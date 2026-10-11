---
description: Find missing or hardcoded strings
---

Find missing or hardcoded strings.

1. Compare `src/i18n/ui/en.ts` and `src/i18n/ui/es.ts`. TypeScript must already reject a missing key.
2. Search components for user-facing text that is not passed through `t()` or a content collection.
3. Check hreflang pairs from `getAlternates()` and the translated slugs in `src/i18n/routes.ts`.
4. Report gaps in Spanish.
