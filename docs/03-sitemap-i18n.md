# Sitemap and i18n

One landing page per language (ADR-024). English lives at the root. Spanish lives under `/es/`. Each page links to its twin. There is **no automatic language redirect**.

| Page | English | Spanish | Goal |
|---|---|---|---|
| Home | `/` | `/es/` | The whole site: impact, work, services, quote |
| Style guide (internal, noindex, not in the sitemap) | `/styleguide` | — | Check tokens, type and motion |

The earlier plan had eleven pages per language (services, pricing, projects, quote, thanks, legal). They were removed on 2026-11-06. Their copy specs stay in `docs/pages/` as reference and are not built.

The typed map is `src/i18n/routes.ts` and holds only `home`. `getAlternates()` emits `en`, `es`, and `x-default` (English) for `Hreflang.astro`.

## Navigation

A fixed bar over the film: the wordmark (centered from `lg`, left below) and EN / ES on the right. There is no menu, no service links and no quote button in the bar. Once the hero has scrolled away the bar gets a glass backing.

The quote CTA is `QuoteFab`: a white pill fixed bottom right on every screen, linking to `#contact`.

## Home section order

1. Hero (dark). The still-sequence film scrubbed by scroll, headline, one quote button (`#contact`). No pricing button.
2. Video gallery (dark). Four muted clips that play while in view. Stand-ins from `public/media/projects/` until the final reels arrive.
3. Service cards (blue hour). Product images, ad videos, hyperreal UGC. Each button goes to the form and pre-ticks that need.
4. Contact form (dark, light card). Netlify Forms, answered in place.

## Netlify Forms

The form exists as static HTML at build time.

- `name="quote"`, `data-netlify="true"`, honeypot `bot-field`
- hidden `locale` field, so a submission says which page it came from
- fields: name, work email, company or brand, website (optional), what do you need (at least one of four), and the brief
- sent with `fetch` to the page itself; success replaces the form, failure shows the `hello@arkticfox.ai` fallback
- **no privacy consent checkbox yet**: it must link to a privacy page, and that page was removed. Decide before launch.

Not in the form compared with `docs/pages/quote.md`: country, package, budget, timeline, references. Packages and pricing no longer exist on the site.

## Numbers

Prices are not shown on the site.

## Sitemap

`@astrojs/sitemap` is configured with `en` as the default locale and `es` as the alternate. `/styleguide` is `noindex` and excluded, so the sitemap lists the two homes.
