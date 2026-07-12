# Bumi Astro Platform — Product Requirements Document

> Status: Draft / implementation baseline  
> Owner: Bumi  
> Last updated: 2026-07-12  
> Primary source: current Bumi Nuxt repository and Sulth visual reference

## 1. Product intent

Bumi needs a premium technology-company website with strong visual direction, high-performance delivery, and a foundation for full-stack features. The first implementation target is an Astro application deployed to Cloudflare Workers. The website may use the Sulth website as a visual interaction reference, but must use Bumi-owned copy, brand, and media.

## 2. Goals

- Present Bumi as a trusted, future-focused technology company.
- Establish a premium, dark, editorial, motion-led visual system.
- Deliver excellent mobile, accessibility, SEO, and Core Web Vitals performance.
- Support dynamic services, projects, insights, contact submissions, and newsletter subscriptions.
- Deploy frontend and server routes on Cloudflare Workers.
- Keep content and media replaceable without rewriting layout components.

## 3. Non-goals for MVP

- Full CMS with complex editorial permissions.
- E-commerce or payment processing.
- Real-time collaboration.
- AI assistant or semantic site search.
- Copying Sulth's proprietary assets, logo, text, or source code.

## 4. Users and jobs to be done

| User | Need | Success signal |
|---|---|---|
| Prospective client | Understand Bumi's capabilities and credibility | Visits capability/project detail or submits contact form |
| Partner/investor | Understand company, leadership, and positioning | Reads company/insights content |
| Content editor | Update published content safely | Changes content without code rewrite |
| Bumi operator | Receive qualified inquiries | Contact submission reaches D1 and notification queue |

## 5. Information architecture

```text
/
├── company/
│   ├── leadership
│   └── (future: story, values)
├── services/
│   └── [slug]
├── solutions/
│   └── [slug]
├── projects/
│   └── [slug]
├── insights/
│   └── [slug]
├── sustainability/
│   └── [slug]
├── careers
├── contact
├── privacy
└── terms
```

## 6. MVP requirements

### Homepage

- Fixed responsive header with mobile menu.
- Hero with headline, supporting copy, primary CTA, and approved Bumi media.
- Editorial introduction section.
- Animated marquee/statement strip.
- Capability/service cards.
- Selected projects or proof section.
- Company credibility section.
- CTA section.
- Newsletter footer.

### Content pages

- Services, solutions, projects, and insights support index and slug detail routes.
- Every published page has SEO title, description, canonical URL, and social image.
- Draft or missing records must not leak into public routes.

### Forms

- Contact form validates on the server.
- Newsletter form validates email and prevents duplicate subscriptions.
- Turnstile protects public submissions.
- D1 stores submission status and timestamps.
- Queue dispatches email notification jobs.

## 7. Quality requirements

- Semantic HTML and keyboard-accessible interactions.
- Respect `prefers-reduced-motion`.
- No layout shift from images, fonts, or hero media.
- Mobile layouts tested at 360px and 390px widths.
- `npm run typecheck`, `npm run build`, and route smoke tests pass before release.
- No production secret is committed to the repository.

## 8. Acceptance criteria

- Homepage renders correctly in local Astro preview and Cloudflare Worker preview.
- Core routes resolve with no 404s.
- Header, mobile menu, marquee, reveal animation, and CTA interactions work without console errors.
- Contact and newsletter API routes return safe validation errors and success responses.
- Static assets are cacheable and large media is stored in R2 before production.
- Visual comparison passes agreed desktop and mobile reference screenshots.

## 9. Delivery phases

1. Astro foundation and homepage vertical slice.
2. Route parity and content migration.
3. Cloudflare D1/R2/API integration.
4. Admin/editor workflow.
5. Performance, accessibility, security, and production release.

## 10. Theme system requirements

### Product decision

The website supports light and dark themes. Light is the default theme for first-time visitors.

### Functional requirements

- The user can switch between light and dark from the global header.
- The selected theme persists in localStorage under bumi-theme.
- A first-time visitor receives the light theme without waiting for client hydration.
- Theme switching works on desktop navigation, mobile navigation, and all primary routes.
- Theme state uses html[data-theme="light|dark"] as the single source of truth.
- The toggle exposes an accessible name and pressed state.
- Theme changes do not reload the page.

### Visual requirements

- All global colors use semantic design tokens.
- Hero video, overlays, grid, borders, cards, buttons, footer, and mobile menu adapt to both themes.
- Text and controls meet WCAG AA contrast targets.
- The hero video remains visible and readable in both themes.
- Motion remains compatible with prefers-reduced-motion.

### Theme acceptance criteria

- Initial render is light when no preference exists.
- Reload preserves the selected theme.
- Toggle state and aria-pressed remain synchronized.
- No visible flash of the wrong theme occurs on initial load.
- No console errors occur during theme switching.
