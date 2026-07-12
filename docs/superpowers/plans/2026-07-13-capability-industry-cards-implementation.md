# Capability Industry Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the homepage capability section as ten responsive editorial cards with authentic industry photography, feature lists, business benefits, and existing solution links.

**Architecture:** Keep the current data-driven capability loop in `app/pages/index.vue` and extend each record in `app/data/capabilities.ts` with local image metadata. Store ten optimized assets under `public/images/capabilities/`, render them through Nuxt Image, and replace the abstract workflow visual with a consistent photographic panel while preserving the current icon and content structure.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Nuxt Image, CSS custom properties, Node built-in test runner.

## Global Constraints

- Render exactly ten capability cards from `app/data/capabilities.ts`.
- Use local raster photography without embedded text, logos, or watermarks.
- Keep existing capability names, features, benefits, accent colors, and destination URLs.
- Use five columns on wide desktop, two on tablet, and one on mobile without horizontal scrolling.
- Keep all five features and all three benefits visible at every breakpoint.
- Respect `prefers-reduced-motion: reduce` and provide meaningful image alternative text.
- Do not redesign unrelated homepage sections or add runtime dependencies.

---

### Task 1: Define and test the photographic capability data contract

**Files:**
- Create: `scripts/capabilities.test.mjs`
- Modify: `package.json`
- Modify: `app/data/capabilities.ts`

**Interfaces:**
- Produces: every capability record has `image: string`, `imageAlt: string`, and optional `imagePosition?: string`.
- Produces: `npm run test:capabilities`, validating record count, metadata, content cardinality, unique images, and local asset existence.

- [ ] **Step 1: Write the failing contract test**

Create `scripts/capabilities.test.mjs`:

```js
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
```

Add the package script:

```json
"test:capabilities": "node --test scripts/capabilities.test.mjs"
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:capabilities`

Expected: FAIL because capability records do not yet define `image` and `imageAlt`.

- [ ] **Step 3: Add explicit image metadata to all ten records**

Add these fields after `accent` in each matching record:

```ts
// 01 Manufacturing ERP
image: '/images/capabilities/manufacturing.webp',
imageAlt: 'Engineer monitoring automated production equipment inside a modern manufacturing facility',
imagePosition: 'center',

// 02 Education System
image: '/images/capabilities/education.webp',
imageAlt: 'Students and instructor collaborating with digital learning displays in a modern classroom',
imagePosition: 'center',

// 03 Clinic & Beauty Management
image: '/images/capabilities/clinic-beauty.webp',
imageAlt: 'Healthcare professional consulting a patient in a clean contemporary clinic environment',
imagePosition: 'center',

// 04 Hotel Management
image: '/images/capabilities/hotel.webp',
imageAlt: 'Premium hotel guest room prepared for connected hospitality operations',
imagePosition: 'center',

// 05 Restaurant Management
image: '/images/capabilities/restaurant.webp',
imageAlt: 'Restaurant team operating a digital ordering system in a contemporary dining venue',
imagePosition: 'center',

// 06 Laundry Management
image: '/images/capabilities/laundry.webp',
imageAlt: 'Commercial laundry facility with modern connected washing machines and organized operations',
imagePosition: 'center',

// 07 Outsourcing Management
image: '/images/capabilities/outsourcing.webp',
imageAlt: 'Professional service team working together in a modern operations center',
imagePosition: 'center',

// 08 Franchise Management
image: '/images/capabilities/franchise.webp',
imageAlt: 'Multi-location business manager reviewing connected franchise operations and outlet performance',
imagePosition: 'center',

// 09 BPR / Fintech System
image: '/images/capabilities/fintech.webp',
imageAlt: 'Financial services professional reviewing secure digital lending and analytics dashboards',
imagePosition: 'center',

// 10 AI Digital Employee
image: '/images/capabilities/ai-workforce.webp',
imageAlt: 'Human professional collaborating with an intelligent digital assistant in a futuristic workplace',
imagePosition: 'center',
```

- [ ] **Step 4: Run the contract test and confirm the expected asset-only failure**

Run: `npm run test:capabilities`

Expected: the metadata test passes and the asset test fails with `missing /images/capabilities/manufacturing.webp` as the first missing path.

- [ ] **Step 5: Commit the tested data contract**

```bash
git add scripts/capabilities.test.mjs package.json app/data/capabilities.ts
git commit -m "test: define capability photography contract"
```

