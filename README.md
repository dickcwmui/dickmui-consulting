# Dick Mui Consulting — enhancement preview

Implemented from the authoritative Pasted text.txt brief using the existing repository at https://github.com/dickcwmui/dickmui-consulting (starting commit db6ab1f). This is an incremental static-site enhancement. Original CSS tokens, typography, DM identity, hero illustration, capability section, service categories, stage-gate approach and existing contact destinations are retained.

## Preview

Run `npm run preview` with Node 22, then visit http://127.0.0.1:4173. The preview is local to this computer. No live website changes have been deployed or pushed.

## Changes

- Problem-led hero and four problem-to-service cards; outcome-focused expandable services.
- Three brief-supplied anonymised cases with individual detail pages and a data file for expansion.
- Horizontal desktop / vertical mobile process; six illustrative execution-document cards.
- Capability-led Asia network, client types, personal About and three ways to start.
- Separate customer and partner journeys; partner application opens the existing WhatsApp contact. Existing sponsorship enquiry links remain in a secondary disclosure on /partners.
- /start-a-project includes all requested fields, validation, consent, honeypot, delivery error handling, and success follow-up links. Query parameters preserve service and engagement context.
- /insights and six clearly labelled planned article pages. No fabricated dates or reading times; unpublished pages are noindex and absent from the sitemap.
- Shared sticky navigation, mobile CTA, expanded footer, draft privacy page, keyboard focus, skip link, Escape menu close, reduced motion.
- Page metadata, canonical links, Open Graph/social image, Person/ProfessionalService data, sitemap and robots.
- Optional analytics hooks for all eight requested events. No analytics provider or tracking cookies added; enquiry values are excluded from analytics.

## Editing and build

The site has no runtime frontend dependencies. Generated HTML is checked in. `build.py` is a small standard-library authoring generator using the preserved original HTML in templates/original.html. Run `python3 build.py` after changing its content/templates or data/case-studies.json. data/insights.json supplies planned titles and slugs; publishing actual articles requires approved content and updating the article rendering, publication metadata and BlogPosting schema.

`npm run build` copies only public assets into public/. The Vercel output directory is public; clean URLs are enabled. api/project.js is the Vercel Node function. Build scripts, original templates and tests are excluded from public output. Dashboard-level settings have not been inspected; verify they match vercel.json for a hosted preview.

## Form configuration before launch

No receiver, public email or CRM integration existed in the source. Form delivery therefore remains disabled by default. Dick must choose and authorise the actual destination before enabling delivery.

Set server-only Vercel environment variables:

- PROJECT_WEBHOOK_URL: trusted HTTPS endpoint which durably accepts project enquiry JSON. Do not point it at an arbitrary URL.
- PROJECT_WEBHOOK_TOKEN: optional bearer token for the receiver.
- PROJECT_FORM_ENABLED=true: enable only after privacy details and real delivery are verified.

An upstream 2xx response means the receiver accepted the enquiry; the receiver must not acknowledge before storing/queuing it. Test an actual receipt end-to-end before production. Timeouts return an unconfirmed-delivery warning to avoid claiming success. The receiver should deduplicate and apply production rate controls. No enquiry payload is logged by this function.

Analytics integration: listen for the browser event `dmc:analytics`, or assign `window.dmcAnalytics(name, properties)`. Install the chosen adapter before script.js so page-view hooks are captured. `insight_read` only fires for an element with data-published-insight; planned articles intentionally do not emit a reading event.

## Verification completed

- Static build passes; all 15 pages have one h1, metadata and valid internal links/anchors; no duplicate IDs.
- Five automated API tests cover method restrictions, cross-origin rejection, field validation, disabled delivery and mocked receiver success/failure.
- Browser checks at 1440px desktop and 390px mobile; additional overflow checks at 320px.
- Mobile menu opening, closing via Escape and aria-expanded behaviour verified.
- Form required-field validation, required challenge selection, disabled-backend failure and preserved input verified in browser.
- Success UI verified using a separate local mocked receiver with synthetic data. No enquiry was transmitted externally.
- Desktop five-column process and mobile vertical timeline checked. Case-study, partner and planned article views inspected.
- No Lighthouse score is claimed; hosted performance and real delivery still need verification after Vercel preview deployment.

Commands: `npm test`; `npm run build`; `python3 tests/check-site.py`.

## Dick's confirmation / content TODOs

1. Approve the preview and supplied anonymised case wording for publication.
2. Choose enquiry receiver/CRM and final privacy contact; confirm controller/company details, retention, processors and transfer information. The privacy page is explicitly a draft.
3. Supply an approved real professional photograph, if desired. A code placeholder is present; no stock identity is substituted.
4. Supply partner names/logos and permission before publishing them. No fictional partners appear.
5. Supply/review actual Insight articles; then add genuine publication dates, calculated reading times and Article schema.
6. Choose an analytics provider only if desired; optional hooks already exist.
7. Verify Vercel preview build and real form delivery, then approve production deployment. Do not push directly to main merely to preview: the original project may automatically deploy main to production.
