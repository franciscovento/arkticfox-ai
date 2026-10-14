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
| Reveal | `src/components/motion/Reveal.astro` | `stagger` (ms), `as`, `class` | styleguide | built |
| Marquee | `src/components/motion/Marquee.astro` | `label`, `reverse`, `pauseOnHover`, `clips`, `openTemplate`, `class` | styleguide, HomeEntry | built (`clips` turns words into reel buttons) |
| SnowCanvas | `src/components/motion/SnowCanvas.astro` | `class` | styleguide, WorkCase | built (behind plates; pointer drifts the fall, same source as the home) |
| Seo | `src/components/seo/Seo.astro` | `title`, `description`, `siteName`, `noindex` | BaseLayout | built |
| Hreflang | `src/components/seo/Hreflang.astro` | `pageKey` | BaseLayout | built |
| LanguageSwitcher | — | — | — | planned |
| Nav | — | — | — | planned |
| Footer | — | — | — | planned |
| MobileMenu | — | — | — | planned |
| WhatsAppButton | — | — | — | planned |
| PageShell | `src/components/pages/PageShell.astro` | `locale`, `pageKey`, `titleKey`, `descriptionKey`, `headingKey` | every public route except home, EN and ES | built (shell only, no page design) |
| HomeEntry | `src/components/home/HomeEntry.astro` | `locale` | `/` and `/es/` | built (V1: pinned stage, blue-hour field, glass cards, sector marquee, loader) |
| WorkReel | `src/components/home/WorkReel.astro` | `closeLabel`, `note`, `moreLabel`, `moreHref`, `poster` | HomeEntry | built (glass card, bottom-right; mobile stacks note then CTA so the pill stays on one line) |
| WorkCase | `src/components/home/WorkCase.astro` | `locale` | `/work` and `/es/trabajo` | built (frost field, glass process beats, large plates) |
| HomePop | `src/components/home/HomePop.astro` | `locale` | `/v2` and `/es/v2` | parked (image grid only, noindex, unlinked from V1) |
| SnowDive | `src/components/motion/SnowDive.astro` | none | HomeEntry | built (parallax drifts, staggered cards, head-on snow) |
| FrostField | `src/components/motion/FrostField.astro` | `fixed`, `class` | HomeEntry | built (procedural blue-hour sky) |
| GlassSheen | `src/components/motion/GlassSheen.astro` | none | HomeEntry | built (pointer sheen on `[data-sheen]`) |
