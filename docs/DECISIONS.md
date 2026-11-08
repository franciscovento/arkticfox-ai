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
- Update (2026-10-14, look test): `/` plays `public/media/hero-loop.mp4` on a loop. It is the same film as `/v2`, encoded from the scroll stills (1080p, about 25s, no audio) so the two cuts can be compared. `/v2` steps `public/media/scrub/` with scroll and stays `noindex`. The 8K masters are not deployed. The earlier snowfield film is kept as `public/media/hero-snowfield.mp4` (1080p, 36s) and is not wired to a page.

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
- Update (2026-10-14): The parked image grid is gone. `/v2` and `/es/v2` are the home again, `noindex`, with the second film as scroll-scrubbed 1080p stills in `public/media/scrub/`. `/` keeps the looping `hero-loop.mp4`.
- Update (2026-11-05, weight): The 380 stills are 1080p lossy WebP at about 147 KB each, 54 MB in total. Re-encoding at a visually equal quality (q90) saves only about 6%, and q85 saves about 28% but shows in the fine snow, so the files stay as they are. The cost was the loader, which waited for all 380. Now the loader waits for the first 10 frames (about 1.5 MB) and the rest streams behind the page, four requests at a time, coarse to fine (every 8th frame, then 4th, 2nd, all). A scroll position whose frame has not arrived paints the nearest frame that has, so the canvas is never blank. Measured at 10 Mbps: the page opens in about 4 s with 2 MB loaded, instead of waiting for 54 MB.
- Update (2026-11-05, v2 is the home): V1 is removed. `/` and `/es/` now render the scroll-scrubbed frame film, indexable, with the normal home title and description. `/v2`, `/es/v2`, the `homeV2` route, the `variant` prop on `HomeEntry`, the looping `<video>` code in `SnowDive`, and `public/media/hero-loop.mp4` / `.jpg` (25 MB) are deleted; they stay in git history. `hero-snowfield.mp4` is still unwired. The header drops the three service links (Product images, Ad videos, Hyperreal UGC) from the desktop bar and the mobile menu, leaving Projects, language and the quote. The service pages still exist and are reached from the home service cards.

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
- Update (2026-10-19): The home strip is Motion, Stills, Automotive and UGC. Each word opens that project's real title, body and a frame from `public/media/projects/`. Cadillac and Jeep keep the avatar note. `See more` goes to `/projects` · `/es/proyectos`. `/work` stays the winter stand-in.

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

## ADR-022 — Projects is a public gallery; the winter case stays a mock

- Date: 2026-10-18
- Context: Real pieces arrived (Cadillac films and stills, Kia stills, a Nissan offer still, a Jeep UGC film, a beauty selfie). `/work` is still the noindex winter-drop stand-in. Some stills have English type baked into the picture. The built header is three service links; the planned dropdown and footer are not built.
- Decision: Ship an indexed gallery at `/projects` and `/es/proyectos`. Copy is PROPOSED in `docs/pages/projects.md`. Media sits in `public/media/projects/` and is rendered as `<img>` or `<video>`, never as a CSS background. Videos are muted, `playsinline`, with a poster and `preload="none"`. They play when most of the frame is in view, and stay paused when reduced motion is requested. Brands are named only as they appear in the frame. The UGC case keeps the AI-avatar note. The built header gains a Projects link beside the language switch, from the `sm` breakpoint up, so the left service row and the centered mark stay clear. `/work` is unchanged. Each frame's CSS width stays at or under half its native pixel width, so a 2x screen does not upscale it. From `lg`, each brand is a case row: the glass card sticks on the left, and the frames sit in labelled rows on the right (motion, stills, a Nissan note beside its one still, the Jeep film beside the selfie). Below that, those rows scroll sideways with snap.
- Consequences: The sitemap gains one EN/ES pair. Hreflang comes from the route map, the same way as the other pages. There is still no footer to repeat the link.

## ADR-023 — Mobile nav is one glass dialog

