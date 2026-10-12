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

## ADR-009 — Ten URLs, home as the cinematic landing

- Date: 2026-10-11
- Context: The site can launch as one scrolling landing, or as the ten-page map in the brief. There is no Claude Design export yet.
- Decision: Keep the ten routes in English and Spanish as thin shells now. The home is the landing: full-screen hero, split menu, fox film. Service, pricing, quote and legal pages stay separate URLs.
- Consequences: Design work starts on the home. The other pages already resolve, with hreflang, and can be filled later without changing the map.

## ADR-010 — Hero fox is a close mascot, not a distant wildlife shot

- Date: 2026-10-11
- Context: The brief describes a photoreal fox camouflaged in a vast snowfield. A test still of that landscape is so wide that a white fox would disappear. The delivered marks (`public/media/logo-01.png`, `logo-02.png`) are a large, simple head peeking over a line.
- Decision: The hero film is a close, stylized 3D fox. It rises over one snow drift, leans toward the camera, and ducks back down. The wordmark stays in HTML, not inside the video.
- Consequences: The fox reads on a phone. The shot no longer matches the brief's wildlife prompt. The new prompts live in `docs/04-motion.md`.

## ADR-011 — Home entry uses the right-side fox cut, slowed

- Date: 2026-10-11
- Context: Two Gemini clips landed in `public/media/`. Both are 640×360, 30 frames, about 3 seconds. One parks the fox in the center with its eyes closed. The other parks it on the right, eyes open, and leaves the left sky empty. A 3-second loop is too fast for the hero, and a GIF cannot be slowed.
- Decision: The home entry plays the right-side clip (`Gemini_Generated_Gif_pyi3hupyi3hupyi3.gif`) as WebP frames, about 240ms each, with holds on the empty drift and on the look. The return to the drift is a fade, because the clip never sinks. A polar-night loader stays up until every frame has downloaded, or 8 seconds, whichever comes first. The centered clip stays in `public/media/` and is not composited. Reduced motion shows the last frame, still.
- Consequences: The entry can be judged now. The plate is soft at desktop size until a 1080p export replaces the frames. The centered blink clip is unused on purpose.

## ADR-012 — Scroll dive uses the still plate, not a new path

- Date: 2026-10-11
- Context: The home read as a static poster. The ask is a scroll that feels like walking into the snow. The only plate is a 640×360 loop of one drift. Zooming it hard makes the pixels worse, and there is no traveling shot down a path.
- Decision: Pin the hero and scrub a short dolly (scale 1.16 toward the horizon), a polar-night veil, and canvas flakes that grow toward the camera. Lenis runs only for this scene and turns off with reduced motion. The fox loop stays in the plate. A real path needs a new forward-moving clip.
- Consequences: The scroll is feelable now. It is not a mountain trail. Replacing the plate with a traveling MP4 is the next asset, not another zoom.
- Update: Each journey still pushes in on its own (scale about 1.05 to 1.6, origin toward the horizon) and crossfades into the next. The hero leaves upward. The three service cards then slide in from the right, staggered, and remain together. The last card keeps the ice border. Snow stays the small depth field. The stills remain the stand-in for a later frame scrub.

