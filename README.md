# UnifiedQR

**Design, generate, and track QR codes — static or dynamic — without a design tool or a developer.**

UnifiedQR is a full web application for creating professional QR codes. Choose
one of ten content types, restyle it with a built-in template or your own
colors, and download a crisp SVG or 1024px PNG in seconds. Create an account
and you get dynamic codes with editable short links, a saved-code library, and
per-code scan tracking.

<p align="center">
  <img src="src/assets/step-1-choose-type.jpg" width="200" alt="Choose your QR code type" />
  <img src="src/assets/step-2-customize.jpg" width="200" alt="Customize colors and shapes" />
  <img src="src/assets/step-3-download.jpg" width="200" alt="Download PNG or SVG" />
</p>

## Highlights

- **Ten content types** — URL, PDF, Multi-URL, Contact (vCard), Text, App
  stores, SMS, Email, Phone, and Social links.
- **Full design control** — thirteen preset templates, custom foreground and
  background colors, and square / dot / rounded modules with matching eye
  styles, rendered as clean SVG.
- **Instant downloads** — one click for SVG or 1024px PNG from a live,
  debounced preview.
- **Dynamic QR codes** — turn any code into a trackable short link under
  `/r/:slug`, edit the destination later, and pause or reactivate it without
  reprinting a single code.
- **Scan intelligence** — every redirect logs a scan (device, referrer, and
  timestamp) that feeds a workspace analytics view.
- **Saved library** — your codes are stored in your account, ready to rename,
  re-download, or delete.
- **Bulk generation** — upload a CSV of names and destinations and get dynamic
  codes back in one pass, with a short-link CSV to take away.
- **Simple billing** — Free, Flex, and Pro tiers with checkout handled
  securely by Cashfree.

## QR code types

| Type | What it encodes |
| --- | --- |
| URL | A web address, opened on scan |
| PDF | A link to a hosted document |
| Multi-URL | Several destinations encoded together |
| Contact | A vCard with name, phone, email, company, and website |
| Text | Free-form text or notes |
| App | iOS and/or Android store links |
| SMS | A pre-filled `SMSTO:` message to a phone number |
| Email | A `mailto:` link with optional subject and body |
| Phone | A `tel:` link |
| Social | Instagram, YouTube, and X profiles |

## How dynamic codes work

A dynamic QR code stores a short slug instead of your final URL. When someone
scans it, the `/r/:slug` route looks up the code, records a scan, and
redirects to the current destination. Because the code itself never changes,
you can update the destination, or pause and reactivate the code, whenever you
like — everything already printed keeps working.

