<table>
  <tr>
    <td width="140" align="center">
      <img src="src/assets/UnifiedQR_Logo.png" width="120" alt="UnifiedQR logo" />
    </td>
    <td>
      <h1>UnifiedQR</h1>
      <h3>100% Free QR Code Generator</h3>
      <p>Design, generate &amp; track QR codes — no design tool, no developer.</p>
      <p>
        <a href="https://github.com/nxtgensec/Unified-QR/blob/main/LICENSE">
          <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" />
        </a>
        <img src="https://img.shields.io/badge/node-%3E%3D20-brightgreen" alt="Node.js 20+" />
        <img src="https://img.shields.io/badge/typescript-strict-3178c6?logo=typescript&logoColor=white" alt="TypeScript Strict" />
        <img src="https://img.shields.io/badge/version-0.0.3-8b5cf6" alt="Version" />
      </p>
      <p><em>One app. Every QR format. Real-time scan analytics. Ship-ready in 2 minutes.</em></p>
    </td>
  </tr>
</table>

---

<p align="center">
  <img src="src/assets/step-1-choose-type.jpg" width="240" alt="Choose a QR code type" />
  &nbsp;&nbsp;
  <img src="src/assets/step-2-customize.jpg" width="240" alt="Customize colors, shapes, and templates" />
  &nbsp;&nbsp;
  <img src="src/assets/step-3-download.jpg" width="240" alt="Download as PNG, SVG, JPG, WebP, or PDF" />
</p>

---

## Why UnifiedQR?

| Problem | UnifiedQR solves it |
| --- | --- |
| "I need a QR code but hate ugly generators" | 24 designer templates with dot, diamond, heart, star, and triangle shapes |
| "I printed a code but the URL changed" | Dynamic codes with editable destinations — reprint once, update forever |
| "I have no idea if anyone scanned it" | Per-code analytics: device, referrer, timestamp, growth %, peak hours |
| "I need 500 codes for my product launch" | Bulk CSV import with instant short-link export |
| "My team needs shared access" | Team workspaces with role-based permissions |

## Features

- **10 QR content types** — URL, PDF, Multi-URL, vCard contact, plain text, app store, SMS, email, phone, and social profile links.
- **Full design engine** — 24 templates, 7 body shapes (square, dot, rounded, diamond, star, heart, triangle), 3 eye styles, custom fg/bg colors, gradients with angle control, logo embedding, and frame text.
- **Multi-format export** — Download as SVG, PNG (1024px), JPG, WebP, or PDF in one click.
- **Dynamic short links** — Each code gets a `/r/:slug` redirect with pause, resume, and editable destination.
- **Scan intelligence** — Today/yesterday counts, growth %, device breakdown, top referrers, and a peak-hours heatmap.
- **Saved-code library** — Rename, re-download, delete, and view per-code stats from a single dashboard.
- **Bulk generation** — Upload a CSV of names and destinations; get dynamic codes back with a short-link CSV export.
- **Link pages (bio links)** — Create multi-link pages at `/p/:slug` with sections and drag-to-reorder items.
- **3-tier billing** — Free, Flex, and Pro plans with secure Cashfree checkout.
- **29-language i18n** — Auto-detect locale with full native-script support across the entire UI.

## How dynamic codes work

A dynamic QR code encodes a short slug, not your final URL. When someone
scans it:

1. `/r/:slug` looks up the code and verifies it is active.
2. A scan row is recorded (device, referrer, timestamp).
3. The visitor is redirected to the current destination.

