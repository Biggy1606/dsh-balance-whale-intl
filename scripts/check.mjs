#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (name) => readFile(path.join(root, name), 'utf8')
const fail = (message) => { throw new Error(`check: ${message}`) }

for (const file of ['index.js', 'client.js', 'ui.js', 'client.template.js']) {
  execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'pipe' })
}

const pkg = JSON.parse(await read('package.json'))
if (pkg.name !== 'dsh-balance-whale-intl') fail('unexpected package name')
if (pkg.private) fail('package must not be private for publish')
if (pkg.dsh?.bundle?.patch !== './cordis.patch.yml') fail('missing dsh.bundle.patch')

const patch = await read('cordis.patch.yml')
if (!patch.includes(`name: '${pkg.name}'`)) fail('cordis.patch.yml name does not match package.json')

const [client, css, html, ui, template] = await Promise.all([
  read('client.js'),
  read('ui.css'),
  read('ui.html'),
  read('ui.js'),
  read('client.template.js'),
])

if (template.includes('"@@BW_CSS@@"') === false) fail('template lost its CSS placeholder')
if (!client.includes(`id: '${pkg.name}'`)) fail('client module id does not match package name')
if (client.includes('@@BW_')) fail('client contains unresolved placeholders')

const lines = client.split('\n')
const cssLine = lines.find((line) => line.startsWith('    const CSS = '))
const htmlLine = lines.find((line) => line.startsWith('    const HTML = '))
if (!cssLine || !htmlLine) fail('client is missing embedded CSS or HTML')
const embeddedCss = JSON.parse(cssLine.slice('    const CSS = '.length).replace(/;$/, ''))
const embeddedHtml = JSON.parse(htmlLine.slice('    const HTML = '.length).replace(/;$/, ''))
if (embeddedCss !== css) fail('client CSS is stale; run npm run build')
if (embeddedHtml !== html) fail('client HTML is stale; run npm run build')

const uiStart = client.indexOf('/* Balance Whale — client UI controller.')
const widgetStart = client.indexOf('\n    function Widget() {')
if (uiStart < 0 || widgetStart < 0 || widgetStart <= uiStart) fail('cannot locate embedded UI')
const embeddedUi = client.slice(uiStart, widgetStart).replace(/\s+$/, '')
if (embeddedUi !== ui.replace(/\s+$/, '')) fail('client UI is stale; run npm run build')

for (const file of ['locale/en.json', 'locale/zh.json']) {
  const meta = JSON.parse(await read(file))
  if (!meta?.meta?.title || !meta?.meta?.description) fail(`${file} is missing metadata`)
}

console.log('check: package, bundle, locales, and generated client are consistent')