The redirect and the scan log are protected by row-level security: any
visitor can be redirected to an active public code, but only its owner can
read the scan history or modify it.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start) (React 19, server functions) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/) components on Radix primitives |
| QR engine | `qrcode-generator` with a custom SVG renderer |
| Data & auth | [Supabase](https://supabase.com) (Postgres, Row-Level Security, Google OAuth) |
| Payments | [Cashfree](https://cashfree.com) Payments Gateway |
| Build | Vite with a Nitro server preset for Cloudflare Workers |

## Getting started

### Prerequisites

- Node.js 20 or newer
- A package manager — `npm` or `bun`
- The [Supabase CLI](https://supabase.com/docs/guides/cli) (for database work)
- A Supabase project, or a local Supabase instance

### Install and run

```sh
git clone https://github.com/devnxtgensec/unified-qr.git
cd unified-qr
npm install        # or: bun install
cp .env.local.example .env.local
npm run dev
```

Open http://localhost:8080. The home page generator works without any
configuration; sign-in, dynamic codes, and billing need the environment
variables below.

### Environment variables

All configuration lives in `.env.local` and is never committed. Server-side
variables are read by server functions; `VITE_`-prefixed variables are
exposed to the client.

| Variable | Required | Purpose |
| --- | --- | --- |
| `SUPABASE_PROJECT_ID` | accounts | Supabase project reference |
| `SUPABASE_URL` | accounts | Supabase API URL (`https://<ref>.supabase.co`) |
| `SUPABASE_PUBLISHABLE_KEY` | accounts | Client-safe publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | server | Server-only key — do not expose to the client |
| `VITE_SUPABASE_PROJECT_ID` | accounts | Exposed project reference |
| `VITE_SUPABASE_URL` | accounts | Exposed Supabase API URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | accounts | Exposed publishable key |
| `CASHFREE_ENV` | billing | `sandbox` or `production` |
| `CASHFREE_CLIENT_ID` | billing | Cashfree merchant client ID |
| `CASHFREE_CLIENT_SECRET` | billing | Cashfree merchant client secret |
| `CASHFREE_CURRENCY` | billing | Order currency (default `INR`) |
| `CASHFREE_RETURN_URL` | billing | Where Cashfree returns the customer after checkout |
| `VITE_CASHFREE_ENV` | billing | Exposed Cashfree environment flag |

## Database

The schema lives in `supabase/migrations` and is applied with the Supabase
CLI. Migrations are immutable once merged — changes always ship as new files.

```sh
supabase login
supabase link --project-ref <your-project-ref>
npm run db:push
```

Three tables back the product:

- `profiles` — user display name, avatar, and plan, auto-created on first sign-in.
- `qr_codes` — saved codes with type, payload, style template, and dynamic-code fields (`slug`, `destination`, `active`).
- `scans` — one row per recorded scan of a dynamic code.

Each table has row-level security enabled; policies scope reads and writes to
the owning user, with a narrow public path for active dynamic redirects.

## Project structure

```text
.
├── .github/                 # PR and issue templates
├── docs/                    # Development status and roadmap
├── public/                  # Static assets (favicon, robots.txt)
├── src/
│   ├── assets/              # Brand logo and marketing images
│   ├── components/
│   │   ├── app/             # Authenticated workspace shell
│   │   ├── qr/              # Generator widgets (preview, forms, tabs)
│   │   ├── site/            # Public header and footer
│   │   └── ui/              # shadcn/ui primitives
│   ├── hooks/               # Shared React hooks
│   ├── integrations/        # Supabase and Cashfree clients
│   ├── lib/                 # QR engine, payloads, code helpers
│   ├── routes/              # TanStack file-based routes
│   │   ├── _authenticated/  # Workspace pages (dashboard, create, …)
│   │   └── ...              # Public pages and the /r/:slug redirect
│   ├── router.tsx           # Router wiring
│   └── styles.css           # Design tokens and Tailwind entry
├── supabase/
│   ├── config.toml          # Supabase project config
│   └── migrations/          # Versioned SQL migrations
├── package.json
└── vite.config.ts           # Vite + TanStack Start + Nitro
```

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server at http://localhost:8080 |
| `npm run build` | Production build (Nitro Cloudflare Workers preset) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint across the project |
| `npm run format` | Format all source files with Prettier |
| `npm run typecheck` | Type-check with `tsc --noEmit` (strict) |
| `npm run db:push` | Apply Supabase migrations to the linked project |

## Deployment

The production build targets Cloudflare Workers via Nitro's
`cloudflare-module` preset. After a build, upload the generated output with
Wrangler and set the environment variables in the Cloudflare dashboard.
Static files under `public/` are emitted alongside the worker bundle.

## Quality gates

- TypeScript runs in strict mode; `npm run typecheck` must pass.
- ESLint is wired with React Hooks and Prettier plugins.
- Server functions validate input with Zod before touching the network or
  database.
- Database access goes through Supabase with row-level security — never
  through a service-role key on the client.

## Roadmap

Planned and in-progress work — including per-type landing pages, legal pages,
team collaboration, plan-limit enforcement, and more export formats — is
tracked in [docs/development-status.md](docs/development-status.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow, code
conventions, and the PR checklist.

## Security

To report a vulnerability, follow the guidance in
[SECURITY.md](SECURITY.md). Please do not open a public issue for security
problems.

## License

[MIT](LICENSE) © 2026 UnifiedQR contributors
