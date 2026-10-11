# Arktic Fox — STEP 1: Environment setup

> **For Claude Code.** Read this whole file, then execute **Step 1 only**. Do not build any page or section. When Step 1 is complete and verified, stop and report to me (in Spanish) so I can approve before Step 2.
> Language rules: talk to me in **Spanish**. Code, comments, docs, commit messages and file names in **English**.

---

## 0. Context (what we are building)

**arktic fox** (`arkticfox.ai`) is a premium, cinematic marketing site for an AI creative studio selling three services: **Product images**, **Ad videos**, **Hyperreal UGC videos**. Single goal: the visitor asks for a quote ("Get a quote" → `/quote`).

- Concept: an arctic fox camouflaged in the snow. Ads blend into the feed, results stand out.
- Languages: EN (primary, root) and ES (under `/es/`, translated slugs). 10 pages per language.
- Hosting: Netlify (static). Forms: Netlify Forms.
- Studio has no public face: **no testimonials, no client logos, no founder photos, no invented statistics.**
- The source brief is in `docs/source/` (PDF from Nabil). **It is a draft, not final.** Where it conflicts with `CLAUDE.md` or `docs/`, the docs win, and you flag the conflict to me.
- Visual references: full-bleed looping video hero, split nav with centered logo mark, large editorial serif headline mixing upright caps with one italic word, frosted-glass cards over video. Style references from motionsites.ai (animated hero backgrounds, glass cards, scroll reveals) go in `design-handoff/references/` as **visual inspiration only**.
- Visual design is explored in **Claude Design**; its exports land in `design-handoff/`. Claude Code's job is to port that design faithfully into the Astro codebase using the token system. **Never invent a new visual language.**

