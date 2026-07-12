import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const componentPath = path.resolve(currentDir, '../src/components/BrandLogo.astro')
const publicBrandDir = path.resolve(currentDir, '../public/brand')

test('BrandLogo renders the official app mark assets with accessible alt text', () => {
  const componentSource = readFileSync(componentPath, 'utf8')

  assert.match(componentSource, /\/brand\/bumi-logo-app-light\.svg/)
  assert.match(componentSource, /\/brand\/bumi-logo-app-dark\.svg/)
  assert.match(componentSource, /alt=\{alt\}/)
})

test('official Bumi logo assets exist in Astro public brand directory', () => {
  const requiredAssets = [
    'bumi-logo-primary.svg',
    'bumi-logo-app-light.svg',
    'bumi-logo-app-dark.svg',
    'bumi-logo-monochrome.svg',
  ]

  for (const asset of requiredAssets) {
    assert.equal(existsSync(path.join(publicBrandDir, asset)), true, `Missing asset: ${asset}`)
  }
})
