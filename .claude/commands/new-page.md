---
description: Create a page in EN and ES using the route map
---

Create a page in English and Spanish using the route map.

1. Add the page key to `src/i18n/routes.ts` if it is missing.
2. Add both route files as thin wrappers around one page component that takes `locale`.
3. Add every new string to `src/i18n/ui/en.ts` and `src/i18n/ui/es.ts`.
4. Render `Seo` and `Hreflang` through `BaseLayout`.
5. Confirm the sitemap includes the pair and that `/styleguide` stays excluded.
6. Run `pnpm verify`.
7. Summarize in Spanish.
