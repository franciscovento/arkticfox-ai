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
- Decision: Pin the hero and scrub a short dolly (scale 1.16 toward the horizon), a polar-night veil, and canvas flakes that grow toward the camera. Lenis runs only for this scene on fine pointers; touch and reduced motion use native scroll. The fox loop stays in the plate. A real path needs a new forward-moving clip.
- Consequences: The scroll is feelable now. It is not a mountain trail. Replacing the plate with a traveling MP4 is the next asset, not another zoom.
- Update: Each journey still pushes in on its own (scale about 1.05 to 1.6, origin toward the horizon) and crossfades into the next. The hero leaves upward. The three service cards then slide in from the right, staggered, and remain together. The last card keeps the ice border. Snow stays the small depth field. The stills remain the stand-in for a later frame scrub.

## ADR-013 — Content lives in one spec per page, with provenance markers

- Date: 2026-10-13
- Context: Copy was spread across the source PDF, `docs/01-project-brief.md` and a flat `docs/05-content.md`. Iterating on a page's design meant re-reading all three and re-deciding what the page says. The PDF also mixes approved copy with the author's own proposals and with gaps, and nothing recorded which was which, so every design pass risked either inventing copy or discarding approved lines.
- Decision: One spec per page in `docs/pages/`, block by block, EN and ES side by side, with every line marked **PDF** (approved, literal), **PROPOSED** (written or translated by us, usable, pending review) or **OPEN** (needs a decision or data we don't have). The three service pages share `_service-template.md` and only carry what differs. Prices exist only in `pages/pricing.md`. Legal body text is never drafted. `docs/05-content.md` becomes a thin index plus the cross-page rules, so there is no second copy of any string.
- Consequences: Design iteration now changes presentation without renegotiating copy. Spanish beyond the few lines the PDF supplies is explicitly a proposal, not a decision. The specs are the staging area for `src/i18n/ui/*.ts`, and they must be updated in the same task whenever a design change alters what a block says, or they will drift. Blocked content is visible as **OPEN** rather than quietly invented, which is what rules 3 and 7 in `CLAUDE.md` demand.

## ADR-014 — Home field is blue hour, cards stay frosted glass

- Date: 2026-10-13
- Context: Polar night made the hero feel gloomy. A daylight rewrite made it a white slab: the CSS snow banks filled half the viewport, and the frosted cards lost the contrast they need to read as glass.
- Decision: Keep the original `glass` cards, white type and ice eyebrows. The field is a procedural blue hour — ice mixed into ink, not snow-white and not polar-night black. The ridges stay small, low and in shade. Snow still comes at the camera. The pointer turns the head, mostly left to right.
- Consequences: No raster landscape on the home. The four journey stills are unused. Daylight and night remain available for later sections; the entry is neither.

## ADR-015 — Why tiles borrow the unused palette, then hold at full opacity

- Date: 2026-10-13
- Context: The four Why cards at the end of the dive read as empty glass compared with the service cards. They also never reached opacity 1: fade-in needs 0.10 of pin progress and the last tile started at 0.975. Coral, pink and snow-gray were sitting unused while everything on the home was ice and white.
- Decision: Keep the frosted tiles. Give each one a single palette accent — ice, coral, pink, snow-gray — as a top hairline, line icon and corner bloom. The quote button under the grid is the only brand-gradient in that viewport. The marquee holds until 0.92; Why starts at 0.88 with a short fade so the fourth tile is still opaque before the pin ends.
- Consequences: Why is still four short, stat-free lines. Color is structural, not a new visual language. Later light-section Why (block 6 of the home spec) can reuse the same accents on snow-white.

## ADR-016 — Dive ends on the sector marquee

- Date: 2026-10-13
- Context: Why-as-slides (paging, snap, locked wheel) fought Lenis: you could not scroll back, a fast wheel skipped every card, and it sometimes stuck on the second beat.
- Decision: Remove Why from the pinned entry. The dive is hero → service cards → sector marquee, and it stays there. The four Why lines remain in i18n and `docs/pages/home.md` for a later block.
- Consequences: The home no longer traps the wheel. Scroll is free again. Why is still specified; it is just not on this pin.

## ADR-017 — Two home cuts while we look for the tone

- Date: 2026-10-13
- Context: The blue-hour dive (V1) is cinematic but not locked. Nabil asked for a second cut closer to [Steven Popovich](https://www.stevenpopovich.com/): large, colourful plates, almost no chrome.
- Decision: Keep V1 at `/` and `/es/`. Ship V2 at `/v2` and `/es/v2`, `noindex`, out of the sitemap. Colour comes from the photographs. UI stays on tokens. The plates in `public/media/mocks/` are Unsplash stand-ins, labelled as such, never as client work.
- Consequences: V2 is parked at `/v2` (see ADR-018). Replace the mock files in place; keep the filenames.

## ADR-018 — Marquee words open glass work, V2 stays a parked grid

- Date: 2026-10-13
- Context: Each sector word should preview work. A Popovich-like sticky menu on V2 read as a copy. Pausing the marquee on hover/focus made the strip feel broken.
- Decision: The marquee never pauses. `WorkReel` is a frosted-glass dialog (same `glass` + sheen as the service cards) that fades and scales in. It shows a still or a reel depending on the file. V2 stays the earlier image grid, `noindex`, and is unlinked from the V1 header.
- Consequences: Product / fashion / beauty / food open mock stills; ads and automotive open mock MP4s. Replace files in place. V2 remains at `/v2` if we want it later.

## ADR-019 — Work reel sits on the field; Read more opens one mock case

- Date: 2026-10-13
- Context: A dimmed backdrop hid the dive. The reel needed to feel like a card in the scene, and a word click should lead to a project presentation — the same stand-in for every sector until real cases exist.
- Decision: No backdrop scrim. The glass reel pins bottom-right and grows. `See the case` goes to `/work` · `/es/trabajo` (`WorkCase`): one winter-drop story, no client name, no statistics, `noindex`. Page copy reads as a project, not as a labelled mock.
- Consequences: Every marquee word opens the same case page. Swap the media and copy in place when a real job can be shown.

## ADR-020 — View transitions into a same-field work case

- Date: 2026-10-13
- Context: The sample case read as a different site: a text column and a grid. The jump from the reel was a hard cut.
- Decision: Full page loads between home and `/work`. `ClientRouter` and `transition:name="work-media"` were removed — the swap left Lenis, ScrollTrigger and `dialog.showModal()` overflow stuck on return. The case stays the same blue-hour field, large inset plates and glass cards as the dive, told as four process beats.
- Consequences: No morph from the reel into the first plate. Motion boots via `onPageReady` (full loads do not fire `astro:page-load`). Still no real client, logos or statistics.

## ADR-021 — Work case pins process titles; snow stays behind plates

- Date: 2026-10-13
- Context: Glass cards on light stills failed contrast. The page chrome stuck while the process titles did not. Snow on top of the photos would hide the work.
- Decision: The site header on `/work` scrolls away. Each beat title (The brief, Stills, The film, The cut) is `position: sticky` until the next beat pushes it off. Cards sit on `glass-deep` (ink, token) over a bottom scrim. `SnowCanvas` is a fixed layer under the plates, so flakes fall in the field around the frames, not on the images.
- Consequences: Contrast holds on pale stills. The sticky menu is the process, not the nav.

