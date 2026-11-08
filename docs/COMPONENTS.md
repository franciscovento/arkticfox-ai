# Components

Update this table in the same task that creates or changes a component.

| Name | Path | Props | Used in | Status |
|---|---|---|---|---|
| Button | `src/components/ui/button.tsx` | shadcn/Radix button variants | Dialog and Sheet | built (behavior only; brand buttons on the styleguide are still token classes) |
| Accordion | `src/components/ui/accordion.tsx` | Radix accordion | not used yet | built |
| Dialog | `src/components/ui/dialog.tsx` | Radix dialog | not used yet | built |
| Tabs | `src/components/ui/tabs.tsx` | Radix tabs | not used yet | built |
| NavigationMenu | `src/components/ui/navigation-menu.tsx` | Radix navigation menu | not used yet | built |
| Sheet | `src/components/ui/sheet.tsx` | Radix sheet | not used yet | built |
| GlassCard | — | — | — | planned |
| Eyebrow | — | `label` utility stands in for now | styleguide | planned |
| Heading | — | — | — | planned |
| FoxDivider | — | placeholder SVG is inline on the styleguide | styleguide | planned |
| Badge | — | — | — | planned |
| Reveal | `src/components/motion/Reveal.astro` | `stagger` (ms), `class` | styleguide | built |
| Marquee | `src/components/motion/Marquee.astro` | `label`, `reverse`, `pauseOnHover`, `clips` (src, title, note, alt, poster), `openTemplate`, `class` | styleguide | built (`clips` turns words into reel buttons; off the home since 2026-11-07) |
| SnowCanvas | `src/components/motion/SnowCanvas.astro` | `class` | styleguide | built (pointer drifts the fall, same source as the home) |
| Seo | `src/components/seo/Seo.astro` | `title`, `description`, `siteName`, `noindex` | BaseLayout | built |
| Hreflang | `src/components/seo/Hreflang.astro` | `pageKey` | BaseLayout | built |
| LanguageSwitcher | `src/components/SiteHeader.astro` | part of the header (`pageKey` keeps the switch on the current page) | HomeEntry | built (EN / ES on the right at every width) |
| Nav | `src/components/SiteHeader.astro` | `locale`, `pageKey`, `fixed` | HomeEntry | built (mark and EN / ES only; clear over the film; no menu, no service links) |
| Footer | — | — | — | planned |
| QuoteForm | `src/components/home/QuoteForm.astro` | `locale` | HomeEntry (outside the stage) | built (glass modal `#contact`, native `<dialog>`; drops in from above over a blurred scrim, closes with ×, Escape or a backdrop click; Lenis paused and the wheel blocked outside the panel while open, scrollbar kept so the page does not shift (touch uses an overflow lock); one glass layer like the service cards; pill fields (name and email side by side, optional brand) and a two-line brief box, all with floating labels that rise onto a notched top border (decorative fieldset + legend); needs as glass pills; consent; full-width send button; Netlify Forms `quote` with honeypot, sent with fetch and answered in place) |
| QuoteFab | `src/components/QuoteFab.astro` | `locale` | HomeEntry | built (floating glass pill, bottom right; on hover the brand gradient and its glow fade in and the arrow swaps and turns 45°; opens the quote modal like every `[data-quote-jump]`) |
| HomeEntry | `src/components/home/HomeEntry.astro` | `locale` | `/`, `/es/` | built (pinned stage over the film: headline, then the video slider, and the three service cards; no marquee; the quote form is a modal) |
| VideoCard | `src/components/home/VideoCard.astro` | `src`, `poster`, `title`, `description`, `tag?`, `soundOnLabel`, `soundOffLabel`, `pauseLabel`, `playLabel`, `managed`, `class` | VideoCarousel | built (`managed` lets a parent start and stop the film; portrait film in a thick glass bezel; progressive blur under a compact caption; play/pause and sound pill; lazy, plays in view, no autoplay on reduced motion) |
| VideoCarousel | `src/components/home/VideoCarousel.astro` | `items` (src, poster, title, description, tag), `label`, `prevLabel`, `nextLabel`, sound and play labels, `loop` (default on), `class` | HomeEntry (second beat of the pinned stage) | built (scroll-snap row; endless loop of three shuffled copies that re-centres quietly; inside a `stagger` beat the visible cards arrive one by one with scroll, then the arrows (`setReveal`); only the centre and one card per side show; posters load near the centre only; centred card full size and the only one playing, side cards shrink and dim via `src/motion/carousel.ts`; floating glass prev/next buttons beside the centred card, swipe, mouse drag with a short throw, arrow keys, click a side card; moves glide with `ease-fox` over `dur.reveal`) |
| WorkReel | `src/components/home/WorkReel.astro` | `closeLabel`, optional `moreLabel` + `moreHref` | not mounted | built (glass card opened by a marquee word; the more link is omitted while there is no page to open) |
| SnowDive | `src/components/motion/SnowDive.astro` | none | HomeEntry | built (`data-enter="stagger"` pieces stay put and emit `journey:enter` (0 → 1 over `data-span`) so children run their own entrance; scroll-scrubbed frames for the pinned stage, loader waits for the first 10 and the rest stream in coarse to fine, nearest loaded frame is painted meanwhile; snow direction is `data-snow-direction`: `fall` or `dive`) |
| FrostField | `src/components/motion/FrostField.astro` | `fixed`, `class` | not mounted | built (procedural blue-hour sky) |
| GlassSheen | `src/components/motion/GlassSheen.astro` | none | HomeEntry | built (pointer sheen on `[data-sheen]`) |
