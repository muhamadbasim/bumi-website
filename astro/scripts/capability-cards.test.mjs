import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const data = readFileSync(join(root, 'src/data/home.ts'), 'utf8')
const card = readFileSync(join(root, 'src/components/ServiceCard.astro'), 'utf8')
const css = readFileSync(join(root, 'src/styles/global.css'), 'utf8')
const servicesSource = data.match(/export const services = \[([\s\S]*?)\n\]\n\nexport const projects/)?.[1] ?? ''
const records = [...servicesSource.matchAll(/\{\s*number:\s*'(\d{2})'([\s\S]*?)\},/g)]

test('production defines ten photographic capability cards', () => {
  assert.equal(records.length, 10)
  for (const [, , body] of records) {
    const image = body.match(/image:\s*'([^']+\.webp)'/)?.[1]
    assert.ok(image?.startsWith('/images/capabilities/'))
    assert.ok(existsSync(join(root, 'public', image.slice(1))))
    assert.ok((body.match(/features:\s*\[([^\]]+)\]/)?.[1].match(/'[^']+'/g) ?? []).length === 5)
    assert.ok((body.match(/benefits:\s*\[([^\]]+)\]/)?.[1].match(/'[^']+'/g) ?? []).length === 3)
  }
})

test('production card renders features, photo, benefits, and accessible link', () => {
  assert.match(card, /class="capability-features"/)
  assert.match(card, /class="capability-photo"/)
  assert.match(card, /alt=\{imageAlt\}/)
  assert.match(card, /class="capability-benefits"/)
  assert.match(card, /aria-label=\{'Explore ' \+ title\}/)
  assert.ok(card.indexOf('capability-features') < card.indexOf('capability-photo'))
})

test('production grid uses five, two, and one responsive columns', () => {
  assert.match(css, /\.service-grid\s*\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/s)
  assert.match(css, /@media \(min-width:1280px\)[^{]*\{[^}]*\.service-grid\s*\{[^}]*repeat\(5,minmax\(0,1fr\)\)/s)
  assert.match(css, /@media \(max-width:800px\)[^{]*\{[\s\S]*?\.service-grid\s*\{[^}]*grid-template-columns:1fr/s)
  assert.match(css, /\.service-card:focus-within/)
  assert.match(css, /prefers-reduced-motion:reduce/)
})
