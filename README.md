# Unified QR

A clone of the most professional structured QR code generator website, built on
the structure of https://www.the-qrcode-generator.com/.

## Stack

- TanStack Start + React + Tailwind v4
- Supabase (auth, database, RLS)
- Cashfree Payments (billing)

## Development

You need Node.js and npm (or bun).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

Copy `.env.local.example` to `.env.local` and fill in your Supabase project URL
and keys. The dev server runs at http://localhost:8080.

## Database

Schema lives in `supabase/migrations`. Apply it to a linked Supabase project with:

```sh
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```