### Task 2: Create and validate ten local industry photographs

**Files:**
- Create: `public/images/capabilities/manufacturing.webp`
- Create: `public/images/capabilities/education.webp`
- Create: `public/images/capabilities/clinic-beauty.webp`
- Create: `public/images/capabilities/hotel.webp`
- Create: `public/images/capabilities/restaurant.webp`
- Create: `public/images/capabilities/laundry.webp`
- Create: `public/images/capabilities/outsourcing.webp`
- Create: `public/images/capabilities/franchise.webp`
- Create: `public/images/capabilities/fintech.webp`
- Create: `public/images/capabilities/ai-workforce.webp`

**Interfaces:**
- Consumes: the exact local paths defined by Task 1.
- Produces: ten 4:3 WebP assets suitable for `object-fit: cover`, with no text or third-party branding.

- [ ] **Step 1: Generate or source each required photograph**

Use one cohesive visual direction for all ten assets: premium editorial corporate photography, realistic Indonesian or Southeast Asian context where people appear, cool neutral lighting with subtle electric-blue accents, 4:3 landscape composition, central subject with safe crop margins, no text, no logo, no watermark. Create exactly one usable final image for each subject:

```text
manufacturing.webp — engineer supervising robotic production machinery and live operational displays
education.webp — students and instructor collaborating around digital classroom displays
clinic-beauty.webp — healthcare professional consulting a patient in a polished modern clinic
hotel.webp — refined connected hotel room with hospitality technology visible but unobtrusive
restaurant.webp — restaurant staff using a digital POS with an active kitchen or dining room behind
laundry.webp — orderly commercial laundry with rows of modern connected machines
outsourcing.webp — diverse professional operations team in a contemporary service center
franchise.webp — multi-outlet business operator reviewing store network performance
fintech.webp — finance professional reviewing secure lending and risk analytics
ai-workforce.webp — professional collaborating with a friendly embodied digital assistant interface
```

Save the final files at the exact paths above. If an output is PNG or JPEG, convert it to WebP using the repository's available image tooling while preserving a practical card resolution near 1200 × 900.

- [ ] **Step 2: Inspect all ten assets for visual and content defects**

Open the ten-image directory as a contact sheet or inspect files individually. Reject and replace any asset with malformed people, unreadable invented interface text, a logo, watermark, unrelated subject, or a crop that loses the primary subject at 4:3.

- [ ] **Step 3: Run the asset contract test**

Run: `npm run test:capabilities`

Expected: PASS with two passing tests.

- [ ] **Step 4: Commit the photography set**

```bash
git add public/images/capabilities
git commit -m "feat: add capability industry photography"
```

### Task 3: Replace the abstract workflow visual with the editorial photo card

**Files:**
- Modify: `app/pages/index.vue`
- Modify: `app/assets/css/main.css`
- Modify: `scripts/capabilities.test.mjs`

**Interfaces:**
- Consumes: `capability.image`, `capability.imageAlt`, and `capability.imagePosition` from Task 1.
- Produces: a lazy-loaded Nuxt image panel with accent overlay and an explicit solution link.

- [ ] **Step 1: Extend the failing rendering test**

Append to `scripts/capabilities.test.mjs`:

```js
test('homepage renders accessible photographic capability cards', () => {
  const page = readFileSync(join(root, 'app/pages/index.vue'), 'utf8')
  const css = readFileSync(join(root, 'app/assets/css/main.css'), 'utf8')

  assert.match(page, /<NuxtImg/)
  assert.match(page, /:src="capability\.image"/)
  assert.match(page, /:alt="capability\.imageAlt"/)
  assert.match(page, /loading="lazy"/)
  assert.match(page, /class="capability-photo"/)
  assert.doesNotMatch(page, /workflow-orbit/)
  assert.match(css, /\.capability-photo img/)
  assert.match(css, /object-fit:\s*cover/)
  assert.match(css, /\.capability-card:focus-within/)
})
```

- [ ] **Step 2: Run the rendering test to verify it fails**

Run: `npm run test:capabilities`

Expected: FAIL because the homepage still renders `.workflow-orbit` and has no `NuxtImg` capability photo.

- [ ] **Step 3: Replace the workflow visual markup**

In `app/pages/index.vue`, replace the complete `<div class="capability-visual workflow-visual">...</div>` block with:

