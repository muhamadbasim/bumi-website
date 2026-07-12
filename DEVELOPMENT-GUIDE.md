# Bumi Astro Development Guide

## 1. Before editing

1. Read PRD.md for product requirements.
2. Read blueprint.md for architecture and contracts.
3. Read TECHSTACK.md for runtime constraints.
4. Read the relevant feature document, such as THEME-SYSTEM.md.
5. Inspect the current diff and existing route behavior.

## 2. How to add a feature

### Step 1 — Define the contract

Write down the route, component, API, content shape, acceptance criteria, and failure states before coding.

### Step 2 — Build the smallest vertical slice

Implement one user-visible path end to end. Avoid broad rewrites and avoid modifying the Nuxt baseline unless explicitly requested.

### Step 3 — Keep Astro server-safe

- Use Astro components for static output.
- Add browser scripts only for actual interaction.
- Keep Cloudflare binding access inside server routes.
- Do not import Node-only APIs into Worker code.

### Step 4 — Verify behavior

Run:

~~~bash
npm run typecheck
npm run build
~~~

Then verify:

- Desktop and mobile layout.
- Keyboard navigation.
- Reduced motion.
- Console errors.
- Route links and empty states.
- Cloudflare preview behavior when bindings are involved.

## 3. Agent handoff format

An agent completing a task should report:

~~~text
Implemented:
Changed files:
Verification:
Known limitations:
Next recommended slice:
~~~

## 4. Definition of done

A feature is complete only when:

- Its contract is documented.
- Its UI and state behavior are implemented.
- Loading, error, and empty states are considered.
- It works at mobile and desktop breakpoints.
- It has accessible controls and labels.
- It respects reduced motion where relevant.
- Typecheck and build pass, or the exact environment blocker is documented.
- No secret, personal data, or unlicensed asset is committed.
