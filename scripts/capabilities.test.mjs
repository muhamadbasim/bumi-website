import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const dataSource = readFileSync(join(root, 'app/data/capabilities.ts'), 'utf8')
const pageSource = readFileSync(join(root, 'app/pages/index.vue'), 'utf8')
const cssSource = readFileSync(join(root, 'app/assets/css/main.css'), 'utf8')
const records = [...dataSource.matchAll(/\{\s*kicker:\s*'([^']+)'([\s\S]*?)\n\s*\},/g)]

const expectedCapabilities = [
  ['01', 'Manufacturing ERP', '/images/capabilities/manufacturing.webp', '/solutions/future-ready-digital-infrastructure'],
  ['02', 'Education System', '/images/capabilities/education.webp', '/solutions/smart-operations'],
  ['03', 'Clinic & Beauty Management', '/images/capabilities/clinic-beauty.webp', '/solutions/secure-platforms'],
  ['04', 'Hotel Management', '/images/capabilities/hotel.webp', '/solutions/smart-operations'],
  ['05', 'Restaurant Management', '/images/capabilities/restaurant.webp', '/solutions/smart-operations'],
  ['06', 'Laundry Management', '/images/capabilities/laundry.webp', '/services/operational-systems'],
  ['07', 'Outsourcing Management', '/images/capabilities/outsourcing.webp', '/services/operational-systems'],
  ['08', 'Franchise Management', '/images/capabilities/franchise.webp', '/projects/operational-modernization'],
  ['09', 'BPR / Fintech System', '/images/capabilities/fintech.webp', '/solutions/secure-platforms'],
  ['10', 'AI Digital Employee', '/images/capabilities/ai-workforce.webp', '/solutions/data-intelligence'],
]

function property(body, name) {
  return body.match(new RegExp(`${name}:\\s*'([^']+)'`))?.[1]
}

function stringArray(body, name) {
  const values = body.match(new RegExp(`${name}:\\s*\\[([^\\]]+)\\]`))?.[1]
  return values?.match(/'[^']+'/g)?.map(value => value.slice(1, -1)) ?? []
}

function blockAfter(source, marker) {
  const markerIndex = source.indexOf(marker)
  assert.notEqual(markerIndex, -1, `missing ${marker}`)
  const openingBrace = source.indexOf('{', markerIndex + marker.length)
  assert.notEqual(openingBrace, -1, `missing block for ${marker}`)

  let depth = 0
  for (let index = openingBrace; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1
    if (source[index] === '}') depth -= 1
    if (depth === 0) return source.slice(openingBrace + 1, index)
  }

  assert.fail(`unclosed block for ${marker}`)
}

function capabilityColumnsAt(width) {
  const baseCss = cssSource.slice(0, cssSource.indexOf('@media'))
  let columns = Number(blockAfter(baseCss, '.capability-grid').match(/grid-template-columns:\s*repeat\((\d+)/)?.[1])

  for (const match of cssSource.matchAll(/@media\s*\((min|max)-width:\s*(\d+)px\)/g)) {
    const [, direction, breakpoint] = match
    const applies = direction === 'min' ? width >= Number(breakpoint) : width <= Number(breakpoint)
    if (!applies) continue

    const mediaBlock = blockAfter(cssSource, match[0])
    for (const rule of mediaBlock.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selectors = rule[1].split(',').map(selector => selector.trim())
      if (!selectors.includes('.capability-grid')) continue
      const count = rule[2].match(/grid-template-columns:\s*(?:repeat\((\d+)|1fr)/)?.[1]
      columns = count ? Number(count) : 1
    }
  }

  return columns
}

function readWebpDimensions(buffer) {
  assert.equal(buffer.toString('ascii', 0, 4), 'RIFF')
  assert.equal(buffer.toString('ascii', 8, 12), 'WEBP')

  for (let offset = 12; offset + 8 <= buffer.length;) {
    const chunk = buffer.toString('ascii', offset, offset + 4)
    const size = buffer.readUInt32LE(offset + 4)
    const data = offset + 8

    if (chunk === 'VP8X') {
      return {
        width: 1 + buffer.readUIntLE(data + 4, 3),
        height: 1 + buffer.readUIntLE(data + 7, 3),
      }
    }

    if (chunk === 'VP8L') {
      assert.equal(buffer[data], 0x2f, 'invalid VP8L signature')
      const bits = buffer.readUInt32LE(data + 1)
      return {
        width: 1 + (bits & 0x3fff),
        height: 1 + ((bits >> 14) & 0x3fff),
      }
    }

    if (chunk === 'VP8 ') {
      assert.equal(buffer.toString('hex', data + 3, data + 6), '9d012a', 'invalid VP8 frame header')
      return {
        width: buffer.readUInt16LE(data + 6) & 0x3fff,
        height: buffer.readUInt16LE(data + 8) & 0x3fff,
      }
    }

    offset = data + size + (size % 2)
  }

  assert.fail('WebP dimensions chunk not found')
}

test('capability records preserve exact images, links, and content cardinality', () => {
  assert.equal(records.length, expectedCapabilities.length)

  const actualMappings = records.map(([, kicker, body]) => [
    kicker,
    property(body, 'title'),
    property(body, 'image'),
    property(body, 'href'),
  ])
  assert.deepEqual(actualMappings, expectedCapabilities)

  for (const [, kicker, body] of records) {
    assert.match(kicker, /^\d{2}$/)
    assert.ok(property(body, 'imageAlt')?.length >= 20)
    assert.equal(stringArray(body, 'features').length, 5, `${kicker} feature count`)
    assert.equal(stringArray(body, 'benefits').length, 3, `${kicker} benefit count`)
  }

  assert.doesNotMatch(dataSource, /\bworkflow:\s*\[/)
  assert.doesNotMatch(dataSource, /imagePosition:\s*'center'/)
})

test('capability images are distinct local 1200 by 900 WebP files', () => {
  const images = expectedCapabilities.map(([, , image]) => image)
  assert.equal(new Set(images).size, expectedCapabilities.length)

  for (const image of images) {
    assert.equal(image.slice(-5), '.webp', `${image} must use WebP`)
    const file = readFileSync(join(root, 'public', image.slice(1)))
    const dimensions = readWebpDimensions(file)
    assert.deepEqual(dimensions, { width: 1200, height: 900 }, `${image} dimensions`)
    assert.equal(dimensions.width / dimensions.height, 4 / 3, `${image} aspect ratio`)
  }
})

test('capability cards keep two columns through 1279px and five from 1280px', () => {
  assert.equal(capabilityColumnsAt(1024), 2)
  assert.equal(capabilityColumnsAt(1279), 2)
  assert.equal(capabilityColumnsAt(1280), 5)
  assert.match(cssSource, /@media\s*\(min-width:\s*1280px\)/)
  assert.match(pageSource, /sizes="100vw sm:50vw xl:20vw"/)
})

test('capability markup preserves content, accessibility, and features-before-photo order', () => {
  const cardStart = pageSource.indexOf('<article v-for="capability in capabilities"')
  const cardEnd = pageSource.indexOf('</article>', cardStart)
  assert.ok(cardStart >= 0 && cardEnd > cardStart, 'capability card template must exist')
  const card = pageSource.slice(cardStart, cardEnd)
  const featuresIndex = card.indexOf('class="capability-features"')
  const photoIndex = card.indexOf('class="capability-photo"')

  assert.match(card, /<NuxtImg[\s\S]*:src="capability\.image"[\s\S]*:alt="capability\.imageAlt"/)
  assert.match(card, /width="1200"[\s\S]*height="900"[\s\S]*format="webp"[\s\S]*loading="lazy"/)
  assert.match(card, /:style="\{ objectPosition: capability\.imagePosition \|\| 'center' \}"/)
  assert.match(card, /<NuxtLink class="capability-cta" :to="capability\.href">/)
  assert.ok(featuresIndex >= 0 && photoIndex >= 0 && featuresIndex < photoIndex)
  assert.doesNotMatch(card, /<figcaption/)
  assert.doesNotMatch(card, /workflow-orbit/)
})

test('keyboard focus matches hover elevation and arrow motion with a visible ring', () => {
  assert.match(cssSource, /\.capability-card:hover,\s*\.capability-card:focus-within\s*\{[^}]*transform:\s*translateY\(-8px\);[^}]*box-shadow:/)
  assert.match(cssSource, /\.capability-cta:hover span,\s*\.capability-cta:focus-visible span,\s*\.capability-card:focus-within \.capability-cta span\s*\{[^}]*transform:\s*translateX\(5px\)/)
  assert.match(cssSource, /\.capability-cta:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--accent\);[^}]*outline-offset:\s*5px/)
})

test('reduced motion disables capability transforms and all animation transitions', () => {
  const reducedMotion = blockAfter(cssSource, '@media (prefers-reduced-motion: reduce)')
  assert.match(reducedMotion, /animation:\s*none !important/)
  assert.match(reducedMotion, /transition:\s*none !important/)
  assert.match(reducedMotion, /\.capability-card:hover[\s\S]*\.capability-card:focus-within[^{]*\{[^}]*transform:\s*none/)
  assert.match(reducedMotion, /\.capability-cta:focus-visible span[\s\S]*\{[^}]*transform:\s*none/)
})

test('obsolete capability animation and workflow contracts stay removed', () => {
  assert.doesNotMatch(cssSource, /@keyframes\s+dataFlow/)
  assert.doesNotMatch(pageSource, /workflow-orbit|workflow-steps|workflow-pulse/)
})