## 1. Stack decision (final unless I say otherwise)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro** (latest stable, static output) | Content/marketing site, zero JS by default, best Lighthouse/SEO, native i18n routing + hreflang control, content collections, trivial Netlify deploy. Interactive bits run as islands. |
| Interactive islands | **React** via `@astrojs/react` | Before/after slider, masonry filter + lightbox, accordion, tabs, mobile menu. Huge ecosystem, Claude writes it very well. |
| Styling | **Tailwind CSS v4** (`@tailwindcss/vite`) + tokens in CSS `@theme` | Single source of truth for design tokens; default palette is wiped so off-system colors cannot exist. |
| Components | **shadcn/ui (Radix primitives)** for accessible behavior only, restyled with our tokens | Accessible Accordion/Dialog/Tabs/NavigationMenu without custom a11y work. |
| Motion (UI, React islands) | **`motion`** (motion.dev, ex Framer Motion) | Springs, layout, gestures, reveal. |
| Motion (scroll scenes, timelines) | **GSAP** + ScrollTrigger | Cinematic scroll choreography, marquee, pinned sections. |
| Smooth scroll | **Lenis** (opt-in, disabled with reduced motion) | Premium scroll feel. |
| Ambient effects | Custom lightweight canvas (snow), CSS animations | No heavy libs; pauses off-screen. |
| Fonts | **Self-hosted via Fontsource** (Instrument Serif, Montserrat Variable) | Better than Google Fonts CDN for EU/GDPR and performance. (Deviates from the brief's "Google Fonts"; log it in DECISIONS.md.) |
| Icons | `lucide-react` / `astro-icon` + `@iconify-json/lucide` | Line icons consistent with the brand. |
| Package manager | **pnpm** | Fast, strict. |
| Quality | TypeScript strict, `astro check`, ESLint (+ jsx-a11y), Prettier, **custom design-token guard**, Playwright for screenshots | Keeps vibe coding on rails. |
| Deploy | Netlify static (`netlify.toml`) | No adapter needed for static output. |

Rejected: **Next.js** (SSR/React server features unnecessary, heavier, Netlify forms need workarounds). **Vite SPA** (weak SEO/hreflang/prerender story for a marketing site). If any version below differs from what I assume (e.g. a new Astro/Tailwind major), **follow the current official docs**, verify with `npm view <pkg> version`, and record it in `docs/DECISIONS.md`. Do not guess APIs: use the Context7 MCP (see §4) or official docs.

## 2. Target folder structure

```
arktic-fox/
├─ CLAUDE.md                      # master rules (loaded every session)
├─ .claude/
│  ├─ settings.json               # permissions + hooks (token guard runs after every edit)
│  ├─ commands/                   # slash commands: new-section, new-page, design-review, i18n-check
│  └─ agents/design-guardian.md   # reviewer subagent
├─ docs/
│  ├─ source/                     # original PDF brief (read-only reference)
│  ├─ 01-project-brief.md
│  ├─ 02-design-system.md
│  ├─ 03-sitemap-i18n.md
│  ├─ 04-motion.md
│  ├─ 05-content.md
│  ├─ COMPONENTS.md               # living registry of every component (update on every change)
│  ├─ DECISIONS.md                # ADR-style log
│  └─ ROADMAP.md                  # steps + status
├─ design-handoff/                # Claude Design exports + references (read-only source of truth for visuals)
│  ├─ exports/
│  └─ references/
├─ public/
│  ├─ media/                      # hero videos (mp4+webm), posters
│  ├─ og/                         # 1200x630 share images
│  └─ favicon.svg
├─ scripts/check-tokens.mjs       # design-system guard
├─ src/
│  ├─ assets/{logo,images}/
│  ├─ components/
│  │  ├─ ui/                      # primitives: Button, GlassCard, Eyebrow, Heading, FoxDivider, Badge
│  │  ├─ layout/                  # Nav, Footer, MobileMenu, LanguageSwitcher, WhatsAppButton
│  │  ├─ sections/                # Hero, Services, BeforeAfter, WhyUs, Work, Process, Packages, Faq, FinalCta...
│  │  ├─ islands/                 # React interactive components (client:* hydrated)
│  │  ├─ motion/                  # Reveal, Marquee, SnowCanvas, ScrollScene wrappers
│  │  └─ seo/                     # Seo.astro, Hreflang.astro
│  ├─ content/                    # content collections (faq, packages, services, work)
│  ├─ content.config.ts
│  ├─ i18n/{routes.ts,utils.ts,ui/en.ts,ui/es.ts}
│  ├─ layouts/BaseLayout.astro
│  ├─ lib/
│  ├─ motion/{tokens.ts,reveal.ts,gsap.ts}   # the ONLY place gsap/lenis are imported
│  ├─ pages/                      # EN at root, ES under pages/es/
│  └─ styles/{tokens.css,global.css,motion.css}
├─ astro.config.mjs
├─ netlify.toml
├─ eslint.config.js  .prettierrc  .editorconfig  .nvmrc  .env.example  .gitignore
└─ package.json
```

## 3. Step 1 tasks (do in order, small commits)

**Pre-check:** the folder should contain this file and (optionally) `_inbox/` with the PDF brief. If the PDF is in `_inbox/`, move it to `docs/source/`.

### 3.1 Scaffold
1. Verify Node (LTS, ≥22) and pnpm are available; write `.nvmrc`.
2. Scaffold Astro in the current directory: minimal template, TypeScript **strict**, no sample content. Check `pnpm create astro@latest --help` for exact flags. `git init`.
3. Add integrations/packages (latest stable):
   - Runtime: `react react-dom @astrojs/react @astrojs/sitemap tailwindcss @tailwindcss/vite motion gsap lenis @fontsource-variable/montserrat @fontsource/instrument-serif lucide-react clsx tailwind-merge class-variance-authority`
   - Dev: `typescript @astrojs/check eslint typescript-eslint eslint-plugin-astro eslint-plugin-jsx-a11y prettier prettier-plugin-astro prettier-plugin-tailwindcss @playwright/test @types/react @types/react-dom`
   - Then `pnpm exec playwright install chromium`.
4. Initialize **shadcn/ui** following the *current* shadcn Astro guide. **Important:** shadcn will try to write its own CSS variables/colors; map them to our tokens (see `src/styles/tokens.css`), never keep its default palette. Install only: `accordion`, `dialog`, `tabs`, `navigation-menu`, `sheet`. Components go in `src/components/ui/` (shadcn) — keep our own primitives next to them.
5. Configure `astro.config.mjs`: `site: 'https://arkticfox.ai'`, static output, React integration, sitemap with i18n (`en` default, `es`), Tailwind via Vite plugin, and **i18n routing** (`defaultLocale: 'en'`, `locales: ['en','es']`, `prefixDefaultLocale: false`).
6. `tsconfig` path alias `@/*` → `src/*`.

### 3.2 Design tokens (the heart of the project)
Create `src/styles/tokens.css` with the content below, `src/styles/global.css` (imports Tailwind, tokens, fonts, base styles, `glass` utility) and `src/styles/motion.css` (reduced-motion rules, reveal classes).

````css
/* src/styles/tokens.css — SINGLE SOURCE OF TRUTH. Only file allowed to contain raw color values. */
@theme {
  /* wipe Tailwind's default palette so off-system colors don't exist */
  --color-*: initial;

  --color-fox-coral: #ff674c;
  --color-fox-pink: #ff429e;
  --color-ice-blue: #a7cdff;
  --color-snow-gray: #e8e8e8;
  --color-polar-night: #0b0f1a;   /* dark sections (proposal) */
  --color-snow-white: #f7f8fa;    /* light sections (proposal) */
  --color-ink: #111318;           /* text on light */
  --color-white: #ffffff;
  --color-glass: rgb(255 255 255 / 0.08);
  --color-glass-border: rgb(255 255 255 / 0.15);
  --color-scrim: rgb(11 15 26 / 0.7);

  --font-serif: "Instrument Serif", "Times New Roman", serif;
  --font-sans: "Montserrat Variable", Montserrat, system-ui, sans-serif;

  --radius-card: 20px;
  --radius-card-sm: 16px;
  --radius-pill: 9999px;

  --tracking-label: 0.2em;
  --ease-fox: cubic-bezier(0.22, 1, 0.36, 1);

  /* brand gradient: max ONE gradient element per viewport */
  --background-image-brand-gradient: linear-gradient(90deg, var(--color-fox-coral), var(--color-fox-pink));
}

:root {
  --dur-hover: 250ms;
  --dur-reveal: 900ms;
  --dur-slow: 1400ms;
}
````

`global.css` must also define: base body (`font-sans`, snow-white/ink), heading styles (`font-serif`), an `@utility glass` (backdrop blur + `bg-glass` + 1px `border-glass-border` + `rounded-card`), an `@utility label` (Montserrat 500, uppercase, `tracking-label`), and focus-visible styles with AA contrast.

### 3.3 Guardrails
Create `scripts/check-tokens.mjs` exactly as below. It exits with code **2** and prints to stderr so a Claude Code hook feeds the violations straight back to the model.

````js
#!/usr/bin/env node
// Design-system guard. Fails on raw colors, off-system Tailwind colors, hardcoded motion values,
// and animation libs imported outside the motion layer. Add `// token-ok` on a line to exempt it (explain why).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = fileURLToPath(new URL('../src/', import.meta.url));
const EXT = new Set(['.astro', '.tsx', '.ts', '.jsx', '.js', '.css', '.mdx']);
const COLOR_ALLOWED = ['styles/tokens.css'];
const MOTION_LIB_ALLOWED = ['motion/', 'components/motion/', 'components/islands/'];
const PALETTE = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const UTIL = 'bg|text|border|ring|fill|stroke|from|via|to|shadow|outline|decoration|divide|accent|caret';

const rules = [
  { name: 'raw hex color', re: /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/, colorOnly: true, skipLine: /href=|\bid=|url\(#|xlink:href/ },
  { name: 'raw color function (rgb/hsl/oklch…)', re: /\b(?:rgba?|hsla?|oklch|oklab|hwb|lab|lch)\(/, colorOnly: true },
  { name: 'arbitrary Tailwind color', re: new RegExp(`\\b(?:${UTIL})-\\[(?:#|rgb|hsl|oklch|color:)`) },
  { name: 'default Tailwind palette color', re: new RegExp(`\\b(?:${UTIL})-(?:${PALETTE})-\\d{2,3}\\b`) },
  { name: 'hardcoded motion value (use motion tokens)', re: /\b(?:duration|ease|delay)-\[/ },
  { name: 'hardcoded font-family (use font-serif / font-sans)', re: /font-family\s*:/, colorOnly: true },
];

const libRe = /from\s+['"](?:gsap|gsap\/[^'"]+|lenis)['"]/;

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    statSync(p).isDirectory() ? walk(p, out) : EXT.has(extname(p)) && out.push(p);
  }
  return out;
}

const problems = [];
for (const file of walk(SRC)) {
  const rel = relative(SRC, file).replaceAll('\\', '/');
  const isTokens = COLOR_ALLOWED.some((a) => rel.endsWith(a));
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (line.includes('token-ok')) return;
    for (const r of rules) {
      if (r.colorOnly && isTokens) continue;
      if (r.skipLine && r.skipLine.test(line)) continue;
      if (r.re.test(line)) problems.push(`${rel}:${i + 1}  ${r.name}\n    ${line.trim()}`);
    }
    if (libRe.test(line) && !MOTION_LIB_ALLOWED.some((a) => rel.startsWith(a))) {
      problems.push(`${rel}:${i + 1}  gsap/lenis may only be imported in src/motion, src/components/motion or src/components/islands\n    ${line.trim()}`);
    }
  });
}

if (problems.length) {
  console.error(`\n✖ Design-token guard: ${problems.length} violation(s)\n`);
  console.error(problems.join('\n\n'));
  console.error('\nFix: use tokens from src/styles/tokens.css (e.g. bg-fox-coral, text-ink, bg-brand-gradient, glass) and motion tokens from src/motion/tokens.ts. See docs/02-design-system.md.\n');
  process.exit(2);
}
console.log('✔ Design-token guard passed');
````

Then:
- `package.json` scripts: `dev`, `build`, `preview`, `check` (`astro check`), `lint`, `format`, `check:tokens` (`node scripts/check-tokens.mjs`), `verify` (`check` + `lint` + `check:tokens` + `build`), `shots` (Playwright screenshots at 390 / 768 / 1440).
- `.claude/settings.json`:

````json
{
  "permissions": {
    "allow": [
      "Bash(pnpm:*)", "Bash(pnpm dlx:*)", "Bash(pnpm exec:*)", "Bash(node scripts/*)",
      "Bash(git status)", "Bash(git diff:*)", "Bash(git add:*)", "Bash(git commit:*)", "Bash(git log:*)"
    ],
    "deny": [
      "Read(./.env)", "Read(./.env.*)", "Bash(rm -rf:*)", "Bash(git push --force:*)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [{ "type": "command", "command": "pnpm -s check:tokens" }]
      }
    ]
  }
}
````
(Verify the hook schema against the current Claude Code docs and adjust if it changed.)

