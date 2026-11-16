#!/usr/bin/env node
// Dependency-free tests for the peak badge label in ui.js.
// The tests do not trust a copy: they cut the shipped `formatUntil` out of
// ui.js, write it to a temp module, and import that. Time zones are exercised
// in child processes because V8 caches the zone for a process's lifetime; each
// child starts with TZ already set, before any Date or Intl use.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const UI = new URL('../ui.js', import.meta.url)

// Extract `function <name>(...) { ... }` by matching braces, skipping strings
// and comments so a brace inside either cannot end the function early.
function extractFunction(source, name) {
  // Exact identifier match, so a renamed `formatUntilX` is not mistaken for it.
  const declaration = new RegExp('function\\s+' + name + '\\s*\\(')
  const match = declaration.exec(source)
  if (!match) throw new Error('cannot find "function ' + name + '(" in ui.js')
  const start = match.index
  const open = source.indexOf('{', start)
  if (open < 0) throw new Error('cannot find the body of ' + name)
  let depth = 0
  for (let i = open; i < source.length; i += 1) {
    const char = source[i]
    const next = source[i + 1]
    if (char === '/' && next === '/') {
      const end = source.indexOf('\n', i)
      if (end < 0) break
      i = end
      continue
    }
    if (char === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2)
      if (end < 0) throw new Error('unterminated comment while extracting ' + name)
      i = end + 1
      continue
    }
    if (char === '"' || char === "'" || char === '`') {
      i += 1
      while (i < source.length) {
        if (source[i] === '\\') { i += 2; continue }
        if (source[i] === char) break
        i += 1
      }
      continue
    }
    if (char === '{') depth += 1
    else if (char === '}') {
      depth -= 1
      if (depth === 0) return source.slice(start, i + 1)
    }
  }
  throw new Error('unbalanced braces while extracting ' + name)
}

// Instants are UTC; the reader's zone decides the wall clock.
const NEXT_AT = Date.parse('2026-11-16T10:00:00Z')
const NOW = Date.parse('2026-11-16T06:17:00Z')
// 21:00 local in Warsaw, next switch 10:00 local the following day.
const LATE_NOW = Date.parse('2026-11-16T20:00:00Z')
const NEXT_DAY = Date.parse('2026-11-17T09:00:00Z')
// Three local days out from LATE_NOW: Thursday 2026-11-19 10:00 Warsaw.
const THREE_DAYS = Date.parse('2026-11-19T09:00:00Z')

const WARSAW = 'Europe/Warsaw'

const cases = [
  { name: 'Europe/Warsaw en shows 11:00 for 10:00Z', zone: WARSAW, args: [NEXT_AT, NOW, 'en'], expected: '11:00' },
  { name: 'Europe/Warsaw zh shows 11:00 for 10:00Z', zone: WARSAW, args: [NEXT_AT, NOW, 'zh'], expected: '11:00' },
  { name: 'Asia/Shanghai en shows 18:00 for 10:00Z', zone: 'Asia/Shanghai', args: [NEXT_AT, NOW, 'en'], expected: '18:00' },
  { name: 'America/New_York en shows 05:00 for 10:00Z', zone: 'America/New_York', args: [NEXT_AT, NOW, 'en'], expected: '05:00' },
  { name: 'Europe/Warsaw en crosses local midnight as "tomorrow "', zone: WARSAW, args: [NEXT_DAY, LATE_NOW, 'en'], expected: 'tomorrow 10:00' },
  { name: 'Europe/Warsaw zh crosses local midnight as "明天 "', zone: WARSAW, args: [NEXT_DAY, LATE_NOW, 'zh'], expected: '明天 10:00' },
  { name: 'Europe/Warsaw en three local days out leads with a weekday', zone: WARSAW, args: [THREE_DAYS, LATE_NOW, 'en'], expected: 'Thu 10:00' },
  { name: 'null nextAt returns ""', zone: WARSAW, args: [null, NOW, 'en'], expected: '' },
  { name: 'undefined nextAt returns ""', zone: WARSAW, args: ['undefined', NOW, 'en'], expected: '' },
  { name: 'NaN nextAt returns ""', zone: WARSAW, args: ['NaN', NOW, 'en'], expected: '' },
  { name: 'non-numeric string nextAt returns ""', zone: WARSAW, args: ['string:not-a-time', NOW, 'en'], expected: '' },
]

const weekdayCase = cases.find((entry) => entry.args[0] === THREE_DAYS && entry.args[2] === 'en')

