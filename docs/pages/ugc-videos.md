# Hyperreal UGC videos

| | |
|---|---|
| URLs | `/ugc-videos` · `/es/videos-ugc` |
| Goal | Sell AI UGC videos. |
| Template | [`_service-template.md`](./_service-template.md) — only the blocks below differ. |

This page carries a **non-negotiable transparency note** (`CLAUDE.md` rule 7). It must stay visible, not hidden behind an accordion, and it must be linked from the FAQ. It covers the studio under the EU AI Act's labelling expectations for realistic synthetic content, so it is a legal requirement as much as a trust signal.

## SEO

| Slot | EN | ES |
|---|---|---|
| Title | `Arktic Fox \| Hyperreal AI UGC Videos` **PROPOSED** | `Arktic Fox \| Vídeos UGC hiperrealistas con IA` **PROPOSED** |
| Description | `UGC-style testimonials, unboxings and tutorials with AI creators, each with alternative hooks to test.` **PROPOSED** | `Testimonios, unboxings y tutoriales tipo UGC con creadores de IA, cada uno con hooks alternativos para testear.` **PROPOSED** |

## 1. Hero — dark

| Slot | Key | EN | ES |
|---|---|---|---|
| Eyebrow | `ugcVideos.hero.eyebrow` | `HYPERREAL UGC` **PROPOSED** | `UGC HIPERREALISTA` **PROPOSED** |
| Headline | `ugcVideos.hero.headlineLead` + `headlineEmphasis` | `Creators your audience trusts. *Built by AI.*` **PDF** | `Creadores en los que tu público confía. *Hechos con IA.*` **PDF** |
| Subheadline | `ugcVideos.hero.subhead` | `Hyperrealistic UGC-style videos with AI creators: testimonials, unboxings and tutorials, each with alternative hooks to test.` **PDF** | `Vídeos tipo UGC hiperrealistas con creadores de IA: testimonios, unboxings y tutoriales, cada uno con hooks alternativos para testear.` **PROPOSED** |
| CTA | `shared.cta.quote` | `Get a quote` **PDF** | `Pide presupuesto` **PDF** |

## 2. What you get

The five use cases are **PDF** (testimonials, unboxing, tutorials, reactions, TikTok and Meta ads). Descriptions are **PROPOSED**.

| # | EN | ES |
|---|---|---|
| 1 | `Testimonials` — `A creator talking about your product like a customer would.` | `Testimonios` — `Un creador hablando de tu producto como lo haría un cliente.` |
| 2 | `Unboxings` — `The first-impression video that sells without selling.` | `Unboxings` — `El vídeo de primera impresión que vende sin vender.` |
| 3 | `Tutorials` — `How-to videos that answer the objection before it arrives.` | `Tutoriales` — `Vídeos de uso que responden a la objeción antes de que llegue.` |
| 4 | `Reactions` — `Short, reactive formats native to TikTok.` | `Reacciones` — `Formatos cortos y reactivos, nativos de TikTok.` |
| 5 | `Hook variations` — `Two or more openings per video, so you can test what stops the scroll.` | `Variaciones de hook` — `Dos o más aperturas por vídeo, para testear qué frena el scroll.` |

Row 5 matches the package inclusions in [`pricing.md`](./pricing.md) (Pilot: 2 alternative hooks per video).

## 4. Service-specific block — 9:16 carousel and hooks

Horizontal carousel of 9:16 videos inside phone frames, plus a "One video, multiple hooks" explainer showing one video with two different opening hooks. **PDF**

| Slot | Key | EN | ES |
|---|---|---|---|
| Carousel headline | `ugcVideos.carousel.headline` | `Made for the feed.` **PROPOSED** | `Hechos para el feed.` **PROPOSED** |
| Explainer headline | `ugcVideos.hooks.headlineLead` + `headlineEmphasis` | `One video, *multiple hooks*.` **PDF** | `Un vídeo, *varios hooks*.` **PROPOSED** |
| Explainer body | `ugcVideos.hooks.body` | `Same creator, same product, different first three seconds. Test them against each other and scale the winner.` **PROPOSED** | `Mismo creador, mismo producto, tres primeros segundos distintos. Los pones a competir y escalas el que gana.` **PROPOSED** |
| Hook A label | `ugcVideos.hooks.labelA` | `Hook A` **PROPOSED** | `Hook A` **PROPOSED** |
| Hook B label | `ugcVideos.hooks.labelB` | `Hook B` **PROPOSED** | `Hook B` **PROPOSED** |

**OPEN** — needs sample videos and one real hook pair.

## Transparency note

Sits directly under the carousel, always visible, and links to FAQ question 1.

| Slot | Key | EN | ES |
|---|---|---|---|
| Note | `ugcVideos.transparency.body` | `All creators are AI-generated avatars. We'll help you label content where platforms or regulations require it.` **PDF** | `Todos los creadores son avatares generados con IA. Te ayudamos a etiquetar el contenido donde las plataformas o la normativa lo exijan.` **PROPOSED** |
| Link | `ugcVideos.transparency.link` | `Why this matters` → FAQ anchor **PROPOSED** | `Por qué importa` → ancla de la FAQ **PROPOSED** |

A shortened version (`All creators are AI-generated avatars.`) already exists as `home.ugcNote` in `src/i18n/ui/*.ts`. The full two-sentence version is required on this page; the short one is acceptable on the home services panel.

## 8. FAQs

Four to five questions, with the real-people question first. **OPEN** — answers, except where noted.

| # | EN | ES |
|---|---|---|
| 1 | `Are the creators real people?` **PDF** | `¿Los creadores son personas reales?` **PROPOSED** |
| 2 | `Do I have to disclose that the content is AI-generated?` **PROPOSED** | `¿Tengo que avisar de que el contenido está hecho con IA?` **PROPOSED** |
| 3 | `Can I reuse the same creator across campaigns?` **PROPOSED** | `¿Puedo reutilizar el mismo creador en varias campañas?` **PROPOSED** |
| 4 | `How many hooks come with each video?` **PROPOSED** | `¿Cuántos hooks trae cada vídeo?` **PROPOSED** |
| 5 | `Can I use the videos commercially, and who owns them?` **PDF** | `¿Puedo usar los vídeos comercialmente y de quién son?` **PROPOSED** |

Answer 1 is settled by the brief and must be unambiguous: **no**, every creator is an AI-generated avatar, and the studio helps label the content where platforms or the law require it. Do not hedge it.

Answer 2 is **OPEN** and legally sensitive. The brief flags the EU AI Act and says to have an adviser review it. Until then, state what the studio does (helps you label) and do not give legal advice about the client's obligations.

Answer 4 is `two or more per video` on Pilot; confirm against the final package definitions before publishing a number.

## Assets needed

- Hero background loop, 16:9 and 9:16, plus poster.
- 4–6 sample 9:16 UGC videos with posters, for the phone-frame carousel.
- One video with two distinct hooks, for the explainer.
- Gallery: 3–4 samples per sector.
