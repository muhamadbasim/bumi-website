# Capability Industry Cards Design

## Objective

Redesign the homepage capability section as a ten-card editorial showcase based on the supplied project-capabilities reference. Each card must use authentic industry photography while preserving Bumi's dark, premium, technology-led visual identity.

## Scope

The change applies to the existing capability section on the Nuxt homepage and the existing ten records in `app/data/capabilities.ts`. It does not add new capability categories, change destination pages, or redesign unrelated homepage sections.

## Content Model

Each capability record will retain its existing number, title, subtitle, description, icon identifier, accent color, destination, five feature labels, and three business benefits. It will gain:

- a local image path;
- concise descriptive alternative text;
- optional image-position metadata only when the default centered crop obscures the subject.

The ten cards remain data-driven from one shared template.

## Visual Design

### Section

The section keeps its dark Bumi background, blue and violet ambient gradients, introductory eyebrow, headline, and summary. The grid uses five equal columns on wide desktop displays, two columns on tablets, and one column on mobile.

### Card Composition

Each card is a vertically ordered editorial panel:

1. hexagonal icon and two-digit capability number;
2. title and accent-colored subtitle;
3. five compact feature rows with accent markers;
4. an industry photograph with a consistent aspect ratio;
5. an accent-tinted benefit panel with three business outcomes;
6. a clear link to the existing destination page.

Descriptions may be used as accessible supporting text or a short visible line where space allows, but cards must remain visually balanced and equal in height within each desktop row.

### Photography

Ten local raster images will represent manufacturing, education, clinic and beauty, hotel, restaurant, laundry, outsourcing, franchise, fintech, and AI workforce. Images should show credible environments and people or equipment relevant to each industry. Photography must avoid embedded text, logos, watermarks, or imagery that appears unrelated to the capability.

Each photograph receives a subtle dark-to-transparent overlay and accent tint so it integrates with the card palette. Cropping uses `object-fit: cover`; individual focal positions are allowed through data metadata.

### Interaction

Hover and keyboard focus slightly elevate the card, strengthen its accent border, and scale the photograph by a small amount. The call-to-action arrow shifts horizontally. Motion is subtle and disabled when the user prefers reduced motion. The entire card will not become a nested interactive surface; the explicit link remains the actionable element.

## Responsive Behavior

- Wide desktop: five cards per row, two rows.
- Tablet and small desktop: two cards per row.
- Mobile: one full-width card per row with reduced padding and type sizes.
- No horizontal scrolling is required to discover capabilities.
- Feature and benefit content remains present at every breakpoint.
- Image crops preserve their fixed visual ratio to prevent layout shift.

## Accessibility

- Every industry image has meaningful alternative text.
- Decorative icons remain hidden from assistive technology while their surrounding card text provides context.
- Links have visible keyboard focus states.
- Text and overlays maintain sufficient contrast against photography.
- Motion respects `prefers-reduced-motion`.
- Heading hierarchy remains consistent with the homepage section structure.

## Asset and Performance Strategy

Images are stored under `public/images/capabilities/` and referenced locally. They should use an efficient web format and practical dimensions for the rendered card size. The implementation should use Nuxt's image handling when compatible with the current project and lazy-load below-the-fold photos. Width and height or aspect-ratio constraints must be supplied to avoid cumulative layout shift.

## Implementation Boundaries

The existing inline capability template in `app/pages/index.vue` may be extracted to a focused component if doing so improves readability without changing behavior. Existing data fields and destination URLs are preserved. CSS changes remain scoped to the capability section and reuse current design tokens.

## Validation

Validation must confirm:

- all ten cards render exactly once with their correct photo, features, benefits, and link;
- the layout is five, two, and one columns at the intended breakpoints;
- images have alt text and load without broken paths;
- hover, focus, and reduced-motion behavior work as designed;
- no unrelated homepage section regresses;
- project preflight, type checking, and production build succeed.

## Acceptance Criteria

The capability section visibly reflects the supplied industry-card reference while looking native to Bumi. A visitor can scan and compare all ten offerings, recognize each industry from its photograph, understand its core functions and benefits, and open the relevant solution page on desktop or mobile without horizontal scrolling.
