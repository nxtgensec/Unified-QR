# Contributing to UnifiedQR

Thanks for taking the time to contribute. UnifiedQR is a production web app, so
we keep a few ground rules to make reviews fast and the codebase easy to
reason about.

## Getting started

1. Fork the repository and clone your fork.
2. Install dependencies with `bun install` or `npm install`.
3. Copy `.env.local.example` to `.env.local` and fill in the values (see the
   [README](README.md#environment-variables) for what each variable means).
4. Start the dev server with `npm run dev`.

## Before you open a PR

- Run the quality checks and make sure they pass locally:
  - `npm run typecheck` — strict TypeScript with no errors.
  - `npm run lint` — ESLint without new errors.
  - `npm run format` — Prettier formatting (note: the repo has a backlog of
    pre-existing formatting issues; if `prettier --write .` touches files you
    did not change, revert those hunks).
- If you changed behavior, add or update tests where a test seam exists.
- Write a commit message that explains **why** the change exists, not just
  what it does. Keep the subject under 72 characters.

## Pull request checklist

- The PR describes the problem it solves and links the related issue, if any.
- Screenshots or a short screen recording are included for UI changes.
- New environment variables are documented in `.env.local.example` and the
  README, and never committed with real values.
- Database changes ship as a new file under `supabase/migrations/`, not as an
  edit to an existing migration.

## Database changes

Schema lives in `supabase/migrations`. Migrations are immutable once merged —
always add a new one. Apply them to your local or linked project with:

```sh
npm run db:push
```

## Code style

- Follow the conventions already in the file you are editing.
- Prefer small, focused files over large ones. Feature code lives in
  `src/components`, shared logic in `src/lib`, and integrations in
  `src/integrations`.
- Keep server-only code behind the TanStack server function boundary
  (`createServerFn`) and never import server-only modules into client code.
- Secrets are loaded from environment variables at runtime — never hardcode
  them.

## Reporting bugs

Open an issue using the bug report template. Include the route, browser and
OS, and the shortest steps to reproduce. If it involves a scan or a redirect,
include the slug (redact any personal data).
