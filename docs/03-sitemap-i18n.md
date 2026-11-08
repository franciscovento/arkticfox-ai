# Sitemap and i18n

One landing page per language (ADR-024). English lives at the root. Spanish lives under `/es/`. Each page links to its twin. There is **no automatic language redirect**.

| Page | English | Spanish | Goal |
|---|---|---|---|
| Home | `/` | `/es/` | The whole site: impact, work, services, quote |
| Style guide (internal, noindex, not in the sitemap) | `/styleguide` | — | Check tokens, type and motion |

The earlier plan had eleven pages per language (services, pricing, projects, quote, thanks, legal). They were removed on 2026-11-06. Their copy specs stay in `docs/pages/` as reference and are not built.

The typed map is `src/i18n/routes.ts` and holds only `home`. `getAlternates()` emits `en`, `es`, and `x-default` (English) for `Hreflang.astro`.

## Navigation

A fixed bar over the film: the wordmark (centered from `lg`, left below) and EN / ES on the right. There is no menu and no service links.

## Home

One pinned scroll scene over the film: the headline, the video slider, then the three service cards. The quote form is a glass modal (`#contact`) opened by the floating "Get a quote" pill or the hero pill, wherever the visitor is; `/#contact` opens it on load.

## Numbers

Prices are not shown on the site.

## Sitemap

`@astrojs/sitemap` is configured with `en` as the default locale and `es` as the alternate. `/styleguide` is `noindex` and excluded, so the sitemap lists the two homes.
