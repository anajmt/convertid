# ConvertID website

Static, dependency-free site. Open `index.html` in a browser, or deploy the folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages).

## Source material

The site is built from the ConvertID Proposal (Claude artifact "ConvertID Proposal"), the ConvertID Brand Guide (Notion, "CONVERTID AGENCY"), and the client email screenshots embedded in the proposal. Brand choices follow the Brand Guide: navy, ice and brand blue palette, DM Sans, the official logo mark, and sentence-case bold headlines.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Full one-page site: hero, problem, services, process, tools, work, copy and goals, measurement, about, pricing, audit, FAQ, contact |
| `privacy.html` | Privacy Policy **draft** (must be reviewed before launch) |
| `assets/css/styles.css` | All styles. Brand colours are tokens at the top of the file |
| `assets/js/config.js` | Editable settings: contact details, form endpoint, founding offer |
| `assets/js/analytics.js` | Google Analytics 4: loads the tag and tracks form leads, WhatsApp, email and booking clicks |
| `assets/js/main.js` | Mobile menu, scroll reveal, project dialogs, form validation and submission |
| `assets/images/convertid-logo-mark.png` | Official logo mark (from the proposal) |
| `assets/images/ana-portrait.jpg` | Founder portrait (from the proposal) |
| `assets/images/work/` | 24 real client email screenshots, grouped by project prefix (`madre-`, `romeo-`, `op-`, `kloke-`, `ew-`, `hl-`) |

## Before launch: checklist

- [ ] **Connect the contact form** (see below). Until then the form shows a "not connected" message and does not claim to send.
- [ ] **Confirm the performance-fee term.** The proposal's measurement slide also states "from month 7, a 3% performance fee applies to email revenue above the 2x target". This is deliberately **not** shown on the site, because it is a commercial term not in the brief. Add it only once you have confirmed it is the offer you want to make publicly.
- [ ] **Confirm the Work copy.** Project objectives, goals and "what we designed" counts are taken from the proposal's project slides. Check them once more before launch.
- [ ] **Finalise `privacy.html`** with your form provider and the laws that apply to your markets (Australia, US, UK, Canada).
- [ ] Add a canonical URL and the production domain to the `<head>` once the domain is known.
- [ ] Check the Calendly link and the TikTok URL work from a fresh browser.

## Replacing images

Images are plain `<img>` tags, so to swap one, replace its `src` (and `alt`). Keep the aspect ratio: email screenshots are 600 × 1145 px, the portrait is 720 × 900 px. Export replacements as WebP or compressed JPEG to keep the page fast.

## Connecting the contact form

The site has no backend, so the form does not store or send anything by itself. To connect it:

1. Create a form endpoint. Options include **Formspree** (`https://formspree.io/f/<id>`), a serverless function you control, or any service that accepts a JSON `POST`.
2. Paste the URL into `assets/js/config.js`:
   ```js
   formEndpoint: 'https://formspree.io/f/your-form-id',
   ```
3. Submit a test message and confirm it arrives in `ana@convertid.agency`.

The form posts this JSON: `name`, `email`, `brand`, `website`, `monthly_email_revenue`, `need`, `message`, `source`. A hidden honeypot field (`company_fax`) blocks most bots.

Until `formEndpoint` is set, a valid submission shows: *"This contact form is not connected to an inbox yet, so your message has not been sent…"*, with the direct email address and a Calendly link. This is deliberate.

## Google Analytics

Set `gaMeasurementId` in `assets/js/config.js` to the GA4 Measurement ID (`G-…`). Leave it empty to turn analytics off. The tag never loads on `localhost` or from a local file.

Events sent (all pages, both languages):

| Event | When | Extra parameters |
| --- | --- | --- |
| `generate_lead` | Contact form sent successfully | `form_need`, `form_id` |
| `contact_whatsapp_click` | Any `wa.me` link | `link_location`, `link_text`, `link_url` |
| `contact_email_click` | Any `mailto:` link, including the one in the form's error message | same |
| `book_call_click` | Any Calendly link | same |

Every event also has `page_language` (`en` or `id`). `link_url` has its query string removed, so the pre-filled intro messages are never sent to Google. In GA4, mark `generate_lead`, `contact_whatsapp_click`, `contact_email_click` and `book_call_click` as key events (Admin → Events).

## Founding Client Partnership offer

The offer appears in the Pricing section (`#founding-offer`), and "Request a founding place" pre-selects the form's "Founding Client Partnership" option.

- **Hide it:** set `foundingOffer.enabled` to `false` in `assets/js/config.js`. The block is removed from the page at load.
- **Remove it permanently:** delete the `<aside id="founding-offer">…</aside>` block from `index.html`, and delete the `Founding Client Partnership` option from the `need` select.

## Changing contact details and links

Public links are in `assets/js/config.js` (email, Calendly, LinkedIn, TikTok). Several buttons link to the Calendly URL directly in `index.html`, so if the Calendly address changes, search the file for `calendly.com/anajumiati/30min` and replace each occurrence.

## Content notes

- **Results:** no performance numbers, revenue figures, open rates or testimonials are shown. Each project card states that results are shared once approved by the client. The "planned measures" lines are labelled as planned.
- **Goal wording:** the six-month goal is always described as a target, not a guarantee.
- **Pricing:** prices are USD with "AUD pricing available on request". SMS is noted as an optional add-on, priced separately.
- **Free email scorecard:** the proposal's "Start with the audit" steps include a free email scorecard. It is offered in the contact form and the next-steps list. The scorecard itself is delivered by you, not automated.

## Accessibility and performance

- Colour contrast follows the Brand Guide: navy and slate text on white and ice, brand blue buttons with white text, cyan only on navy.
- Keyboard: skip link, visible focus rings, native `<dialog>` for project details (Escape closes them), `<details>` for FAQ.
- Motion: scroll reveals, the hero float-in and the marquee are disabled when `prefers-reduced-motion` is set.
- External resources: Google Fonts (DM Sans) and Google Analytics 4 (only when `gaMeasurementId` is set). Calendly and social links open on click.
