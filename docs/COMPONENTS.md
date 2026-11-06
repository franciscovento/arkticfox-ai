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
| Reveal | `src/components/motion/Reveal.astro` | `stagger` (ms), `as`, `class` | styleguide, ProjectsGallery | built |
| Marquee | `src/components/motion/Marquee.astro` | `label`, `reverse`, `pauseOnHover`, `clips` (src, title, note, alt, poster), `openTemplate`, `class` | styleguide, HomeEntry, ProjectsGallery | built (`clips` turns words into reel buttons) |
| SnowCanvas | `src/components/motion/SnowCanvas.astro` | `class` | styleguide, WorkCase, ProjectsGallery | built (behind plates; pointer drifts the fall, same source as the home) |
| Seo | `src/components/seo/Seo.astro` | `title`, `description`, `siteName`, `noindex` | BaseLayout | built |
| Hreflang | `src/components/seo/Hreflang.astro` | `pageKey` | BaseLayout | built |
| LanguageSwitcher | `src/components/SiteHeader.astro` | part of the header (`pageKey` keeps the switch on the current page) | HomeEntry, ProjectsGallery, WorkCase | built (bar from `lg`; inside the mobile menu below that) |
| Nav | `src/components/SiteHeader.astro` | `locale`, `pageKey`, `markKey`, `fixed`, `quote` (`outline` or `gradient`) | HomeEntry, ProjectsGallery, WorkCase | built (mark centered, Projects + language + quote right, from `lg`; no service links in the bar or the mobile menu) |
| Footer | — | — | — | planned |
| MobileMenu | `src/components/SiteHeader.astro` | same header; dialog below `lg` | HomeEntry, ProjectsGallery, WorkCase | built (full-screen glass dialog, one gradient quote, focus trap, Escape, scroll lock) |
| WhatsAppButton | — | — | — | planned |
| PageShell | `src/components/pages/PageShell.astro` | `locale`, `pageKey`, `titleKey`, `descriptionKey`, `headingKey` | public routes except home, `/work`, and `/projects` | built (shell only, no page design) |
| HomeEntry | `src/components/home/HomeEntry.astro` | `locale` | `/`, `/es/` | built (the film is the still sequence in `public/media/scrub/`, stepped with scroll; indexable) |
| WorkReel | `src/components/home/WorkReel.astro` | `closeLabel`, `moreLabel`, `moreHref` | HomeEntry | built (glass card, bottom-right; copy and media come from the marquee button; mobile stacks note then CTA so the pill stays on one line) |
| WorkCase | `src/components/home/WorkCase.astro` | `locale` | `/work` and `/es/trabajo` | built (frost field, glass process beats, large plates) |
| ProjectsGallery | `src/components/pages/ProjectsGallery.astro` | `locale` | `/projects` and `/es/proyectos` | built (frost field, sticky glass case cards, labelled frame rows, snap strips below `lg`, lazy muted videos with posters) |
| SnowDive | `src/components/motion/SnowDive.astro` | none | HomeEntry | built (scroll-scrubbed frames on the home, loader waits for the first 10 and the rest stream in coarse to fine, nearest loaded frame is painted meanwhile; snow direction is `data-snow-direction`: `fall` or `dive`) |
| FrostField | `src/components/motion/FrostField.astro` | `fixed`, `class` | WorkCase, ProjectsGallery | built (procedural blue-hour sky; off the home during the video look test) |
| GlassSheen | `src/components/motion/GlassSheen.astro` | none | HomeEntry, WorkCase, ProjectsGallery | built (pointer sheen on `[data-sheen]`) |
