# Custom System Flagship Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add and deploy a full-width, theme-aware flagship card showing that Bumi can build any custom application.

**Architecture:** A focused Astro component owns the flagship markup while the homepage places it before the numbered capability grid. One local WebP image supplies the editorial visual, and capability-scoped CSS controls light/dark themes, responsive layout, focus behavior, and reduced motion.

**Tech Stack:** Astro, TypeScript, CSS custom properties, Node built-in test runner, Cloudflare Workers, Wrangler 4.

## Global Constraints

- Render the flagship exactly once before Manufacturing ERP and without a sequence number.
- Keep all existing ten capability cards numbered `01` through `10`.
- Use the approved eyebrow, headline, body topics, five chips, and `/contact` CTA.
- Use an original local 4:3 editorial image without readable text, logos, or watermarks.
- Explicitly support light and dark themes with accessible contrast.
- Use two internal columns above `800px` and one column at `800px` and below.
- Preserve the existing five/two/one numbered capability grid and avoid horizontal overflow.
- Respect `prefers-reduced-motion: reduce` and add no runtime dependency.

---

### Task 1: Build and test the flagship component

**Files:**
- Create: `astro/src/components/CustomSystemFlagship.astro`
- Create: `astro/public/images/capabilities/custom-system.webp`
- Modify: `astro/src/pages/index.astro`
- Modify: `astro/src/styles/global.css`
- Modify: `astro/scripts/capability-cards.test.mjs`

**Interfaces:**
- Produces: `<CustomSystemFlagship />`, rendering one unnumbered article with class `custom-system-flagship`.
- Produces: local visual `/images/capabilities/custom-system.webp` with alt text owned by the component.

- [ ] **Step 1: Add failing component and placement tests**

Append these tests to `astro/scripts/capability-cards.test.mjs`:

```js
test('custom system flagship appears once before the numbered grid', () => {
  const page = readFileSync(join(root, 'src/pages/index.astro'), 'utf8')
  const component = readFileSync(join(root, 'src/components/CustomSystemFlagship.astro'), 'utf8')
  assert.equal((page.match(/<CustomSystemFlagship \/>/g) ?? []).length, 1)
  assert.ok(page.indexOf('<CustomSystemFlagship />') < page.indexOf('class="service-grid"'))
  assert.doesNotMatch(component, /card-number|number:/)
  assert.match(component, /FLAGSHIP CAPABILITY/)
  assert.match(component, /Any idea\. Any workflow\. Your custom application\./)
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
```

- [ ] **Step 2: Run tests and confirm red state**

Run: `cd astro; npm.cmd run test:capabilities`

Expected: FAIL because `CustomSystemFlagship.astro` and its homepage import do not exist.

- [ ] **Step 3: Generate and save the flagship photograph**

Use the imagegen tool once with this production prompt:

```text
Use case: photorealistic-natural
Asset type: 4:3 flagship website capability photograph
Primary request: an Indonesian or Southeast Asian software product team collaborating around a large digital application prototype, demonstrating that they can design any custom business application
Style: premium editorial corporate technology photography, realistic people and workspace
Composition: landscape 4:3, team grouped on the right and center, safe crop margins, visible but abstract interface shapes
Lighting: modern neutral studio-office light with electric-blue and subtle violet accents
Avoid: readable generated text, third-party logos, watermarks, malformed people, cartoon or sci-fi excess
```

Inspect the output, convert it to a 1200 × 900 WebP near 60–140 KB, and save it at `astro/public/images/capabilities/custom-system.webp`.

- [ ] **Step 4: Implement the focused Astro component**

Create `astro/src/components/CustomSystemFlagship.astro`:

```astro
<article class="custom-system-flagship">
  <div class="custom-system-copy">
    <p class="custom-system-eyebrow">FLAGSHIP CAPABILITY</p>
    <h3>Any idea. Any workflow. <em>Your custom application.</em></h3>
    <p class="custom-system-body">Bumi builds purpose-fit web applications, mobile applications, dashboards, portals, enterprise systems, workflow automation, AI solutions, and system integrations around the way your business works.</p>
    <div class="custom-system-chips" aria-label="Custom system capabilities">
      {['Web & Mobile Apps', 'Enterprise Systems', 'AI & Automation', 'Integrations', 'Ongoing Support'].map((chip) => <span>{chip}</span>)}
    </div>
    <a class="custom-system-cta" href="/contact" aria-label="Build your custom system with Bumi">Build your custom system <span>↗</span></a>
  </div>
  <figure class="custom-system-visual">
    <img src="/images/capabilities/custom-system.webp" alt="Software product team collaborating on a custom business application" width="1200" height="900" loading="lazy" decoding="async" />
  </figure>
  <div class="custom-system-grid" aria-hidden="true"></div>
</article>
```

- [ ] **Step 5: Place the flagship before the grid**

In `astro/src/pages/index.astro`, import `CustomSystemFlagship` beside `ServiceCard`, then render:

```astro
<CustomSystemFlagship />
<div class="service-grid">{services.map((service) => <ServiceCard {...service} />)}</div>
```

- [ ] **Step 6: Add theme-aware and responsive styling**

Add component-scoped selectors to `astro/src/styles/global.css` with these binding values:

```css
.custom-system-flagship { display:grid; grid-template-columns:minmax(0,1.05fr) minmax(360px,.95fr); gap:clamp(30px,5vw,76px); align-items:center; position:relative; overflow:hidden; margin-bottom:28px; padding:clamp(30px,5vw,72px); border:1px solid rgba(32,123,255,.45); border-radius:34px; transition:transform .3s ease,box-shadow .3s ease; }
html[data-theme='light'] .custom-system-flagship { color:#0b1020; background:linear-gradient(135deg,#ffffff,#eaf3ff); box-shadow:0 30px 90px rgba(32,123,255,.16); }
html[data-theme='dark'] .custom-system-flagship { color:#ffffff; background:linear-gradient(135deg,#101a31,#071126); box-shadow:0 30px 100px rgba(0,102,255,.22); }
.custom-system-flagship:hover,.custom-system-flagship:focus-within { transform:translateY(-7px); box-shadow:0 38px 110px rgba(32,123,255,.28); }
.custom-system-eyebrow { color:#207bff; font-size:11px; font-weight:700; letter-spacing:.18em; }
.custom-system-copy h3 { max-width:720px; margin:18px 0 24px; font-size:clamp(42px,6vw,92px); line-height:.92; letter-spacing:-.065em; }
.custom-system-copy h3 em { color:#207bff; font-style:normal; }
.custom-system-body { max-width:680px; color:var(--muted); font-size:clamp(16px,1.6vw,21px); line-height:1.6; }
.custom-system-chips { display:flex; flex-wrap:wrap; gap:9px; margin:28px 0 34px; }
.custom-system-chips span { padding:9px 13px; border:1px solid rgba(32,123,255,.35); border-radius:999px; font-size:11px; font-weight:600; }
.custom-system-cta { display:inline-flex; gap:18px; align-items:center; padding:15px 20px; border-radius:999px; background:#207bff; color:#fff; font-weight:700; }
.custom-system-cta span { transition:transform .22s ease; }
.custom-system-cta:hover span,.custom-system-cta:focus-visible span { transform:translateX(4px); }
.custom-system-visual { aspect-ratio:4/3; margin:0; overflow:hidden; border-radius:24px; }
.custom-system-visual img { width:100%; height:100%; display:block; object-fit:cover; transition:transform .5s ease; }
.custom-system-flagship:hover .custom-system-visual img,.custom-system-flagship:focus-within .custom-system-visual img { transform:scale(1.04); }
.custom-system-grid { position:absolute; inset:0; pointer-events:none; opacity:.18; background-image:linear-gradient(rgba(32,123,255,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(32,123,255,.18) 1px,transparent 1px); background-size:42px 42px; mask-image:linear-gradient(90deg,transparent,black); }
@media (max-width:800px) { .custom-system-flagship { grid-template-columns:1fr; padding:26px; } .custom-system-copy h3 { font-size:44px; } }
@media (prefers-reduced-motion:reduce) { .custom-system-flagship,.custom-system-flagship:hover,.custom-system-flagship:focus-within,.custom-system-visual img { transform:none!important; } }
```

- [ ] **Step 7: Run focused and production checks**

Run: `cd astro; npm.cmd run test:capabilities; npm.cmd run verify`

Expected: all capability tests pass, Astro reports zero diagnostics, and production build completes.

- [ ] **Step 8: Commit the implementation**

```bash
git add astro/src/components/CustomSystemFlagship.astro astro/public/images/capabilities/custom-system.webp astro/src/pages/index.astro astro/src/styles/global.css astro/scripts/capability-cards.test.mjs
git commit -m "feat: add custom system flagship capability"
```

### Task 2: Validate, deploy, and verify production

**Files:**
- No source changes expected.

**Interfaces:**
- Consumes: verified Astro build and Worker `bumi-astro-preview`.
- Produces: live custom-system flagship at `https://bumi.basim.id/#services`.

- [ ] **Step 1: Browser-check the local production surface**

Run `cd astro; npm.cmd run dev -- --host 127.0.0.1`. At 1440px and 390px, verify one `.custom-system-flagship`, ten `.service-card` elements, no horizontal overflow, correct internal columns, light/dark readability, and no console errors.

- [ ] **Step 2: Run Wrangler dry-run**

Run: `cd astro; npx.cmd wrangler deploy --dry-run`

Expected: Wrangler uses `dist/server/wrangler.json`, recognizes `SESSION`, `IMAGES`, and `ASSETS`, and exits successfully without upload.

- [ ] **Step 3: Deploy production**

Run: `cd astro; npx.cmd wrangler deploy`

Expected: Worker `bumi-astro-preview` deploys successfully to custom domain `bumi.basim.id` and reports a new Version ID.

- [ ] **Step 4: Verify the live deployment**

Request `https://bumi.basim.id/?deploy=<VERSION_ID>` and confirm HTTP 200, one `FLAGSHIP CAPABILITY`, the approved headline, `/images/capabilities/custom-system.webp`, and all ten existing capability cards.

- [ ] **Step 5: Push source parity**

Run: `git push origin main`

Expected: `origin/main` advances to the implementation commit and `public/stitch/` remains untracked.