### 3.4 Motion foundation (infrastructure only, no sections)
- `src/motion/tokens.ts`: export durations/easings mirroring the CSS tokens (`dur.hover=0.25`, `dur.reveal=0.9`, `dur.slow=1.4`, `ease.fox=[0.22,1,0.36,1]`, `distance.rise=24`).
- `src/motion/gsap.ts`: single registration point for GSAP + ScrollTrigger, exports `prefersReducedMotion()`; every scroll scene must early-return when it is true.
- `src/motion/reveal.ts` + `src/components/motion/Reveal.astro`: IntersectionObserver fade-and-rise (CSS-driven, no library) with `data-reveal`, optional stagger.
- `src/components/motion/Marquee.astro` (CSS-only infinite marquee, pause on hover/reduced motion).
- `src/components/motion/SnowCanvas.astro`: very subtle snow particles on `<canvas>`, DPR-aware, paused when off-screen (IntersectionObserver) and disabled for reduced motion.
- `src/styles/motion.css`: `@media (prefers-reduced-motion: reduce)` disables all non-essential animation globally.

### 3.5 i18n foundation
- `src/i18n/routes.ts`: a typed map of page keys → localized paths:
  `home: / | /es/`, `productImages: /product-images | /es/imagenes-de-producto`, `adVideos: /ad-videos | /es/videos-publicitarios`, `ugcVideos: /ugc-videos | /es/videos-ugc`, `pricing: /pricing | /es/precios`, `quote: /quote | /es/presupuesto`, `thanks: /thanks | /es/gracias`, `legalNotice: /legal-notice | /es/aviso-legal`, `privacy: /privacy | /es/privacidad`, `cookies: /cookies | /es/cookies`.
