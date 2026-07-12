# Bumi Brand System and GitHub Delivery Design

**Status:** Approved design; pending implementation plan

## Purpose

Replace the temporary Bumi identity with the supplied official vector brand kit, align the site typography and color tokens with the brand, and establish traceable GitHub-to-Cloudflare delivery.

## Scope

The implementation covers the Astro application in `astro/` and the Worker deployed as `bumi-astro-preview` at `https://bumi.basim.id`.

Included:

- Official logo usage in the header, footer, favicon, metadata, social preview, and initial loader.
- Poppins as the site typeface.
- Light and dark theme tokens derived from the official palette.
- GitHub Actions CI, GitHub semantic releases, and Cloudflare Workers Builds CD.
- Documentation for brand usage, release flow, preview deployments, and rollback.

Excluded:

- Content rewrite, information-architecture changes, or new product functionality.
- A redesign of the existing page composition beyond changes necessary for brand contrast and legibility.
- A new backend or data model.

## Brand assets and rules

Authoritative supplied assets:

| Asset | Usage |
| --- | --- |
| `bumi-logo-primary.svg` | Dark promotional surfaces and social-card artwork. |
| `bumi-logo-app-light.svg` | Logo mark on light theme. |
| `bumi-logo-app-dark.svg` | Logo mark on dark theme. |
| `bumi-logo-monochrome.svg` | Single-color fallback where gradients are unsuitable. |
| `bumi-logo-variations.svg` | Reference sheet only; never used as a UI logo. |

Assets will be served from `astro/public/brand/`. The supplied root-level `public/brand/` files remain source references until the Astro copies are verified.

The identity palette is:

- Midnight: `#0B1020`
- Brand blue: `#207BFF`
- Accent blue: `#0066FF`
- Silver: `#C8CCD4`
- White: `#FFFFFF`

Poppins replaces DM Sans and Space Grotesk. Heading and body weights use the official family while retaining the current responsive size scale unless a contrast or layout issue requires a small adjustment.

## Component architecture

`BrandLogo.astro` is the sole logo interface. It accepts a visual context (theme and semantic purpose) and renders the correct asset with alternative text controlled by the parent link or label.

`SiteHeader.astro` and the site footer use `BrandLogo.astro`; the temporary circular `B` is removed. The header logo switches with the persisted theme before the page is painted, avoiding a theme/logo flash.

`BaseLayout.astro` owns document-level brand metadata:

- favicon and web manifest
- canonical URL
- Open Graph and Twitter metadata
- social-preview image path and alt text
- theme color metadata

The social preview is a 1200 x 630 SVG/PNG-compatible static card built from the official primary logo and brand palette. It does not depend on client JavaScript.

## Theme and loading behavior

Light theme is the default. The active theme changes both CSS tokens and the logo variant.

The initial loader is a small, client-only branded overlay. It:

- Shows the official mark only while the initial document is becoming ready.
- Ends on `load`, or through a maximum 1.2-second fail-open timeout.
- Does not run motion when `prefers-reduced-motion: reduce` is enabled.
- Is removed from the accessibility tree once the page is ready and never prevents keyboard access to loaded content.

## CI/CD and release architecture

### Continuous integration

GitHub Actions runs for pull requests and pushes to `main`, using the `astro/` lockfile:

1. Install exact dependencies with `npm ci`.
2. Run `npm run typecheck`.
3. Run `npm run build`.

The workflow has read-only default permissions and pinned action versions. It is the required status check before merging into `main` once branch protection is enabled.

### Continuous delivery

Cloudflare Workers Builds connects the existing GitHub repository to the existing Worker.

| Setting | Value |
| --- | --- |
| Worker | `bumi-astro-preview` |
| Root directory | `astro` |
| Production branch | `main` |
| Build command | `npm ci && npm run build` |
| Deploy command | `npx wrangler deploy` |
| Production domain | `bumi.basim.id` |

Pushes to `main` promote a production deployment. Pull request branches receive Cloudflare preview versions and must never replace the custom production domain.

Cloudflare manages the deploy credential for Workers Builds. No Cloudflare API token is stored in GitHub Actions.

### Versioning

Release Please runs after successful updates to `main`.

- Commit messages follow Conventional Commits.
- Release Please creates a release pull request and updates `astro/package.json` plus the changelog.
- Merging that pull request creates an immutable Git tag in the form `vMAJOR.MINOR.PATCH` and a GitHub Release.
- A release always points to a production-candidate commit already validated by CI.

## Failure handling and rollback

- A CI failure prevents a protected `main` merge.
- A Cloudflare build/deploy failure leaves the active production Worker version unchanged.
- Roll back application code through a Git revert, then let the normal pipeline deploy it.
- For urgent recovery, use Cloudflare Worker version rollback, then follow with a Git revert so source and production converge.

## Verification criteria

Before release, verify:

1. `npm run verify` passes in `astro/`.
2. Header, footer, favicon, loader, light theme, dark theme, and mobile navigation show the correct logo with adequate contrast.
3. The generated document includes canonical, Open Graph, Twitter, and theme metadata that point to production URLs.
4. The social card is accessible by direct URL and renders without JavaScript.
5. Pull requests show a passing GitHub CI check and a Cloudflare preview version once Workers Builds is connected.
6. A merge to `main` deploys only after the Cloudflare build succeeds.
7. Release tags and GitHub Releases point to the intended commit.

## Required external setup

The repository owner must authorize the Cloudflare Workers & Pages GitHub App and connect the existing Worker in Cloudflare Dashboard: **Workers & Pages -> bumi-astro-preview -> Settings -> Builds -> Connect**. After code workflows are merged, enable GitHub branch protection for `main` and require the CI check.

## Implementation order

1. Copy and reference official assets; build the reusable logo and document metadata layer.
2. Apply typography, color tokens, social card, favicon, and loader; verify visual and accessibility behavior.
3. Add GitHub CI and Release Please workflows.
4. Connect Workers Builds in Cloudflare dashboard and enable branch protection.
5. Verify a preview, a production deployment, a release tag, and a rollback path.
