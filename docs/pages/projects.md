# Projects

| | |
|---|---|
| URLs | `/projects` · `/es/proyectos` |
| Goal | Show real pieces — ad films, stills and UGC to camera — and send the visitor to a quote. |
| Roadmap | Gallery beside the sample `/work` case. Indexed. Linked from the built header. |

All copy is **PROPOSED**. Brands are named only as they appear in the frame. No client logos, testimonials or statistics. People on camera are AI avatars; that note stays next to the UGC case.

Stills with baked-in English type are pieces, not backgrounds.

## SEO

| Slot | Key | EN | ES |
|---|---|---|---|
| Title | `projects.title` | `Arktic Fox \| Projects` **PROPOSED** | `Arktic Fox \| Proyectos` **PROPOSED** |
| Description | `projects.description` | `Ad films, stills and talk-to-camera pieces. The brands you see are the ones in the frame.` **PROPOSED** | `Anuncios, stills y piezas a cámara. Las marcas que ves son las que salen en el encuadre.` **PROPOSED** |

## 1. Hero — dark

| Slot | Key | EN | ES |
|---|---|---|---|
| Eyebrow | `projects.eyebrow` | `Selected work` **PROPOSED** | `Trabajo seleccionado` **PROPOSED** |
| Headline | `projects.headingLead` + `headingEmphasis` | `Ads, stills *and to camera.*` **PROPOSED** | `Anuncios, stills *y a cámara.*` **PROPOSED** |
| Lead | `projects.lead` | `Square and vertical films, stills with the offer inside the frame, and UGC to camera.` **PROPOSED** | `Films en cuadrado y en vertical, stills con la oferta dentro del encuadre y UGC a cámara.` **PROPOSED** |

## 2. Marquee

| Slot | Key | EN | ES |
|---|---|---|---|
| Label | `projects.marquee` | `Ad films · Stills · Talk to camera` **PROPOSED** | `Anuncios · Stills · A cámara` **PROPOSED** |

Categories, not client names. No logos.

## 3. Cadillac

| Slot | Key | EN | ES |
|---|---|---|---|
| Eyebrow | `projects.cadillac.eyebrow` | `Cadillac` **PROPOSED** | `Cadillac` **PROPOSED** |
| Title | `projects.cadillac.title` | `Spot, offer and stills` **PROPOSED** | `Spot, oferta y stills` **PROPOSED** |
| Body | `projects.cadillac.body` | `A square Lyriq film, a vertical deals film, a talk to camera from the driver seat, and stills in red fog. One still carries the offer in the frame.` **PROPOSED** | `Un film cuadrado del Lyriq, un vertical de ofertas, un UGC a cámara desde el asiento y stills con niebla roja. Uno de los stills lleva la oferta dentro del encuadre.` **PROPOSED** |
| Avatar note | `projects.ugcNote` | `People on camera are AI avatars.` **PROPOSED** | `Quien sale a cámara es un avatar de IA.` **PROPOSED** |

The note sits in the case card, before the frames, because this case includes a talk-to-camera piece. The Jeep case repeats it.

Row labels for this case: `projects.row.motion` (`Ads and UGC` / `Anuncios y UGC`) and `projects.row.stills` (`Stills and static` / `Stills y anuncio estático`). Format chips use `projects.format.story` (`9:16`) and `projects.format.square` (`1:1`). **PROPOSED**.

| Piece | Kind | Ratio | File | Title key | EN title | ES title |
|---|---|---|---|---|---|---|
| Square Lyriq spot | Ad | 1:1 | `cadillac-1.mp4` + `cadillac-1.jpg` | `projects.piece.lyriq` | `Square Lyriq spot` | `Spot cuadrado del Lyriq` |
| Vertical deals spot | Ad | 9:16 | `cadillac-2.mp4` + `cadillac-2.jpg` | `projects.piece.deals` | `Vertical deals spot` | `Spot vertical de ofertas` |
| Driver UGC | UGC | 9:16 | `cadillac-ugc.mp4` + `cadillac-ugc.jpg` | `projects.piece.driver` | `From the driver seat` | `Desde el asiento` |
| Offer still | Ad | 9:16 | `autos-9x16-2.webp` | `projects.piece.cadillacOffer` | `Year-end offer` | `Oferta de fin de año` |
| Fog still | Still | 9:16 | `cadillac-image-9.webp` | `projects.piece.fogA` | `Red fog` | `Niebla roja` |
| Fog still | Still | 9:16 | `cadillac-image-12.webp` | `projects.piece.fogB` | `Red fog, second frame` | `Niebla roja, segundo encuadre` |
| Fog still | Still | 9:16 | `cadillac-image-14.webp` | `projects.piece.fogC` | `Red fog, third frame` | `Niebla roja, tercer encuadre` |

Alt keys are the title key plus `Alt` (`projects.piece.lyriqAlt`, and the same pattern for the rest). The offer still shows the English line `Best Year-End Cadillac Deals` inside the picture.

