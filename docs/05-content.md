# Content

Page copy now lives in **one spec per page** under [`docs/pages/`](./pages/README.md), block by block, in English and Spanish, with the provenance of every line marked. This file keeps only what is cross-page.

| Page | Spec |
|---|---|
| Home | [`pages/home.md`](./pages/home.md) |
| Sample work | [`pages/work.md`](./pages/work.md) |
| Service template | [`pages/_service-template.md`](./pages/_service-template.md) |
| Product images | [`pages/product-images.md`](./pages/product-images.md) |
| Ad videos | [`pages/ad-videos.md`](./pages/ad-videos.md) |
| Hyperreal UGC | [`pages/ugc-videos.md`](./pages/ugc-videos.md) |
| Pricing | [`pages/pricing.md`](./pages/pricing.md) |
| Get a quote | [`pages/quote.md`](./pages/quote.md) |
| Thank you | [`pages/thanks.md`](./pages/thanks.md) |
| Legal ×3 | [`pages/legal.md`](./pages/legal.md) |

Conventions, source markers (**PDF** / **PROPOSED** / **OPEN**), site-wide constants and key naming: [`pages/README.md`](./pages/README.md).

## Rules that apply to all copy

1. No hardcoded strings in components. Everything moves into `src/i18n/ui/en.ts` and `es.ts`, or a content collection. Types enforce EN/ES parity.
2. Spanish is natural Spain Spanish, "tú", not a literal translation.
3. The PDF supplies Spanish for the hero headlines, the hero subheadline, the three service headlines and the VAT note. Everything else Spanish is a proposal awaiting review.
4. No fabricated proof: no testimonials, client logos, founder photos or invented statistics.
5. Prices live only in [`pages/pricing.md`](./pages/pricing.md). Other pages reference it.
6. Legal body text is never drafted by us. It stays `[LEGAL TEXT]`.

## SEO pattern

One title and one meta description per page and language. Per-page values are in each spec.

- EN: `Arktic Fox | AI Product Images, Ad Videos & UGC`
- ES: `Arktic Fox | Imágenes de producto, vídeos publicitarios y UGC con IA`

Open Graph image 1200×630, logo over the gradient, still to be designed. Alt text on every image. Posters on every video.

## Number and currency format

| | EN | ES |
|---|---|---|
| Pilot | `from €490` | `desde 490 €` |
| Growth | `from €1,290/mo` | `desde 1.290 €/mes` |
| Scale | `from €2,600/mo` | `desde 2.600 €/mes` |

EUR in both languages. Thousands separator is a comma in English and a period in Spanish; the symbol goes before the number in English and after it, with a space, in Spanish.
