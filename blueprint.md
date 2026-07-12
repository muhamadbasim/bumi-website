# Bumi Astro Blueprint

> This document is the implementation contract for humans and agentic coding tools.

## 1. Architecture decision

Use Astro as the page renderer and Cloudflare Workers as the runtime. Use Astro components for mostly static UI and small client-side scripts/islands only where behavior is required. Use `@astrojs/cloudflare` with `output: 'server'` for full-stack routes.

## 2. Repository layout

```text
astro/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   ├── sections/
│   │   └── ui/
│   ├── data/
│   ├── layouts/
│   ├── pages/
│   ├── scripts/
│   ├── styles/
│   └── types/
├── public/
│   ├── images/
│   └── videos/
├── astro.config.mjs
├── env.d.ts
├── package.json
└── wrangler.jsonc
```

The existing Nuxt application remains the baseline until Astro reaches route and visual parity.

## 3. Rendering strategy

| Route/content | Strategy | Reason |
|---|---|---|
| Homepage marketing sections | prerender where data is static | Fast cacheable HTML |
| Published content detail | server or hybrid | Supports D1-backed content |
| Privacy/terms | prerender | Stable legal content |
| Contact/newsletter API | Worker server route | Secrets, validation, bindings |
| Admin | server route + access control | Protected data |

## 4. Component contracts

### `BaseLayout.astro`

Input: `title`, `description`, `canonical`, `ogImage`.  
Guarantees: document head, skip link, global styles, header/footer slots.

### `SiteHeader.astro`

Input: navigation data.  
Behavior: desktop nav, mobile menu, escape-to-close, focus-safe controls.

### `HeroSection.astro`

Input: eyebrow, title, body, primary CTA, media.  
Behavior: optional entrance animation; static fallback must remain complete.

### `Marquee.astro`

Input: repeated text/items, direction, speed.  
Behavior: GSAP animation only on client; stop/reduce motion when requested.

### `ContentCard.astro`

Input: title, kicker, description, href, accent, media.  
Guarantees: accessible link target and fixed media aspect ratio.

## 5. Data contracts

```ts
type PublishedContent = {
  id: string
  slug: string
  title: string
  excerpt?: string
  body?: string
  status: 'draft' | 'published' | 'archived'
  seoTitle?: string
  seoDescription?: string
  ogImage?: string
  publishedAt?: string
  updatedAt: string
}
```

Initial content can live in `src/data/`. The same shape must be used when it moves to D1.

## 6. Cloudflare bindings

```text
DB              D1 database
MEDIA_BUCKET    R2 bucket
CACHE           KV namespace
EMAIL_QUEUE     Queue
TURNSTILE       public site key / secret in Worker secrets
```

Binding access is server-only. Agentic tools must never print secret values.

## 7. API contracts

### `POST /api/contact`

Request: `name`, `email`, `company`, `message`, `turnstileToken`.  
Response: `{ ok: true }` or `{ ok: false, code: string, fields?: Record<string,string> }`.

### `POST /api/newsletter`

Request: `email`, `turnstileToken`.  
Response: safe success response for both new and already-known addresses.

## 8. Agent execution rules

- Read `PRD.md`, `blueprint.md`, and `TECHSTACK.md` before implementation.
- Inspect the current diff before editing.
- Prefer small vertical slices over broad rewrites.
- Do not delete the Nuxt baseline until parity is approved.
- Do not add third-party services without documenting the reason and secret handling.
- Run typecheck/build after code changes.
- Report changed files, verification commands, and known risks.

## 9. Definition of done

- Requirement maps to a route/component/API contract.
- Code has no unhandled TypeScript errors.
- UI works at desktop/mobile breakpoints.
- Animations have reduced-motion behavior.
- Cloudflare preview passes smoke tests.
- No secrets or unlicensed reference assets are committed.

## 10. Theme implementation contract

### Source of truth

Theme state is stored on the root element:

~~~html
<html data-theme="light">
~~~

Allowed values are light and dark. Do not introduce a second theme state in body, component state, or individual sections.

### Initialization order

1. BaseLayout.astro runs a small inline script in head.
2. The script reads localStorage.getItem('bumi-theme').
3. Only dark is accepted from storage; all other values resolve to light.
4. The script sets document.documentElement.dataset.theme before first paint.
5. ThemeToggle.astro reads and updates the same attribute.

### Component contract: ThemeToggle.astro

Input: none.  
Guarantees: keyboard support, accessible label, aria-pressed, persistence, and no page reload.

Required selectors:

~~~text
[data-theme-toggle]
html[data-theme="light"]
html[data-theme="dark"]
~~~

### Styling contract

- Use semantic variables such as --bg, --paper, --surface, --muted, and --line.
- Do not use page-level hard-coded black/white values for theme-dependent UI.
- Theme-specific hero video overlays must use variables.
- Every new component must document any theme-specific exception.

### Theme QA contract

- Test first visit, reload, route navigation, mobile menu, keyboard toggle, and reduced motion.
- Verify light and dark screenshots at 390px and desktop width.
- Verify no console errors after switching themes.
