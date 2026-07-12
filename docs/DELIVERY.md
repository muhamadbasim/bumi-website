# Bumi delivery runbook

## GitHub quality gate

The `Astro verification` workflow runs on pull requests and pushes to `main`. It installs `astro/package-lock.json`, then runs the brand test, typecheck, and production build. Enable GitHub branch protection on `main` and require this check before merge.

## Cloudflare Workers Builds

Connect the existing Worker through **Workers & Pages → bumi-astro-preview → Settings → Builds → Connect GitHub**.

| Setting | Value |
| --- | --- |
| Repository | `muhamadbasim/bumi-website` |
| Root directory | `astro` |
| Production branch | `main` |
| Build command | `npm ci && npm run build` |
| Deploy command | `npx wrangler deploy` |

Cloudflare builds preview versions for non-production branches. Only `main` deploys `bumi.basim.id`.

## Versioning and rollback

Use Conventional Commit messages. Release Please creates a release pull request and, after merge, creates `vMAJOR.MINOR.PATCH` tags and GitHub Releases.

For source-controlled rollback, revert the faulty commit and merge it to `main`. For urgent recovery, run `npx wrangler rollback` against the Worker, then create the matching Git revert so source and production converge.
