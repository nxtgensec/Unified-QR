# TQRCG Clone — Development Status

Clone of https://www.the-qrcode-generator.com/ built on TanStack Start + Tailwind v4.
Everything is currently **frontend-only** (no backend, no accounts, no database).

---

## 1. Done

### Design system
- `src/styles.css` — semantic tokens: `--brand`, `--brand-soft`, `--surface`, `--premium`, `--success`, card shadow, radii, dark mode.
- Plus Jakarta Sans loaded via `<link>` in `src/routes/__root.tsx`.
- No hardcoded colors in components.

### Layout
- `src/components/site/Header.tsx` — sticky header, logo, nav (Products, QR Code types, Pricing, Resources, Blog), Log in / Sign up free CTAs, mobile menu.
- `src/components/site/Footer.tsx` — multi-column footer (product / company / resources / legal), socials, language selector.
- `src/routes/__root.tsx` — root layout, global meta/OG defaults, font links.

### QR engine (real, working, client-side)
- `src/lib/qr.ts` (258 lines)
  - Payload builders: URL, PDF link, Multi-URL, Contact (vCard), Plain Text, App, SMS, Email, Phone, Social.
  - 13 style templates (foreground / background / eye colors, dot shape).
  - SVG renderer with square / rounded / circle modules and eye styles.
- `src/components/qr/TypeTabs.tsx` — 10 type tabs with icons + taglines.
- `src/components/qr/TypeForm.tsx` — type-specific input forms for all 10 types.
- `src/components/qr/QrWidget.tsx` — live debounced preview, template picker, color pickers, premium toggles (locked upsell), PNG (1024px canvas) + SVG download.

### Pages (each with own `head()` — title, description, OG)
- `/` — hero generator, social-proof band (4.8 Google, 4M+ users), trust badges (SOC 2 / ISO 27001 / GDPR), 3-step how-to with generated images, "QR Codes explained", Chrome-extension band, 5-card bento "Why 4M+ users trust", QR types grid, FAQ accordion. JSON-LD WebApplication.
- `/pricing` — Free / Flex / Pro tier comparison.
- `/qr-code-types` — grid of all types.
- `/contact` — contact form with client-side validation only.

### Assets
- `src/assets/`: step-1-choose-type.jpg, step-2-customize.jpg, step-3-download.jpg, feature-analytics.jpg.

---

## 2. Not done / remaining

### Content & pages (visual gaps vs. original)
- [ ] `/products` and `/resources` and `/blog` nav links have no destination pages yet.
- [ ] Per-type landing pages (e.g. `/qr-code-types/url`, `/vcard-qr-code`) — original has one per type.
- [ ] Alternating image/text rows for each QR type on home (currently a simpler card grid).
- [ ] Customer logo wall / testimonials section.
- [ ] Legal pages: Terms, Privacy, Cookie policy.
- [ ] Language selector is decorative — no i18n.

### Generator features
- [ ] Logo upload in the centre of the QR code.
- [ ] Frame / call-to-action captions ("SCAN ME") around the code.
- [ ] Error-correction level selector and size/margin controls.
- [ ] JPG and PDF download formats (currently PNG + SVG only).
- [ ] Multi-URL type currently encodes a text list — original hosts a real link-list page (needs backend).
- [ ] PDF type takes a link, not a real file upload (needs storage).

### Backend-dependent (needs Lovable Cloud — not started)
- [ ] Sign up / log in / password reset.
- [ ] Dynamic QR Codes: short-link redirect service + editable destination.
- [ ] Scan analytics: scans, unique users, location, device, charts.
- [ ] Saved QR code dashboard / history.
- [ ] Team collaboration & invites.
- [ ] Payments / subscriptions for Flex & Pro plans.
- [ ] Contact form actually sending email.
- [ ] File storage for PDF and logo uploads.

### Polish / quality
- [ ] Responsive audit at 375–430px (current preview width) for the hero widget.
- [ ] Accessibility pass: focus states, labels on colour inputs, tab-list ARIA roles.
- [ ] `sitemap.xml`; `robots.txt` exists.
- [ ] og:image assets (absolute URLs) once published.
- [ ] No automated tests yet.

---

## 3. Open questions for you

1. How far do you want the clone to go — **marketing clone only**, or the **real product** (accounts, dynamic QR codes, scan analytics)? The latter needs Lovable Cloud enabled.
2. Should the missing nav pages (Products, Resources, Blog) be built out, or should the links be trimmed?
3. Do you want per-type landing pages (roughly 10 extra pages) for SEO parity with the original?
4. Should the contact form actually deliver email, or stay demo-only?
5. Keep the TQRCG name/branding, or rebrand to your own name and logo?