- Date: 2026-10-19
- Context: Below `lg` the header wrapped. Projects sat on its own row under 640px, and from there to 1024px it shared the bar with EN/ES and “Pide presupuesto”, which collided with the wordmark. The same markup was copied in the home, projects, and work headers.
- Decision: One `SiteHeader`. From `lg` the bar stays as it was: services on the left, mark centered, Projects, language, and the quote on the right. Home keeps the outline quote; projects and work keep the gradient quote. Below `lg` a menu button opens a native `<dialog>` (`showModal`) on a scrim with a `glass-deep` sheet. The sheet lists the three services and Projects in serif, then the language switch and one gradient quote. Escape, the close control, and a desktop resize dismiss it. Focus stays in the dialog, scroll locks, and Lenis pauses while it is open. Open and close animate opacity and transform with `--dur-reveal` and `--ease-fox`. Reduced motion skips the wait and the transition.
- Consequences: The quote leaves the closed bar below `lg` and lives in the sheet, so a phone never shows two gradients. The services dropdown, Process, and the footer are still unbuilt.


## ADR-024 — One landing page

- Date: 2026-11-06
- Context: The site had a home, three service pages, pricing, projects, a sample case, quote, thanks and three legal pages per language. The client wants a single landing with four parts and a floating quote button.
- Decision: Delete every page except the home (`/`, `/es/`). `/styleguide` stays as an internal, noindex page. Delete `PageShell`, `ProjectsGallery`, `WorkCase` and the mobile menu. The routes map holds only `home`. The pinned scroll stays as it was: the film, the headline leaving, the three cards sliding in from the right, then the marquee. The pricing button is gone. The header keeps the mark and EN / ES.
- Update (2026-11-07): Pulling the cards out of the pinned stage broke the scroll. They are back inside it, with the same slide-in. The marquee is back too. The contact form and the floating quote button are gone. The hero quote pill and the card labels stay on screen and do not navigate, because the quote page, the service pages and the form are all gone.
- Gradient budget: the hero quote pill is the one gradient on the home.
- Consequences: The sitemap lists the two homes. `docs/pages/*` specs for removed pages stay as reference only. Media that only the removed pages used (`public/media/mocks`, `journey`, `hero`, unused project stills, the snowfield film, GIFs) is still in `public/` and ships; it can be deleted.

## ADR-025 — VideoCard preview after the stage

- Date: 2026-11-07
- Context: The client shared a reference card (portrait photo in a thick glass bezel, blurred caption, white pill button) and asked for a video version at the end of the home to see how it looks.
- Decision: `VideoCard` ports that look with tokens: `glass` bezel with `--radius-frame` / `--radius-frame-inner`, four stacked `backdrop-filter` layers for a progressive blur, and `--background-image-video-card-fade` under the caption. The caption is kept small and low (blur from 64% down) so it covers little of the film. Controls: a glass play/pause button and a white sound pill. The title uses Montserrat like the reference, not the serif headline face. The preview uses the Jeep UGC film with an "AI avatar" tag for transparency. The file loads only near the viewport and pauses off-screen; reduced motion never autoplays.
- Consequences: Something follows the pinned stage again. If the card stays, decide its section and copy; otherwise delete the section in `HomeEntry`.
- Update (2026-11-07): The single card became `VideoCarousel`: four films (Lyriq spot, driver seat UGC, Jeep UGC, deals spot) on a native scroll-snap track. The centred card is full size; side cards scale to 0.8 and fade to 55% with their distance, and are pulled inward so the gaps stay even. Only the centred film loads and plays; leaving the centre pauses and mutes it. Mouse drag, swipe, arrow keys and a click on a side card move it. No arrow buttons and no expand button, as in the reference.
- Update (2026-11-07): The browser's smooth scroll felt abrupt. Buttons, keys, clicks and the end of a mouse drag now glide with `ease-fox` over `dur.reveal` (900ms), with snap off during the glide. A drag can throw one step at most. Two floating glass buttons (previous / next) sit beside the centred card, on the screen edges on phones, and are disabled at the ends. Touch keeps native scroll and snap.
- Update (2026-11-07): The progressive blur starts 8rem (128px) below the ink fade, capped at 86% of the card height, because it covered the subtitles burned into the films. The fade stays at 64% so the caption still reads.

## ADR-026 — Video slider inside the pinned stage, marquee removed

