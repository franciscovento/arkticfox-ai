# Home

| | |
|---|---|
| URLs | `/` · `/es/` (V1, dive). Parked V2: `/v2` · `/es/v2` (noindex, unlinked). |
| Goal | Impact, a summary of everything, a quote request. |
| Rhythm | Twelve blocks alternating dark (cinema) and light (snow). Every block pushes toward the quote. |
| Roadmap | Step 4. Blocks 1–2 exist as `HomeEntry` + `SnowDive`; 3–12 are still to do. |

Read the conventions and the source markers in [`README.md`](./README.md) first.

## SEO

| Slot | EN | ES |
|---|---|---|
| Title | `Arktic Fox \| AI Product Images, Ad Videos & UGC` **PDF** | `Arktic Fox \| Imágenes de producto, vídeos publicitarios y UGC con IA` **PDF** |
| Description | `AI-crafted product images, ad films and hyperreal UGC videos for brands that need more creative, faster, without the cost of a shoot.` **PROPOSED** | `Imágenes de producto, vídeos publicitarios y UGC hiperrealistas creados con IA. Más creatividades, más rápido y sin el coste de un rodaje.` **PROPOSED** |

Current values in `src/i18n/ui/*.ts` (`meta.homeTitle`, `meta.homeDescription`) are shorter placeholders and should be replaced with these.

## 1. Nav — transparent over the hero

No copy of its own beyond the labels, which already live in `src/i18n/ui/*.ts` under `nav.*`. Structure is specified in `docs/03-sitemap-i18n.md`.

| Slot | Key | EN | ES |
|---|---|---|---|
| Services dropdown | `nav.services` | `Services` **PDF** | `Servicios` **PDF** |
| Work (anchor to block 7) | `nav.work` | `Work` **PDF** | `Trabajos` **PROPOSED** |
| Process (anchor to block 8) | `nav.process` | `Process` **PDF** | `Proceso` **PROPOSED** |
| Pricing | `nav.pricing` | `Pricing` **PDF** | `Precios` **PDF** |
| Quote button | `nav.quote` | `Get a quote` **PDF** | `Pide presupuesto` **PDF** |

Dropdown items reuse the service page titles from block 4.

## 2. Hero — dark, full height

| Slot | Key | EN | ES |
|---|---|---|---|
| Eyebrow | `home.hero.eyebrow` | `AI CREATIVE STUDIO` **PDF** | `ESTUDIO CREATIVO CON IA` **PROPOSED** |
| Headline | `home.line1Lead` + `line1Emphasis` + `line2Lead` + `line2Emphasis` | `We don't only make *cool creatives*, we make *winning ads*.` Client, 2026-10-14 | `No solo hacemos *creatividades chulas*, hacemos *anuncios que ganan*.` **PROPOSED** |
| Subheadline | `home.hero.subhead` | `AI-crafted product images, ad films and hyperreal UGC videos for brands that need more creative, faster, without the cost of a shoot.` **PDF** | `Imágenes de producto, vídeos publicitarios y UGC hiperrealistas creados con IA, para marcas que necesitan más creatividades, más rápido y sin el coste de un rodaje.` **PDF** |
| Primary CTA | `shared.cta.quote` | `Get a quote` **PDF** | `Pide presupuesto` **PDF** |
| Secondary CTA | `shared.cta.work` | `See our work` **PDF** | `Ver nuestro trabajo` **PROPOSED** |
| Service card label | `home.hero.viewReel` | `View reel` **PDF** | `Ver reel` **PROPOSED** |

Three frosted-glass cards sit bottom right, one per service, each with a looping thumbnail and the `View reel` play label. Card titles reuse the service names.

### Headline alternatives

The client set the hero sentence on 2026-10-14. These five PDF lines stay approved and unused.

| # | EN | ES |
|---|---|---|
| 1 | Ads that *blend in*. Results that stand out. | Anuncios que se *camuflan*. Resultados que destacan. |
| 2 | Hidden in plain sight. Impossible to scroll past. | A plena vista. Imposibles de ignorar. |
| 3 | So real, no one sees the AI. Only the results. | Tan reales que nadie ve la IA. Solo los resultados. |
| 4 | Blend into the feed. Stand out in the numbers. | Se funden con el feed. Destacan en los números. |
| 5 | Native to the feed. Wild in performance. | Nativos del feed. Salvajes en resultados. |

The hero sentence above is what ships. These five stay on file if we switch back.

### Media

