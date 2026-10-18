# Get a quote

| | |
|---|---|
| URLs | `/quote` · `/es/presupuesto` |
| Goal | The only conversion on the site. Everything else funnels here. |
| Layout | Split. Left dark: pitch and reassurance. Right light: the form. |
| Roadmap | Step 7. |

## SEO

| Slot | EN | ES |
|---|---|---|
| Title | `Arktic Fox \| Get a quote` **PROPOSED** | `Arktic Fox \| Pide presupuesto` **PROPOSED** |
| Description | `Tell us about your product and goals. We'll come back with a clear quote, no commitment.` **PROPOSED** | `Cuéntanos tu producto y tus objetivos. Te contestamos con un presupuesto claro y sin compromiso.` **PROPOSED** |

## Left panel — dark

| Slot | Key | EN | ES |
|---|---|---|---|
| Headline | `quote.hero.headlineLead` + `headlineEmphasis` | `Tell us what you're *hunting* for.` **PDF** | `Cuéntanos qué estás *cazando*.` **PROPOSED** |
| Subheadline | `quote.hero.subhead` | `A few details and we'll send you a quote built for your product, not a template.` **PROPOSED** | `Unos datos y te mandamos un presupuesto hecho para tu producto, no una plantilla.` **PROPOSED** |

Three short reassurance points **PDF**:

| # | Key | EN | ES |
|---|---|---|---|
| 1 | `quote.reassurance.reply` | `Reply within 24 h` **PDF** | `Respuesta en 24 h` **PROPOSED** |
| 2 | `quote.reassurance.noCommitment` | `No commitment` **PDF** | `Sin compromiso` **PROPOSED** |
| 3 | `quote.reassurance.clearQuote` | `A clear quote` **PDF** | `Un presupuesto claro` **PROPOSED** |

**OPEN** — point 1 is an SLA. The PDF line is what the page shows. It is not confirmed. `shared.whatsapp.number` is empty, so the panel links to `hello@arkticfox.ai` until a real WhatsApp number exists.

WhatsApp link in this panel, same prefilled message as the floating button: `Hi Arktic Fox, I'd like a quote for…`

## Right panel — the form

Netlify Forms. Must exist as static HTML at build time.

| Attribute | Value |
|---|---|
| `name` | `quote` |
| `data-netlify` | `true` |
| Honeypot | hidden field, no visible captcha |
| `action` | `/thanks` (EN) · `/es/gracias` (ES) |

### Fields

Field order and types are **PDF**. Labels, placeholders and help text are **PROPOSED**.

| # | Key | EN label | ES label | Type | Required |
|---|---|---|---|---|---|
| 1 | `quote.form.name` | `Name` | `Nombre` | text | yes |
| 2 | `quote.form.email` | `Work email` | `Email de trabajo` | email | yes |
| 3 | `quote.form.company` | `Company / brand` | `Empresa / marca` | text | yes |
| 4 | `quote.form.website` | `Website or store URL` | `Web o URL de la tienda` | url | no |
| 5 | `quote.form.country` | `Country` | `País` | text | no |
| 6 | `quote.form.needs` | `What do you need?` | `¿Qué necesitas?` | checkboxes | yes |
| 7 | `quote.form.package` | `Package of interest` | `Paquete que te interesa` | radio or select | no |
| 8 | `quote.form.budget` | `Monthly creative budget` | `Presupuesto mensual de creatividades` | select | no |
| 9 | `quote.form.timeline` | `When do you need it?` | `¿Para cuándo lo necesitas?` | select | no |
| 10 | `quote.form.brief` | `Tell us about your product and goals` | `Cuéntanos tu producto y tus objetivos` | textarea | yes |
| 11 | `quote.form.references` | `Links to references` | `Enlaces de referencia` | textarea | no |

File uploads are deliberately out of scope at launch; field 11 is text only. **PDF**

### Options

Field 6, `What do you need?` — checkboxes, **PDF**:

| EN | ES |
|---|---|
| `Product images` | `Imágenes de producto` |
| `Ad videos` | `Vídeos publicitarios` |
| `Hyperreal UGC videos` | `Vídeos UGC hiperrealistas` |
| `Not sure yet` | `Aún no lo sé` |

Field 7, `Package of interest` — **PDF**: `Pilot` · `Growth` · `Scale` · `Custom` / `A medida`.

Field 8, `Monthly creative budget` — **PDF**. Values keep the EN/ES number formats from [`pricing.md`](./pricing.md):

| EN | ES |
|---|---|
| `< €500` | `< 500 €` |
| `€500–1,500` | `500–1.500 €` |
| `€1,500–3,000` | `1.500–3.000 €` |
| `€3,000+` | `3.000 €+` |

Field 9, `When do you need it?` — **PDF**:

| EN | ES |
|---|---|
| `ASAP` | `Cuanto antes` |
| `2–4 weeks` | `2–4 semanas` |
| `Just exploring` | `Solo estoy mirando` |

### Consent

| # | Key | EN | ES | Required |
|---|---|---|---|---|
| 1 | `quote.form.privacyConsent` | `I've read and accept the privacy policy.` **PROPOSED** | `He leído y acepto la política de privacidad.` **PROPOSED** | yes |
| 2 | `quote.form.newsletterConsent` | `Send me occasional work and ideas. No spam.` **PROPOSED** | `Mándame trabajos e ideas de vez en cuando. Sin spam.` **PROPOSED** | no |

Consent 1 is required by GDPR and must link to `/privacy` · `/es/privacidad`. The two checkboxes must be separate; a bundled consent is not valid. Consent 2 must default to unchecked.

### Submit and states

| Slot | Key | EN | ES |
|---|---|---|---|
| Submit | `quote.form.submit` | `Send request` **PDF** | `Enviar solicitud` **PROPOSED** |
| Sending | `quote.form.sending` | `Sending…` **PROPOSED** | `Enviando…` **PROPOSED** |
| Required-field error | `quote.form.errorRequired` | `This field is required.` **PROPOSED** | `Este campo es obligatorio.` **PROPOSED** |
| Invalid email | `quote.form.errorEmail` | `Check the email address.` **PROPOSED** | `Revisa la dirección de email.` **PROPOSED** |
| Submit failure | `quote.form.errorSubmit` | `Something went wrong. Write to hello@arkticfox.ai and we'll pick it up from there.` **PROPOSED** | `Algo ha fallado. Escríbenos a hello@arkticfox.ai y lo seguimos por ahí.` **PROPOSED** |

The submit button is the page's one gradient element (`CLAUDE.md` rule 6), so the nav quote button must not be gradient on this page.

## Accessibility

Every field needs a real `<label>`, not a placeholder. Errors are announced, tied to their input, and never communicated by colour alone. The required marker needs a text equivalent, not just an asterisk.

## Assets needed

- Background plate or still for the dark left panel.
- Calendly URL is **not** needed here — it belongs on [`thanks.md`](./thanks.md) only.
