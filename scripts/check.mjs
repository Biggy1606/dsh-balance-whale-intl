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

// Rebuild the bundle in memory with exactly the substitutions scripts/build.mjs
// performs, then compare the whole string. Comparing the full output (instead of
// slicing sentinels back out of client.js) also catches a change to the template
// itself, and cannot be fooled by placeholder text appearing in ui.js or ui.html.
function replaceOnce(source, needle, value, label) {
  const first = source.indexOf(needle)
  if (first === -1) fail(`client.template.js is missing the ${label} placeholder`)
  if (source.indexOf(needle, first + needle.length) !== -1) {
    fail(`client.template.js has a duplicate ${label} placeholder`)
  }
  return source.replace(needle, () => value)
}

let expected = replaceOnce(template, '"@@BW_CSS@@"', JSON.stringify(css), 'CSS')
expected = replaceOnce(expected, '"@@BW_HTML@@"', JSON.stringify(html), 'HTML')
expected = replaceOnce(expected, '/* @@BW_UI@@ */', ui.replace(/\s+$/, ''), 'UI')
if (expected.includes('@@BW_')) fail('rebuilt bundle contains unresolved placeholders')
if (expected !== client) fail('client.js is stale; run npm run build')

for (const file of ['locale/en.json', 'locale/zh.json']) {
  const meta = JSON.parse(await read(file))
  if (!meta?.meta?.title || !meta?.meta?.description) fail(`${file} is missing metadata`)
}

console.log('check: package, bundle, locales, and generated client are consistent')
