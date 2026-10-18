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
| Eyebrow | — | `label` utility stands in for now | styleguide, page sections | planned |
| Heading | — | — | — | planned |
| FoxDivider | `src/components/chrome/FoxDivider.astro` | `class` | footer | built (white mark on a polar-night chip, so it reads on light and dark) |
| Badge | — | — | — | planned |
| Reveal | `src/components/motion/Reveal.astro` | `stagger` (ms), `as`, `class` | styleguide | built |
| Marquee | `src/components/motion/Marquee.astro` | `label`, `reverse`, `pauseOnHover`, `clips`, `openTemplate`, `class` | styleguide, HomeEntry | built (`clips` turns words into reel buttons) |
| SnowCanvas | `src/components/motion/SnowCanvas.astro` | `class` | styleguide, WorkCase | built (behind plates; pointer drifts the fall, same source as the home) |
| Seo | `src/components/seo/Seo.astro` | `title`, `description`, `siteName`, `noindex`, `robots`, `image` | BaseLayout | built (default OG image is `/media/brand/og.jpg`) |
| Hreflang | `src/components/seo/Hreflang.astro` | `pageKey` | BaseLayout | built |
| LanguageSwitcher | `src/components/chrome/SiteHeader.astro` and `SiteFooter.astro` | part of the header and footer | every designed page | built (no separate component) |
| SiteHeader | `src/components/chrome/SiteHeader.astro` | `locale`, `pageKey`, `tone` (`overlay` or `solid`) | home and every designed page | built (services disclosure, language, outline quote button, full-screen menu) |
| SiteFooter | `src/components/chrome/SiteFooter.astro` | `locale`, `pageKey` | home and every designed page | built |
| WhatsAppButton | `src/components/chrome/WhatsAppButton.astro` | `locale` | BaseLayout, hidden when `shared.whatsapp.number` is empty, and on thanks | built |
| CookieBanner | `src/components/chrome/CookieBanner.astro` | `locale` | BaseLayout | built (Accept and Reject share one outline style; no analytics is loaded) |
| PageShell | `src/components/pages/PageShell.astro` | `locale`, `pageKey`, `titleKey`, `descriptionKey`, `headingKey` | unused by the designed routes | built (shell only; kept for the styleguide era) |
| ServicePage | `src/components/pages/ServicePage.astro` | `locale`, `service` | the three service routes, EN and ES | built |
| PricingPage | `src/components/pages/PricingPage.astro` | `locale` | `/pricing`, `/es/precios` | built |
| QuotePage | `src/components/pages/QuotePage.astro` | `locale` | `/quote`, `/es/presupuesto` | built |
| ThanksPage | `src/components/pages/ThanksPage.astro` | `locale` | `/thanks`, `/es/gracias` | built |
| LegalPage | `src/components/pages/LegalPage.astro` | `locale`, `page` | the six legal routes | built |
| NotFoundPage | `src/components/pages/NotFoundPage.astro` | none | `/404` | built (Spanish copy swaps from the path) |
| HomeRest | `src/components/home/HomeRest.astro` | `locale`, `pageKey` | home and `/v2` | built (sections 4–12 under the dive) |
| LazyVideo | `src/components/sections/LazyVideo.astro` | `src`, `poster`, `label`, `class` | services, pricing, gallery | built |
| CompareSlider | `src/components/sections/CompareSlider.astro` | `locale`, images, alts, headline keys | home, product images | built |
| Gallery | `src/components/sections/Gallery.astro` | `locale`, `items`, filters | home, service pages | built |
| PackageCards | `src/components/sections/PackageCards.astro` | `locale`, `headline`, `tone`, links | home, services, pricing | built |
| ProcessSteps | `src/components/sections/ProcessSteps.astro` | `locale` | home, services | built |
| FormatRow | `src/components/sections/FormatRow.astro` | `locale` | service pages | built |
| FaqList | `src/components/sections/FaqList.astro` | `locale`, `items`, `heading`, `tone` | home, services, pricing | built (native `details`, no React) |
| FinalCta | `src/components/sections/FinalCta.astro` | `locale` | home, services, pricing | built |
| HomeEntry | `src/components/home/HomeEntry.astro` | `locale`, `variant` (`loop` or `scrub`) | `/`, `/es/`, `/v2`, `/es/v2` | built (`loop` plays `hero-loop.mp4`; `scrub` steps `public/media/scrub/` with scroll; v2 is noindex) |
| WorkReel | `src/components/home/WorkReel.astro` | `closeLabel`, `note`, `moreLabel`, `moreHref`, `poster` | HomeEntry | built (glass card, bottom-right; mobile stacks note then CTA so the pill stays on one line) |
| WorkCase | `src/components/home/WorkCase.astro` | `locale` | `/work` and `/es/trabajo` | built (frost field, glass process beats, large plates) |
| SnowDive | `src/components/motion/SnowDive.astro` | none | HomeEntry | built (looping video on `/`; scroll-scrubbed frames on `/v2`; snow direction is `data-snow-direction`: `fall` or `dive`) |
| FrostField | `src/components/motion/FrostField.astro` | `fixed`, `class` | WorkCase | built (procedural blue-hour sky; off the home during the video look test) |
| GlassSheen | `src/components/motion/GlassSheen.astro` | none | HomeEntry | built (pointer sheen on `[data-sheen]`) |
