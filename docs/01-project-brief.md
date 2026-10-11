# Project brief

**DRAFT – confirm with Nabil.** Condensed from `docs/source/`. Where this file and the PDF disagree, this file and `CLAUDE.md` win.

## Brand

| Decision | Value |
|---|---|
| Brand | Arktic Fox (`arkticfox.ai`, Instagram `@arkticfox.ai`) |
| Logo | Half a fox face peeking over a line + wordmark ARKTIC FOX. White on the coral → pink gradient. Mark-only centered in the nav; full lockup in the footer and the mobile hero. SVG versions needed: white, gradient, black. |
| Languages | English primary at `/`. Spanish under `/es/` with translated slugs. EN/ES switcher in the nav. No automatic language redirect. |
| Tone | Premium, cinematic, editorial. |
| Style | Dark cinematic sections (hero, portfolio) alternating with light snowy sections (packages, process, FAQ). |
| Primary CTA | `Get a quote` → `/quote`. Spanish: `Pide presupuesto` → `/es/presupuesto`. |
| Services | Product images, Ad videos, Hyperreal UGC videos. Each has its own page. |
| Packages | Pilot, Growth, Scale. Price is "from". None is highlighted. À-la-carte row underneath. |
| Sectors | E-commerce, fashion, beauty, food & beverage, automotive. No sector is featured above the others. No client logos. |
| Presence | Faceless studio. No testimonials, no client logos, no founder photos, no invented statistics. |
| Hosting | Netlify, static output. |

Concept: an arctic fox camouflaged in the snow. The creatives blend into the feed; the results stand out.

## Packages (draft prices)

| Package | Type | Includes | Price |
|---|---|---|---|
| Pilot | One-off | 3 AI UGC videos (15–30 s), each with 2 alternative hooks · 5 ad images · script included · 2 revision rounds | from €490 |
| Growth | Monthly | 8 AI UGC videos with hook variations · 2 product ad videos · 15 static images in Meta/TikTok formats | from €1,290/mo |
| Scale | Monthly | 15–20 UGC videos · 4 ad videos · 30 statics · monthly review of what performed and iteration on the winners | from €2,600/mo |

Card lines: Pilot "Test the waters." Growth "Feed the algorithm." Scale "Double down on winners."

Note under the cards: "Prices exclude VAT. Final price depends on volume, formats and complexity." Spanish: "Precios sin IVA. El precio final depende del volumen, los formatos y la complejidad."

English number format: `€1,290/mo`. Spanish: `1.290 €/mes`. Currency is EUR in both languages.

À-la-carte cards (Product images, Ad videos, UGC videos) use "Custom quote" until "from" prices exist.

## Contact stack

| Tool | Role |
|---|---|
| Netlify Forms | Primary quote form. Static HTML, `name="quote"`, `data-netlify="true"`, honeypot, submit redirects to `/thanks` or `/es/gracias`. Privacy consent is required. |
| WhatsApp Business | Floating "Chat with us" button. Prefilled message: "Hi Arktic Fox, I'd like a quote for…" |
| Calendly | 20-minute call, only on the thanks page. |
| Email | `hello@arkticfox.ai` |

## Open questions

- Legal entity (name, tax id, address, registry data) for the legal notice.
- Whether published prices include VAT. The draft note says they exclude it.
- Minimum term and cancellation for Growth and Scale.
- À-la-carte "from" prices.
- Final hero headline (option 1 is the current preference).
- Final headline font (option A, Instrument Serif, is the current preference).
- Whether the 24-hour reply line on the thanks page is a real SLA.
