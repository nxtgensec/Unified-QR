import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — UnifiedQR" },
      {
        name: "description",
        content:
          "UnifiedQR privacy policy. Learn how we collect, use, store and protect your personal data.",
      },
      { property: "og:title", content: "Privacy Policy — UnifiedQR" },
      {
        property: "og:description",
        content:
          "UnifiedQR privacy policy. Learn how we collect, use, store and protect your personal data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "canonical", href: "https://qr.nxtgensec.org/privacy" },
      { rel: "alternate", hreflang: "en", href: "https://qr.nxtgensec.org/privacy" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Effective date: August 17, 2026</p>

      <div className="prose prose-sm mt-8 space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground">1. Introduction</h2>
          <p>
            UnifiedQR ("we", "our", "us") is committed to protecting your privacy. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your information when you
            visit our website (qr.nxtgensec.org) and use our QR code generation and management
            services (the "Service").
          </p>
          <p>
            By accessing or using our Service, you agree to the collection and use of information in
            accordance with this policy. If you do not agree, please discontinue use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">2. Information We Collect</h2>
          <h3 className="text-base font-bold text-foreground">2.1 Account Information</h3>
          <p>
            When you sign in via Google OAuth, we collect your email address, display name and
            profile picture. We do not store your Google password.
          </p>

          <h3 className="text-base font-bold text-foreground">2.2 QR Code Data</h3>
          <p>
            We store the QR codes you create, including the encoded content (URLs, text, vCard data,
            etc.), customization settings and any associated short links.
          </p>

          <h3 className="text-base font-bold text-foreground">2.3 Analytics Data</h3>
          <p>
            When a dynamic QR code is scanned, we record the scan timestamp, device type, referrer
            and IP-derived geolocation. This data is used to provide you with scan analytics.
          </p>

          <h3 className="text-base font-bold text-foreground">2.4 Usage Data</h3>
          <p>
            We collect anonymised usage data including page views, feature interactions, browser
            type and operating system. This data is not linked to your personal identity.
          </p>

          <h3 className="text-base font-bold text-foreground">2.5 Payment Information</h3>
          <p>
            Payment processing is handled by Cashfree Payments. We do not store your credit card
            number, CVV or bank details. We only retain a reference to your transaction for billing
            records.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide, maintain and improve the Service</li>
            <li>To process payments and manage your subscription plan</li>
            <li>To send you transactional emails (account verification, plan changes)</li>
            <li>To display scan analytics and QR code management tools</li>
            <li>To detect and prevent fraud, abuse and security incidents</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">4. Data Sharing</h2>
          <p>We do not sell your personal information. We may share data with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Service providers:</strong> Supabase (database, auth), Cashfree (payments),
              Cloudflare (hosting) — strictly for operating the Service.
            </li>
            <li>
              <strong>Legal compliance:</strong> If required by law, court order or government
              request.
            </li>
            <li>
              <strong>Business transfers:</strong> In connection with a merger, acquisition or sale
              of assets, with appropriate notice.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">5. Data Retention</h2>
          <p>
            We retain your account information for as long as your account is active. QR code data
            and analytics are retained until you delete them. After account deletion, we remove your
            personal data within 30 days, except where required by law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">6. Data Security</h2>
          <p>
            We implement industry-standard security measures including TLS encryption in transit,
            encrypted database storage and access controls. However, no method of transmission over
            the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">7. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability — receive your data in a machine-readable format</li>
          </ul>
          <p>
            To exercise these rights, contact us at{" "}
            <a
              href="mailto:unifiedqr@nxtgensec.org"
              className="text-brand font-semibold hover:underline"
            >
              unifiedqr@nxtgensec.org
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">8. Cookies</h2>
          <p>
            We use minimal cookies for authentication sessions and user preferences. We do not use
            advertising or third-party tracking cookies. See our{" "}
            <Link to="/cookies" className="text-brand font-semibold hover:underline">
              Cookie Policy
            </Link>{" "}
            for details.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">9. Children's Privacy</h2>
          <p>
            The Service is not intended for users under the age of 16. We do not knowingly collect
            personal information from children.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">10. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Material changes will be communicated via
            email or a notice on the Service. Continued use after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">11. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, contact us at:</p>
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
