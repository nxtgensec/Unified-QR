# UnifiedQR — Agent Guide

> [!IMPORTANT]
> This project runs on its own Supabase project (auth + database). Env config
> lives in `.env` / `.env.local` — never commit real secrets. Payments use
> Cashfree (see `src/lib/cashfree.functions.ts`).

## Repo layout

- `src/routes/` — TanStack file-based routing. The only root layout is
  `src/routes/__root.tsx`; authenticated pages live under
  `src/routes/_authenticated/`. Never create `src/pages/` or `app/layout.tsx`
  (those are Next.js/Remix conventions). `routeTree.gen.ts` is generated —
  do not edit by hand.
- `src/components/qr/` — generator engine (widget, type forms, tabs).
- `src/lib/` — shared logic (`qr.ts` payload builders + SVG renderer,
  `codes.ts` saved-code helpers, `cashfree.functions.ts` server function).
- `src/integrations/supabase/` — Supabase clients (server + browser) and
  typed schema. `src/integrations/cashfree/` — Cashfree client.
- `supabase/migrations/` — versioned SQL. Migrations are immutable once
  merged; always add a new file. Apply with `npm run db:push`.
- `docs/development-status.md` — what is built, what remains, locked
  decisions, and the roadmap.

## Conventions

- `npm run typecheck` (strict `tsc --noEmit`) and `npm run lint` before
  finishing work; keep Prettier formatting consistent (`.prettierrc`).
- Server-only code must stay behind the `createServerFn` boundary and must
  never be imported from client components (enforced by Vite import
  protection).
- Do not edit existing migrations; add a new migration instead.
- No hardcoded secrets. Client-safe keys are `VITE_`-prefixed; everything
  else stays server-side in `.env.local`.
