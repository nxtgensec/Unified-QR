# Clone of The QR Code Generator (TQRCG)

Build a faithful, fully working clone of the-qrcode-generator.com homepage plus supporting pages, with a real working QR generator (not a mockup).

## Pages

- `/` — Home: full landing page, matching section order of the original
- `/pricing` — plan comparison (Free / Flex / Pro-style tiers)
- `/qr-code-types` — grid of all QR types
- `/contact` — contact form (client-side validation only)

## Home page sections (in original order)

1. Sticky header: logo, nav (Products, QR Code types, Pricing, Resources, Blog), "Log in" + "Sign up free" CTA, mobile menu
2. Hero generator widget — the centerpiece:
   - Left: horizontal type tab strip (URL, PDF, Multi-URL, Contact, Plain Text, App, SMS, Email, Phone, Social) with icons
   - Type-specific input form (URL field, vCard fields, SMS number+message, etc.)
   - Toggles: "Track your scans" and "Remove watermark" marked premium (locked, shows upsell tooltip)
   - Right: live QR preview card, 13 style template thumbnails, color pickers, Download button (PNG + SVG)
3. Social-proof band: Google rating 4.8, "Trusted by 4M+ users", Sign up free, "No credit card required"
4. Trust/compliance badges row: SOC 2 Type II, ISO 27001, GDPR
5. "How to create a free QR Code in 3 simple steps" — numbered steps with images
6. "QR Codes explained" — What is a QR Code / Why used in 2026 / How to scan (numbered list)
7. Chrome extension promo band with CTA
8. "Why 4 Million+ Users Trust TQRCG" — 5 feature cards in a bento layout (Track every scan, Free dynamic QR Codes, Collaborate with your team, 24/7 support, Pay for what you use)
9. "What types of QR Codes can you create for free?" — alternating image/text rows for each type
10. FAQ accordion
11. Large multi-column footer with product/company/resources/legal columns, language selector, socials

## Working QR generator behaviour

- Real encoding via a client-side QR library, rendered to SVG so PNG and SVG downloads are both crisp
- Live re-render on every input change (debounced)
- Payload builders per type: URL, mailto, SMS, tel, vCard contact, plain text, multi-URL (renders a link-list preview page payload as text), app/social links
- Style templates change foreground/background/eye colors and module shape
- Downloads: PNG (canvas rasterise, 1024px) and SVG, generated fully in the browser
- Watermark drawn on the free preview unless the premium toggle is unlocked (stays locked, matching the original's upsell)

## Design system

Match the original's visual language via tokens in `src/styles.css` (no hardcoded colors):
- Deep navy/near-black text on white, saturated blue primary for CTAs, soft grey section surfaces, generous rounding on cards, soft elevation shadows
- Clean geometric sans typography loaded via `<link>` in the root route
- Illustrative section images generated as assets

## Technical notes

- TanStack Start file routes; each route gets its own `head()` with unique title/description/OG tags
- QR generation and downloads are 100% client-side — no backend, no accounts, no database (auth/dashboard/analytics from the original are represented as UI + CTAs only)
- Hero widget split into small components: `TypeTabs`, `TypeForm`, `QrPreview`, `TemplatePicker`, `DownloadBar`
- Images: hero step screenshots, feature cards, and type illustrations generated as local assets; QR type icons as inline SVG components
- Shared `Header`/`Footer` rendered from `__root.tsx`

## Out of scope

Sign-up/login, dynamic QR redirects, scan analytics, team collaboration, payments — these are visual/CTA only, since they require a backend the original runs on its own servers.
