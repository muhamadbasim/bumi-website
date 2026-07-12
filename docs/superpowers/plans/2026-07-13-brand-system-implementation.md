# Bumi Brand System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the temporary Bumi identity with the supplied official assets and make branding consistent across themes, browser metadata, social sharing, and initial loading.

**Architecture:** Official static assets are served from `astro/public/brand/`. A single `BrandLogo.astro` component owns theme-aware presentation, while `BaseLayout.astro` owns document metadata and `BrandLoader.astro` owns the bounded initial loading state.

**Tech Stack:** Astro, TypeScript, CSS custom properties, Node built-in test runner.

## Global Constraints

- The Astro application root is `astro/`; do not serve production assets from the repository-root `public/` directory.
- Use only the supplied official SVG marks; do not redraw or raster-crop the logo.
- Light theme is the default and the loader must fail open after 1.2 seconds.
- Respect `prefers-reduced-motion: reduce`.
- Use Poppins with weights 400, 500, 600, and 700.

---

### Task 1: Establish official assets and the reusable logo interface

**Files:**
- Create: `astro/public/brand/bumi-logo-primary.svg`
- Create: `astro/public/brand/bumi-logo-app-light.svg`
- Create: `astro/public/brand/bumi-logo-app-dark.svg`
- Create: `astro/public/brand/bumi-logo-monochrome.svg`
- Create: `astro/src/components/BrandLogo.astro`
- Create: `astro/scripts/brand-system.test.mjs`
- Modify: `astro/package.json`

**Interfaces:**
- Produces: `<BrandLogo alt?: string class?: string />`, rendering light and dark app marks from `/brand/`.
- Produces: `npm run test:brand`, which validates official asset paths and required component markup.

- [ ] **Step 1: Write the failing asset/component test**

```js
// astro/scripts/brand-system.test.mjs
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8')

test('BrandLogo uses official light and dark app assets', async () => {
  const component = await read('../src/components/BrandLogo.astro')
  assert.match(component, /\/brand\/bumi-logo-app-light\.svg/)
  assert.match(component, /\/brand\/bumi-logo-app-dark\.svg/)
  assert.match(component, /alt=\{alt\}/)
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd astro; node --test scripts/brand-system.test.mjs`

Expected: FAIL because `BrandLogo.astro` does not exist.

- [ ] **Step 3: Copy assets and implement the minimal component**

Copy the four supplied SVGs from `../public/brand/` into `astro/public/brand/`, then create:

```astro
---
interface Props { alt?: string; class?: string }
const { alt = 'Bumi', class: className = '' } = Astro.props
---
<span class:list={['brand-logo', className]}>
  <img class="brand-logo-light" src="/brand/bumi-logo-app-light.svg" alt={alt} width="64" height="64" />
  <img class="brand-logo-dark" src="/brand/bumi-logo-app-dark.svg" alt="" width="64" height="64" aria-hidden="true" />
</span>
```

Add this script to `astro/package.json`:

```json
"test:brand": "node --test scripts/brand-system.test.mjs"
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd astro; npm run test:brand`

Expected: PASS with one passing test.

- [ ] **Step 5: Commit**

```bash
git add astro/public/brand astro/src/components/BrandLogo.astro astro/scripts/brand-system.test.mjs astro/package.json
git commit -m "feat: add official Bumi logo component"
```

### Task 2: Apply the official identity to site chrome and theme tokens

**Files:**
- Modify: `astro/src/components/SiteHeader.astro`
- Modify: `astro/src/pages/index.astro`
- Modify: `astro/src/styles/global.css`
- Modify: `astro/scripts/brand-system.test.mjs`

**Interfaces:**
- Consumes: `BrandLogo.astro` from Task 1.
- Produces: theme-aware header/footer logos and Poppins/palette CSS tokens.

- [ ] **Step 1: Extend the failing test**

```js
test('site chrome uses BrandLogo and brand theme rules', async () => {
  const [header, home, css] = await Promise.all([
    read('../src/components/SiteHeader.astro'), read('../src/pages/index.astro'), read('../src/styles/global.css'),
  ])
  assert.match(header, /import BrandLogo/)
  assert.match(home, /<BrandLogo alt="Bumi"/)
  assert.match(css, /family=Poppins/)
  assert.match(css, /--brand-midnight:#0b1020/)
  assert.match(css, /\.brand-logo-dark/)
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd astro; npm run test:brand`

