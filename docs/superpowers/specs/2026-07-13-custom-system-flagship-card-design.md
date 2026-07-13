# Custom System Flagship Card Design

## Objective

Add a visually dominant, unnumbered flagship capability before the numbered production capability grid on `bumi.basim.id`. It must communicate that Bumi can design and build any custom application around a client's workflows, goals, and operating model.

## Placement and Hierarchy

The flagship card appears directly after the Capabilities section heading and before Manufacturing ERP. It spans the full service-grid width and has no sequence number. Existing capability cards remain numbered `01` through `10`.

## Content

- Eyebrow: `FLAGSHIP CAPABILITY`
- Headline: `Any idea. Any workflow. Your custom application.`
- Body: Bumi builds purpose-fit web applications, mobile applications, dashboards, portals, enterprise systems, workflow automation, AI solutions, and system integrations.
- Capability chips: `Web & Mobile Apps`, `Enterprise Systems`, `AI & Automation`, `Integrations`, and `Ongoing Support`.
- Primary CTA: `Build your custom system ↗`, linking to `/contact`.

## Visual Direction

Use an original 4:3 editorial photograph of an Indonesian or Southeast Asian software team collaborating around a digital product interface. The image must contain no readable generated text, third-party logos, or watermarks.

Desktop uses a two-column composition with copy on the left and the visual on the right. The card uses oversized typography, generous spacing, a strong border, blue glow, and subtle interface-grid accents. Mobile stacks the content above the image without horizontal overflow.

## Theme Behavior

Light theme uses a white-to-pale-blue surface, navy text, electric-blue accents, and a restrained blue shadow. Dark theme uses midnight-blue surfaces, white text, and electric-blue/violet glow. Text, chips, and CTA retain accessible contrast in both themes.

## Interaction and Accessibility

Hover and keyboard focus slightly elevate the card and shift the CTA arrow. The CTA has a visible focus ring. The image has meaningful alt text. Decorative visual layers are hidden from assistive technology. Motion is disabled under `prefers-reduced-motion: reduce`.

## Responsive Behavior

- Wide desktop and tablet: full-width card with two internal columns.
- Mobile at `800px` and below: one internal column, compact typography and spacing.
- Existing numbered grid remains five columns at `1280px+`, two columns at `801–1279px`, and one column at `800px` and below.

## Validation

- The flagship card renders once before Manufacturing ERP and has no number.
- Existing ten cards retain numbering `01–10`.
- Light and dark theme styles are explicitly present.
- The CTA links to `/contact` and exposes a descriptive accessible name.
- The local photograph loads with meaningful alt text.
- Desktop and mobile layouts have no horizontal overflow.
- Reduced-motion behavior, tests, typecheck, production build, and live deployment verification pass.
