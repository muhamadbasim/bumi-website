# Bumi Theme System

> Implementation specification for the light/dark website theme.

## 1. Objective

Provide a consistent light and dark visual mode across the Bumi Astro website. The default mode is light, while dark mode is an explicit user preference.

## 2. Scope

Included:

- Global color tokens.
- Theme initialization before first paint.
- Header and mobile-menu theme toggle.
- Persistence across reloads and routes.
- Hero video overlay adaptation.
- Accessibility and reduced-motion behavior.

Excluded for the first iteration:

- Per-section theme overrides.
- Multiple accent palettes.
- Server-side user profile preferences.
- CMS-managed theme configuration.

## 3. State model

~~~ts
type Theme = 'light' | 'dark'
const STORAGE_KEY = 'bumi-theme'
const DEFAULT_THEME: Theme = 'light'
~~~

State is represented by:

~~~html
<html data-theme="light">
~~~

Invalid storage values must fall back to light.

## 4. User flow

~~~text
First visit
  -> read localStorage
  -> valid dark? use dark
  -> otherwise use light
  -> render page

User clicks toggle
  -> update data-theme
  -> update aria-pressed and label
  -> persist preference
  -> keep current route and scroll position
~~~

## 5. Token groups

Every theme must define these groups:

~~~text
background: --bg, --surface, --surface-muted
content:    --paper, --muted, --inverse
decoration: --lime, --violet, --blue
structure:  --line, --focus
media:      --hero-overlay-start, --hero-overlay-end
~~~

Components must consume tokens rather than direct hex values for theme-dependent properties.

## 6. Component behavior

### Theme toggle

Required behavior:

- Button is reachable by Tab.
- Enter and Space activate it.
- aria-pressed="false" represents light mode.
- aria-pressed="true" represents dark mode.
- Label describes the next action, for example Switch to dark theme.
- Icon is decorative and has aria-hidden="true".

### Header and mobile menu

- Header background changes with the theme.
- Mobile menu uses the same theme tokens as the page.
- Opening/closing the mobile menu must not reset the theme.
- Theme toggle remains visible and does not block navigation.

### Hero video

- Video is decorative and uses aria-hidden="true".
- It must use autoplay muted loop playsinline.
- A canplay listener may call video.play() to recover from autoplay blocking.
- Light mode uses a lighter video overlay; dark mode uses a darker overlay.
- Reduced-motion users receive a static poster or paused visual fallback.

## 7. Implementation sequence

1. Refactor hard-coded colors into semantic tokens.
2. Add root theme initialization in BaseLayout.astro.
3. Add reusable ThemeToggle.astro.
4. Mount the toggle in desktop and mobile header layouts.
5. Tune hero video, buttons, borders, cards, and footer for light mode.
6. Add reduced-motion handling.
7. Test persistence, keyboard behavior, and route navigation.

## 8. QA checklist

- [ ] First visit is light.
- [ ] Toggle changes theme without reload.
- [ ] Reload preserves theme.
- [ ] Invalid localStorage value falls back to light.
- [ ] Theme works on /, /company, /services, /projects, and /contact.
- [ ] Mobile menu and theme toggle work together.
- [ ] Keyboard and screen-reader labels are correct.
- [ ] Hero video remains readable in both modes.
- [ ] Reduced motion disables nonessential movement.
- [ ] Console has no errors or warnings.
