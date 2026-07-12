# Bumi Astro Development Roadmap

> Ordered backlog for continuing development after the homepage vertical slice.

## Status legend

- Now: next implementation slice.
- Next: planned after the current slice is verified.
- Later: valuable but not required for the first production release.
- Blocked: requires a decision, asset, credential, or external service.

## Now — Theme foundation

- [ ] Refactor global color tokens.
- [ ] Implement default light theme.
- [ ] Add persistent light/dark toggle.
- [ ] Adapt hero video overlay and decorative orb contrast.
- [ ] Add theme QA at desktop and mobile widths.

## Next — Content and route parity

- [ ] Replace placeholder company page with approved content.
- [ ] Build services index and service detail route.
- [ ] Build projects index and project detail route.
- [ ] Add solutions and insights route contracts.
- [ ] Add shared SEO metadata and Open Graph image support.

## Next — Forms and Cloudflare backend

- [ ] Implement POST /api/contact.
- [ ] Implement POST /api/newsletter.
- [ ] Add server-side schema validation.
- [ ] Add Turnstile protection.
- [ ] Add D1 migration and submission status model.
- [ ] Add Queue-based notification workflow.

## Later — Content operations

- [ ] Move approved media to R2.
- [ ] Define content import format.
- [ ] Build protected admin/editor workflow.
- [ ] Add draft, published, and archived states.
- [ ] Add audit logging for content changes.

## Later — Production hardening

- [ ] Add security headers and CSP.
- [ ] Configure cache rules for static assets and media.
- [ ] Run Lighthouse and Core Web Vitals review.
- [ ] Add automated route smoke tests.
- [ ] Add screenshot regression checks.
- [ ] Configure production domain and observability.

## Feature delivery template

Every new feature should document:

~~~text
Goal:
User story:
Route/component/API:
Data contract:
Loading/error/empty states:
Accessibility:
Responsive behavior:
Cloudflare impact:
Verification:
~~~
