# Service page template

The three service pages share this skeleton in this exact order. Only blocks 1, 2, 4 and 8 change per service; the rest is identical copy, so it lives here under `shared.*` keys and is not repeated in the per-service files.

Read [`README.md`](./README.md) for the source markers.

| | |
|---|---|
| Pages | [`product-images.md`](./product-images.md) · [`ad-videos.md`](./ad-videos.md) · [`ugc-videos.md`](./ugc-videos.md) |
| Rhythm | Dark hero, then alternating light and dark, ending on the dark CTA. |
| Roadmap | Step 5. |

## Block order

| # | Block | Varies per service? |
|---|---|---|
| 1 | Dark hero: media, headline, subheadline, `Get a quote` | yes |
| 2 | What you get: 4–6 deliverables with icons | yes |
| 3 | Gallery filtered by sector | media only |
| 4 | Service-specific block | yes |
| 5 | Delivery formats | no |
| 6 | Four-step process | no |
| 7 | Packages including this service | no |
| 8 | 4–5 service FAQs | yes |
| 9 | Final CTA | no |

## 3. Gallery

| Slot | Key | EN | ES |
|---|---|---|---|
| Eyebrow | `shared.gallery.eyebrow` | `SELECTED WORK` **PDF** | `TRABAJOS SELECCIONADOS` **PROPOSED** |
| Filter: all | `shared.gallery.filterAll` | `All sectors` **PROPOSED** | `Todos los sectores` **PROPOSED** |

Sector chips: E-commerce · Fashion · Beauty · Food & beverage · Automotive. Spanish: E-commerce · Moda · Belleza · Alimentación · Automoción. **PROPOSED**

**OPEN** — real samples per sector. Same constraint as the home gallery: only automotive work exists. Placeholders must not be presented as client work.

## 5. Delivery formats

Frame outlines, one per aspect ratio, each labelled with where it goes.

| Slot | Key | EN | ES |
|---|---|---|---|
| Headline | `shared.formats.headline` | `Every format, ready to publish.` **PROPOSED** | `Todos los formatos, listos para publicar.` **PROPOSED** |
| Body | `shared.formats.body` | `Built for Meta, TikTok, YouTube and your store.` **PDF** | `Pensados para Meta, TikTok, YouTube y tu tienda.` **PDF** |

| Ratio | EN label | ES label |
|---|---|---|
| 9:16 | `Reels, TikTok, Stories` **PROPOSED** | `Reels, TikTok, Stories` **PROPOSED** |
| 4:5 | `Feed` **PROPOSED** | `Feed` **PROPOSED** |
| 1:1 | `Feed, catalog` **PROPOSED** | `Feed, catálogo` **PROPOSED** |
| 16:9 | `YouTube, web` **PROPOSED** | `YouTube, web` **PROPOSED** |

The four ratios and the four platforms are **PDF**; pairing each ratio to its placement is **PROPOSED**.

## 6. Process

Identical to home block 8. Reuse `shared.process.*` — do not re-translate. See [`home.md`](./home.md#8-process--light).

| Slot | Key | EN | ES |
|---|---|---|---|
| Headline | `shared.process.headline` | `How it works.` **PROPOSED** | `Cómo funciona.` **PROPOSED** |

Steps: `01 Brief` · `02 Concept & script` · `03 Creation` · `04 Review & delivery`.

## 7. Packages

Only the packages that include this service, each linking to `/pricing`. All three packages include all three services, so all three cards appear on all three pages, with the relevant line emphasised.

| Slot | Key | EN | ES |
|---|---|---|---|
| Headline | `shared.packages.headline` | `Packages that include this.` **PROPOSED** | `Paquetes que lo incluyen.` **PROPOSED** |
| Link | `shared.packages.link` | `See full pricing` → `/pricing` **PROPOSED** | `Ver precios completos` → `/es/precios` **PROPOSED** |
| VAT note | `shared.pricing.vatShort` | `Prices exclude VAT.` **PDF** | `Precios sin IVA.` **PDF** |

Card content comes from [`pricing.md`](./pricing.md). Do not restate prices anywhere else.

## 9. Final CTA

Identical to home block 11. Reuse `shared.cta.*`.

| Slot | Key | EN | ES |
|---|---|---|---|
| Headline | `shared.cta.headlineLead` + `headlineEmphasis` | `Ready to *stand out*?` **PDF** | `¿Listo para *destacar*?` **PROPOSED** |
| Button | `shared.cta.quote` | `Get a quote` **PDF** | `Pide presupuesto` **PDF** |

## Shared FAQ answers

Service FAQs in blocks 8 repeat three topics across pages. Write each answer once, under `shared.faq.*`, and let the pages reference them: commercial use and rights, what we need from you, turnaround.

**OPEN** — all answers. Turnaround and revision counts are commercial commitments and need Nabil's sign-off.