Expected: FAIL because site chrome still contains the temporary `B` mark.

- [ ] **Step 3: Replace the temporary marks and update CSS**

In both header and footer, import and render:

```astro
import BrandLogo from './BrandLogo.astro' // Header
// Footer imports from '../components/BrandLogo.astro'
<BrandLogo alt="" />
```

Use `alt=""` where the surrounding link has `aria-label="Bumi home"`; use `alt="Bumi"` for the standalone footer mark. Replace the font import with Poppins and define both theme palettes using `--brand-midnight:#0b1020`, `--brand-blue:#207bff`, `--brand-accent:#0066ff`, `--brand-silver:#c8ccd4`, and `--brand-white:#ffffff`. Add:

```css
.brand-logo { display:inline-grid; width:36px; height:36px; }
.brand-logo img { grid-area:1 / 1; width:100%; height:100%; }
.brand-logo-dark { display:none; }
html[data-theme='dark'] .brand-logo-light { display:none; }
html[data-theme='dark'] .brand-logo-dark { display:block; }
```

Update heading, navigation, and marquee declarations from `Space Grotesk` to `Poppins`.

- [ ] **Step 4: Verify test and responsive build**

Run: `cd astro; npm run test:brand; npm run verify`

Expected: all tests pass and Astro finishes with `Complete!`.

- [ ] **Step 5: Commit**

```bash
git add astro/src/components/SiteHeader.astro astro/src/pages/index.astro astro/src/styles/global.css astro/scripts/brand-system.test.mjs
git commit -m "feat: apply Bumi brand system to site chrome"
```

### Task 3: Add document branding, social card, and bounded loader

**Files:**
- Create: `astro/public/brand/bumi-social-card.svg`
- Create: `astro/public/site.webmanifest`
- Create: `astro/src/components/BrandLoader.astro`
- Modify: `astro/src/layouts/BaseLayout.astro`
- Modify: `astro/src/styles/global.css`
- Modify: `astro/scripts/brand-system.test.mjs`

**Interfaces:**
- Consumes: public brand assets and `BrandLoader.astro`.
- Produces: canonical/social metadata, manifest, branded loader, and test coverage for required head tags.

- [ ] **Step 1: Extend the failing test**

```js
test('base layout exposes brand metadata and bounded loader', async () => {
  const [layout, loader] = await Promise.all([
    read('../src/layouts/BaseLayout.astro'), read('../src/components/BrandLoader.astro'),
  ])
  assert.match(layout, /rel="icon" href="\/brand\/bumi-logo-app-dark\.svg"/)
  assert.match(layout, /property="og:image" content="https:\/\/bumi\.basim\.id\/brand\/bumi-social-card\.svg"/)
  assert.match(layout, /<BrandLoader \/>/)
  assert.match(loader, /1200/)
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd astro; npm run test:brand`

Expected: FAIL because metadata and loader do not exist.

- [ ] **Step 3: Implement layout metadata and loader**

Add to `BaseLayout.astro`:

```astro
<link rel="icon" href="/brand/bumi-logo-app-dark.svg" type="image/svg+xml" />
<link rel="manifest" href="/site.webmanifest" />
<link rel="canonical" href="https://bumi.basim.id/" />
<meta name="theme-color" content="#0B1020" />
<meta property="og:image" content="https://bumi.basim.id/brand/bumi-social-card.svg" />
<meta name="twitter:card" content="summary_large_image" />
```

Render `<BrandLoader />` as the first body child. The loader script must remove its root on `load`, set a `1200` ms timeout, and skip animation for reduced motion. Create the social-card SVG at exact 1200 by 630 dimensions using the official logo paths and the `#0B1020` / `#207BFF` palette. Create `site.webmanifest` with name `Bumi`, start URL `/`, display `standalone`, theme color `#0B1020`, and the app-dark SVG icon.

- [ ] **Step 4: Verify behavior**

Run: `cd astro; npm run test:brand; npm run verify`

Expected: all checks pass. In a browser, confirm the loader disappears within 1.2 seconds and both themes show contrasting marks.

- [ ] **Step 5: Commit**

```bash
git add astro/public/brand/bumi-social-card.svg astro/public/site.webmanifest astro/src/components/BrandLoader.astro astro/src/layouts/BaseLayout.astro astro/src/styles/global.css astro/scripts/brand-system.test.mjs
git commit -m "feat: add Bumi metadata and branded loader"
```