- `src/i18n/utils.ts`: `t(locale, key)`, `getPath(locale, pageKey)`, `getAlternates(pageKey)` (used by the language switcher and `Hreflang.astro`: `en`, `es`, `x-default = en`).
- `ui/en.ts`, `ui/es.ts`: typed dictionaries (TypeScript must error when a key exists in one and not the other). Seed with nav labels only.
- **Rule:** no user-facing string is hardcoded in components; everything goes through the dictionaries or content collections.
- Pattern for pages: EN and ES route files are thin wrappers that render the *same* page component with a `locale` prop.

### 3.6 Base layout and a dev-only style guide
- `src/layouts/BaseLayout.astro`: `<html lang>`, `Seo.astro` (title, description, canonical, Open Graph), `Hreflang.astro`, fonts imported, global styles, slot.
- `src/pages/styleguide.astro` (`noindex`, excluded from sitemap): renders color swatches from tokens, type scale (serif headline with an italic word, Montserrat label), pill buttons (gradient primary, outline secondary), a `glass` card over a dark gradient, the fox divider placeholder, a reveal demo and the snow canvas. **This is only to prove the token pipeline works.** Final visuals come from the Claude Design handoff in Step 2.
- Placeholder SVG for the fox mark in `src/assets/logo/` (replaced by the real logo later; ask me for it).

