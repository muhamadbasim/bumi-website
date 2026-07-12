# Bumi Astro Technical Stack

## 1. Core

| Layer | Choice | Purpose |
|---|---|---|
| Framework | Astro | HTML-first pages, islands, server routes |
| Language | TypeScript | Contracts and safer refactors |
| Styling | CSS + Tailwind CSS | Design tokens and utility layout |
| Animation | GSAP + ScrollTrigger | Marquee, reveal, parallax, sequencing |
| Runtime | Cloudflare Workers | Edge frontend and backend |
| Adapter | `@astrojs/cloudflare` | Astro Worker deployment/runtime |
| Local runtime | Wrangler/workerd | Cloudflare-compatible preview |

## 2. Cloudflare services

| Service | Use | MVP status |
|---|---|---|
| Workers | SSR, static assets, APIs | Required |
| D1 | Content, contact, newsletter | Phase 2 |
| R2 | Images, videos, documents | Phase 2 |
| KV | Cache/session/config | Optional |
| Queues | Email/background jobs | Phase 2 |
| Turnstile | Form abuse prevention | Phase 2 |
| Access | Admin protection | Phase 3 |

## 3. Package policy

Required:

```text
astro
@astrojs/cloudflare
typescript
wrangler
gsap
tailwindcss
```

Add a package only when it solves a documented requirement. Prefer platform APIs and Astro primitives over large UI libraries.

## 4. Runtime constraints

- Treat Cloudflare Workers as an edge runtime, not a full Node.js server.
- Prefer Web APIs, `fetch`, Web Crypto, and platform bindings.
- Avoid filesystem access and Node-only packages in server routes.
- Keep secrets in Wrangler/Cloudflare secrets, never in `PUBLIC_*` variables.
- Use `nodejs_compat` only when a dependency requires it and document the reason.

## 5. Performance policy

- Astro-render static content by default.
- Hydrate only interactive components.
- Use `client:visible` where interaction can be deferred.
- Reserve `client:load` for header/menu or immediate hero behavior.
- Use fixed aspect ratios for media.
- Preload only the hero poster/font actually needed above the fold.
- Store large media in R2 and use responsive formats.
- Disable or review Cloudflare HTML/JS transformations if hydration mismatches occur.

## 6. Security policy

- Validate all form payloads server-side.
- Add Turnstile and rate limiting before production.
- Parameterize D1 queries.
- Sanitize or safely render rich content.
- Add security headers and a restrictive Content Security Policy after assets are known.
- Never log email body, secrets, tokens, or unnecessary personal data.

## 7. Verification commands

```bash
npm run typecheck
npm run build
npm run preview
npm run deploy
```

Required release checks:

```text
route smoke test
desktop/mobile screenshot comparison
keyboard navigation
reduced motion
console error check
Cloudflare binding check
Lighthouse/Core Web Vitals
```

## 8. Environments

```text
local      local Astro + Wrangler bindings
preview    Cloudflare preview Worker and isolated data
production production Worker, domain, D1, R2, Queue
```

Production data and media must never be used by local development by default.

## 9. Theme and design system

| Concern | Decision | Rule |
|---|---|---|
| Theme state | html[data-theme] | Single source of truth |
| Default | light | Used when no valid preference exists |
| Persistence | localStorage | Key: bumi-theme |
| Styling | CSS custom properties | Components consume semantic tokens |
| Toggle | Astro component + inline client script | No framework island required |
| Motion | CSS transition + existing media behavior | Respect prefers-reduced-motion |

The theme system should remain framework-free. Astro renders the control, while a small browser script handles persistence and state changes. No global state library is needed.

## 10. Media strategy

- Hero media is served from public/ during development.
- Production media should move to R2 when the asset set grows or cache control requires it.
- Hero video must have a poster or CSS fallback and remain decorative with aria-hidden="true".
- Video playback must be muted, looped, inline, and resilient to browser autoplay restrictions.
- Avoid loading multiple large media files above the fold.
