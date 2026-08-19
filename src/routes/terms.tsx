import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — UnifiedQR" },
      {
        name: "description",
        content:
          "UnifiedQR terms of service. Read the rules and guidelines for using our QR code platform.",
      },
      { property: "og:title", content: "Terms of Service — UnifiedQR" },
      {
        property: "og:description",
        content:
          "UnifiedQR terms of service. Read the rules and guidelines for using our QR code platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "canonical", href: "https://qr.nxtgensec.org/terms" },
      { rel: "alternate", hreflang: "en", href: "https://qr.nxtgensec.org/terms" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Effective date: August 17, 2026</p>

      <div className="prose prose-sm mt-8 space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using UnifiedQR (qr.nxtgensec.org) and its associated services (the
            "Service"), you agree to be bound by these Terms of Service. If you do not agree, do not
            use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">2. Description of Service</h2>
          <p>
            UnifiedQR provides a free web-based tool for creating, customising, downloading and
            managing QR codes. The Service includes static QR code generation, dynamic QR code
            management with short links, scan analytics, team collaboration features and
            payment-based subscription plans.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">3. Account Registration</h2>
          <p>
            Some features require signing in via Google OAuth. You are responsible for maintaining
            the security of your account and for all activities that occur under your account. You
            must be at least 16 years old to create an account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">4. Free and Paid Plans</h2>
          <p>
            Static QR codes are provided free of charge with no limits. Dynamic QR codes and
            advanced features require a paid subscription (Flex or Pro). Prices are listed in INR
            and include applicable taxes. We reserve the right to modify pricing with 30 days'
            notice.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">5. Subscriptions and Payments</h2>
          <p>
            Paid subscriptions are processed via Cashfree Payments. By subscribing, you authorise
            recurring charges to your payment method. Subscriptions renew automatically unless
            cancelled at least 24 hours before the renewal date. See our{" "}
            <Link to="/refund" className="text-brand font-semibold hover:underline">
              Refund Policy
            </Link>{" "}
            for details.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">6. User Content</h2>
          <p>
            You retain ownership of all QR code data and content you create using the Service. By
            creating content, you grant UnifiedQR a limited licence to store, process and display
            your content solely for operating the Service. We will never use your QR code content
            for marketing or sell it to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">7. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the Service for any unlawful purpose</li>
            <li>Create QR codes that link to malware, phishing sites or harmful content</li>
            <li>Attempt to circumvent usage limits or access controls</li>
            <li>Reverse engineer, decompile or extract source code from the Service</li>
            <li>Use automated tools to scrape, crawl or overload the Service</li>
            <li>Resell the Service without written authorisation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">8. Intellectual Property</h2>
          <p>
            The Service, including its design, code, branding and documentation, is the intellectual
            property of UnifiedQR. QR codes you create are yours. You may use generated QR codes
            commercially without attribution.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">9. Service Availability</h2>
          <p>
            We strive for high availability but do not guarantee uninterrupted service. We may
            perform maintenance, updates or temporary suspensions with reasonable notice. We are not
            liable for any data loss or business interruption.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">10. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, UnifiedQR shall not be liable for any indirect,
            incidental, special, consequential or punitive damages arising from your use of the
            Service. Our total liability shall not exceed the amount you paid us in the 12 months
            preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">11. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless UnifiedQR and its operators from any claims,
            losses or damages arising from your use of the Service or violation of these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">12. Termination</h2>
          <p>
            You may delete your account at any time from the Settings page. We may suspend or
            terminate your access if you violate these Terms, with or without notice. Upon
            termination, your data will be deleted per our{" "}
            <Link to="/privacy" className="text-brand font-semibold hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">13. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India. Any disputes shall be resolved in the
            courts of India.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">14. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will be notified via email
            or a banner on the website. Your continued use after changes take effect constitutes
            acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">15. Contact</h2>
          <p>
            Email:{" "}
            <a
              href="mailto:unifiedqr@nxtgensec.org"
              className="text-brand font-semibold hover:underline"
            >
              unifiedqr@nxtgensec.org
            </a>
            <br />
            Website:{" "}
            <a
              href="https://qr.nxtgensec.org/contact"
              className="text-brand font-semibold hover:underline"
            >
              qr.nxtgensec.org/contact
            </a>
          </p>
        </section>
      </div>
    </article>
  );
}
