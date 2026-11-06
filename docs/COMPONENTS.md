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
| Reveal | `src/components/motion/Reveal.astro` | `stagger` (ms), `class` | styleguide, VideoGallery, ServiceCards, QuoteForm | built |
| Marquee | `src/components/motion/Marquee.astro` | `label`, `reverse`, `pauseOnHover`, `clips` (src, title, note, alt, poster), `openTemplate`, `class` | styleguide | built (not on the home any more; `clips` turns words into reel buttons, which needs a reel dialog that no longer exists) |
| SnowCanvas | `src/components/motion/SnowCanvas.astro` | `class` | styleguide | built (pointer drifts the fall, same source as the home) |
| Seo | `src/components/seo/Seo.astro` | `title`, `description`, `siteName`, `noindex` | BaseLayout | built |
| Hreflang | `src/components/seo/Hreflang.astro` | `pageKey` | BaseLayout | built |
| LanguageSwitcher | `src/components/SiteHeader.astro` | part of the header (`pageKey` keeps the switch on the current page) | HomeEntry | built (EN / ES on the right at every width) |
| Nav | `src/components/SiteHeader.astro` | `locale`, `pageKey`, `fixed` | HomeEntry | built (mark and EN / ES only; clear over the film, glass backing once the hero has scrolled away; no menu, no service links, no quote button because `QuoteFab` carries it) |
| Footer | — | — | — | planned |
| HomeEntry | `src/components/home/HomeEntry.astro` | `locale` | `/`, `/es/` | built (section 1, the hero: the film is the still sequence in `public/media/scrub/`, stepped with scroll; composes the three sections below, `QuoteFab` and `SnowDive`) |
| VideoGallery | `src/components/home/VideoGallery.astro` | `locale` | HomeEntry | built (section 2: four muted clips from `public/media/projects/` as stand-ins; play while in view, a clip the visitor pauses stays paused; reduced motion plays nothing on its own; keeps the AI-avatar note for UGC) |
| ServiceCards | `src/components/home/ServiceCards.astro` | `locale` | HomeEntry | built (section 3: three glass cards on a `FrostField`; each button goes to `#contact` and pre-ticks its need in the form) |
| QuoteForm | `src/components/home/QuoteForm.astro` | `locale` | HomeEntry | built (section 4, `id="contact"`: Netlify Forms `quote` with honeypot, sent with `fetch` and answered in place; light card on a dark section; the send button holds the section's one gradient) |
| QuoteFab | `src/components/QuoteFab.astro` | `locale` | HomeEntry | built (white pill fixed bottom right on every screen, links to `#contact`; white on purpose so it never counts as a second gradient) |
| SnowDive | `src/components/motion/SnowDive.astro` | none | HomeEntry | built (scroll-scrubbed frames on the hero (it only drives the pinned hero stage), loader waits for the first 10 and the rest stream in coarse to fine, nearest loaded frame is painted meanwhile; snow direction is `data-snow-direction`: `fall` or `dive`) |
| FrostField | `src/components/motion/FrostField.astro` | `fixed`, `class` | ServiceCards | built (procedural blue-hour sky) |
| GlassSheen | `src/components/motion/GlassSheen.astro` | none | HomeEntry | built (pointer sheen on `[data-sheen]`) |
