# Design system

Visual source of truth, once exported: `design-handoff/`. Until that handoff lands, build only with the tokens below. Do not invent a new visual language.

**Polar Night and Snow White are proposals** pending approval. They exist so the page can alternate dark cinematic sections and light snowy sections.

## Palette

| Token | Value | Role |
|---|---|---|
| `fox-coral` | `#ff674c` | Buttons, links, details. One end of the brand gradient. |
| `fox-pink` | `#ff429e` | Second end of the gradient, hovers. |
| Brand gradient | 90°, coral → pink | Primary CTA, badges, key underlines. **Max one gradient element per viewport.** |
| `ice-blue` | `#a7cdff` | Glows, icons, cold details on dark sections. |
| `snow-gray` | `#e8e8e8` | Light fills, borders, separators. |
| `polar-night` | `#0b0f1a` | Dark cinematic section background. Proposal. |
| `snow-white` | `#f7f8fa` | Light section background. Proposal. |
| `ink` | `#111318` | Text on light. |
| `white` | `#ffffff` | Text on the gradient button. |
| `glass` / `glass-border` | white 8% / white 15% | Frosted cards. |
| `scrim` | polar night 70% | Overlays. |

Raw values live only in `src/styles/tokens.css`. Everything else uses the utilities (`bg-fox-coral`, `text-ink`, `bg-brand-gradient`, `glass`).

## Typography

| Role | Face | Notes |
|---|---|---|
| Headlines | Instrument Serif, regular + italic | Mix upright caps with one italic word. Example: "ADS THAT *blend in*". |
| UI, body, logo wordmark | Montserrat 400 / 500 / 700 | Self-hosted via Fontsource. |
| Nav and eyebrows | Montserrat 500, uppercase, `tracking-label` (0.2em) | Use the `label` utility. |

Alternatives considered and not chosen: Cormorant Garamond (more fashion, thinner on mobile), Fraunces (warmer, less cold luxury).

## Logo and motif

Fox head peeking over a horizontal line, plus the ARKTIC FOX wordmark.

- Nav: mark only, centered.
- Footer and mobile hero: full lockup.
- Versions still needed from Nabil: white, gradient, black, all SVG. The file in `src/assets/logo/fox-mark.svg` is a placeholder.

Signature motif: the same horizontal line with ears peeking over it, used as a section divider (`FoxDivider`, not built yet).

## Components

- Pill buttons. Primary: brand gradient, white text. Secondary: 1px outline (white on dark, ink on light).
- Frosted-glass cards: backdrop blur, 1px white/15% border, 16–20px radius (`rounded-card-sm` / `rounded-card`). Use the `glass` utility.
- Snow particles on dark sections only, very subtle, paused off-screen, off when reduced motion is requested.

## Page rhythm

Alternate dark cinematic sections and light snowy sections. Mobile first. Contrast meets WCAG AA. Focus rings use Fox Coral.
