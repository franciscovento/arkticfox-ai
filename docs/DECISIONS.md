# Decisions

## ADR-001 — Astro over Next.js or a Vite SPA

- Date: 2026-10-11
- Context: The site is a static, bilingual marketing site. The only goal is a quote request. Netlify Forms need a real HTML form at build time.
- Decision: Astro with static output. Interactive pieces are React islands.
- Consequences: No server runtime. SEO, hreflang and content collections stay simple. Next.js SSR and a client-side SPA were rejected.

## ADR-002 — Tailwind v4 tokens, default palette wiped

- Date: 2026-10-11
- Context: Off-system colors (default `bg-red-500`, arbitrary `bg-[#fff]`) would drift the brand.
- Decision: One token file, `src/styles/tokens.css`, with `--color-*: initial` and the Arktic Fox palette in `@theme`. `scripts/check-tokens.mjs` fails the build on violations.
- Consequences: shadcn semantic colors must point at these tokens. The CLI's default oklch palette is not kept.

## ADR-003 — Self-hosted fonts via Fontsource

- Date: 2026-10-11
- Context: The source brief asks for Google Fonts (Instrument Serif, Montserrat).
- Decision: Self-host with `@fontsource/instrument-serif` and `@fontsource-variable/montserrat`.
- Consequences: Better for EU/GDPR and for performance. This disagrees with the PDF. The docs win. Flagged to Nabil.

## ADR-004 — GSAP only in the motion layer

- Date: 2026-10-11
- Context: Scroll libraries are easy to import from random components and hard to pause.
- Decision: `gsap` and `lenis` may only be imported from `src/motion/`, `src/components/motion/` and `src/components/islands/`. `src/motion/gsap.ts` is the registration point. Scroll scenes return early when reduced motion is on.
- Consequences: The token guard enforces the import rule. Lenis is installed but not started until a page needs smooth scroll.

## ADR-005 — Netlify Forms

- Date: 2026-10-11
- Context: The studio needs qualified leads without an extra form vendor at launch.
- Decision: Netlify Forms, honeypot, required privacy consent. WhatsApp is a shortcut. Calendly is only on the thanks page.
- Consequences: The form must be present in the static HTML. The free plan has a monthly submission cap.

## ADR-006 — No automatic language redirect

- Date: 2026-10-11
- Context: Detecting the browser language and redirecting hides one version from Google and surprises the visitor.
- Decision: English at `/`, Spanish at `/es/`, a visible EN/ES switcher, hreflang `en`, `es`, `x-default=en`.
- Consequences: Both versions must be linked and indexable. No geo or `Accept-Language` redirect.

## ADR-007 — Astro 7 and pinned TypeScript 5.9

- Date: 2026-10-11
- Context: `npm view astro version` returned 7.3.8. `npm view typescript version` resolved to 7.0.2, which `@astrojs/check` (`^5 || ^6`) and `typescript-eslint` (`<6.1`) reject.
- Decision: Use Astro 7.3.8 (current stable). Pin TypeScript to 5.9.3, the latest 5.x accepted by both tools.
- Consequences: Config follows current Astro 7 docs (`@tailwindcss/vite`, `astro.config.mjs`). Revisit the TypeScript pin when the Astro checker accepts TypeScript 7.

## ADR-008 — shadcn Radix Nova, restyled

- Date: 2026-10-11
- Context: Current shadcn (4.21) asks for a base (`radix`) and a preset. Its init writes an oklch palette and the Geist font.
- Decision: `radix-nova` for behavior (accordion, dialog, tabs, navigation menu, sheet, and the button those components import). Semantic colors in `global.css` reference Arktic Fox tokens. Geist was removed.
- Consequences: Re-running `shadcn init` will try to put the default palette back. Do not accept that diff.