// Runs one zone in a fresh process and returns the formatted labels in order.
// The label strings are the only output, so the zone cannot leak in later.
const CHILD = `
const module = await import(process.env.BW_UNDER_TEST)
const cases = JSON.parse(process.env.BW_CASES)
const decode = (arg) => {
  if (arg === 'null') return null
  if (arg === 'undefined') return undefined
  if (arg === 'NaN') return NaN
  if (typeof arg === 'string' && arg.startsWith('string:')) return arg.slice(7)
  return arg
}
process.stdout.write(JSON.stringify(cases.map((args) =>
  String(module.formatUntil(...args.map(decode))))))
`

const encode = (arg) => {
  if (arg === undefined) return 'undefined'
  if (typeof arg === 'number' && Number.isNaN(arg)) return 'NaN'
  if (typeof arg === 'number') return arg
  return 'string:' + arg
}

const runZone = (zone, zoneCases) => {
  const stdout = execFileSync(process.execPath, ['--input-type=module', '-e', CHILD], {
    env: {
      ...process.env,
      TZ: zone,
      BW_UNDER_TEST: process.env.BW_UNDER_TEST,
      BW_CASES: JSON.stringify(zoneCases.map((entry) => entry.args.map(encode))),
    },
    encoding: 'utf8',
  })
  return JSON.parse(stdout)
}

// execFileSync's message embeds the whole inline script; report the real error.
const describeFailure = (error) => {
  const stderr = String(error && error.stderr ? error.stderr : '')
  const lines = stderr.split('\n').map((line) => line.trim()).filter(Boolean)
  const errorLine = lines.find((line) => /(^|\s)\w*Error:/.test(line))
  return errorLine || lines[0] || String((error && error.message) || error)
}

const main = () => {
  const source = extractFunction(readFileSync(UI, 'utf8'), 'formatUntil')
  const dir = mkdtempSync(path.join(os.tmpdir(), 'balance-whale-peak-'))
  const modulePath = path.join(dir, 'formatUntil.mjs')
  writeFileSync(modulePath, source + '\nexport { formatUntil };\n')
  process.env.BW_UNDER_TEST = pathToFileURL(modulePath).href

  const tests = []
  const test = (name, fn) => { tests.push({ name, fn }) }

  const show = (value) => {
    if (value === undefined) return 'undefined'
    try { return JSON.stringify(value) } catch { return String(value) }
  }

  const equal = (actual, expected, label) => {
    if (!Object.is(actual, expected)) {
      throw new Error(`expected ${label ? `${label} ` : ''}${show(expected)}, got ${show(actual)}`)
    }
  }

  let failed = 0
  try {
    const byZone = new Map()
    for (const entry of cases) {
      if (!byZone.has(entry.zone)) byZone.set(entry.zone, [])
      byZone.get(entry.zone).push(entry)
    }
    const zones = new Map()
    for (const [zone, zoneCases] of byZone) {
      try {
        zones.set(zone, { results: runZone(zone, zoneCases) })
      } catch (error) {
        zones.set(zone, { error: describeFailure(error) })
      }
    }

    for (const entry of cases) {
      test(`${entry.name} (TZ=${entry.zone})`, () => {
        const zone = zones.get(entry.zone)
        if (zone.error) throw new Error(`zone run failed: ${zone.error}`)
        const index = byZone.get(entry.zone).indexOf(entry)
        equal(zone.results[index], entry.expected)
      })
    }

    // The weekday case must not degrade into "tomorrow" or a bare time.
    test('weekday token is a weekday, never "tomorrow" or a bare time (TZ=Europe/Warsaw)', () => {
      const zone = zones.get(WARSAW)
      if (zone.error) throw new Error(`zone run failed: ${zone.error}`)
      const index = byZone.get(WARSAW).indexOf(weekdayCase)
      const value = zone.results[index]
      const token = String(value).split(' ')[0]
      if (token === 'tomorrow') throw new Error(`expected a weekday token, got ${show(value)}`)
      if (!/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)$/.test(token)) {
        throw new Error(`expected a weekday token, got ${show(token)} in ${show(value)}`)
      }
      if (!/^\d{2}:\d{2}$/.test(String(value).split(' ')[1] || '')) {
        throw new Error(`expected a zero-padded 24-hour time, got ${show(value)}`)
      }
    })

    for (const { name, fn } of tests) {
      try {
        fn()
        console.log(`ok ${name}`)
      } catch (error) {
        failed += 1
        console.log(`FAIL ${name}: ${error.message}`)
      }
    }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }

  if (failed > 0) process.exitCode = 1
}

try {
  main()
} catch (error) {
  // Extraction is fatal: no silent skip when ui.js changes shape.
  console.log(`FAIL extract formatUntil from ui.js: ${error.message}`)
  process.exitCode = 1
}