Muted looping fox film, full bleed, dark scrim on the left third for legibility. Poster image required. Prompts and the current frame-sequence stand-in are documented in `docs/04-motion.md` (see also ADR-010 → ADR-012, which supersede the PDF's wildlife shot).

A separate noindex prototype at `/hero-3d` loads `public/media/fox.glb` (ADR-022). It is not this block and it is not linked from the home.

## 3. Sector marquee

| Slot | Key | EN | ES |
|---|---|---|---|
| Marquee | `home.marquee.label` | `E-COMMERCE · FASHION · BEAUTY · FOOD & BEVERAGE · AUTOMOTIVE` **PDF** | `E-COMMERCE · MODA · BELLEZA · ALIMENTACIÓN · AUTOMOCIÓN` **PROPOSED** |
| Hint | `home.marquee.hint` | `Click a word to see the work` **PROPOSED** | `Pulsa una palabra para ver el trabajo` **PROPOSED** |

Continuous horizontal scroll, uppercase. No client logos, ever. The strip does not pause on hover. Each word opens a glass `WorkReel` (bottom-right, no dimmed backdrop) with a still or reel. Caption is `home.reel.note` (winter drop, not a mock disclaimer). A bottom-right hint (`home.marquee.hint`) says the words are clickable; it hides the moment the reel is open so it does not sit on the glass during the fade. `See the case` goes to the same case (`/work` · `/es/trabajo`).

## 4. Services — dark

| Slot | Key | EN | ES |
|---|---|---|---|
| Eyebrow | `home.services.eyebrow` | `WHAT WE CREATE` **PDF** | `LO QUE CREAMOS` **PROPOSED** |
| Headline | `home.services.headlineLead` + `headlineEmphasis` | `Three ways to *stand out*.` **PDF** | `Tres formas de *destacar*.` **PROPOSED** |
| Panel link | `shared.cta.explore` | `Explore` **PDF** | `Descubrir` **PROPOSED** |

Three large panels, video on hover, two lines of copy each.

| Panel | EN title | ES title | EN body | ES body |
|---|---|---|---|---|
| Product images | `Studio-grade product shots. *No studio required.*` **PDF** | `Fotos de producto de estudio. *Sin estudio.*` **PDF** | `Send us your product photos. We place them in any scene, season or style, ready for your store and your ads.` **PDF** | `Mándanos las fotos de tu producto. Las llevamos a cualquier escena, temporada o estilo, listas para tu tienda y tus anuncios.` **PROPOSED** |
| Ad videos | `Cinematic ads, *without the film crew.*` **PDF** | `Anuncios de cine, *sin equipo de rodaje.*` **PDF** | `15 to 30-second product films for social, web and pre-roll, built with AI and finished with an editor's eye.` **PDF** | `Vídeos de producto de 15 a 30 segundos para redes, web y pre-roll, creados con IA y acabados con ojo de editor.` **PROPOSED** |
| Hyperreal UGC | `Creators your audience trusts. *Built by AI.*` **PDF** | `Creadores en los que tu público confía. *Hechos con IA.*` **PDF** | `Hyperrealistic UGC-style videos with AI creators: testimonials, unboxings and tutorials, each with alternative hooks to test.` **PDF** | `Vídeos tipo UGC hiperrealistas con creadores de IA: testimonios, unboxings y tutoriales, cada uno con hooks alternativos para testear.` **PROPOSED** |

These exact strings are already in `src/i18n/ui/*.ts` as `home.product*`, `home.ads*`, `home.ugc*`, used by the entry card row. Reuse those keys rather than adding duplicates.

## 5. Before / after — light

| Slot | Key | EN | ES |
|---|---|---|---|
| Headline | `home.beforeAfter.headlineLead` + `headlineEmphasis` | `Same product. *Different league.*` **PDF** | `El mismo producto. *Otra liga.*` **PROPOSED** |
| Before label | `home.beforeAfter.before` | `Your photo` **PROPOSED** | `Tu foto` **PROPOSED** |
| After label | `home.beforeAfter.after` | `Arktic Fox` **PROPOSED** | `Arktic Fox` **PROPOSED** |
| Drag hint | `home.beforeAfter.hint` | `Drag to compare` **PROPOSED** | `Arrastra para comparar` **PROPOSED** |

Drag slider comparing a plain product photo against the Arktic Fox version. Two or three examples in tabs. **OPEN** — needs 2–3 real before/after pairs (launch checklist).

## 6. Why Arktic Fox — light

Four benefits. **No statistics** until there is real data. Not on the current dive — the pinned entry ends on the sector marquee. These four lines wait for a later home block.

| Slot | Key | EN | ES |
|---|---|---|---|
| Eyebrow | `home.why.eyebrow` | `Why Arktic Fox` **PROPOSED** | `Por qué Arktic Fox` **PROPOSED** |

| # | Key | EN title | ES title | EN body | ES body |
|---|---|---|---|---|---|
| 1 | `home.why.speed*` | `Speed` **PDF** | `Velocidad` **PROPOSED** | `From brief to first drafts in days, not weeks.` **PDF** | `Del brief a las primeras propuestas en días, no semanas.` **PROPOSED** |
| 2 | `home.why.cost*` | `Cost` **PDF** | `Coste` **PROPOSED** | `A fraction of a traditional shoot. No studio, no crew, no logistics.` **PDF** | `Una fracción de un rodaje tradicional. Sin estudio, sin equipo, sin logística.` **PROPOSED** |
| 3 | `home.why.testing*` | `Testing` **PDF** | `Testeo` **PROPOSED** | `Multiple hooks and variations per concept, so you can find the winner.` **PDF** | `Varios hooks y variaciones por concepto, para que encuentres el que funciona.` **PROPOSED** |
| 4 | `home.why.quality*` | `Brand-safe quality` **PDF** | `Calidad de marca` **PROPOSED** | `Reviewed by humans, on-brand every time.` **PDF** | `Revisado por personas, fiel a tu marca siempre.` **PROPOSED** |

The second half of each body line is **PROPOSED**; the PDF only gives the parenthetical ("from brief to first drafts in days", "a fraction of a traditional shoot", "multiple hooks and variations per concept", "reviewed by humans, on-brand every time").

## 7. Selected work — dark

| Slot | Key | EN | ES |
|---|---|---|---|
| Eyebrow | `home.work.eyebrow` | `SELECTED WORK` **PDF** | `TRABAJOS SELECCIONADOS` **PROPOSED** |
| Filter: all | `home.work.filterAll` | `All` **PROPOSED** | `Todo` **PROPOSED** |
| Service filters | — | Product images · Ad videos · UGC videos | Imágenes de producto · Vídeos publicitarios · Vídeos UGC |
| Sector filters | — | E-commerce · Fashion · Beauty · Food & beverage · Automotive | E-commerce · Moda · Belleza · Alimentación · Automoción |

Masonry gallery, filter chips by service and by sector, lightbox on click.

**OPEN** — the only real work is automotive. The launch checklist asks for 3–4 samples per service outside automotive. Until they exist, the gallery ships with placeholders; do not label a placeholder as client work.

## 8. Process — light

Four numbered steps on a horizontal line, one sentence each. Shared with the service pages, so keys are `shared.process.*`.

| # | EN title | ES title | EN body | ES body |
|---|---|---|---|---|
| 01 | `Brief` **PDF** | `Brief` **PDF** | `You tell us the product, the goal and the platforms. Send photos, brand guide and references.` **PROPOSED** | `Nos cuentas el producto, el objetivo y las plataformas. Nos mandas fotos, guía de marca y referencias.` **PROPOSED** |
| 02 | `Concept & script` **PDF** | `Concepto y guion` **PROPOSED** | `We propose the concepts, the scenes and the scripts with their alternative hooks.` **PROPOSED** | `Te proponemos los conceptos, las escenas y los guiones con sus hooks alternativos.` **PROPOSED** |
| 03 | `Creation` **PDF** | `Creación` **PROPOSED** | `We generate, direct and edit every image and video until it looks shot, not generated.` **PROPOSED** | `Generamos, dirigimos y editamos cada imagen y vídeo hasta que parezca rodado, no generado.` **PROPOSED** |
| 04 | `Review & delivery` **PDF** | `Revisión y entrega` **PROPOSED** | `You review, we iterate, and you get every format ready to publish.` **PROPOSED** | `Revisas, iteramos y recibes todos los formatos listos para publicar.` **PROPOSED** |

Only the four step titles come from the PDF. The sentences are **PROPOSED** and must match the revision rounds stated in `pricing.md`.

## 9. Packages — light

Three equal cards, none highlighted, no "most popular" badge. Full inclusion lists live in [`pricing.md`](./pricing.md); the home shows the same cards.

| Slot | Key | EN | ES |
|---|---|---|---|
| Headline | `home.packages.headline` | `Pick your pace.` **PROPOSED** | `Elige tu ritmo.` **PROPOSED** |
| À-la-carte link | `home.packages.custom` | `Need something specific? Build your own pack` → `/pricing#a-la-carte` **PDF** | `¿Necesitas algo concreto? Monta tu propio pack` → `/es/precios#a-la-carte` **PROPOSED** |
| VAT note | `shared.pricing.vatShort` | `Prices exclude VAT.` **PDF** | `Precios sin IVA.` **PDF** |

Every card carries the `Get a quote` button.

## 10. FAQ — light

Accordion. The PDF lists eight questions in English and no answers.

| # | EN question | ES question |
|---|---|---|
| 1 | `Will people notice it's AI?` **PDF** | `¿Se nota que es IA?` **PROPOSED** |
| 2 | `Can I use the content commercially?` **PDF** | `¿Puedo usar el contenido comercialmente?` **PROPOSED** |
| 3 | `Who owns the rights to the final files?` **PDF** | `¿De quién son los derechos de los archivos finales?` **PROPOSED** |
| 4 | `What do you need from me?` **PDF** | `¿Qué necesitas de mí?` **PROPOSED** |
| 5 | `How long does delivery take?` **PDF** | `¿Cuánto tarda la entrega?` **PROPOSED** |
| 6 | `How many revisions are included?` **PDF** | `¿Cuántas rondas de revisión incluye?` **PROPOSED** |
| 7 | `Do the UGC videos use real people?` **PDF** | `¿Los vídeos UGC usan personas reales?` **PROPOSED** |
| 8 | `Which formats do you deliver?` **PDF** | `¿Qué formatos entregas?` **PROPOSED** |
| 9 | `Do you work with brands outside Spain?` **PDF** | `¿Trabajas con marcas de fuera de España?` **PROPOSED** |

That is nine; the PDF asks for 6–8 in the accordion. Questions 1 and 2 are a single line in the PDF ("Will people notice it's AI? / Can I use the content commercially?") and can be merged or split. **OPEN** — Nabil picks the final set.

Answer 4 should name product photos, brand guide and links. Answer 7 must state plainly that the creators are AI-generated avatars and recommend labelling where platforms or regulations require it; it is the trust-and-compliance answer and cannot be softened.

**OPEN** — all nine answers. Turnaround, revision counts and rights wording are commercial commitments, so they need Nabil's sign-off rather than a plausible draft.

## 11. Final CTA — dark

| Slot | Key | EN | ES |
|---|---|---|---|
| Headline | `shared.cta.headlineLead` + `headlineEmphasis` | `Ready to *stand out*?` **PDF** | `¿Listo para *destacar*?` **PROPOSED** |
| Button | `shared.cta.quote` | `Get a quote` **PDF** | `Pide presupuesto` **PDF** |

Snowy landscape where only the fox's ears peek over a ridge. Reused as the last block of every service page and the pricing page.

## 12. Footer

| Slot | Key | EN | ES |
|---|---|---|---|
| Nav heading | `footer.sitemap` | `Sitemap` **PROPOSED** | `Mapa del sitio` **PROPOSED** |
| Legal heading | `footer.legal` | `Legal` **PROPOSED** | `Legal` **PROPOSED** |
| Email | — | `hello@arkticfox.ai` **PDF** | same |
| Instagram | — | `@arkticfox.ai` **PDF** | same |
| Copyright | `footer.copyright` | `© 2026 Arktic Fox` **PDF** | same |

Full logo lockup, nav links, Instagram, email, EN/ES switcher, and links to Legal notice, Privacy and Cookies.

## Site-wide, on this and every page

Floating WhatsApp button, bottom right.

| Slot | Key | EN | ES |
|---|---|---|---|
| Label | `shared.whatsapp.label` | `Chat with us` **PDF** | `Habla con nosotros` **PROPOSED** |
| Prefilled message | `shared.whatsapp.message` | `Hi Arktic Fox, I'd like a quote for…` **PDF** | `Hola Arktic Fox, quiero presupuesto para…` **PROPOSED** |

## Assets needed

- Hero fox film, 16:9 and 9:16, muted, plus poster. See `docs/04-motion.md`.
- Three looping service thumbnails for the hero glass cards.
- Three hover videos for the services panels.
- 2–3 before/after pairs.
- Gallery samples: 3–4 per service outside automotive.
- Final CTA plate: snow ridge with fox ears.
- Logo SVGs (white, gradient, black) and favicon.
- Open Graph image, 1200×630.
