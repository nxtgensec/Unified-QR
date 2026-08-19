import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — UnifiedQR" },
      {
        name: "description",
        content: "UnifiedQR cookie policy. Learn about the cookies we use and why.",
      },
      { property: "og:title", content: "Cookie Policy — UnifiedQR" },
      {
        property: "og:description",
        content: "UnifiedQR cookie policy. Learn about the cookies we use and why.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "canonical", href: "https://qr.nxtgensec.org/cookies" },
      { rel: "alternate", hreflang: "en", href: "https://qr.nxtgensec.org/cookies" },
    ],
  }),
  component: CookiePolicyPage,
});

function CookiePolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">Cookie Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Effective date: August 17, 2026</p>

      <div className="prose prose-sm mt-8 space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground">1. What Are Cookies</h2>
          <p>
            Cookies are small text files placed on your device by websites you visit. They help the
            site remember your actions and preferences over time, so you don't have to re-enter them
            each time you visit.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">2. How UnifiedQR Uses Cookies</h2>
          <p>
            UnifiedQR uses a minimal set of cookies strictly necessary for the Service to function:
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 text-left font-bold text-foreground">Cookie</th>
                  <th className="py-2 text-left font-bold text-foreground">Purpose</th>
                  <th className="py-2 text-left font-bold text-foreground">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-2">sb-access-token</td>
                  <td className="py-2">Supabase authentication session token</td>
                  <td className="py-2">Session</td>
                </tr>
                <tr>
                  <td className="py-2">sb-refresh-token</td>
                  <td className="py-2">Refreshes the authentication session</td>
                  <td className="py-2">30 days</td>
                </tr>
                <tr>
                  <td className="py-2">unifiedqr:locale:chosen</td>
                  <td className="py-2">Remembers your language preference</td>
                  <td className="py-2">Never</td>
                </tr>
                <tr>
                  <td className="py-2">unifiedqr:visited:*</td>
                  <td className="py-2">Prevents duplicate visitor count increments</td>
                  <td className="py-2">1 day</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">3. What We Do NOT Do</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              We do <strong>not</strong> use advertising or marketing cookies
            </li>
            <li>
              We do <strong>not</strong> use third-party tracking cookies (Google Analytics,
              Facebook Pixel, etc.)
            </li>
            <li>
              We do <strong>not</strong> sell or share cookie data with advertisers
            </li>
            <li>
              We do <strong>not</strong> use cookies to build user profiles for targeted advertising
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">4. Managing Cookies</h2>
          <p>
            You can control and delete cookies through your browser settings. Disabling the
            authentication cookies will log you out and prevent you from using account features. The
            QR code generator works without cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">5. Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy when we add or modify cookies. Changes will be posted
            on this page with an updated effective date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">6. Contact</h2>
          <p>
            Email:{" "}
            <a
              href="mailto:unifiedqr@nxtgensec.org"
              className="text-brand font-semibold hover:underline"
            >
              unifiedqr@nxtgensec.org
            </a>
          </p>
        </section>
      </div>
    </article>
  );
}
