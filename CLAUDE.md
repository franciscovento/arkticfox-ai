# Arktic Fox — arkticfox.ai

Premium cinematic marketing site for an AI creative studio (product images, ad videos, hyperreal UGC videos). One goal: get the visitor to request a quote.
Reply to the user in Spanish. Code, comments, docs, commits in English.

## Stack
Astro (static) · React islands · Tailwind v4 (tokens in `src/styles/tokens.css`) · shadcn/Radix (behavior only) · motion (islands) · GSAP/ScrollTrigger (scroll scenes) · Lenis · TypeScript strict · pnpm · Netlify.

## Commands
- `pnpm dev` · `pnpm build` · `pnpm preview`
- `pnpm verify` = astro check + lint + check:tokens + build. **Run before saying a task is done.**
- `pnpm shots` = Playwright screenshots at 390 / 768 / 1440.

## Read first (imported)
@docs/01-project-brief.md
@docs/02-design-system.md
@docs/03-sitemap-i18n.md
@docs/04-motion.md
@docs/COMPONENTS.md

## Golden rules (non-negotiable)
1. **Tokens only.** Never write raw colors, arbitrary color values (`bg-[#…]`), default Tailwind palette colors, hardcoded fonts, or hardcoded durations/easings. Use `bg-fox-coral`, `text-ink`, `bg-brand-gradient`, `glass`, `font-serif`, motion tokens. The `check:tokens` hook will fail you otherwise.
2. **Reuse before create.** Check `docs/COMPONENTS.md` and `src/components/` first. If you create or change a component, update `COMPONENTS.md` in the same task. No near-duplicates.
3. **Port, don't invent.** Visual design comes from `design-handoff/` (Claude Design exports + references). If something isn't specified, ask or propose options; don't improvise a new style.
4. **No hardcoded copy.** All user-facing text lives in `src/i18n/ui/*.ts` or `src/content/`. Every key must exist in EN and ES (types enforce it). ES is natural Spain Spanish ("tú"), not literal translation.
5. **Motion discipline.** Animate only via `src/motion/*` and `src/components/motion/*`. GSAP/Lenis imports only in `src/motion`, `src/components/motion`, `src/components/islands`. Always honor `prefers-reduced-motion`. Animate `transform`/`opacity` only; no layout-thrashing.
6. **Gradient budget:** at most ONE brand-gradient element per viewport (primary CTA, badge, or key underline).
7. **No fabricated proof:** no testimonials, client logos, founder photos or invented statistics. UGC creators are AI avatars; the transparency note must stay visible on the UGC page.
8. **Performance & a11y:** semantic HTML, AA contrast, keyboard operable, alt text on images, videos have posters and are lazy-loaded except the hero, ship zero JS unless interaction needs it (`client:visible` / `client:idle` preferred over `client:load`).
9. **Dependencies:** don't add packages without asking. State why and the size cost.
10. **Small steps:** one task = one focused change + `pnpm verify` + screenshot check + short Spanish summary. Commit with Conventional Commits. Ask before large refactors.
11. If a doc and the original brief (`docs/source/`) conflict, the docs win; flag it to the user.
12. Update `docs/DECISIONS.md` whenever you make or change a technical/design decision. Keep `docs/ROADMAP.md` statuses current.

## Workflow per task
Read relevant docs → state a 3–5 line plan → implement with existing components/tokens → `pnpm verify` → `pnpm shots` and look at the result → update COMPONENTS.md / ROADMAP.md → summarize in Spanish.