- Date: 2026-11-07
- Context: The client wants hero → video slider → service cards, all over the film rather than on a black section, and the marquee of sector words and reels removed. Visitors should be able to stay on the videos without the scroll throwing them to the next part.
- Decision: The slider becomes a `data-journey-piece` with `data-enter="side"` (enters from 40vw to the right) between the headline (0–0.22) and the cards (0.66, 0.72, 0.78, and they stay). It holds from 0.2 to 0.62 of the 440vh/680vh stage, which is the "stick": a long stretch of scroll during which the slider stays put while the film keeps scrubbing behind it. The marquee beat and `WorkReel` are unmounted; the components stay in the repo. While its beat is hidden, the slider tells every card it is inactive, so no film loads during the hero. The slide width is also capped by the viewport height so a card always fits under the header.
- Consequences: The stage height is unchanged. If the hold feels too long or short, move `data-from` / `data-to` on the slider piece and the cards' `from`. Marquee and reel CSS remain in `motion.css` and can be deleted along with `WorkReel` if they are not coming back.

## ADR-027 — Quote form as the last beat, floating quote pill back

- Date: 2026-11-07
- Context: The client wants a creative glass contact form at the end of the page, asking only what a quote needs, on the same film background, plus a floating "Get a quote" button that takes you there.
- Decision: `QuoteForm` is the last `data-journey-beat` (0.84–1) inside the pinned stage, with `id="contact"`. It reuses the VideoCard bezel, pill fields and glass pills for the needs. Fields: name, email, optional brand, needs (at least one), one-line brief, consent. The website field is dropped. Netlify Forms `quote` with a honeypot, sent with fetch and answered in place (there is no thanks page). `QuoteFab` returns as a glass pill, not a gradient, and hides while the form is visible. The hero pill becomes a link too. Both use `[data-quote-jump]`, which glides through Lenis (`scrollPageTo`, `dur.slow * 2`, `ease-fox`) to the end of the stage. On short screens the form scrolls inside its beat (`data-lenis-prevent`). The stage grows to 560vh / 860vh so the reels hold keeps its length. `ease-fox` as a JS function moved to `src/motion/easing.ts`.
- Consequences: The consent line has no privacy link while there is no legal page; add it when the legal notice exists. The gradient budget holds: the hero pill and the send button are never on screen together.
- Update (2026-11-07): The form wrapper had `overscroll-contain` and a permanent `data-lenis-prevent`. It covers almost the whole viewport, so the wheel and trackpad were trapped on the form and the page stopped scrolling. Now the wrapper only gets `data-lenis-prevent` while its content actually overflows, and it has no `overscroll-contain`. The inner panel's second `backdrop-filter` is gone too; nested blurs over the moving film were costly.

## ADR-028 — New vertical clips are web files, not masters

- Date: 2026-11-07
- Context: Seven new vertical films arrived as 4K or 1080p HEVC `.mov` files, 9–87 MB each. They are only meant to play inside a phone-sized card.
- Decision: Replace each master with an H.264 MP4 at 720×1280, CRF 26, AAC 128 kbps, `+faststart`. Names describe the picture: `subaru-forester-camping-ugc`, `buick-2026-ugc`, `kia-suv-lineup`, `subaru-outdoor-ugc`, `kia-dealership-pov-ugc`, `aurora-skin-cream-ugc`, `ugc-creator-camera-tap`. The masters are deleted. These files are not mounted on the page yet.
- Consequences: The seven files together are about 24 MB instead of about 347 MB. A larger card later would need a new encode from the masters, which are no longer in the repo.

## ADR-029 — Slider films match the phone-card encode

- Date: 2026-11-07
- Context: The four films already in the home slider were H.264, but still 1080p at about 2.5–4 Mbps: `cadillac-1` (5.9 MB), `cadillac-2` (3.8 MB), `cadillac-ugc` (12.9 MB) and `jeep-ugc` (14.4 MB). They only play inside a phone-sized card.
- Decision: Re-encode them the same way as ADR-028 (H.264 High, CRF 26, AAC 128 kbps, `+faststart`). The square Lyriq spot is 720×720; the three vertical films are 720×1280. Rename them to `cadillac-lyriq-square-spot`, `cadillac-year-end-deals`, `cadillac-driver-seat-ugc` and `jeep-creator-to-camera-ugc`. Posters keep the same stem. The 1080p files are deleted. The slider paths in `HomeEntry` point at the new files.
- Consequences: Those four films are about 11.6 MB instead of about 37 MB. A larger card later would need a new encode; the 1080p files are no longer in the repo.

## ADR-028 — The quote form is a modal