### 3.7 Netlify + housekeeping
- `netlify.toml`: build `pnpm build`, publish `dist`, `NODE_VERSION` env, headers: immutable long cache for `/_astro/*` and `/media/*`, short cache for HTML, basic security headers (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`).
- `.gitignore`, `.editorconfig`, `.prettierrc` (astro + tailwind plugins), `.env.example`, `eslint.config.js` (astro + typescript-eslint + jsx-a11y).
- Create `design-handoff/{exports,references}/` with a short README: "Drop Claude Design exports and reference screenshots here. Read-only."

### 3.8 Write the documentation (see §5 for contents)
Create `CLAUDE.md`, the 7 `docs/*.md` files, `COMPONENTS.md`, `DECISIONS.md`, `ROADMAP.md`, `.claude/commands/*`, `.claude/agents/design-guardian.md` using the content in §5–§6. Condense my brief from `docs/source/` where indicated; do not invent facts.

### 3.9 Verify and report
Run `pnpm verify`; open `/styleguide` and take screenshots at 390 / 768 / 1440 with Playwright. Deliberately add a bad line (e.g. `class="bg-[#fff]"`) once to confirm the guard and the hook catch it, then remove it. Make the first commit: `chore: project setup (step 1)`.

**Report to me (Spanish):** installed versions, anything that deviated from this doc, `pnpm verify` output summary, screenshots, and the list of things you need from me for Step 2.

**Acceptance criteria for Step 1**
- [ ] `pnpm dev` and `pnpm build` work; `pnpm verify` passes.
- [ ] Tokens file is the only place with raw colors; guard catches violations; hook is active.
- [ ] `/styleguide` renders with correct fonts, colors, glass, motion; reduced motion respected.
- [ ] i18n route map + hreflang helper work; EN/ES dictionary parity is type-checked.
- [ ] All docs and `.claude/` files exist.
- [ ] No page or section from the home has been built yet.

## 4. Recommended MCP servers (ask me before installing; verify commands in current docs)
- **Context7** — up-to-date library docs so you stop guessing APIs: `claude mcp add context7 -- npx -y @upstash/context7-mcp`
- **Playwright MCP** — lets you open the dev server and look at your own work: `claude mcp add playwright -- npx @playwright/mcp@latest`
- Later (optional): Netlify MCP for deploys; Figma MCP only if we move design there.

---

## 5. Files to create — contents

### 5.1 `CLAUDE.md` (root)

````markdown
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
````

### 5.2 `docs/01-project-brief.md`
Condense from the source PDF (mark **DRAFT – confirm with Nabil**): brand decisions table, services, three packages (Pilot from €490 one-off; Growth from €1,290/mo; Scale from €2,600/mo; none highlighted; "Prices exclude VAT" pending confirmation), sectors (e-commerce, fashion, beauty, food & beverage, automotive — no special prominence), presence rules (faceless studio), hosting, primary CTA `Get a quote` → `/quote`, contact stack (Netlify Forms, WhatsApp button, Calendly on thanks page, hello@arkticfox.ai), and the **open questions list**: legal entity for legal notice, VAT, minimum term for Growth/Scale, à-la-carte "from" prices, final hero headline, final headline font option, 24 h reply SLA.

### 5.3 `docs/02-design-system.md`
- Palette and roles (table from tokens above), note that **Polar Night and Snow White are proposals** pending approval.
- Typography: Instrument Serif (regular + *italic*) for headlines, mixing upright caps with one italic word (e.g. "ADS THAT *blend in*"); Montserrat 400/500/700 for UI/body; nav + eyebrow labels Montserrat 500 uppercase `tracking-label`. Alternatives considered: Cormorant Garamond, Fraunces.
- Logo: fox head peeking over a horizontal line + ARKTIC FOX wordmark. Mark-only centered in nav; full lockup in footer and mobile hero. Versions: white, gradient, black (SVG).
- Signature motif: horizontal line with fox ears peeking over it, used as section divider (`FoxDivider`).
- Components: pill buttons (primary gradient + white text; secondary 1px outline), frosted-glass cards (blur, 1px white/15% border, 16–20px radius), snow on dark sections only.
- Page rhythm: alternate dark cinematic and light snowy sections.
- Rules: one gradient element per viewport; WCAG AA; mobile-first.
- Link to `design-handoff/` as the visual source of truth once exported.

### 5.4 `docs/03-sitemap-i18n.md`
The 10-page sitemap with EN/ES URLs (table from `routes.ts`), nav structure (left: Services dropdown [3 pages], Work, Process; center: fox mark; right: Pricing, EN/ES, "Get a quote" gradient button; mobile: mark left, quote button + full-screen hamburger), home section order (12 blocks: nav, hero, sector marquee, services, before/after, why us, selected work, process, packages, FAQ, final CTA, footer), service page template (9 sections), hreflang rules (`en`, `es`, `x-default = en`), **no automatic language redirect**, EN number format `€1,290/mo` vs ES `1.290 €/mes`, Netlify Forms notes (static HTML form must exist at build time: `name="quote"`, `data-netlify="true"`, honeypot, `action` → `/thanks` or `/es/gracias`; privacy consent required).

### 5.5 `docs/04-motion.md`
Motion principles (slow, cinematic, premium; nothing bouncy): reveal = fade + rise 24 px, 900 ms, `ease-fox`; hovers 250 ms; snow = very subtle, dark sections only; hero video = muted loop, no audio, poster, MP4+WebM, 1080p desktop + separate 9:16 mobile; seamless loop (fox starts camouflaged, ends on empty snowfield, 0.5–1 s crossfade); sector marquee; glass nav on scroll; before/after slider; masonry filter transitions; accordion; lightbox. Tool split: CSS first → `motion` for React island interactions → GSAP only for scroll choreography. Performance budget: animate transform/opacity only, pause off-screen, respect reduced motion, no motion library in the critical path of the hero. Include the Veo prompt rules for the hero video as reference (copy from the PDF §8 / "Vídeo del hero con Veo").

### 5.6 `docs/05-content.md`
Copy bank from the brief, **flagged as draft**: hero headline options (1: "Ads that *blend in*. Results that stand out." — preferred; 3: "So real, no one sees the AI. Only the results."), subheadline, eyebrow "AI CREATIVE STUDIO", services headlines and subheads (Product images / Ad videos / Hyperreal UGC), package texts (Pilot "Test the waters." / Growth "Feed the algorithm." / Scale "Double down on winners." with inclusions), FAQ list, quote form fields, thanks-page copy, UGC transparency note, SEO titles/descriptions pattern. ES counterparts where the PDF provides them; otherwise mark `TODO ES`.

### 5.7 `docs/COMPONENTS.md`
Registry table: `Name | Path | Props | Used in | Status`. Seed it with the primitives planned (Button, GlassCard, Eyebrow, Heading, FoxDivider, Badge, Reveal, Marquee, SnowCanvas, Seo, Hreflang, LanguageSwitcher) with status `planned/built`.

### 5.8 `docs/DECISIONS.md`
ADR log. Seed: ADR-001 Astro over Next/Vite; ADR-002 Tailwind v4 tokens with palette wipe; ADR-003 self-hosted fonts via Fontsource; ADR-004 GSAP only in motion layer; ADR-005 Netlify Forms; ADR-006 no auto language redirect. Each: context, decision, consequences, date.

### 5.9 `docs/ROADMAP.md`
| Step | Goal | Status |
|---|---|---|
| 1 | Environment, tooling, guardrails, docs | in progress |
| 2 | Design system build: tokens ← Claude Design handoff, primitives, FoxDivider, logo, `/styleguide` approved | todo |
| 3 | Layout: Nav (split + mobile menu), Footer, language switcher, WhatsApp button, Seo/Hreflang | todo |
| 4 | Home sections 1→12 (dark/light rhythm, hero video, marquee, sliders, masonry) | todo |
| 5 | Service page template + 3 services | todo |
| 6 | Pricing page | todo |
| 7 | Quote form + Thanks + legal template + cookie banner | todo |
| 8 | Spanish version (`/es/`), content parity | todo |
| 9 | SEO, OG images, sitemap, 404, performance + a11y pass, Netlify config | todo |
| 10 | Launch checklist (legal texts, domain, HTTPS, form test EN+ES, Search Console) | todo |

### 5.10 `.claude/commands/`
- `new-section.md` — description: "Build a new page section from the design handoff". Body: read `$ARGUMENTS`, find matching reference in `design-handoff/`, check COMPONENTS.md, build in `src/components/sections/` using tokens/i18n only, wire motion via `src/motion`, run `pnpm verify` + `pnpm shots`, update COMPONENTS.md, summarize in Spanish.
- `new-page.md` — "Create a page in EN and ES using the route map": add keys to `routes.ts`, both route files as thin wrappers, dictionaries, Seo + Hreflang, sitemap check.
- `design-review.md` — "Review current changes against the design system": invoke the `design-guardian` subagent on `git diff`, run `pnpm verify`, `pnpm shots`, report issues.
- `i18n-check.md` — "Find missing or hardcoded strings": compare dictionaries, grep components for hardcoded text, check hreflang pairs and translated slugs.

### 5.11 `.claude/agents/design-guardian.md`
Frontmatter: `name: design-guardian`, `description: Reviews code changes for design-system, motion, i18n and accessibility violations. Use proactively after UI changes.`, `tools: Read, Grep, Glob, Bash`. Body: checklist — tokens only, gradient budget, no hardcoded copy, EN/ES parity, motion rules and reduced motion, a11y (contrast, focus, alt, landmarks, heading order), performance (hydration directives, video lazy-loading, image formats), no fabricated proof, component reuse. Output: a concise list of violations with file:line and the fix. Read-only: never edit files.

---

## 6. After Step 1 — what I (Nabil) will provide for Step 2
- Claude Design export(s) / screenshots → `design-handoff/exports/`
- Logo SVG (white, gradient, black) + favicon
- Hero video (16:9 + 9:16) + poster, once generated with Veo
- Decisions on the open questions in `docs/01-project-brief.md`

**STOP after Step 1 and wait for my approval.**
