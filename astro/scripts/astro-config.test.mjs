import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('Astro owns its TypeScript configuration', async () => {
  const [config, astroConfig] = await Promise.all([
    readFile(new URL('../tsconfig.json', import.meta.url), 'utf8'),
    readFile(new URL('../astro.config.mjs', import.meta.url), 'utf8'),
  ])
  assert.match(config, /"extends"\s*:\s*"astro\/tsconfigs\/strict"/)
  assert.match(config, /"include"\s*:\s*\[\s*"src\/\*\*\/\*.astro"/)
  assert.match(astroConfig, /tsconfigPaths:\s*false/)
})
