# Page content specs

One file per page. Each file is the single source of truth for **what that page says**, block by block, in English and Spanish. Design, layout and motion are deliberately out of scope: these files exist so we can iterate on the visual presentation without renegotiating the copy every time.

| Page | Spec | EN | ES |
|---|---|---|---|
| Home | [`home.md`](./home.md) | `/` | `/es/` |
| Sample work | [`work.md`](./work.md) | `/work` | `/es/trabajo` |
| Product images | [`product-images.md`](./product-images.md) | `/product-images` | `/es/imagenes-de-producto` |
| Ad videos | [`ad-videos.md`](./ad-videos.md) | `/ad-videos` | `/es/videos-publicitarios` |
| Hyperreal UGC | [`ugc-videos.md`](./ugc-videos.md) | `/ugc-videos` | `/es/videos-ugc` |
| Pricing | [`pricing.md`](./pricing.md) | `/pricing` | `/es/precios` |
| Get a quote | [`quote.md`](./quote.md) | `/quote` | `/es/presupuesto` |
| Thank you | [`thanks.md`](./thanks.md) | `/thanks` | `/es/gracias` |
| Legal (×3) | [`legal.md`](./legal.md) | `/legal-notice` · `/privacy` · `/cookies` | `/es/aviso-legal` · `/es/privacidad` · `/es/cookies` |

The three service pages share one template. `product-images.md`, `ad-videos.md` and `ugc-videos.md` only carry what differs; the shared skeleton lives in [`_service-template.md`](./_service-template.md).

## Source markers

Every line of copy carries its provenance, because not all of it is equally settled:

| Marker | Meaning | What to do with it |
|---|---|---|
| **PDF** | Literal from `docs/source/…pdf`. Approved by Nabil. | Use as is. Don't rewrite. |
| **PROPOSED** | Written or translated here from an approved English line. | Usable now, flag in the next review. |
| **OPEN** | Needs a decision or data we don't have. | Never ship invented values. Leave the placeholder. |

The PDF only supplies Spanish for the hero headlines, the hero subheadline, the three service headlines and the VAT note. Every other Spanish line is **PROPOSED**: natural Spain Spanish, "tú", not a literal translation.

## How to use these specs

1. Read the page spec before touching the page.
2. Copy goes into `src/i18n/ui/en.ts` and `es.ts` under the key suggested in the `Key` column. Never hardcode it in a component (`CLAUDE.md` rule 4).
3. Each block names the component it needs. Check `docs/COMPONENTS.md` before building anything new (rule 2).
4. If a design iteration changes what a block *says*, update the spec in the same task. These files must not drift from `src/i18n/`.
5. Anything marked **OPEN** stays a placeholder until Nabil answers. No fabricated proof, prices or statistics (rules 3 and 7).

## Key naming

`<page>.<block>.<slot>`, lowerCamelCase — `home.hero.eyebrow`, `pricing.packages.pilotTitle`, `quote.form.emailLabel`. Blocks reused across pages are prefixed `shared.` (`shared.cta.headline`, `shared.process.step1Title`).

Headlines that mix upright and italic text split into two keys, `…Lead` and `…Emphasis`, following the pattern already in `src/i18n/ui/en.ts`. The italic word is marked `*like this*` in these specs.

## Site-wide constants

Facts repeated on every page. Change them here first.

| Item | EN | ES |
|---|---|---|
| Primary CTA | `Get a quote` → `/quote` | `Pide presupuesto` → `/es/presupuesto` |
| Secondary CTA | `See our work` | `Ver nuestro trabajo` **PROPOSED** |
| Email | `hello@arkticfox.ai` | same |
| Instagram | `@arkticfox.ai` | same |
| Pilot price | `from €490` | `desde 490 €` |
| Growth price | `from €1,290/mo` | `desde 1.290 €/mes` |
| Scale price | `from €2,600/mo` | `desde 2.600 €/mes` |
| VAT note | `Prices exclude VAT. Final price depends on volume, formats and complexity.` | `Precios sin IVA. El precio final depende del volumen, los formatos y la complejidad.` |
| Delivery formats | `9:16 · 4:5 · 1:1 · 16:9` | same |
| Sectors | `E-COMMERCE · FASHION · BEAUTY · FOOD & BEVERAGE · AUTOMOTIVE` | `E-COMMERCE · MODA · BELLEZA · ALIMENTACIÓN · AUTOMOCIÓN` **PROPOSED** |
| WhatsApp prefill | `Hi Arktic Fox, I'd like a quote for…` | `Hola Arktic Fox, quiero presupuesto para…` **PROPOSED** |

Currency is EUR in both languages. Never show a client logo, a testimonial, a founder photo or a statistic.

## Open questions blocking content

Carried from `docs/01-project-brief.md`. Each one blocks a specific block, noted in the page specs.

1. Legal entity: name, tax ID, address, registry data → `legal.md`.
2. Do published prices include VAT? The draft says they exclude it → `pricing.md`.
3. Minimum term and cancellation for Growth and Scale → `pricing.md` FAQ.
4. À-la-carte "from" prices → `pricing.md`, currently `Custom quote`.
5. Is "reply within 24 h" a real SLA? → `quote.md`, `thanks.md`.
6. Final hero headline, option 1 preferred → `home.md`.
7. Calendly URL → `thanks.md`.
