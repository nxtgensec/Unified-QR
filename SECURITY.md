# Security Policy

## Supported versions

Security fixes are applied to the latest release and backported to the most
recent minor where the fix can land cleanly.

| Version | Supported     |
| ------- | ------------- |
| v1.x    | Supported     |
| Older   | Not supported |

## Reporting a vulnerability

Please do **not** open a public issue for security problems. Report them
privately instead:

- Email the maintainers with a subject prefixed with `[SECURITY]`, or
- Open a private advisory from the repository's **Security** tab
  (Settings > Security > New advisory) if you have access.

Include, where possible:

- The affected route, endpoint, or component.
- Steps to reproduce and a minimal proof of concept.
- The impact you observed and your suggested severity.

You can expect an acknowledgement within 72 hours and a fix plan shortly
after. We will credit you in the changelog unless you prefer to stay
anonymous.

## Scope

This policy covers the application code in this repository, the server
functions in `src/lib` and `src/integrations`, and the database policies in
`supabase/migrations`. It does not cover third-party packages, Supabase
platform infrastructure, or the Cashfree payment gateway — report issues with
those to the respective vendor.

## What we take seriously

- Broken row-level security that exposes another user's data.
- Server function abuse (e.g. payment session creation).
- Any way to read environment variables or secrets from the client.
- SSRF, injection, or logic flaws in the dynamic QR redirect path.