Because the code itself never changes, you can update the destination,
pause, or reactivate — everything already printed keeps working. Row-level
security ensures only the owner can read scan history or modify the code.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start) (React 19, server functions) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/) on Radix |
| QR engine | `qrcode-generator` with a custom SVG renderer |
| Data & auth | [Supabase](https://supabase.com) (Postgres, RLS, Google OAuth) |
| Payments | [Cashfree](https://cashfree.com) Payments Gateway |
| Build | Vite + Nitro (Cloudflare Workers preset) |

## Quick start

```sh
git clone https://github.com/nxtgensec/Unified-QR.git
cd Unified-QR
npm ci
cp .env.local.example .env.local
npm run dev
```

Open **http://localhost:8080**. The home-page generator works with zero
configuration. Sign-in, dynamic codes, and billing require the environment
variables below.

> **Time to first QR code:** under 30 seconds.

## Environment variables

All configuration lives in `.env.local` and is never committed.

| Variable | Required | Purpose |
| --- | --- | --- |
| `SUPABASE_PROJECT_ID` | accounts | Supabase project reference |
| `SUPABASE_URL` | accounts | Supabase API URL (`https://<ref>.supabase.co`) |
| `SUPABASE_PUBLISHABLE_KEY` | accounts | Client-safe publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | server | Server-only — never expose to client |
| `VITE_SUPABASE_PROJECT_ID` | accounts | Exposed project reference |
| `VITE_SUPABASE_URL` | accounts | Exposed Supabase API URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | accounts | Exposed publishable key |
| `CASHFREE_ENV` | billing | `sandbox` or `production` |
| `CASHFREE_CLIENT_ID` | billing | Cashfree merchant client ID |
| `CASHFREE_CLIENT_SECRET` | billing | Cashfree merchant client secret |
| `CASHFREE_CURRENCY` | billing | Order currency (default `INR`) |
| `CASHFREE_RETURN_URL` | billing | Post-checkout redirect URL |
| `VITE_CASHFREE_ENV` | billing | Exposed Cashfree environment flag |

## Database

Migrations live in `supabase/migrations/` and are applied with the Supabase
CLI. **Never edit a merged migration** — always add a new file.

```sh
supabase login
supabase link --project-ref <your-project-ref>
npm run db:push
```

| Table | Purpose |
| --- | --- |
| `profiles` | User display name, avatar, plan — auto-created on first sign-in |
| `qr_codes` | Saved codes with type, payload, design fields, and dynamic-code fields |
| `scans` | One row per scan of a dynamic code |
| `link_pages` | Multi-link bio page definitions |
| `link_sections` | Sections within a link page |
| `link_items` | Individual links within sections |

Every table has row-level security enabled with policies scoped to the
owning user.

## Project structure

```text
.
├── src/
│   ├── components/
│   │   ├── app/             # Authenticated workspace shell
│   │   ├── qr/              # Generator widget, forms, type tabs
│   │   ├── site/            # Public header, footer, visitor badge
│   │   └── ui/              # shadcn/ui primitives
│   ├── lib/                 # QR engine, payloads, codes, i18n, admin
│   ├── routes/              # TanStack file-based routes
│   │   ├── _authenticated/  # Dashboard, create, analytics, billing, links
│   │   └── ...              # Public pages + /r/:slug redirect
│   └── integrations/        # Supabase + Cashfree clients
├── supabase/migrations/     # Versioned SQL (immutable once merged)
├── .github/                 # Issue & PR templates
└── vite.config.ts           # Vite + TanStack Start + Nitro
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server at http://localhost:8080 |
| `npm run build` | Production build (Cloudflare Workers) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint across the project |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm run db:push` | Apply Supabase migrations |

## Deployment

The production build targets **Cloudflare Workers** via Nitro's
`cloudflare-module` preset.

```sh
npm run build
npx wrangler deploy
```

Set environment variables in the Cloudflare dashboard. Static assets under
`public/` are emitted alongside the worker bundle.

## Roadmap

Planned and in-progress work — per-type landing pages, team collaboration,
plan-limit enforcement, multi-format downloads, enhanced analytics, and
more — is tracked in
[docs/development-status.md](docs/development-status.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow, code
conventions, and PR checklist.

## Security

To report a vulnerability, follow the guidance in
[SECURITY.md](SECURITY.md). Please do not open a public issue for security
problems.

## License

[MIT](LICENSE) &copy; 2026 UnifiedQR contributors
