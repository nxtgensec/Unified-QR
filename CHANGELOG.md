# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- No planned changes yet. See the roadmap in `docs/development-status.md`.

## [1.0.0] - 2026-08-16

First tagged release.

### Added

- Static QR code generator for ten content types: URL, PDF, Multi-URL,
  Contact (vCard), Plain text, App stores, SMS, Email, Phone and Social.
- SVG renderer with three module shapes (square, dot, rounded) and matching
  eye styles, plus thirteen built-in color templates and custom color
  pickers.
- PNG (1024px) and SVG download from a live, debounced preview.
- Accounts with Google sign-in via Supabase Auth; profiles are created
  automatically on first sign-in.
- Saved-code dashboard: rename, re-download, delete, and per-code stats.
- Dynamic QR codes backed by `/r/:slug` short links — editable destination,
  pause/activate, public redirect that records a scan row.
- Scan tracking with a scans table and an analytics workspace view.
- Bulk generation from a CSV of names and destinations, with a CSV export of
  the new short links.
- Workspace pages for billing (Cashfree), settings, and a team beta view.
- Marketing pages: landing, pricing (Free / Flex / Pro), QR-code types
  overview, and contact.

### Fixed

- Rounded the brand logo corners at the source image so header and favicon
  edges no longer render with clipped squares.
- Rebuilt `public/favicon.ico` as a single 256x256 PNG-in-ICO using the brand
  logo.
- Removed the Lovable runtime integration and its build plugin; the app now
  builds with the stock TanStack Start Vite pipeline only.
- Removed a committed `.env` and scrubbed Lovable references from lockfiles,
  config, and docs.

### Security

- Enforced row-level security on `profiles`, `qr_codes`, and `scans`.
- Revoked public execution of internal database functions.
- Moved all secrets to environment variables; nothing sensitive is tracked.
