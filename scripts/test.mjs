#!/usr/bin/env node
// Dependency-free tests for the money and ledger logic in index.js.
// index.js resolves its state path from DSH_HOME at module load, so point it at
// a throwaway directory before importing it.
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const home = mkdtempSync(path.join(os.tmpdir(), 'balance-whale-test-'))
process.env.DSH_HOME = home

const { __test } = await import('../index.js')
const { currencyCode, dayKey, isInheritedEvent, isPeakAt, nextPeakChange, priceFor, readLedger, tokenCost } = __test

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

// Beijing wall clock instants. Peak: Mon-Fri 09:00-12:00 and 14:00-18:00.
const WEDNESDAY_PEAK = Date.parse('2026-03-04T02:00:00Z') // Wed 10:00 Beijing
const WEDNESDAY_OFF_PEAK = Date.parse('2026-03-04T00:00:00Z') // Wed 08:00 Beijing

// 1. tokenCost — 1M cache-hit tokens on deepseek-flash.
test('tokenCost: 1M cache-hit flash tokens at peak cost 0.04 CNY', () => {
  equal(tokenCost({ cacheReadTokens: 1_000_000 }, 'deepseek-flash', WEDNESDAY_PEAK).cost, 0.04, 'cost')
})

test('tokenCost: 1M cache-hit flash tokens off-peak cost 0.02 CNY', () => {
  equal(tokenCost({ cacheReadTokens: 1_000_000 }, 'deepseek-flash', WEDNESDAY_OFF_PEAK).cost, 0.02, 'cost')
})

// 2. isPeakAt
test('isPeakAt: listed 2026 holiday at 10:00 Beijing is off-peak', () => {
  equal(isPeakAt(Date.parse('2026-10-01T02:00:00Z')), false, 'isPeakAt')
})

test('isPeakAt: normal Wednesday 10:00 Beijing is peak', () => {
  equal(isPeakAt(WEDNESDAY_PEAK), true, 'isPeakAt')
})

test('isPeakAt: Saturday 10:00 Beijing is off-peak', () => {
  equal(isPeakAt(Date.parse('2026-09-05T02:00:00Z')), false, 'isPeakAt')
})

test('isPeakAt: 2027-01-01 10:00 Beijing is off-peak (2027 holiday list)', () => {
  equal(isPeakAt(Date.parse('2027-01-01T02:00:00Z')), false, 'isPeakAt')
})

test('nextPeakChange: peak ends at 12:00 Beijing', () => {
  equal(nextPeakChange(WEDNESDAY_PEAK), Date.parse('2026-03-04T04:00:00Z'), 'nextPeakChange')
})

test('priceFor: pro and flash prices stay distinct', () => {
  equal(priceFor('deepseek-pro').cny.hit[0], 0.15, 'pro hit price')
  equal(priceFor('deepseek-flash').cny.hit[0], 0.02, 'flash hit price')
})

// 3. dayKey
test('dayKey: 2026-12-31T16:00:00Z is 2027-01-01 in Beijing', () => {
  equal(dayKey(Date.parse('2026-12-31T16:00:00Z')), '2027-01-01', 'dayKey')
})

// 4. readLedger rollover after midnight (restart-after-midnight regression).
test('readLedger: yesterday ledger rolls over to today with zero spend', () => {
  const today = dayKey(Date.now())
  const yesterday = dayKey(Date.now() - 86_400_000)
  writeFileSync(path.join(home, '.balance-whale.json'), JSON.stringify({
    version: 5,
    day: yesterday,
    spend: 3.5,
    usd: 0.5,
    tokens: 100,
    currencies: ['USD'],
    seq: 2,
    lastTurn: null,
    events: { e1: { at: Date.now() - 86_400_000, cost: 3.5, usd: 0.5, tokens: 100 } },
    wallet: {
      day: yesterday,
      source: 'api',
      since: 1,
      last: { USD: 10 },
      spent: { USD: 1 },
      toppedUp: {},
    },
  }))
  const ledger = readLedger()
  equal(ledger.day, today, 'ledger.day')
  equal(ledger.spend, 0, 'ledger.spend')
  equal(ledger.wallet.day, today, 'ledger.wallet.day')
})

// 5. isInheritedEvent — a real Session carries header.createdAt, and the fork cut
// is Session#inheritedEventCount. Every case below uses that real shape.
test('isInheritedEvent: seq below the fork cut is inherited', () => {
  equal(isInheritedEvent(4, { inheritedEventCount: 5, header: { createdAt: 1 } }), true, 'isInheritedEvent')
})

test('isInheritedEvent: seq at or above the fork cut is owned by the child', () => {
  equal(isInheritedEvent(5, { inheritedEventCount: 5, header: { createdAt: 1 } }), false, 'isInheritedEvent')
  equal(isInheritedEvent(9, { inheritedEventCount: 5, header: { createdAt: 1 } }), false, 'isInheritedEvent')
})

test('isInheritedEvent: a non-forked session inherits nothing', () => {
  equal(isInheritedEvent(0, { inheritedEventCount: 0, header: { createdAt: Date.now() } }), false, 'isInheritedEvent')
  equal(isInheritedEvent(3, { header: { createdAt: Date.now() } }), false, 'isInheritedEvent')
})

test('isInheritedEvent: missing seq or session is not inherited', () => {
  equal(isInheritedEvent(undefined, { inheritedEventCount: 5 }), false, 'isInheritedEvent')
  equal(isInheritedEvent(1, undefined), false, 'isInheritedEvent')
})

// 6. currencyCode
test('currencyCode: normalizes usd to USD', () => {
  equal(currencyCode('usd'), 'USD', 'currencyCode')
})

test('currencyCode: rejects markup', () => {
  equal(currencyCode('<img src=x>'), '', 'currencyCode')
})

test('currencyCode: rejects empty input', () => {
  equal(currencyCode(''), '', 'currencyCode')
})

let failed = 0
for (const { name, fn } of tests) {
  try {
    await fn()
    console.log(`ok ${name}`)
  } catch (error) {
    failed += 1
    console.log(`FAIL ${name}: ${error.message}`)
  }
}

rmSync(home, { recursive: true, force: true })
if (failed > 0) process.exitCode = 1