```vue
<figure class="capability-photo">
  <NuxtImg
    :src="capability.image"
    :alt="capability.imageAlt"
    width="1200"
    height="900"
    format="webp"
    loading="lazy"
    sizes="100vw sm:50vw lg:20vw"
    :style="{ objectPosition: capability.imagePosition || 'center' }"
  />
  <figcaption class="sr-only">{{ capability.imageAlt }}</figcaption>
</figure>
```

Keep the icon, number, heading, subtitle, description, five features, benefit panel, and explicit link in their current semantic order.

- [ ] **Step 4: Replace workflow CSS with photographic card styling**

Remove `.capability-visual`, `.workflow-*`, `.workflow-pulse`, `@keyframes workflowGlow`, `@keyframes nodePulse`, and `@keyframes workflowParticle`. Add:

```css
.capability-photo {
  aspect-ratio: 4 / 3;
  margin: auto 0 18px;
  border: 1px solid color-mix(in srgb, var(--accent) 34%, rgba(255,255,255,.08));
  border-radius: 18px;
  overflow: hidden;
  position: relative;
  background: #0b1020;
}
.capability-photo::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, transparent 48%, rgba(5,8,19,.68) 100%),
    linear-gradient(135deg, color-mix(in srgb, var(--accent) 22%, transparent), transparent 62%);
}
.capability-photo img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transform: scale(1.001);
  transition: transform .45s ease, filter .45s ease;
}
.capability-card:hover .capability-photo img,
.capability-card:focus-within .capability-photo img {
  transform: scale(1.045);
  filter: saturate(1.08) contrast(1.04);
}
.capability-card:focus-within {
  border-color: color-mix(in srgb, var(--accent) 70%, white 10%);
  box-shadow: 0 28px 88px color-mix(in srgb, var(--accent) 20%, rgba(0,0,0,.42));
}
.capability-cta:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 5px;
  border-radius: 4px;
}
```

Keep the existing five-column grid and its two-column and one-column media-query rules. Set `.capability-card` to a consistent minimum height only if required after rendering; do not hide or truncate features or benefits.

- [ ] **Step 5: Run focused tests and type checking**

Run: `npm run test:capabilities; npm run typecheck`

Expected: two contract tests and the rendering test pass; Nuxt type checking exits successfully.

- [ ] **Step 6: Commit the card implementation**

```bash
git add app/pages/index.vue app/assets/css/main.css scripts/capabilities.test.mjs
git commit -m "feat: redesign capability cards with industry photos"
```

### Task 4: Verify responsive behavior, accessibility, and production build

**Files:**
- Modify if needed: `app/assets/css/main.css`
- Modify if needed: `app/data/capabilities.ts`
- Modify if needed: `scripts/capabilities.test.mjs`

**Interfaces:**
- Consumes: completed capability data, assets, markup, and styles from Tasks 1–3.
- Produces: a validated five/two/one-column capability section with stable crops and no homepage regressions.

- [ ] **Step 1: Run the complete automated verification suite**

Run: `npm run test:capabilities; npm run verify`

Expected: all capability tests pass, preflight reports no failures, type checking succeeds, and the Nuxt production build completes.

- [ ] **Step 2: Start the existing development server and inspect the section**

Run: `npm run dev`

Use the exact local URL reported by Nuxt. Inspect `#capabilities` at approximately 1440 px, 900 px, and 390 px viewport widths. Confirm:

```text
1440 px: five columns, two rows, equal visual rhythm, no clipped text
900 px: two columns, readable type, stable 4:3 imagery
390 px: one column, no horizontal overflow, all five features and three benefits visible
```

- [ ] **Step 3: Check interaction and accessibility behavior**

Keyboard-tab through all ten explicit links and confirm every link receives the accent focus ring. Verify each image exposes its descriptive alt text, no card introduces nested links, hover does not shift surrounding layout, and reduced-motion mode removes transitions through the existing global media query.

- [ ] **Step 4: Fix only observed capability-section defects and rerun verification**

If inspection reveals a crop issue, change only that record's `imagePosition` to an explicit value such as `'50% 35%'`. If cards clip or overflow, adjust capability-scoped spacing or minimum height without hiding content. Then rerun:

Run: `npm run test:capabilities; npm run verify`

Expected: all checks pass after the focused correction.

- [ ] **Step 5: Commit final responsive adjustments if any exist**

```bash
git add app/assets/css/main.css app/data/capabilities.ts scripts/capabilities.test.mjs
git commit -m "fix: polish responsive capability cards"
```