## 4. Kia

| Slot | Key | EN | ES |
|---|---|---|---|
| Eyebrow | `projects.kia.eyebrow` | `Kia` **PROPOSED** | `Kia` **PROPOSED** |
| Title | `projects.kia.title` | `Stills in red` **PROPOSED** | `Stills en rojo` **PROPOSED** |
| Body | `projects.kia.body` | `Two stills of a Kia in red light, with no type on the picture.` **PROPOSED** | `Dos stills de un Kia con luz roja, sin texto encima de la imagen.` **PROPOSED** |

| Piece | File | Title key | EN | ES |
|---|---|---|---|---|
| Still | `kia-image-7.webp` | `projects.piece.kiaA` | `Red light` | `Luz roja` |
| Still | `kia-image-9.webp` | `projects.piece.kiaB` | `Red light, second frame` | `Luz roja, segundo encuadre` |

## 5. Nissan

| Slot | Key | EN | ES |
|---|---|---|---|
| Eyebrow | `projects.nissan.eyebrow` | `Nissan` **PROPOSED** | `Nissan` **PROPOSED** |
| Title | `projects.nissan.title` | `The offer in the frame` **PROPOSED** | `La oferta en el encuadre` **PROPOSED** |
| Body | `projects.nissan.body` | `A vertical still of the grille. The line Best 2026 New Nissan Prices sits inside the picture, so the still is the ad.` **PROPOSED** | `Un still vertical de la parrilla. La línea Best 2026 New Nissan Prices va dentro de la imagen, así que el still es el anuncio.` **PROPOSED** |

| Piece | File | Title key | EN | ES |
|---|---|---|---|---|
| Ad still | `autos-9x16-1.webp` | `projects.piece.nissan` | `New prices` | `Precios nuevos` |

Row label: `projects.row.nissan` (`Static ad` / `Anuncio estático`) **PROPOSED**. The note beside the still reuses the piece title and alt. It does not add a new claim.

## 6. Jeep UGC

| Slot | Key | EN | ES |
|---|---|---|---|
| Eyebrow | `projects.jeep.eyebrow` | `Jeep UGC` **PROPOSED** | `Jeep UGC` **PROPOSED** |
| Title | `projects.jeep.title` | `To camera` **PROPOSED** | `A cámara` **PROPOSED** |
| Body | `projects.jeep.body` | `A woman in a Jeep with mountains behind her, and a mirror selfie with a lip product. The selfie is another UGC piece, this one for beauty.` **PROPOSED** | `Una mujer en un Jeep, con montañas detrás, y un selfie en el espejo con un producto de labios. El selfie es otra pieza UGC, esta de belleza.` **PROPOSED** |
| Avatar note | `projects.ugcNote` | `People on camera are AI avatars.` **PROPOSED** | `Quien sale a cámara es un avatar de IA.` **PROPOSED** |

| Piece | Kind | Ratio | File | Title key | EN | ES |
|---|---|---|---|---|---|---|
| Jeep | UGC | 9:16 | `jeep-ugc.mp4` + `jeep-ugc.jpg` | `projects.piece.jeep` | `In the Jeep` | `En el Jeep` |
| Selfie | UGC | 1:1 | `selfie-mirror.webp` | `projects.piece.selfie` | `Mirror selfie` | `Selfie en el espejo` |

Kind labels: `projects.kind.ad` `Ad` / `Anuncio`, `projects.kind.still` `Still` / `Still`, `projects.kind.ugc` `UGC` / `UGC`. **PROPOSED**.

## 7. Close

| Slot | Key | EN | ES |
|---|---|---|---|
| Line | `projects.note` | `Same craft, cut for the feed.` **PROPOSED** | `El mismo oficio, cortado para el feed.` **PROPOSED** |
| CTA | `nav.quote` | `Get a quote` | `Pide presupuesto` |

Outline button. The header quote button is the only brand gradient on the page.

## Nav

`nav.projects`: `Projects` / `Proyectos` **PROPOSED**. From `lg` it sits in the header beside the language switch. Below that it is a large link in the menu (`nav.menu` / `nav.menuClose`), with the language switch and the quote button. There is no footer yet.

## Media

Files live in `public/media/projects/`. Videos are muted, `playsinline`, with a poster, `preload="none"`, and play only when most of the frame is in view. Reduced motion leaves them paused on the poster. Controls stay so the film can still be started by hand.

Each brand is one section. The glass card (and the format chips under it) sticks on the left from the `lg` breakpoint. On the right, labelled rows hold the frames at a fixed height, tucked or offset the way the approved case-study row does. Cadillac is two rows (motion, then stills). Kia is one taller pair. Nissan pairs its single still with a small glass note that reuses the piece title and alt. Jeep pairs the film with the selfie. Below `lg`, each row is a horizontal strip with scroll-snap. CSS width stays at or under half the native pixel width (540, 536, 1080, or 512).
