# UnifiedQR — Codebase Analysis

> **Last updated:** 2026-08-17
> **Audit scope:** Every feature, server function, database table, and UI route in
> the project. Includes what works, what's broken, what's missing, and
> recommendations for production readiness.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Feature Status Matrix](#2-feature-status-matrix)
3. [Architecture Overview](#3-architecture-overview)
4. [Authentication Flow](#4-authentication-flow)
5. [QR Code Engine](#5-qr-code-engine)
6. [Dynamic Codes & Redirect Service](#6-dynamic-codes--redirect-service)
7. [Payment System (Cashfree)](#7-payment-system-cashfree)
8. [Billing Page](#8-billing-page)
9. [Team Collaboration](#9-team-collaboration)
10. [Analytics](#10-analytics)
11. [Bulk Import](#11-bulk-import)
12. [Settings & Profile](#12-settings--profile)
13. [SEO & Public Pages](#13-seo--public-pages)
14. [Internationalization (i18n)](#14-internationalization-i18n)
15. [Database Schema](#15-database-schema)
16. [Security Audit](#16-security-audit)
17. [Bugs Found & Fixed](#17-bugs-found--fixed)
18. [Known Issues & Risks](#18-known-issues--risks)
19. [Recommended Next Steps](#19-recommended-next-steps)
20. [File Reference](#20-file-reference)

---

## 1. Executive Summary

UnifiedQR is a **functional MVP** with all core features working end-to-end.
Google OAuth, QR generation (10 types), dynamic codes with scan tracking,
analytics, team collaboration, and Cashfree billing all work in production.

**What works well:**

- QR generation engine (10 types, 13 templates, SVG/PNG export)
- Dynamic code redirect service with scan logging
- Google OAuth + Supabase RLS
- Cashfree checkout (pay-what-you-want, INR)
- Team CRUD with role-based access
- Analytics dashboard with CSV export
- Bulk CSV import
- 40-language i18n with auto-translation

**Critical gaps before production:**

- No server-side dynamic code count enforcement on QR save (only bulk import)
- Team invite "Copy link" was broken (fixed in this audit — `55f9b49`)
- `notify_url` in Cashfree orders points to a route with no POST handler
- Contact form has no backend (client-side only)
- No automated tests
- No `sitemap.xml`

---

## 2. Feature Status Matrix

| Feature                    | Status        | Notes                                                               |
| -------------------------- | ------------- | ------------------------------------------------------------------- |
| Google OAuth sign-in       | **Working**   | `/auth`, auto-redirect to `/dashboard`                              |
| Session management         | **Working**   | `onAuthStateChange` + `getSession`, auto-refresh                    |
| Route protection           | **Working**   | `_authenticated/route.tsx` gates all `/dashboard/*` routes          |
| QR generation (10 types)   | **Working**   | URL, PDF, Multi-URL, Contact, Text, App, SMS, Email, Phone, Social  |
| 13 style templates         | **Working**   | Custom fg/bg colors, 3 module shapes, 3 eye shapes                  |
| PNG + SVG download         | **Working**   | 1024px canvas PNG, native SVG blob                                  |
| Save to account            | **Working**   | Static or dynamic (URL type only)                                   |
| Dynamic code redirect      | **Working**   | `/r/:slug` with scan logging (device + referrer)                    |
| Edit destination           | **Working**   | Dashboard → edit, no reprint needed                                 |
| Pause / reactivate         | **Working**   | Sets `active` flag, redirect respects it                            |
| Scan analytics             | **Working**   | 30-day chart, device breakdown, top codes, CSV export               |
| Dashboard                  | **Working**   | Saved codes, rename, download, delete, stats                        |
| Bulk CSV import            | **Working**   | Now with plan-limit check (fixed in this audit)                     |
| Team creation              | **Working**   | Plan-limited (Free: 1, Flex: 1, Pro: 99)                            |
| Team invites               | **Working**   | Now with correct token-based links (fixed in this audit)            |
| Accept invite              | **Working**   | `/team?invite=TOKEN`, email-matched, 7-day expiry                   |
| Roles (owner/admin/member) | **Working**   | Owner can't be removed; role-based action gating                    |
| Shared code library        | **Working**   | Codes saved to team visible to all members                          |
| Cashfree checkout          | **Working**   | Pay-what-you-want ₹9–₹9,99,999, INR                                 |
| Payment verification       | **Working**   | `verifyCashfreePayment` checks PAID status, updates `profiles.plan` |
| Plan display (sidebar)     | **Working**   | Fetches real plan from DB (fixed in this audit)                     |
| Plan display (billing)     | **Working**   | Shows current plan, allows upgrade                                  |
| Settings page              | **Working**   | Name update, CSV export, plan display                               |
| Admin panel                | **Working**   | Email-gated, user/code/scan stats                                   |
| 40-language i18n           | **Working**   | Auto-translate via MyMemory API, cached in localStorage             |
| Visitor badge              | **Working**   | Total count, live Realtime updates (leak fixed in this audit)       |
| Homepage                   | **Working**   | Green theme, social proof, JSON-LD, FAQ                             |
| Pricing page               | **Working**   | Free/Flex/Pro comparison, INR                                       |
| Contact page               | **Partial**   | Form UI works, no backend email delivery                            |
| Logo upload                | **Not built** | QR center logo feature missing                                      |
| Frame/CTA captions         | **Not built** | "SCAN ME" around codes                                              |
| JPG/PDF export             | **Not built** | Only PNG + SVG                                                      |
| Per-type landing pages     | **Not built** | 77 planned, 0 implemented                                           |
| Legal pages                | **Not built** | Terms, Privacy, Cookie policy                                       |
| `sitemap.xml`              | **Not built** | `robots.txt` exists                                                 |
| Automated tests            | **Not built** | No test framework configured                                        |

---

## 3. Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│  Browser (React 19 + TanStack Router)                       │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │  Pages      │  │  QR Widget   │  │  Auth (useAuth)    │   │
│  │  (routes/)  │  │  (components)│  │  (onAuthStateChange│   │
│  └─────┬──────┘  └──────┬───────┘  └─────────┬──────────┘   │
│        │                │                     │              │
│  ┌─────▼────────────────▼─────────────────────▼──────────┐   │
│  │  createServerFn RPC (auth-attacher adds Bearer token) │   │
│  └─────────────────────────┬─────────────────────────────┘   │
└────────────────────────────┼─────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼─────────────────────────────────┐
│  TanStack Start Server (Nitro / Cloudflare Workers)          │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  requireSupabaseAuth middleware                       │    │
│  │  - Validates JWT, creates scoped Supabase client      │    │
│  │  - Injects { supabase, userId, claims }               │    │
│  └─────────────────────────┬────────────────────────────┘    │
│                            │                                  │
│  ┌─────────────────────────▼────────────────────────────┐    │
│  │  Server Functions                                     │    │
│  │  cashfree.functions.ts  (create + verify orders)      │    │
│  │  team.functions.ts      (CRUD + invites)              │    │
│  │  admin.functions.ts     (admin stats)                 │    │
│  └────────┬────────────────────────────┬─────────────────┘    │
│           │                            │                      │
│  ┌────────▼──────┐            ┌───────▼─────────┐            │
│  │  Supabase     │            │  Cashfree API    │            │
│  │  (user client)│            │  (orders + GET)  │            │
│  └───────────────┘            └─────────────────┘            │
│  ┌───────────────┐                                            │
│  │  Supabase     │ (service role — via dynamic import)        │
│  │  (admin client)│                                           │
│  └───────────────┘                                            │
└──────────────────────────────────────────────────────────────┘
```

### Key architectural decisions

- **SSR disabled for app routes** — `_authenticated/route.tsx` sets `ssr: false`.
  All data fetching is client-side via Supabase browser client + RLS.
- **Server functions only for sensitive operations** — payment creation,
  verification, team CRUD, and admin stats use `createServerFn` with auth
  middleware. Everything else (QR save, analytics read, bulk insert) goes
  through the Supabase browser client directly.
- **Service role isolation** — `client.server.ts` uses `await import()` to
  prevent the service role key from leaking into the client bundle.
- **No SSR for QR widget** — The generator is entirely client-side (no SEO
  value for the widget itself).

---

## 4. Authentication Flow

### Files

- `src/hooks/useAuth.ts` — React hook, `onAuthStateChange` + `getSession`
- `src/integrations/supabase/auth-attacher.ts` — Client middleware, attaches Bearer token to every server function RPC
- `src/integrations/supabase/auth-middleware.ts` — Server middleware, validates JWT, creates scoped Supabase client
- `src/routes/auth.tsx` — Sign-in page (Google OAuth only)
- `src/routes/_authenticated/route.tsx` — Route guard, redirects unauthenticated users

### Flow

1. User clicks "Sign in with Google" → `signInWithOAuth` → Google consent
2. Callback hits `/auth` with hash params → `useEffect` parses errors
3. `onAuthStateChange` fires with session → `useAuth()` updates
4. `_authenticated/route.tsx` sees session → renders children
5. Every `createServerFn` call gets Bearer token via `auth-attacher`
6. Server middleware validates JWT format (3-part split), calls `getClaims()`, creates scoped client

### Verified working

- Post-login redirect to `/dashboard` ✅
- Route protection on all `_authenticated/*` routes ✅
- Session auto-refresh ✅
- Sign out clears cache + navigates to `/auth` ✅
- CSRF protection via `createCsrfMiddleware` ✅
- Admin client isolated via dynamic import ✅

### Issues found

| Issue                                                      | Severity | Status |
| ---------------------------------------------------------- | -------- | ------ |
| `admin.tsx` sign-out doesn't navigate or clear query cache | Low      | Open   |
| Auth redirect race: brief flash before `useEffect` fires   | Low      | Open   |

---

## 5. QR Code Engine

### Files

- `src/lib/qr.ts` — Payload builders (10 types), SVG renderer, download helpers
- `src/components/qr/TypeTabs.tsx` — Type selector tabs
- `src/components/qr/TypeForm.tsx` — Type-specific input forms
- `src/components/qr/QrWidget.tsx` — Live preview, template picker, download buttons

### QR Types

| Type        | Payload Format            | Form Fields                          |
| ----------- | ------------------------- | ------------------------------------ |
| `url`       | Raw URL                   | URL input                            |
| `pdf`       | Raw URL                   | URL input                            |
| `multi-url` | Newline-joined URLs       | Multiple URL inputs                  |
| `contact`   | vCard 3.0 string          | Name, phone, email, company, website |
| `text`      | Plain text                | Textarea                             |
| `app`       | Newline-joined store URLs | iOS URL, Android URL                 |
| `sms`       | `SMSTO:number:message`    | Phone, message                       |
| `email`     | `mailto:` URI with params | Email, subject, body                 |
| `phone`     | `tel:` URI                | Phone number                         |
| `social`    | Newline-joined URLs       | Instagram, YouTube, X                |

### Rendering

- Error correction: `M` (medium), auto mode selection
- Module shapes: square, dot, rounded
- Eye shapes: square, rounded, circle
- 13 templates with unique color/shape combos
- Debounced preview (180ms)

### Export

- **SVG:** Blob → `createObjectURL` → programmatic `<a>` click, revokes after 2s
- **PNG:** SVG → 1024px `Image` → `Canvas` → `toDataURL` → download
- Both work correctly in all tested browsers

---

## 6. Dynamic Codes & Redirect Service

### Files

- `src/lib/codes.ts` — `makeSlug()`, `shortUrl()`, `listCodes()`, `listScans()`
- `src/routes/r.$slug.tsx` — Redirect route (`/r/:slug`)
- `src/routes/dashboard.tsx` — Manage codes (edit destination, pause, delete)

### Flow

1. User clicks "Create dynamic, trackable link" on URL type
2. `makeSlug()` generates a 7-char random slug
3. Code saved to `qr_codes` with `is_dynamic: true`, `slug`, `destination`
4. Short link: `https://unifiedqr.app/r/{slug}`
5. On scan: `r.$slug.tsx` queries `qr_codes` → checks `is_dynamic + active` → logs scan (device, referrer) → `window.location.replace(destination)`

### Scan logging

- Table: `scans` (code_id, device [UA sliced to 200 chars], referrer, scanned_at)
- RLS: public can redirect, only owner reads scan data
- Redirect waits for scan insert (could be fire-and-forget for speed)

---

## 7. Payment System (Cashfree)

### Files

- `src/lib/cashfree.functions.ts` — `createCashfreeOrder`, `verifyCashfreePayment`
- `src/integrations/cashfree/client.ts` — Cashfree JS SDK v3 wrapper
- `src/lib/plans.ts` — Plan definitions (`free`/`flex`/`pro`)

### Order creation flow

1. User enters amount (₹9–₹9,99,999) on billing page
2. `createCashfreeOrder` server function:
   - Zod validates input (plan + amount as integer)
   - Extracts customer email/name from JWT claims
   - Generates unique `order_id`: `UQR-{timestamp}-{random}`
   - POST to Cashfree `/pg/orders` with:
     - `order_amount` as **string** (not number)
     - `customer_phone: "9999999999"` (required by Cashfree API)
     - `return_url` with `{order_id}` template + `plan` param
     - `notify_url` = plain URL (no template)
   - Returns `payment_session_id`
3. Client calls `startCashfreeCheckout(paymentSessionId)` → SDK `checkout()` method

### Payment verification flow

1. Cashfree redirects to `/billing?order_id=xxx&plan=flex`
2. Billing page detects `order_id` + `plan` in search params
3. `verifyCashfreePayment` server function:
   - GET `/pg/orders/{orderId}` from Cashfree API
   - Checks `order_status === "PAID"`
   - Updates `profiles.plan` via service role client
4. Page cleans URL with `history.replaceState`

### Cashfree SDK integration

- `Cashfree({ mode })` — function call (not constructor)
- `cashfree.checkout({ paymentSessionId, redirectTarget: "_self" })` — method (not `redirect()`)
- API version: `2025-01-01`
- Lazy-loaded via dynamic `<script>` tag

### Verified working

- Order creation ✅
- SDK checkout ✅
- Payment verification ✅
- Plan update in DB ✅
- Return URL handling ✅
- Amount as string ✅
- customer_phone included ✅

### Issues found

| Issue                                                                                | Severity | Status                |
| ------------------------------------------------------------------------------------ | -------- | --------------------- |
| `notify_url` points to `/billing` which has no POST handler (webhook is dead)        | Medium   | Open                  |
| No verification that `orderId` belongs to requesting user in `verifyCashfreePayment` | Medium   | Open                  |
| Hardcoded `customer_phone: "9999999999"`                                             | Low      | Open                  |
| `const plan = PLANS[data.plan]` was dead code                                        | Low      | **Fixed** (`55f9b49`) |

---

## 8. Billing Page

### File

- `src/routes/_authenticated/billing.tsx`

### Features

- Fetches real plan from DB via `fetchUserPlan` server function
- Detects return from Cashfree via search params
- Shows 3 plan cards: Free, Flex, Pro
- "Current plan" badge on active tier
- "Upgrade to {plan}" button on higher tiers
- Amount input with ₹9–₹9,99,999 range
- "Pay now" / "Pay ₹X" button states
- Verifying state with spinner during payment verification
- Auto-cleans URL after verification

### Plan logic

- Free → shows "Your plan" (disabled)
- Free → Flex: "Upgrade to Flex" (opens amount input)
- Free → Pro: "Upgrade to Pro" (opens amount input)
- Flex → Pro: "Upgrade to Pro" (opens amount input)
- Flex/Pro → Free: "Downgrade" (disabled, no downgrade path)
- Current plan always shows "Your plan"

---

## 9. Team Collaboration

### Files

- `src/lib/team.functions.ts` — 6 server functions (all behind `requireSupabaseAuth`)
- `src/routes/_authenticated/team.tsx` — Team dashboard UI

### Server functions

| Function       | Purpose                                                 |
| -------------- | ------------------------------------------------------- |
| `getTeamInfo`  | Load team, members, invites (with profiles)             |
| `createTeam`   | Create team (plan-limited: 1 for Free/Flex, 99 for Pro) |
| `inviteMember` | Generate invite link (plan-limited members: 3/5/99)     |
| `acceptInvite` | Join team via token (email-matched, 7-day expiry)       |
| `removeMember` | Remove member (owner/admin only, can't remove owner)    |
| `revokeInvite` | Revoke pending invite                                   |
| `deleteTeam`   | Delete team (owner only)                                |

### Roles

- **Owner:** Full control, can't be removed
- **Admin:** Can invite/remove members, can't delete team
- **Member:** Can view, save to team library, edit destination, pause

### Plan limits enforced

| Plan | Max teams | Max members |
| ---- | --------- | ----------- |
| Free | 1         | 3           |
| Flex | 1         | 5           |
| Pro  | 99        | 99          |

### Issues found

| Issue                                                                              | Severity     | Status                |
| ---------------------------------------------------------------------------------- | ------------ | --------------------- |
| Invite "Copy link" used `i.id` instead of `i.token` — all copied links were broken | **Critical** | **Fixed** (`55f9b49`) |
| `TeamInfo.invites` didn't include `token` field                                    | **Critical** | **Fixed** (`55f9b49`) |
| Dead double-set `setInviteEmail(...)`                                              | Low          | **Fixed** (`55f9b49`) |
| No "edit team name" feature                                                        | Low          | Open                  |
| `TEAM_LIMITS.pro = 99` instead of `Infinity`                                       | Low          | Open                  |

---

## 10. Analytics

### Files

- `src/routes/_authenticated/analytics.tsx` — Dashboard page
- `src/lib/codes.ts` — `listCodes()`, `listScans()` (client-side, RLS-scoped)

### Features

- 4 stat cards: total scans, last 7 days, dynamic codes, top device
- 30-day bar chart (CSS-based, no chart library)
- Device breakdown (iOS/Android/Desktop/Other) with progress bars
- Top 8 codes by scan count
- CSV export (scanned_at, code_name, short_link, device, referrer)

### Data flow

1. `listCodes()` — `supabase.from("qr_codes").select("*").order("created_at", {asc: false})`
2. `listScans(ids)` — `supabase.from("scans").select(...).in("code_id", ids).limit(5000)`

### Limits

- Hard cap: 5,000 scan rows per export
- No pagination or infinite scroll
- No team-awareness (shows only user's own codes)
- No caching between visits

---

## 11. Bulk Import

### File

- `src/routes/_authenticated/bulk.tsx`

### Flow

1. Upload/drop CSV → auto-detect headers (`name`, `destination`, `url`)
2. Parse → preview table (max 200 rows)
3. Click "Import" → plan-limit check → batch insert → download links CSV

### Plan limit enforcement (added in this audit)

- Counts existing dynamic codes before insert
- Free: 2, Flex: 25, Pro: unlimited
- Truncates to available slots, warns user
- Client-side check (not server-enforced) — a determined user could bypass via browser DevTools

### Issues found

| Issue                                         | Severity | Status                                    |
| --------------------------------------------- | -------- | ----------------------------------------- |
| No plan limit enforcement                     | **High** | **Fixed** (`55f9b49`) — client-side check |
| All bulk codes get `template_id: 1` hardcoded | Low      | Open                                      |
| Error details not shown on failure            | Low      | Open                                      |

---

## 12. Settings & Profile

### File

- `src/routes/_authenticated/settings.tsx`

### Features

- Display name update (saved to `profiles.display_name`)
- Plan display (fetched from DB)
- CSV export (all codes + scans, capped at 5,000 scans)
- Sign out
- Default QR template selector (saves to localStorage — **dead code**, never read by generator)

### Issues found

| Issue                                                                | Severity | Status |
| -------------------------------------------------------------------- | -------- | ------ |
| Default template selector saves to localStorage but nothing reads it | Low      | Open   |
| CSV export truncates at 5,000 scans silently                         | Low      | Open   |

---

## 13. SEO & Public Pages

### Routes

| Route            | File                           | Status                                     |
| ---------------- | ------------------------------ | ------------------------------------------ |
| `/`              | `src/routes/index.tsx`         | Working — hero, social proof, FAQ, JSON-LD |
| `/pricing`       | `src/routes/pricing.tsx`       | Working — 3-tier comparison                |
| `/qr-code-types` | `src/routes/qr-code-types.tsx` | Working — grid of 10 types                 |
| `/contact`       | `src/routes/contact.tsx`       | Working — form UI (no backend)             |
| `/auth`          | `src/routes/auth.tsx`          | Working — Google OAuth                     |
| `/admin`         | `src/routes/admin.tsx`         | Working — email-gated                      |

### Meta tags

All pages have proper `head()` with title, description, OG tags, and canonical URL. Root layout (`__root.tsx`) provides global fallbacks.

### Homepage features

- Green gradient hero with CTA
- Social proof banner (4.8 Google stars, "4M+ users")
- 3-step how-to with images
- FAQ accordion
- JSON-LD `WebApplication` schema with INR pricing
- QrWidget embed at `#generator`

### Visitor badge

- Shows total visitor count on homepage only
- Increments once per day (localStorage keyed)
- Live updates via Supabase Realtime
- Channel leak fixed in this audit (`55f9b49`)

### Missing

- Per-type landing pages (77 planned, 0 built)
- Legal pages (Terms, Privacy, Cookie policy)
- `sitemap.xml`
- Customer testimonials / logo wall
- `og:image` assets

---

## 14. Internationalization (i18n)

### File

- `src/lib/locale.tsx` — 40 languages, `LocaleProvider`, `useLocale` hook

### Features

- 40 languages with native names
- Auto-translate via MyMemory API (free, no key)
- Results cached in localStorage under `unifiedqr:tr:<locale>:<text>`
- `CHOKEN_KEY` tracks explicit user choice
- Language chooser: globe icon + badge ("EN"/"HI") in header
- First-time visitors see floating bottom chooser modal
- `formatMoney()` uses `Intl.NumberFormat` with `en-IN` locale
- Currency locked to INR (`detectCurrency()` always returns `"INR"`)

### Pricing page translations

- `pricing.freeFeatures` and `pricing.flexFeatures` are `string[]`
- Joined with `", "` by the `t()` function
- Hindi translations included

---

## 15. Database Schema

### Tables

**`profiles`** (auto-created on first sign-in)

| Column         | Type                   | Notes                               |
| -------------- | ---------------------- | ----------------------------------- |
| `id`           | uuid (FK → auth.users) | Primary key                         |
| `display_name` | text                   | User-editable                       |
| `plan`         | text                   | `free`/`flex`/`pro`, default `free` |
| `avatar_url`   | text                   | From Google OAuth                   |
| `created_at`   | timestamptz            | Auto                                |

**`qr_codes`**

| Column        | Type                   | Notes                              |
| ------------- | ---------------------- | ---------------------------------- |
| `id`          | uuid                   | Primary key                        |
| `user_id`     | uuid (FK → auth.users) | Owner                              |
| `team_id`     | uuid (FK → teams)      | Nullable, for shared codes         |
| `name`        | text                   | User-assigned label                |
| `type`        | text                   | QR type identifier                 |
| `content`     | text                   | Encoded payload                    |
| `is_dynamic`  | boolean                | false = static, true = trackable   |
| `slug`        | text                   | Unique, for `/r/:slug`             |
| `destination` | text                   | Current URL (editable for dynamic) |
| `active`      | boolean                | Can be paused                      |
| `template_id` | integer                | Style template                     |
| `fg` / `bg`   | text                   | Custom colors                      |
| `created_at`  | timestamptz            | Auto                               |

**`scans`**

| Column       | Type                 | Notes                            |
| ------------ | -------------------- | -------------------------------- |
| `id`         | uuid                 | Primary key                      |
| `code_id`    | uuid (FK → qr_codes) | Which code was scanned           |
| `device`     | text                 | User-agent (sliced to 200 chars) |
| `referrer`   | text                 | HTTP referrer                    |
| `scanned_at` | timestamptz          | Auto                             |

**`teams`**

| Column       | Type                   | Notes       |
| ------------ | ---------------------- | ----------- |
| `id`         | uuid                   | Primary key |
| `name`       | text                   | Team name   |
| `created_by` | uuid (FK → auth.users) | Owner       |
| `created_at` | timestamptz            | Auto        |

**`team_members`**

| Column      | Type                   | Notes                    |
| ----------- | ---------------------- | ------------------------ |
| `team_id`   | uuid (FK → teams)      |                          |
| `user_id`   | uuid (FK → auth.users) |                          |
| `role`      | text                   | `owner`/`admin`/`member` |
| `joined_at` | timestamptz            | Auto                     |

**`team_invites`**

| Column       | Type              | Notes                          |
| ------------ | ----------------- | ------------------------------ |
| `id`         | uuid              | Primary key                    |
| `team_id`    | uuid (FK → teams) |                                |
| `email`      | text              | Invitee email                  |
| `token`      | text              | Unique, used in invite URL     |
| `role`       | text              | `admin`/`member`               |
| `status`     | text              | `pending`/`accepted`/`revoked` |
| `invited_by` | uuid              | Who sent the invite            |
| `expires_at` | timestamptz       | 7 days from creation           |

**`visitor_counts`**

| Column  | Type    | Notes             |
| ------- | ------- | ----------------- |
| `day`   | date    | One row per day   |
| `count` | integer | Visitors that day |

### RPCs

- `increment_visitor_count(p_day)` — Upserts daily count
- `get_total_visitor_count()` — SUM across all days

### Migrations

All in `supabase/migrations/`, applied with `npm run db:push`. Immutable once merged.

---

## 16. Security Audit

### What's secure

- All server functions behind `requireSupabaseAuth` middleware
- JWT validated (3-part format) before creating scoped client
- Service role key never reaches client (dynamic import isolation)
- RLS on all tables — user can only read/write their own data
- CSRF protection via `createCsrfMiddleware`
- No hardcoded secrets — `VITE_` prefix for client-safe keys only
- Zod validation on all server function inputs
- Admin panel email-gated server-side

### Risks

| Risk                                                 | Severity | Details                                                                                                                               |
| ---------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Payment verification doesn't check orderId ownership | Medium   | User could theoretically use someone else's order_id to upgrade their own plan                                                        |
| No webhook handler for Cashfree notifications        | Medium   | `notify_url` sends POSTs to `/billing` which has no POST handler — server-side payment confirmation is one-way (client redirect only) |
| Bulk import limit is client-side only                | Medium   | A malicious user could bypass the dynamic code count check via browser DevTools                                                       |
| No rate limiting on server functions                 | Low      | Could be hit with rapid requests                                                                                                      |
| `customer_phone` is hardcoded                        | Low      | All orders have the same phone number                                                                                                 |

---

## 17. Bugs Found & Fixed

All bugs below were discovered during this audit and fixed in commit `55f9b49`.

### Critical

1. **Team invite "Copy link" was broken** — The UI used `i.id` (UUID) instead of `i.token` when building the invite URL. `acceptInvite` looks up by `token`, so every copied link was a dead end. Fixed by adding `token` to `TeamInfo.invites` type and using it in both `makeLink()` and `InviteActions`.

### High

2. **VisitorBadge Realtime channel never unsubscribed** — The cleanup function was returned from an async IIFE but never captured by the outer `useEffect`. The Supabase Realtime connection leaked on every unmount/remount. Fixed by hoisting the channel variable outside the IIFE and returning cleanup from the `useEffect` directly.

3. **Bulk import had no plan limit check** — Free users could import 200 dynamic codes in one shot, bypassing the 2-code limit. Fixed by adding a pre-insert check that counts existing dynamic codes and truncates to available slots.

### Medium

4. **Dead double-set in team invite** — `setInviteEmail(...)` was called twice in succession (once with a leading space, once without). The first call was dead code. Removed.

### Low

5. **Dead `plan` variable in cashfree functions** — `const plan = PLANS[data.plan]` was assigned but never used. Removed along with the unused `PLANS` import.

---

## 18. Known Issues & Risks

### Must fix before production

| Issue                                        | Impact                                                                                              |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| No server-side dynamic code count on QR save | Free users can create unlimited dynamic codes via the create page (only bulk import is guarded)     |
| `notify_url` has no POST handler             | Cashfree webhook notifications silently fail; payment confirmation relies solely on client redirect |
| No orderId ownership verification            | Theoretical privilege escalation via order hijacking                                                |

### Should fix

| Issue                                             | Impact                                                    |
| ------------------------------------------------- | --------------------------------------------------------- |
| Contact form has no backend                       | Users think they're sending a message but nothing happens |
| No `sitemap.xml`                                  | SEO penalty                                               |
| No `og:image` assets                              | Social sharing shows no preview image                     |
| Settings "default template" selector is dead code | Misleading UX                                             |
| Admin sign-out doesn't navigate                   | User stuck on admin page after signing out                |
| CSV export silently caps at 5,000 rows            | Data loss for high-volume users                           |

### Nice to have

| Issue                                             | Impact                            |
| ------------------------------------------------- | --------------------------------- |
| No automated tests                                | No regression safety net          |
| No per-type landing pages (77 planned)            | SEO gap vs. competitors           |
| No logo upload / frame captions                   | Feature gap vs. TQRCG             |
| No JPG/PDF export                                 | Feature gap                       |
| Redirect waits for scan insert before redirecting | Slower scan experience            |
| Analytics has no team-awareness                   | Team codes invisible in analytics |
| No responsive audit at 375–430px                  | Potential mobile UX issues        |
| No accessibility pass                             | WCAG compliance gap               |

---

## 19. Recommended Next Steps

### Priority 1: Production hardening

1. Add server-side dynamic code count enforcement in the QR save flow (either via a server function or a Postgres check constraint)
2. Add a webhook handler route for Cashfree `notify_url` notifications (or remove `notify_url` from the order payload)
3. Add orderId ownership verification in `verifyCashfreePayment` (check `customer_details.customer_id` matches user)
4. Build a real contact form backend (Supabase Edge Function or Resend/SendGrid)

### Priority 2: SEO & marketing

5. Add `sitemap.xml` generation
6. Create `og:image` assets
7. Build per-type landing pages (start with top 5: URL, vCard, PDF, WiFi, Social)
8. Build legal pages (Terms, Privacy, Cookie policy)

### Priority 3: Feature completeness

9. Logo upload in QR center (needs Supabase Storage)
10. Frame/CTA captions ("SCAN ME")
11. JPG and PDF export formats
12. Multi-URL landing page (hosted page with clickable links)
13. PDF file upload (needs Supabase Storage)

### Priority 4: Quality

14. Add automated tests (Vitest + Playwright)
15. Responsive audit at 375–430px
16. Accessibility pass (ARIA labels, focus states, tab roles)
17. Remove dead code (settings template selector)
18. Fix admin sign-out navigation

---

## 20. File Reference

### Core

| File                 | Lines | Purpose                                                   |
| -------------------- | ----- | --------------------------------------------------------- |
| `src/lib/qr.ts`      | 258   | QR engine: payloads, templates, SVG renderer, downloads   |
| `src/lib/codes.ts`   | 121   | Saved code helpers, CSV export, slug generation           |
| `src/lib/plans.ts`   | 7     | Plan definitions (free/flex/pro)                          |
| `src/lib/locale.tsx` | 350+  | 40 languages, i18n hook, auto-translation, INR formatting |

### Components

| File                                   | Lines | Purpose                                                   |
| -------------------------------------- | ----- | --------------------------------------------------------- |
| `src/components/qr/QrWidget.tsx`       | 290+  | Main generator widget (dark container, two-column layout) |
| `src/components/qr/TypeTabs.tsx`       | 63    | Type selector tabs (dark theme, green active)             |
| `src/components/qr/TypeForm.tsx`       | 295   | Type-specific input forms (10 types)                      |
| `src/components/site/Header.tsx`       | 120+  | Public header (logo, nav, auth CTA)                       |
| `src/components/site/Footer.tsx`       | 107   | Dark footer (CTA, 4-column links, social icons)           |
| `src/components/site/VisitorBadge.tsx` | 74    | Homepage visitor counter                                  |
| `src/components/app/AppShell.tsx`      | 183   | Authenticated workspace shell (sidebar, nav, plan badge)  |

### Server functions

| File                            | Lines | Purpose                                        |
| ------------------------------- | ----- | ---------------------------------------------- |
| `src/lib/cashfree.functions.ts` | 161   | Cashfree order creation + payment verification |
| `src/lib/team.functions.ts`     | 401   | Team CRUD, invites, roles                      |
| `src/lib/admin.functions.ts`    | 80+   | Admin stats (users, codes, scans)              |

### Routes (authenticated)

| File                                      | Purpose                             |
| ----------------------------------------- | ----------------------------------- |
| `src/routes/_authenticated/dashboard.tsx` | Saved codes list, management        |
| `src/routes/_authenticated/create.tsx`    | QR creation page                    |
| `src/routes/_authenticated/analytics.tsx` | Scan analytics dashboard            |
| `src/routes/_authenticated/bulk.tsx`      | CSV bulk import                     |
| `src/routes/_authenticated/team.tsx`      | Team management                     |
| `src/routes/_authenticated/billing.tsx`   | Plan management + Cashfree checkout |
| `src/routes/_authenticated/settings.tsx`  | Profile, export, preferences        |

### Routes (public)

| File                           | Purpose                              |
| ------------------------------ | ------------------------------------ |
| `src/routes/index.tsx`         | Homepage (hero, social proof, FAQ)   |
| `src/routes/pricing.tsx`       | Pricing comparison                   |
| `src/routes/qr-code-types.tsx` | QR type showcase                     |
| `src/routes/contact.tsx`       | Contact form                         |
| `src/routes/auth.tsx`          | Google OAuth sign-in                 |
| `src/routes/r.$slug.tsx`       | Dynamic code redirect + scan logging |

### Database

| Migration                                                         | Purpose                       |
| ----------------------------------------------------------------- | ----------------------------- |
| `supabase/migrations/20260816120000_teams_and_shared_library.sql` | Teams, members, invites, RLS  |
| `supabase/migrations/20260816140000_visitor_counts.sql`           | Visitor tracking table + RPCs |
| `supabase/migrations/20260816150000_total_visitor_count.sql`      | Total visitor count RPC       |
