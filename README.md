# Dick Mui Consulting — enhancement preview

Implemented from the authoritative Pasted text.txt brief using the existing repository at https://github.com/dickcwmui/dickmui-consulting (starting commit db6ab1f). This is an incremental static-site enhancement. Original CSS tokens, typography, DM identity, hero illustration, capability section, service categories, stage-gate approach and existing contact destinations are retained.

## Preview

Run `npm run preview` with Node 22, then visit http://127.0.0.1:4173. This command runs a local preview. A hosted Vercel Preview is available at https://dickmui-consulting-vercel-git-website-enhance-291d8a-hkb-uy-buy.vercel.app/. Changes are pushed only to website-enhancement-preview, with draft PR https://github.com/dickcwmui/dickmui-consulting/pull/1. The production main branch is unchanged.

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

`npm run build` copies only public assets into public/. The Vercel output directory is public; clean URLs are enabled. api/project.js is the Vercel Node function. Build scripts, original templates and tests are excluded from public output. Vercel successfully built the preview from this branch. The dashboard confirms main is the production branch, and the hosted /api/project endpoint responds correctly.

## Form configuration before launch

The preview uses FormSubmit to forward validated enquiries to Dick’s chosen Gmail inbox. The recipient is kept in server-side Vercel configuration, not frontend HTML. Dick has confirmed activation of the address. Production delivery remains disabled until the preview is approved and production settings are added.

Set server-only Vercel environment variables:

- PROJECT_DELIVERY_PROVIDER=formsubmit and PROJECT_EMAIL_TO: the verified recipient; configured in Preview only. The handler requires FormSubmit JSON success and rejects activation/error responses even when HTTP status is 200.
- PROJECT_WEBHOOK_URL: alternative trusted HTTPS CRM endpoint when FormSubmit mode is not selected.
- PROJECT_WEBHOOK_TOKEN: optional bearer token for the receiver.
- PROJECT_FORM_ENABLED=true: enabled for Preview testing only. Production still requires confirmed privacy details and delivery.

In generic webhook mode, an upstream 2xx response means the receiver accepted the enquiry; the receiver must not acknowledge before storing/queuing it. Test an actual receipt end-to-end before production. Timeouts return an unconfirmed-delivery warning to avoid claiming success. The receiver should deduplicate and apply production rate controls. No enquiry payload is logged by this function.

Analytics integration: listen for the browser event `dmc:analytics`, or assign `window.dmcAnalytics(name, properties)`. Install the chosen adapter before script.js so page-view hooks are captured. `insight_read` only fires for an element with data-published-insight; planned articles intentionally do not emit a reading event.

## Verification completed

- Static build passes; all 15 pages have one h1, metadata and valid internal links/anchors; no duplicate IDs.
- Five automated API tests cover method restrictions, cross-origin rejection, field validation, disabled delivery and mocked receiver success/failure.
- Browser checks at 1440px desktop and 390px mobile; additional overflow checks at 320px.
- Mobile menu opening, closing via Escape and aria-expanded behaviour verified.
- Form required-field validation, required challenge selection, disabled-backend failure and preserved input verified in browser.
- Success UI verified using a separate local mocked receiver with synthetic data. No enquiry was transmitted externally.
- Desktop five-column process and mobile vertical timeline checked. Case-study, partner and planned article views inspected.
- Hosted Vercel homepage, mobile menu, Partners route and form API verified. Disabled delivery returns the intended explicit not-sent response.
- No Lighthouse score is claimed; hosted performance scoring and real delivery remain to be verified before production.

Commands: `npm test`; `npm run build`; `python3 tests/check-site.py`.

## Dick's confirmation / content TODOs

1. Approve the preview and supplied anonymised case wording for publication.
2. Enquiry recipient chosen and FormSubmit activation confirmed; finalise privacy contact and confirm controller/company details, retention, processors and transfer information. The privacy page is explicitly a draft.
3. Supply an approved real professional photograph, if desired. A code placeholder is present; no stock identity is substituted.
4. Supply partner names/logos and permission before publishing them. No fictional partners appear.
5. Supply/review actual Insight articles; then add genuine publication dates, calculated reading times and Article schema.
6. Choose an analytics provider only if desired; optional hooks already exist.
7. Verify Vercel preview build and real form delivery, then approve production deployment. Do not push directly to main merely to preview: the original project may automatically deploy main to production.
