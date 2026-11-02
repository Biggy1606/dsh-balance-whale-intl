#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (name) => readFile(path.join(root, name), 'utf8')

function replaceOnce(source, needle, value, label) {
  const first = source.indexOf(needle)
  if (first === -1) throw new Error(`build: missing ${label} placeholder`)
  if (source.indexOf(needle, first + needle.length) !== -1) {
    throw new Error(`build: duplicate ${label} placeholder`)
  }
  return source.replace(needle, () => value)
}

const [template, css, html, ui] = await Promise.all([
  read('client.template.js'),
  read('ui.css'),
  read('ui.html'),
  read('ui.js'),
])

let output = replaceOnce(template, '"@@BW_CSS@@"', JSON.stringify(css), 'CSS')
output = replaceOnce(output, '"@@BW_HTML@@"', JSON.stringify(html), 'HTML')
output = replaceOnce(output, '/* @@BW_UI@@ */', ui.replace(/\s+$/, ''), 'UI')

if (output.includes('@@BW_')) throw new Error('build: unresolved placeholder in output')
await writeFile(path.join(root, 'client.js'), output, 'utf8')
console.log(`built client.js (${Buffer.byteLength(output)} bytes)`)
