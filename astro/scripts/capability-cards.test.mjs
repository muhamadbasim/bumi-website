import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const data = readFileSync(join(root, 'src/data/home.ts'), 'utf8')
const card = readFileSync(join(root, 'src/components/ServiceCard.astro'), 'utf8')
const css = readFileSync(join(root, 'src/styles/global.css'), 'utf8')
const servicesSource = data.match(/export const services = \[([\s\S]*?)\r?\n\]\r?\n\r?\nexport const projects/)?.[1] ?? ''
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

test('custom system flagship appears once before the numbered grid', () => {
  const page = readFileSync(join(root, 'src/pages/index.astro'), 'utf8')
  const component = readFileSync(join(root, 'src/components/CustomSystemFlagship.astro'), 'utf8')
  assert.equal((page.match(/<CustomSystemFlagship \/>/g) ?? []).length, 1)
  assert.ok(page.indexOf('<CustomSystemFlagship />') < page.indexOf('class="service-grid"'))
  assert.doesNotMatch(component, /card-number|number:/)
  assert.match(component, /FLAGSHIP CAPABILITY/)
  assert.match(component, /Any idea\. Any workflow\. <em>Your custom application\.<\/em>/)
  assert.match(component, /href="\/contact"/)
})

test('custom system flagship supports themes, responsiveness, and reduced motion', () => {
  const component = readFileSync(join(root, 'src/components/CustomSystemFlagship.astro'), 'utf8')
  assert.match(component, /Web & Mobile Apps/)
  assert.match(component, /Enterprise Systems/)
  assert.match(component, /AI & Automation/)
  assert.match(component, /Integrations/)
  assert.match(component, /Ongoing Support/)
  assert.match(css, /html\[data-theme='light'\] \.custom-system-flagship/)
  assert.match(css, /html\[data-theme='dark'\] \.custom-system-flagship/)
  assert.match(css, /@media \(max-width:800px\)[\s\S]*?\.custom-system-flagship/)
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*?\.custom-system-flagship/)
})
