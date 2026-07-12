# GitHub and Cloudflare Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add repeatable GitHub quality checks, semantic GitHub releases, and documented Cloudflare Workers Builds delivery for the Astro Worker.

**Architecture:** GitHub Actions verifies the Astro app and prepares releases. Cloudflare Workers Builds deploys the existing Worker directly from GitHub, keeping Cloudflare credentials out of Actions.

**Tech Stack:** GitHub Actions, Release Please, npm, Astro, Cloudflare Workers Builds, Wrangler.

## Global Constraints

- CI installs from `astro/package-lock.json` with `npm ci`.
- CI must run `npm run typecheck` and `npm run build`.
- Production is `main` and `bumi.basim.id`; pull requests must not alter the custom domain.
- Release tags are immutable SemVer tags in `vMAJOR.MINOR.PATCH` form.
- Never store a Cloudflare API token in GitHub for this hybrid design.

---

### Task 1: Add GitHub quality gate

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `README.md`

**Interfaces:**
- Produces: a required check named `Astro verification` for pull requests and `main`.

- [ ] **Step 1: Write the failing workflow validation command**

Run: `Test-Path .github/workflows/ci.yml`

Expected: `False`.

- [ ] **Step 2: Create the CI workflow**

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read
jobs:
  verify:
    name: Astro verification
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: astro
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: astro/package-lock.json
      - run: npm ci
      - run: npm run typecheck
      - run: npm run build
```

Add a README section stating that pull requests require the `Astro verification` check.

- [ ] **Step 3: Validate workflow content locally**

Run: `rg -n "Astro verification|npm ci|npm run typecheck|npm run build" .github/workflows/ci.yml`

Expected: four matching workflow requirements.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/ci.yml README.md
git commit -m "ci: verify Astro app in GitHub Actions"
```

### Task 2: Add semantic release automation

**Files:**
- Create: `.github/workflows/release-please.yml`
- Create: `release-please-config.json`
- Create: `.release-please-manifest.json`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Produces: Release Please release PRs for the `astro` package and GitHub Releases from merged release PRs.

- [ ] **Step 1: Write the failing configuration validation command**

Run: `Test-Path release-please-config.json; Test-Path .release-please-manifest.json`

Expected: two `False` values.

- [ ] **Step 2: Create Release Please configuration**

```json
// release-please-config.json
{
  "release-type": "node",
  "packages": { "astro": {} },
  "include-component-in-tag": false,
  "include-v-in-tag": true
}
```

```json
// .release-please-manifest.json
{ "astro": "0.1.0" }
```

```yaml
# .github/workflows/release-please.yml
name: Release Please
on:
  push:
    branches: [main]
permissions:
  contents: write
  pull-requests: write
jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: google-github-actions/release-please-action@v4
        with:
          config-file: release-please-config.json
          manifest-file: .release-please-manifest.json
```

Initialize `CHANGELOG.md` with `# Changelog` and a link to Conventional Commits.

- [ ] **Step 3: Validate release configuration**

Run: `Get-Content release-please-config.json | ConvertFrom-Json | Select-Object -ExpandProperty packages`

Expected: an `astro` package entry.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/release-please.yml release-please-config.json .release-please-manifest.json CHANGELOG.md
git commit -m "ci: add semantic release workflow"
```

### Task 3: Connect and verify Cloudflare Workers Builds

**Files:**
- Create: `docs/DELIVERY.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: successful GitHub CI and the existing Worker `bumi-astro-preview`.
- Produces: documented production/preview settings and rollback runbook.

- [ ] **Step 1: Add the exact operational runbook**

Document these Cloudflare dashboard settings in `docs/DELIVERY.md`:

```text
Workers & Pages -> bumi-astro-preview -> Settings -> Builds -> Connect GitHub
Repository: muhamadbasim/bumi-website
Root directory: astro
Production branch: main
Build command: npm ci && npm run build
Deploy command: npx wrangler deploy
```

Document that branch builds create previews, `main` alone owns `bumi.basim.id`, and urgent rollback is `npx wrangler rollback` followed by a Git revert.

- [ ] **Step 2: Verify local production build before connecting Cloudflare**

Run: `cd astro; npm ci; npm run verify`

Expected: typecheck and build finish successfully.

- [ ] **Step 3: Perform dashboard-only connection and verify preview**

Connect the existing Worker using the runbook. Open a pull request with a documentation-only change and confirm:

1. The `Astro verification` GitHub check passes.
2. Cloudflare posts a preview build/version.
3. `https://bumi.basim.id` remains on the `main` production version.

- [ ] **Step 4: Enable merge protection and document results**

In GitHub repository settings, require `Astro verification` before merges to `main`. Record the preview URL/build ID and production verification date in `docs/DELIVERY.md`.

- [ ] **Step 5: Commit**

```bash
git add docs/DELIVERY.md README.md
git commit -m "docs: add Cloudflare delivery runbook"
```

