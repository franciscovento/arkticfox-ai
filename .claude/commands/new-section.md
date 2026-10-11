---
description: Build a new page section from the design handoff
---

Build a new page section from the design handoff.

1. Read `$ARGUMENTS`.
2. Find the matching reference in `design-handoff/`.
3. Check `docs/COMPONENTS.md` and reuse what exists.
4. Build the section in `src/components/sections/` using tokens and i18n only.
5. Wire motion through `src/motion` and `src/components/motion`.
6. Run `pnpm verify` and `pnpm shots`.
7. Update `docs/COMPONENTS.md`.
8. Summarize in Spanish.
