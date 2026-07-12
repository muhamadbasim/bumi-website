import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const source = readFileSync(join(root, 'app/data/capabilities.ts'), 'utf8')
const records = [...source.matchAll(/\{\s*kicker:\s*'([^']+)'([\s\S]*?)\n\s*\},/g)]

test('capability data defines ten complete photographic cards', () => {
  assert.equal(records.length, 10)
  const images = []

  for (const [, kicker, body] of records) {
    const image = body.match(/image:\s*'([^']+)'/)?.[1]
    const imageAlt = body.match(/imageAlt:\s*'([^']+)'/)?.[1]
    const features = body.match(/features:\s*\[([^\]]+)\]/)?.[1].match(/'[^']+'/g) ?? []
    const benefits = body.match(/benefits:\s*\[([^\]]+)\]/)?.[1].match(/'[^']+'/g) ?? []

    assert.match(kicker, /^\d{2}$/)
    assert.ok(image?.startsWith('/images/capabilities/'))
    assert.ok(imageAlt && imageAlt.length >= 20)
    assert.equal(features.length, 5)
    assert.equal(benefits.length, 3)
    images.push(image)
  }

  assert.equal(new Set(images).size, 10)
})

test('all capability images exist locally', () => {
  for (const [, , body] of records) {
    const image = body.match(/image:\s*'([^']+)'/)?.[1]
    assert.ok(image)
    assert.ok(existsSync(join(root, 'public', image.slice(1))), `missing ${image}`)
  }
})
