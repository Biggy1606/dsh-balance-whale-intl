/**
 * Balance Whale — host half.
 *
 * Keeps a small amount of state (today's turn spend + the latest turn), resolves
 * the DeepSeek balance through DSH's credential/account services, and exposes a
 * read-only JSON snapshot to the browser half.
 *
 * The plugin never stores an API key. Balance resolution mirrors DSH's own rules:
 * a configured DEEPSEEK_API_KEY wins; a signed-in DeepSeek account is the fallback.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import dns from 'node:dns'
import { fileURLToPath } from 'node:url'

const VERSION = '1.8.0'
const BALANCE_URL = 'https://api.deepseek.com/user/balance'
const BALANCE_TTL_MS = 30_000
const BALANCE_TIMEOUT_MS = 8_000
const STATE_PATH = path.join(process.env.DSH_HOME || path.join(os.homedir(), '.dsh'), '.balance-whale.json')
const PACKAGE_ROOT = path.dirname(fileURLToPath(import.meta.url))
const ASSET_DIR = path.join(PACKAGE_ROOT, 'assets')

// Prefer IPv4 for balance lookups, matching DSH's own outbound fetch behavior.
try { dns.setDefaultResultOrder('ipv4first') } catch (err) {}

const PRICES = {
  flash: {
    cny: { hit: [0.02, 0.04], miss: [1, 2], out: [4, 8] },
    usd: { hit: [0.003, 0.006], miss: [0.15, 0.3], out: [0.6, 1.2] },
  },
  pro: {
    cny: { hit: [0.15, 0.3], miss: [4.5, 9], out: [13.5, 27] },
    usd: { hit: [0.022, 0.044], miss: [0.66, 1.32], out: [1.98, 3.96] },
  },
}

// DeepSeek off-peak rule: weekends and Chinese public holidays are all-day valley.
// 2026 dates are listed so the peak badge stays correct through the year.
const HOLIDAYS = new Set([
  '2026-01-01', '2026-01-02', '2026-01-03',
  '2026-02-15', '2026-02-16', '2026-02-17', '2026-02-18', '2026-02-19',
  '2026-02-20', '2026-02-21', '2026-02-22', '2026-02-23',
  '2026-04-04', '2026-04-05', '2026-04-06',
  '2026-05-01', '2026-05-02', '2026-05-03', '2026-05-04', '2026-05-05',
  '2026-06-19', '2026-06-20', '2026-06-21',
  '2026-09-25', '2026-09-26', '2026-09-27',
  '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04',
  '2026-10-05', '2026-10-06', '2026-10-07',
])
const WEEKEND_VALLEY_FROM_SEC = Math.floor(Date.UTC(2026, 7, 22, 16, 0, 0) / 1000)

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, max-age=0',
  'X-Content-Type-Options': 'nosniff',
}

function beijingDate(ts) {
  return new Date(Number(ts) + 8 * 3600 * 1000)
}

function dayKey(ts) {
  const d = beijingDate(ts)
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${d.getUTCFullYear()}-${m}-${day}`
}

function isPeakAt(ts) {
  const n = Math.floor(Number(ts) / 1000)
  if (!Number.isFinite(n)) return false
  const bj = beijingDate(n * 1000)
  if (n >= WEEKEND_VALLEY_FROM_SEC) {
    const dow = bj.getUTCDay()
    if (dow === 0 || dow === 6) return false
  }
  if (HOLIDAYS.has(dayKey(n * 1000))) return false
  const hour = bj.getUTCHours()
  return (hour >= 9 && hour < 12) || (hour >= 14 && hour < 18)
}

function nextPeakChange(ts) {
  const n = Number(ts)
  if (!Number.isFinite(n)) return null
  const active = isPeakAt(n)
  const day0 = Math.floor((n + 8 * 3600 * 1000) / 86_400_000) * 86_400_000
  for (let d = 0; d <= 12; d++) {
    for (const edge of [0, 9, 12, 14, 18]) {
      const cand = day0 + d * 86_400_000 + edge * 3600 * 1000 - 8 * 3600 * 1000
      if (cand <= n + 1000) continue
      if (isPeakAt(cand) !== active) return cand
    }
  }
  return null
}

function clockLabel(ts) {
  const d = beijingDate(ts)
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mm = String(d.getUTCMinutes()).padStart(2, '0')
  const diff = Math.round((Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    - Date.UTC(
      beijingDate(Date.now()).getUTCFullYear(),
      beijingDate(Date.now()).getUTCMonth(),
      beijingDate(Date.now()).getUTCDate(),
    )) / 86_400_000)
  if (diff === 0) return `${hh}:${mm}`
  if (diff === 1) return `tomorrow ${hh}:${mm}`
  const name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getUTCDay()]
  return `${name} ${hh}:${mm}`
}

function peakInfo() {
  const now = Date.now()
  const nextAt = nextPeakChange(now)
  const bj = beijingDate(now)
  return {
    active: isPeakAt(now),
    weekend: bj.getUTCDay() === 0 || bj.getUTCDay() === 6,
    holiday: HOLIDAYS.has(dayKey(now)),
    nextAt,
    nextLabel: nextAt ? clockLabel(nextAt) : '',
  }
}

function priceFor(model) {
  const name = String(model || '').toLowerCase()
  return name.includes('pro') ? PRICES.pro : PRICES.flash
}

function round8(value) {
  return Math.round((Number(value) || 0) * 1e8) / 1e8
}

function orderBalances(balances) {
  const rank = (currency) => currency === 'CNY' ? 0 : currency === 'USD' ? 1 : 2
  return balances.sort((left, right) => rank(left.currency) - rank(right.currency)
    || left.currency.localeCompare(right.currency))
}

function withTimeout(promise, ms) {
  let timer = null
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), ms)
    if (typeof timer.unref === 'function') timer.unref()
  })
  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer)
  })
}

function tokenCost(usage, model, at) {
  if (!usage || typeof usage !== 'object') return { cost: 0, usd: 0, tokens: 0 }
  const input = Math.max(0, Number(usage.inputTokens) || 0)
  const cache = Math.max(0, Number(usage.cacheReadTokens) || 0)
  const output = Math.max(0, Number(usage.outputTokens) || 0)
  // DSH guarantees reasoningTokens is a subset of outputTokens; do not bill it twice.
  const tokens = input + cache + output
  const prices = priceFor(model)
  const band = isPeakAt(at) ? 1 : 0
  const calculate = (price) => (cache / 1e6) * price.hit[band]
    + (input / 1e6) * price.miss[band]
    + (output / 1e6) * price.out[band]
  return {
    cost: round8(calculate(prices.cny)),
    usd: round8(calculate(prices.usd)),
    tokens,
  }
}

function emptyLedger() {
  return {
    version: 5,
    day: dayKey(Date.now()),
    spend: 0,
    usd: 0,
    tokens: 0,
    currencies: [],
    seq: 0,
    lastTurn: null,
    events: {},
    wallet: { day: dayKey(Date.now()), source: '', since: 0, last: {}, spent: {}, toppedUp: {} },
  }
}

function readLedger() {
  let parsed = null
  try {
    parsed = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'))
  } catch (err) {
    parsed = null
  }
  // v1 stored only a turn total and could not be reconciled with live session
  // logs. On an older/invalid ledger, start clean and backfill from live sessions.
  if (!parsed || (parsed.version !== 4 && parsed.version !== 5) || !parsed.events
    || typeof parsed.events !== 'object' || Array.isArray(parsed.events)) {
    return emptyLedger()
  }
  const ledger = Object.assign(emptyLedger(), parsed)
  const previousVersion = Number(parsed.version) || 0
  ledger.version = 5
  if (previousVersion === 4 && Number(ledger.spend) > 0 && Number(ledger.usd) > 0) {
    // v4 kept both price bases but did not persist the pre-switch wallet
    // observations. Preserve that both-currency period for existing ledgers.
    ledger.currencies = [...new Set([...(Array.isArray(ledger.currencies) ? ledger.currencies : []), 'CNY', 'USD'])]
  }
  if (!Number.isFinite(Number(ledger.seq))) ledger.seq = 0
  if (!ledger.lastTurn || typeof ledger.lastTurn !== 'object') ledger.lastTurn = null
  if (!Array.isArray(ledger.currencies)) ledger.currencies = []
  if (!ledger.wallet || typeof ledger.wallet !== 'object' || Array.isArray(ledger.wallet)) {
    ledger.wallet = { day: ledger.day, source: '', since: 0, last: {}, spent: {}, toppedUp: {} }
  }
  if (!ledger.wallet.last || typeof ledger.wallet.last !== 'object') ledger.wallet.last = {}
  if (!ledger.wallet.spent || typeof ledger.wallet.spent !== 'object') ledger.wallet.spent = {}
  if (!ledger.wallet.toppedUp || typeof ledger.wallet.toppedUp !== 'object') ledger.wallet.toppedUp = {}
  if (ledger.wallet.day !== ledger.day) {
    ledger.wallet = { day: ledger.day, source: '', since: 0, last: {}, spent: {}, toppedUp: {} }
  }
  if (ledger.day !== dayKey(Date.now())) {
    ledger.day = dayKey(Date.now())
    ledger.events = {}
  }
  // Derive the displayed totals from the event ledger so a partially written
  // file cannot leave spend and events out of sync.
  let spend = 0
  let usd = 0
  let tokens = 0
  for (const event of Object.values(ledger.events)) {
    if (!event || typeof event !== 'object') continue
    const cost = Number(event.cost)
    if (Number.isFinite(cost)) spend += cost
    const costUsd = Number(event.usd)
    if (Number.isFinite(costUsd)) usd += costUsd
    const count = Number(event.tokens)
    if (Number.isFinite(count)) tokens += count
  }
  ledger.spend = round8(spend)
  ledger.usd = round8(usd)
  ledger.tokens = Math.round(tokens)
  return ledger
}

export const inject = ['webServer']

export function apply(ctx) {
  let ledger = readLedger()
  let lastBalance = null
  let lastBalanceAt = 0
  let lastBalanceSource = ''
  let lastBalanceCurrency = 'CNY'
  let lastBalances = []
  let lastBalanceError = ''
  let lastAttemptAt = 0
  let inflight = null
  let ledgerSaveTimer = null
  let backfillDone = false
  let activeSessionId = ''
  let activeSessionAt = 0
  let latestMainTurn = null
  const sessionUsage = new Map()
  const observedCurrencies = new Set(Array.isArray(ledger.currencies) ? ledger.currencies : [])
  const waitState = { pending: null, sessionName: '', session: '' }
  const WAIT_QUESTION_TOOL = 'ask_user_question'

  function ensureToday() {
    const today = dayKey(Date.now())
    if (ledger.day !== today) {
      ledger.day = today
      ledger.spend = 0
      ledger.usd = 0
      ledger.tokens = 0
      ledger.events = {}
      ledger.wallet = { day: today, source: '', since: 0, last: {}, spent: {}, toppedUp: {} }
    }
  }

  function saveLedger() {
    if (ledgerSaveTimer) {
      clearTimeout(ledgerSaveTimer)
      ledgerSaveTimer = null
    }
    try {
      fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true })
      const tmp = `${STATE_PATH}.tmp`
      fs.writeFileSync(tmp, JSON.stringify(ledger), 'utf8')
      fs.renameSync(tmp, STATE_PATH)
    } catch (err) {
      // A read-only $DSH_HOME must not break the widget; keep the in-memory ledger.
    }
  }

  function scheduleSave() {
    if (ledgerSaveTimer) return
    ledgerSaveTimer = setTimeout(() => {
      ledgerSaveTimer = null
      saveLedger()
    }, 800)
    if (typeof ledgerSaveTimer.unref === 'function') ledgerSaveTimer.unref()
  }

  function todayTurnCount() {
    const seen = new Set()
    for (const event of Object.values(ledger.events)) {
      if (!event || !event.session || event.turn === undefined) continue
      seen.add(`${event.session}:${event.turn}`)
    }
    return seen.size
  }

  function newSessionUsage(session) {
    const id = session && session.id ? String(session.id) : 'default'
    return {
      id,
      name: titleForSession(session) || '',
      subagent: !!(session && session.header && session.header.origin === 'subagent'),
      cost: 0,
      usd: 0,
      tokens: 0,
      turns: 0,
      lastTurn: null,
      lastMessage: null,
      openTurn: null,
      lastAt: 0,
    }
  }

  function sessionUsageFor(session) {
    const id = session && session.id ? String(session.id) : 'default'
    let usage = sessionUsage.get(id)
    if (!usage) {
      usage = newSessionUsage(session)
      sessionUsage.set(id, usage)
    } else {
      const title = titleForSession(session)
      if (title) usage.name = title
    }
    return usage
  }

  function noteObservedCurrencies(balances) {
    let changed = false
    for (const row of Array.isArray(balances) ? balances : []) {
      if (!row || !row.currency) continue
      const currency = String(row.currency).toUpperCase()
      if (!currency || observedCurrencies.has(currency)) continue
      observedCurrencies.add(currency)
      changed = true
    }
    if (changed) {
      ledger.currencies = [...observedCurrencies]
      scheduleSave()
    }
  }

  function observeWallet(balances, source, at) {
    const wallet = ledger.wallet
    if (!wallet) return
    const timestamp = Number(at) || Date.now()
    if (wallet.source && source && wallet.source !== source) {
      wallet.last = {}
      wallet.spent = {}
      wallet.toppedUp = {}
      wallet.since = timestamp
    }
    wallet.source = source || wallet.source || ''
    if (!wallet.since) wallet.since = timestamp
    const current = {}
    for (const row of Array.isArray(balances) ? balances : []) {
      if (!row || !row.currency) continue
      const currency = String(row.currency).toUpperCase()
      const amount = Number(row.amount)
      if (!currency || !Number.isFinite(amount)) continue
      current[currency] = round8((current[currency] || 0) + amount)
    }
    for (const [currency, amount] of Object.entries(current)) {
      const previous = Number(wallet.last[currency])
      if (Number.isFinite(previous)) {
        const delta = round8(amount - previous)
        if (delta < 0) {
          wallet.spent[currency] = round8(Number(wallet.spent[currency] || 0) + Math.abs(delta))
        } else if (delta > 0) {
          wallet.toppedUp[currency] = round8(Number(wallet.toppedUp[currency] || 0) + delta)
        }
      }
      wallet.last[currency] = amount
    }
    scheduleSave()
  }

  function recordLedgerEvent(usage, event, cost, usd, tokens, turn, model) {
    const at = Number(event && event.time) || Date.now()
    if (dayKey(at) !== ledger.day) return
    const key = `${usage.id}:${event && event.seq !== undefined ? event.seq : at}`
    if (ledger.events[key]) return
    ledger.events[key] = {
      session: usage.id,
      t: at,
      cost: round8(cost),
      usd: round8(usd),
      tokens: Math.round(tokens),
      turn,
      model: model || '',
    }
    ledger.spend = round8(Number(ledger.spend) + cost)
    ledger.usd = round8(Number(ledger.usd) + usd)
    ledger.tokens = Math.round((Number(ledger.tokens) || 0) + tokens)
    scheduleSave()
  }

  function finishTurn(usage, ts, options) {
    if (!usage || !usage.openTurn) return null
    const agg = usage.openTurn
    usage.openTurn = null
    if (agg.cost <= 0) return null
    usage.turns = Math.max(0, Number(usage.turns) || 0) + 1
    const turn = {
      turn: agg.turn,
      amount: round8(agg.cost),
      amountUsd: round8(agg.usd),
      tokens: Math.round(agg.tokens),
      model: agg.model || '',
      ts: Number(ts) || agg.ts,
    }
    usage.lastTurn = turn
    if (!options || options.backfill !== true) {
      if (!usage.subagent) {
        ledger.seq = Math.max(0, Number(ledger.seq) || 0) + 1
        ledger.lastTurn = Object.assign({
          seq: ledger.seq,
          session: usage.id,
          sessionName: usage.name || '',
        }, turn)
        saveLedger()
      }
    }
    return turn
  }

  function applyUsage(usage, session, event, options) {
    ensureToday()
    const data = (event && event.data) || {}
    const tokenUsage = data.usage
    if (!tokenUsage || typeof tokenUsage !== 'object') return 0
    const turn = Number(data.turn)
    if (!Number.isFinite(turn)) return 0
    const at = Number(event.time) || Date.now()
    const model = data.message && data.message.source ? String(data.message.source.model || '') : ''
    const measured = tokenCost(tokenUsage, model, at)
    if (measured.cost <= 0) return 0
    usage.cost = round8(Number(usage.cost) + measured.cost)
    usage.usd = round8(Number(usage.usd) + measured.usd)
    usage.tokens += measured.tokens
    usage.lastAt = Math.max(Number(usage.lastAt) || 0, at)
    usage.lastMessage = {
      turn,
      amount: round8(measured.cost),
      amountUsd: round8(measured.usd),
      tokens: Math.round(measured.tokens),
      model,
      ts: at,
    }
    if (usage.openTurn && usage.openTurn.turn !== turn) {
      finishTurn(usage, at, { backfill: true })
    }
    if (!usage.openTurn) {
      usage.openTurn = { turn, cost: 0, usd: 0, tokens: 0, model: '', ts: at }
    }
    usage.openTurn.cost = round8(Number(usage.openTurn.cost) + measured.cost)
    usage.openTurn.usd = round8(Number(usage.openTurn.usd) + measured.usd)
    usage.openTurn.tokens += measured.tokens
    usage.openTurn.model = model || usage.openTurn.model
    usage.openTurn.ts = at
    recordLedgerEvent(usage, event, measured.cost, measured.usd, measured.tokens, turn, model)
    return measured.cost
  }

  function selectFallbackActive() {
    let best = null
    for (const usage of sessionUsage.values()) {
      if (usage.subagent) continue
      if (!best || usage.lastAt > best.lastAt) best = usage
    }
    if (!best) {
      for (const usage of sessionUsage.values()) {
        if (!best || usage.lastAt > best.lastAt) best = usage
      }
    }
    if (best) {
      activeSessionId = best.id
      activeSessionAt = best.lastAt
    }
  }

  function scanSession(session) {
    const fresh = newSessionUsage(session)
    const seq = Number(session && session.seq) || 0
    let events = []
    try {
      events = seq > 0 ? session.snapshotEvents(0, seq) : session.snapshotEvents()
    } catch (err) {
      events = []
    }
    for (const event of events) {
      const type = event && event.type
      if (type === 'session/title') {
        const title = String((event.data && event.data.title) || '').trim()
        if (title) fresh.name = title.slice(0, 120)
        continue
      }
      if (type === 'assistant/message') {
        applyUsage(fresh, session, event, { backfill: true })
        continue
      }
      if (type === 'turn/end') {
        finishTurn(fresh, event.time, { backfill: true })
        continue
      }
      if (type === 'turn/start' && fresh.openTurn) {
        finishTurn(fresh, event.time, { backfill: true })
      }
    }
    sessionUsage.set(fresh.id, fresh)
    if (!fresh.subagent && fresh.lastAt >= activeSessionAt) {
      activeSessionId = fresh.id
      activeSessionAt = fresh.lastAt
    }
    if (!fresh.subagent && fresh.lastTurn
      && (!latestMainTurn || fresh.lastTurn.ts > latestMainTurn.ts)) {
      latestMainTurn = Object.assign({ session: fresh.id, sessionName: fresh.name || '' }, fresh.lastTurn)
    }
  }

  function ensureBackfill() {
    if (backfillDone) return
    ensureToday()
    let sessions = []
    try {
      const agents = typeof ctx.get === 'function' ? ctx.get('agents') : null
      if (agents && typeof agents.list === 'function') {
        sessions = agents.list()
          .map((agent) => agent && agent.session)
          .filter((session) => session && typeof session.snapshotEvents === 'function')
      }
    } catch (err) {
      sessions = []
    }
    if (!sessions.length) return
    for (const session of sessions) {
      try { scanSession(session) } catch (err) {}
    }
    backfillDone = true
    if (!activeSessionId) selectFallbackActive()
    if (latestMainTurn && (!ledger.lastTurn || latestMainTurn.ts > Number(ledger.lastTurn.ts || 0))) {
      ledger.lastTurn = Object.assign({ seq: Number(ledger.seq) || 0 }, latestMainTurn)
    }
    saveLedger()
  }


  function eventId(event) {
    try {
      const data = (event && event.data) || {}
      const message = data.message || {}
      const content = Array.isArray(message.content) ? message.content : []
      for (const block of content) {
        if (block && (block.toolCallId || block.tool_call_id)) {
          return String(block.toolCallId || block.tool_call_id)
        }
      }
      return String(
        message.callId || message.toolCallId || message.tool_call_id
        || data.callId || data.call_id || data.toolCallId || data.tool_call_id || data.id || '',
      )
    } catch (err) {
      return ''
    }
  }

  function titleForSession(session) {
    try {
      const service = typeof ctx.get === 'function' ? ctx.get('sessionTitle') : null
      if (service && typeof service.get === 'function' && session) {
        const snapshot = service.get(session)
        const title = typeof snapshot === 'string' ? snapshot : (snapshot && (snapshot.title || snapshot.text))
        const text = String(title == null ? '' : title).trim()
        if (text) return text.slice(0, 120)
      }
    } catch (err) {}
    try {
      const candidates = [
        session && session.title, session && session.name, session && session.label,
        session && session.summary && session.summary.title,
      ]
      for (const candidate of candidates) {
        const text = String(candidate == null ? '' : candidate).trim()
        if (text) return text.slice(0, 120)
      }
    } catch (err) {}
    return ''
  }

  function notePendingEvent(session, event) {
    try {
      const type = String((event && event.type) || '')
      const data = (event && event.data) || {}
      const sessionId = session && session.id ? String(session.id) : 'default'
      if (type === 'session/title') {
        const title = String(data.title == null ? '' : data.title).trim()
        waitState.session = sessionId
        if (title) waitState.sessionName = title.slice(0, 120)
        return
      }
      if (type === 'tool/call' && String(data.name || data.toolName || '') === WAIT_QUESTION_TOOL) {
        if (waitState.session !== sessionId) {
          waitState.session = sessionId
          waitState.sessionName = ''
        }
        const title = titleForSession(session)
        if (title) waitState.sessionName = title
        waitState.pending = {
          kind: 'question',
          id: eventId(event) || ('q' + Date.now()),
          ts: Date.now(),
          session: sessionId,
        }
        return
      }
      if (type === 'tool/result') {
        if (waitState.pending && waitState.pending.kind === 'question') {
          const id = eventId(event)
          if (!id || id === waitState.pending.id) waitState.pending = null
        }
        return
      }
      if (type === 'approval/asked') {
        if (waitState.session !== sessionId) {
          waitState.session = sessionId
          waitState.sessionName = ''
        }
        const title = titleForSession(session)
        if (title) waitState.sessionName = title
        waitState.pending = {
          kind: 'approval',
          id: String(data.id || ('a' + Date.now())),
          ts: Date.now(),
          session: sessionId,
        }
        return
      }
      if (type.indexOf('approval/') === 0) {
        if (waitState.pending && waitState.pending.kind === 'approval') {
          const id = String(data.id || '')
          if (!id || id === waitState.pending.id) waitState.pending = null
        }
        return
      }
      if (type === 'turn/start' || type === 'turn/end') waitState.pending = null
    } catch (err) {}
  }

  function onSessionEvent(session, event) {
    try {
      notePendingEvent(session, event)
      const type = event && event.type
      const data = (event && event.data) || {}
      const sessionId = session && session.id ? String(session.id) : 'default'
      if (type === 'session/title') {
        const usage = sessionUsageFor(session)
        const title = String(data.title || '').trim()
        if (title) usage.name = title.slice(0, 120)
        return
      }
      if (type === 'assistant/message' && data.usage) {
        const usage = sessionUsageFor(session)
        const cost = applyUsage(usage, session, event)
        if (cost > 0 && !usage.subagent) {
          activeSessionId = sessionId
          activeSessionAt = Number(event.time) || Date.now()
        }
        return
      }
      if (type === 'turn/end') {
        const usage = sessionUsageFor(session)
        finishTurn(usage, event.time, { backfill: false })
        if (!usage.subagent) {
          activeSessionId = sessionId
          activeSessionAt = Number(event.time) || Date.now()
        }
        saveLedger()
        return
      }
      if (type === 'turn/start') {
        const usage = sessionUsageFor(session)
        if (usage.openTurn) finishTurn(usage, event.time, { backfill: true })
        if (!usage.subagent) {
          activeSessionId = sessionId
          activeSessionAt = Number(event.time) || Date.now()
        }
      }
    } catch (err) {
      // Observers must never make a committed session append fail.
    }
  }


  function resolveCredentialService() {
    try {
      return typeof ctx.get === 'function' ? ctx.get('credentials') : null
    } catch (err) {
      return null
    }
  }

  async function balanceFromApiKey() {
    const credentials = resolveCredentialService()
    if (!credentials || typeof credentials.resolve !== 'function') {
      return { ok: false, reason: 'credential service unavailable' }
    }
    let cred = null
    try {
      cred = await withTimeout(credentials.resolve('DEEPSEEK_API_KEY'), 3_000)
    } catch (err) {
      return { ok: false, reason: 'could not read DEEPSEEK_API_KEY' }
    }
    if (!cred || !cred.value) return { ok: false, reason: 'no DEEPSEEK_API_KEY' }

    let res
    try {
      res = await fetch(BALANCE_URL, {
        headers: { Authorization: `Bearer ${cred.value}` },
        signal: AbortSignal.timeout(BALANCE_TIMEOUT_MS),
      })
    } catch (err) {
      return { ok: false, reason: 'balance request failed' }
    }
    if (!res.ok) return { ok: false, reason: `balance HTTP ${res.status}` }
    let body
    try {
      body = await res.json()
    } catch (err) {
      return { ok: false, reason: 'balance response was not JSON' }
    }
    const infos = Array.isArray(body && body.balance_infos) ? body.balance_infos : []
    const byCurrency = new Map()
    for (const info of infos) {
      if (!info) continue
      const amount = Number(info.total_balance)
      if (!Number.isFinite(amount)) continue
      const currency = String(info.currency || 'CNY').toUpperCase()
      byCurrency.set(currency, (byCurrency.get(currency) || 0) + amount)
    }
    const balances = orderBalances([...byCurrency].map(([currency, amount]) => ({ currency, amount: round8(amount) })))
    if (!balances.length) return { ok: false, reason: 'balance response shape was unexpected' }
    const primary = balances.find((b) => b.currency === 'CNY' && b.amount > 0)
      || balances.find((b) => b.amount > 0)
      || balances.find((b) => b.currency === 'CNY')
      || balances[0]
    return {
      ok: true,
      amount: primary.amount,
      currency: primary.currency,
      balances,
      source: 'api-key',
    }
  }

  async function balanceFromAccount() {
    let account = null
    try {
      account = typeof ctx.get === 'function' ? ctx.get('deepseekAccount') : null
    } catch (err) {
      account = null
    }
    if (!account || typeof account.getBalance !== 'function') {
      return { ok: false, reason: 'DeepSeek account is not signed in' }
    }
    let result
    try {
      result = await withTimeout(account.getBalance({
        version: String(process.env.DSH_CLIENT_VERSION || process.env.DSH_VERSION || 'unknown'),
        locale: String(process.env.DSH_LOCALE || 'en'),
        timezoneOffsetSeconds: -new Date().getTimezoneOffset() * 60,
      }), 5_000)
    } catch (err) {
      return { ok: false, reason: 'account balance request failed or timed out' }
    }
    if (!result || result.status !== 'ready') {
      return { ok: false, reason: 'DeepSeek account balance is not ready' }
    }
    const normal = Array.isArray(result.value) ? result.value : []
    const bonus = Array.isArray(result.bonusWallets) ? result.bonusWallets : []
    const wallets = normal.concat(bonus).filter((w) => w && Number.isFinite(Number(w.balance)))
    if (!wallets.length) return { ok: false, reason: 'account has no balance wallets' }
    const byCurrency = new Map()
    for (const wallet of wallets) {
      const currency = String(wallet.currency || 'CNY').toUpperCase()
      byCurrency.set(currency, (byCurrency.get(currency) || 0) + Number(wallet.balance))
    }
    const balances = orderBalances([...byCurrency].map(([currency, amount]) => ({ currency, amount: round8(amount) })))
    const primary = balances.find((b) => b.currency === 'CNY' && b.amount > 0)
      || balances.find((b) => b.amount > 0)
      || balances.find((b) => b.currency === 'CNY')
      || balances[0]
    return {
      ok: true,
      amount: primary.amount,
      currency: primary.currency,
      balances,
      source: 'account',
    }
  }

  async function refreshBalance() {
    if (inflight) return inflight
    lastAttemptAt = Date.now()
    inflight = (async () => {
      const api = await balanceFromApiKey()
      if (api.ok) {
        lastBalance = api.amount
        lastBalanceCurrency = api.currency
        lastBalances = api.balances || []
        noteObservedCurrencies(lastBalances)
        observeWallet(lastBalances, api.source, Date.now())
        lastBalanceSource = api.source
        lastBalanceAt = Date.now()
        lastBalanceError = ''
        return
      }
      const account = await balanceFromAccount()
      if (account.ok) {
        lastBalance = account.amount
        lastBalanceCurrency = account.currency
        lastBalances = account.balances || []
        noteObservedCurrencies(lastBalances)
        observeWallet(lastBalances, account.source, Date.now())
        lastBalanceSource = account.source
        lastBalanceAt = Date.now()
        lastBalanceError = ''
        return
      }
      lastBalanceError = [api.reason, account.reason].filter(Boolean).join(' · ')
    })().finally(() => { inflight = null })
    return inflight
  }

  function balanceView() {
    const hasValue = lastBalance !== null && Number.isFinite(Number(lastBalance))
    return {
      amount: hasValue ? Number(lastBalance) : null,
      currency: lastBalanceCurrency || 'CNY',
      source: lastBalanceSource || '',
      balances: hasValue ? lastBalances : [],
      updatedAt: lastBalanceAt ? new Date(lastBalanceAt).toISOString() : null,
      stale: !!(hasValue && lastBalanceError),
      error: lastBalanceError || '',
    }
  }

  function displayCurrency() {
    return String(lastBalanceCurrency || 'CNY').toUpperCase() === 'USD' ? 'USD' : 'CNY'
  }

  function presentedCost(cny, usd, currency) {
    const value = currency === 'USD' ? Number(usd) : Number(cny)
    return round8(Number.isFinite(value) ? value : 0)
  }

  function presentTurn(turn, currency) {
    if (!turn) return null
    const amountCny = round8(turn.amount)
    const amountUsd = round8(turn.amountUsd)
    return Object.assign({}, turn, {
      amount: presentedCost(amountCny, amountUsd, currency),
      amountCny,
      amountUsd,
      currency,
    })
  }

  function presentMessage(message, currency) {
    if (!message) return null
    const amountCny = round8(message.amount)
    const amountUsd = round8(message.amountUsd)
    return Object.assign({}, message, {
      amount: presentedCost(amountCny, amountUsd, currency),
      amountCny,
      amountUsd,
      currency,
    })
  }

  function usagePayload() {
    let active = sessionUsage.get(activeSessionId)
    if (!active) {
      selectFallbackActive()
      active = sessionUsage.get(activeSessionId)
    }
    const currency = displayCurrency()
    const todayCny = round8(ledger.spend)
    const todayUsd = round8(ledger.usd)
    const chat = active ? {
      id: active.id,
      name: active.name || '',
      spend: presentedCost(active.cost, active.usd, currency),
      spendCny: round8(active.cost),
      spendUsd: round8(active.usd),
      tokens: Math.round(active.tokens),
      turns: Math.max(0, Number(active.turns) || 0),
      lastTurn: presentTurn(active.lastTurn, currency),
      lastMessage: presentMessage(active.lastMessage, currency),
      subagent: !!active.subagent,
      currency,
    } : null
    return {
      costCurrency: currency,
      showBothCosts: observedCurrencies.has('CNY') && observedCurrencies.has('USD'),
      wallet: {
        since: Number(ledger.wallet.since) || 0,
        source: ledger.wallet.source || '',
        observed: [...observedCurrencies].map((currency) => ({
          currency,
          spent: round8(ledger.wallet.spent[currency]),
          toppedUp: round8(ledger.wallet.toppedUp[currency]),
        })),
      },
      today: {
        day: ledger.day,
        spend: presentedCost(todayCny, todayUsd, currency),
        spendCny: todayCny,
        spendUsd: todayUsd,
        tokens: Math.round(Number(ledger.tokens) || 0),
        turns: todayTurnCount(),
        currency,
      },
      chat,
      lastTurn: presentTurn(ledger.lastTurn, currency),
      lastMessage: chat ? chat.lastMessage : null,
    }
  }

  function waitPayload() {
    return {
      ok: true,
      pending: waitState.pending
        ? Object.assign({}, waitState.pending, { sessionName: waitState.sessionName || '' })
        : null,
      sessionName: waitState.sessionName || '',
    }
  }

  async function snapshot(force) {
    ensureToday()
    ensureBackfill()
    const now = Date.now()
    const successExpired = !lastBalanceAt || now - lastBalanceAt > BALANCE_TTL_MS
    const retryDue = now - lastAttemptAt > 15_000
    if (inflight) {
      await inflight
    } else if (force || (successExpired && retryDue)) {
      await refreshBalance()
    }
    return Object.assign({
      ok: true,
      version: VERSION,
      serverTime: Date.now(),
      balance: balanceView(),
      pending: waitState.pending
        ? Object.assign({}, waitState.pending, { sessionName: waitState.sessionName || '' })
        : null,
      peak: peakInfo(),
    }, usagePayload())
  }

  function isTrusted(req) {
    const headers = (req && req.headers) || {}
    if (String(headers['sec-fetch-site'] || '').toLowerCase() === 'cross-site') return false
    const origin = headers.origin
    if (typeof origin === 'string' && origin && origin !== 'null') {
      try {
        const originUrl = new URL(origin)
        if (originUrl.host.toLowerCase() !== String(headers.host || '').toLowerCase()) return false
      } catch (err) {
        return false
      }
    }
    return true
  }

  function sendJson(res, code, value) {
    const body = JSON.stringify(value)
    res.writeHead(code, Object.assign({ 'Content-Length': Buffer.byteLength(body) }, JSON_HEADERS))
    res.end(body)
  }

  const assetCache = new Map()

  function readAsset(...parts) {
    const file = path.join(...parts)
    let bytes = assetCache.get(file)
    if (!bytes) {
      bytes = fs.readFileSync(file)
      assetCache.set(file, bytes)
    }
    return bytes
  }

  function registerAsset(routePath, ...parts) {
    const type = routePath.endsWith('.png') ? 'image/png'
      : routePath.endsWith('.gif') ? 'image/gif'
        : routePath.endsWith('.mp3') ? 'audio/mpeg'
          : routePath.endsWith('.wav') ? 'audio/wav'
            : 'application/octet-stream'
    return ctx.webServer.register({
      kind: 'exact',
      path: routePath,
      handler: (req, res) => {
        if (!isTrusted(req)) {
          res.writeHead(403)
          res.end()
          return
        }
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          res.writeHead(405)
          res.end()
          return
        }
        try {
          const bytes = readAsset(...parts)
          res.writeHead(200, {
            'Content-Type': type,
            'Content-Length': String(bytes.length),
            'Cache-Control': 'public, max-age=3600',
            'X-Content-Type-Options': 'nosniff',
          })
          res.end(req.method === 'HEAD' ? undefined : bytes)
        } catch (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
          res.end('asset unavailable')
        }
      },
    })
  }

  ctx.effect(() => registerAsset('/balance-whale/whale.png', ASSET_DIR, 'DSniang1-trim.png'), 'balance-whale: whale art')
  ctx.effect(() => registerAsset('/balance-whale/icon.png', PACKAGE_ROOT, 'icon.png'), 'balance-whale: icon')
  ctx.effect(() => registerAsset('/balance-whale/rua.gif', ASSET_DIR, 'rua.gif'), 'balance-whale: rua art')
  ctx.effect(() => registerAsset('/balance-whale/press.mp3', ASSET_DIR, 'Ya1.mp3'), 'balance-whale: press sound')
  ctx.effect(() => registerAsset('/balance-whale/release.mp3', ASSET_DIR, 'Ya2.mp3'), 'balance-whale: release sound')
  ctx.effect(() => registerAsset('/balance-whale/turn.wav', ASSET_DIR, 'cost-default.wav'), 'balance-whale: cost sound')
  ctx.effect(() => registerAsset('/balance-whale/press-fx1.mp3', ASSET_DIR, 'D1.mp3'), 'balance-whale: press fx1 sound')
  ctx.effect(() => registerAsset('/balance-whale/release-fx1.mp3', ASSET_DIR, 'D2.mp3'), 'balance-whale: release fx1 sound')
  ctx.effect(() => registerAsset('/balance-whale/turn-orb.wav', ASSET_DIR, 'minecraft-exp-orb.wav'), 'balance-whale: turn orb sound')
  ctx.effect(() => registerAsset('/balance-whale/turn-a.wav', ASSET_DIR, 'task-end-a.wav'), 'balance-whale: turn a sound')
  ctx.effect(() => registerAsset('/balance-whale/ask.wav', ASSET_DIR, 'ask-default.wav'), 'balance-whale: ask sound')
  ctx.effect(() => registerAsset('/balance-whale/approve.wav', ASSET_DIR, 'approve-default.wav'), 'balance-whale: approval sound')

  ensureBackfill()

  ctx.effect(() => () => {
    if (ledgerSaveTimer) {
      clearTimeout(ledgerSaveTimer)
      ledgerSaveTimer = null
      saveLedger()
    }
  }, 'balance-whale: ledger flush')

  ctx.effect(() => ctx.on('session/event', onSessionEvent), 'balance-whale: session spend')

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/balance-whale/wait.json',
    handler: (req, res) => {
      if (!isTrusted(req)) {
        sendJson(res, 403, { ok: false, error: 'forbidden' })
        return
      }
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        sendJson(res, 405, { ok: false, error: 'method not allowed' })
        return
      }
      sendJson(res, 200, waitPayload())
    },
  }), 'balance-whale: wait route')

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/balance-whale/state.json',
    handler: async (req, res) => {
      if (!isTrusted(req)) {
        sendJson(res, 403, { ok: false, error: 'forbidden' })
        return
      }
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        sendJson(res, 405, { ok: false, error: 'method not allowed' })
        return
      }
      try {
        const url = new URL(req.url || '/', 'http://localhost')
        const force = url.searchParams.get('refresh') === '1'
        const body = await snapshot(force)
        if (req.method === 'HEAD') {
          res.writeHead(200, JSON_HEADERS)
          res.end()
          return
        }
        sendJson(res, 200, body)
      } catch (err) {
        sendJson(res, 200, {
          ok: false,
          version: VERSION,
          serverTime: Date.now(),
          error: 'could not read wallet state',
        })
      }
    },
  }), 'balance-whale: state route')

  ctx.effect(() => {
    void refreshBalance().catch(() => {})
    const timer = setInterval(() => { void refreshBalance().catch(() => {}) }, 60_000)
    if (typeof timer.unref === 'function') timer.unref()
    return () => clearInterval(timer)
  }, 'balance-whale: balance refresh')
}