- Date: 2026-11-07
- Context: The form as the last beat of the stage felt flat, and getting there meant a long glide through the film. The client wants the quote to open anywhere, without scrolling, as a glass panel over a blurred page.
- Decision: `QuoteForm` is a native `<dialog id="contact">` opened with `showModal()` by any `[data-quote-jump]` (floating pill, hero pill) and by `/#contact` on load. It drops in from above (curtain) with opacity and transform over a scrim `::backdrop` with a backdrop blur. It closes with ×, Escape (animated) or a click on the backdrop. While open, Lenis is paused (`pauseSmoothScroll` / `resumeSmoothScroll`) and `html.quote-open` locks the page; the scroll position never changes. The panel scrolls inside itself on short screens. The stage goes back to three beats and 440vh / 680vh, with the earlier timings. `scrollPageTo` and the floating pill's hide-on-form logic are gone. This supersedes the stage-beat part of ADR-027; its field list and Netlify setup stay.
- Consequences: The send button is the only gradient on screen while the modal is open, since the backdrop covers the hero pill and the floating pill.

## ADR-029 — Endless shuffled reel slider, three cards at a time

- Date: 2026-11-07
- Context: The client added vertical films to `public/media/projects/` (and renamed the old ones) and wants the slider to always have films on both sides, endlessly, in a random order. With every card visible the row felt crowded.
- Decision: No carousel library. Embla (`loop: true`, about 7 KB gzipped) would have meant rebuilding the scale, glide and drag we already have. Instead `VideoCarousel` renders the ten 9:16 films three times. The client shuffles one order and applies it to every copy. `carousel.ts` gains `loop`: once the centre settles within half a copy of either end, it jumps (snap off for that frame) to the twin slide one copy inward. `VideoCarousel` hands the playing film's time and sound state to the twin, so the jump is invisible. `neighbours: 1` fades everything beyond one card per side, so three cards show. Managed cards get their poster from `data-poster` only within two slides of the centre. Six films had no poster; JPG posters were cut at 1 s with ffmpeg. The square Lyriq spot is left out. All films with a person on camera carry the AI avatar tag; the deals spot and the Kia lineup carry the ad video tag.
- Consequences: Without JavaScript the three copies show in source order. Adding a film means dropping MP4 + JPG into `public/media/projects/`, adding a row to `reelCards` in `HomeEntry`, and two copy keys per language.

## ADR-030 — Reels enter card by card with scroll

- Date: 2026-11-07
- Context: The client wants the slider's first three cards to arrive with scroll one by one, like the service cards, and the arrows to appear only once all three are in.
- Decision: A new piece mode in `SnowDive`, `data-enter="stagger"`. The piece itself does not move in; it only fades and lifts out at its `data-to`. Each update it dispatches `journey:enter` with an entrance value from 0 to 1 over `data-span` (0.12 of the stage). `VideoCarousel` forwards it to `carousel.setReveal()`. In `layout()` the left neighbour, the centre and the right neighbour each take half of the entrance, a quarter apart, fading in and sliding 96px from the right. The arrows fade in over the last 20%. The piece takes no pointer input until the entrance is complete. Everything is scroll-linked, so scrolling back reverses it. Reduced motion never runs `SnowDive`, so the reveal stays at 1.
- Consequences: The reels hold is still 0.32–0.62 of the stage after the entrance.
- Update (2026-11-07, ADR-028): The modal drops the VideoCard double bezel. It is one glass layer like the service cards (`--radius-card`, glass fill, 12px blur), with the cards' ice-blue hover border always on.
- Update (2026-11-07, ADR-028): No ice-blue border; the card keeps the glass border. The layout is unchanged (pill fields, name and email side by side, brand, needs, a two-line brief box, consent, full-width send). Labels now float: at rest they sit in the field like placeholders; on focus or once filled they rise and shrink (transform only) until their middle sits on the top border. The border is drawn by an `aria-hidden` fieldset whose legend repeats the label at the floated size and opens a real gap in the line, so the cut works over translucent glass. The brief's example placeholder is gone, since the label takes its place.
- Update (2026-11-07, ADR-028): `html.quote-open { overflow: hidden }` hid the scrollbar and shifted the page sideways on open. It now applies only to coarse pointers. On desktop the scrollbar stays and a non-passive wheel listener blocks scrolling outside the panel (on top of the Lenis pause, and it also covers reduced motion where Lenis is off). The panel gets more top padding (3.25rem, 3.75rem from `md`) so the close button clears the first fields.

