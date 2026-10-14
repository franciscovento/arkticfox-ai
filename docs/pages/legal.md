# Legal pages

| | |
|---|---|
| URLs | `/legal-notice` · `/privacy` · `/cookies` |
| ES URLs | `/es/aviso-legal` · `/es/privacidad` · `/es/cookies` |
| Goal | Legal compliance in Spain and the EU. Not a sales surface. |
| Template | One shared template: light, max 720px text column, table of contents on the left on desktop. |
| Roadmap | Step 7. |

**The actual legal texts are not written and must not be drafted here.** The brief is explicit that the author is not a lawyer and that the final texts will be provided. Every body section below stays `[LEGAL TEXT]` until Nabil delivers real copy reviewed by an adviser. Generating plausible-sounding legal prose would be the single most damaging thing to invent on this site.

## Shared template

| Slot | Key | EN | ES |
|---|---|---|---|
| TOC heading | `legal.toc` | `On this page` **PROPOSED** | `En esta página` **PROPOSED** |
| Last updated | `legal.lastUpdated` | `Last updated: {date}` **PROPOSED** | `Última actualización: {date}` **PROPOSED** |
| Contact line | `legal.contact` | `Questions? Write to hello@arkticfox.ai` **PROPOSED** | `¿Dudas? Escríbenos a hello@arkticfox.ai` **PROPOSED** |

All three pages are `index, follow`, linked from the footer, and reachable in both languages.

## 1. Legal notice — LSSI

Mandatory in Spain. The brief lists exactly what it must contain.

| Required item | Status |
|---|---|
| Owner's name | **OPEN** |
| Tax ID (NIF/CIF) | **OPEN** |
| Registered address | **OPEN** |
| Contact email | `hello@arkticfox.ai` **PDF** |
| Registry data, if it's a company | **OPEN** |

**OPEN** — the blocking question from `docs/01-project-brief.md`: which legal entity invoices Arktic Fox? Nothing else on this page can be written until that is answered. This is the single hardest blocker on the launch checklist.

| Slot | Key | EN | ES |
|---|---|---|---|
| Heading | `legal.notice.heading` | `Legal notice` **PDF** | `Aviso legal` **PDF** |
| Body | — | `[LEGAL TEXT]` | `[LEGAL TEXT]` |

## 2. Privacy policy — GDPR

Must cover what the brief enumerates: what the form collects, what it's used for, how long it's kept, the user's rights, and the processors involved.

| Section | What it must state | Status |
|---|---|---|
| Data collected | The quote form fields, listed in [`quote.md`](./quote.md) | fields known, wording **OPEN** |
| Purpose | Responding to a quote request; newsletter only with separate consent | **OPEN** |
| Legal basis | Consent, per the required checkbox | **OPEN** |
| Retention | How long submissions are kept | **OPEN** |
| User rights | Access, rectification, erasure, objection, portability, complaint to the AEPD | **OPEN** |
| Processors | Netlify (hosting and Forms), the email provider, Calendly, WhatsApp Business | named in the brief, wording **OPEN** |

The processor list is derivable from the stack and should not be guessed at beyond it. If analytics are added later, this page changes with it.

| Slot | Key | EN | ES |
|---|---|---|---|
| Heading | `legal.privacy.heading` | `Privacy policy` **PDF** | `Política de privacidad` **PDF** |
| Body | — | `[LEGAL TEXT]` | `[LEGAL TEXT]` |

## 3. Cookie policy

The scope of this page depends on which analytics ship.

| Analytics choice | Banner needed? |
|---|---|
| Cookieless (Plausible, Netlify Analytics) | Practically not. The policy still describes any strictly necessary cookies. |
| Google Analytics or the Meta pixel | Yes, mandatory, with `Reject` as visually equal to `Accept`. |

**OPEN** — which analytics. This is a content decision as much as a technical one, because it determines whether the banner exists.

| Slot | Key | EN | ES |
|---|---|---|---|
| Heading | `legal.cookies.heading` | `Cookie policy` **PDF** | `Política de cookies` **PDF** |
| Body | — | `[LEGAL TEXT]` | `[LEGAL TEXT]` |

## Cookie banner

Minimal and GDPR-compliant. The brief is specific: `Accept` and `Reject` carry **equal visual weight**. A styled `Accept` next to a greyed-out `Reject` is a dark pattern and is not compliant.

| Slot | Key | EN | ES |
|---|---|---|---|
| Body | `cookieBanner.body` | `We use cookies to understand how the site is used. You choose.` **PROPOSED** | `Usamos cookies para entender cómo se usa la web. Tú eliges.` **PROPOSED** |
| Accept | `cookieBanner.accept` | `Accept` **PDF** | `Aceptar` **PDF** |
| Reject | `cookieBanner.reject` | `Reject` **PDF** | `Rechazar` **PDF** |
| Settings | `cookieBanner.settings` | `Settings` **PDF** | `Configurar` **PROPOSED** |
| Policy link | `cookieBanner.link` | `Cookie policy` → `/cookies` **PDF** | `Política de cookies` → `/es/cookies` **PDF** |

Neither button may be a gradient element, to stay within the one-gradient-per-viewport budget while the nav CTA is visible.

## AI content disclosure

Not a separate page, but a legal obligation that lives in the content. The EU AI Act requires realistic synthetic content to be identified as such. The site meets this through the visible transparency note on [`ugc-videos.md`](./ugc-videos.md) and the matching home FAQ answer.

The brief recommends having an adviser review this. Until then: state what the studio does, never give the client legal advice about their own obligations, and keep the note visible rather than buried.

## Assets needed

None. These pages are typography only, by design.
