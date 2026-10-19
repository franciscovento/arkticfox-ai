# Sitemap and i18n

Eleven pages per language. English lives at the root. Spanish lives under `/es/` with translated slugs. Each page links to its twin. There is **no automatic language redirect**.

| Page | English | Spanish | Goal |
|---|---|---|---|
| Home | `/` | `/es/` | Impact, summary, quote |
| Home V2 (trial, noindex) | `/v2` | `/es/v2` | Image-led cut, not in the sitemap |
| Sample work (mock, noindex) | `/work` | `/es/trabajo` | One stand-in case from the home marquee |
| Projects | `/projects` | `/es/proyectos` | Real ad films, stills and UGC pieces |
| Product images | `/product-images` | `/es/imagenes-de-producto` | Sell product images |
| Ad videos | `/ad-videos` | `/es/videos-publicitarios` | Sell ad films |
| Hyperreal UGC | `/ugc-videos` | `/es/videos-ugc` | Sell AI UGC videos |
| Pricing | `/pricing` | `/es/precios` | Packages, à-la-carte, pricing FAQ |
| Get a quote | `/quote` | `/es/presupuesto` | Quote form |
| Thank you | `/thanks` | `/es/gracias` | Confirmation |
| Legal notice | `/legal-notice` | `/es/aviso-legal` | LSSI (Spain) |
| Privacy | `/privacy` | `/es/privacidad` | GDPR |
| Cookies | `/cookies` | `/es/cookies` | Cookie policy |

The typed map is `src/i18n/routes.ts`. `getAlternates()` emits `en`, `es`, and `x-default` (English) for `Hreflang.astro`.

## Navigation

Desktop, split:

- Left: Services dropdown (the three service pages), Work, Process.
- Center: fox mark.
- Right: Pricing, EN/ES, "Get a quote" gradient button.

The header that is built today lists the three services on the left from the `lg` breakpoint. Projects (`nav.projects`) sits with the language switch from the `sm` breakpoint up, and on a nav row below that, so the centered mark stays clear and the link remains reachable on a phone. The dropdown, Process and the footer are still the step 3 layout.

Mobile: mark on the left, quote button and a full-screen hamburger on the right.

## Home section order

Twelve blocks. Dark and light alternate. Each block pushes toward the quote.

1. Nav, transparent over the video, frosted glass on scroll.
2. Hero (dark). Full-bleed muted loop, left scrim, headline, two buttons, three glass service cards.
3. Work marquee. `Motion · Stills · Automotive · UGC`. No client logos.
4. Services (dark). Three panels.
5. Before / after (light). Drag slider, optional tabs.
6. Why Arktic Fox (light). Four benefits, no statistics.
7. Selected work (dark). Masonry, filter by service and sector, lightbox.
8. Process (light). Brief → Concept & script → Creation → Review & delivery.
9. Packages (light). Three equal cards, none highlighted.
10. FAQ (light). Accordion, 6–8 questions.
11. Final CTA (dark). Fox ears over the snow. "Ready to stand out?"
12. Footer. Full lockup, nav, Instagram, email, EN/ES, legal links.

## Service page template

Same order on all three services:

1. Dark hero with media, headline, subheadline, quote button.
2. What you get: 4–6 deliverables.
3. Gallery filtered by sector.
4. Service-specific block (before/after, featured player, or 9:16 carousel).
5. Delivery formats: 9:16, 4:5, 1:1, 16:9.
6. Four-step process.
7. Packages that include this service, linking to pricing.
8. Four or five service FAQs.
9. Final CTA.

The UGC page keeps a visible transparency note: creators are AI-generated avatars, and the studio helps label content where platforms or the law require it.

## Numbers

- English: `from €490`, `€1,290/mo`, `€2,600/mo`.
- Spanish: `desde 490 €`, `1.290 €/mes`, `2.600 €/mes`.

## Netlify Forms

The form must exist as static HTML at build time.

- `name="quote"`
- `data-netlify="true"`
- honeypot field
- `action` → `/thanks` or `/es/gracias`
- required privacy-policy consent
- optional newsletter checkbox

## Sitemap

`@astrojs/sitemap` is configured with `en` as the default locale and `es` as the alternate. `/styleguide` is `noindex` and excluded. Translated slugs (`/product-images` vs `/es/imagenes-de-producto`) will not pair automatically; the hreflang helper is the source for those pairs and should be wired into the sitemap when the pages exist.
