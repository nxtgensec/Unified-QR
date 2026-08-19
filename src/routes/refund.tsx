import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy — UnifiedQR" },
      {
        name: "description",
        content:
          "UnifiedQR refund policy. Learn about our cancellation and refund terms for paid subscriptions.",
      },
      { property: "og:title", content: "Refund Policy — UnifiedQR" },
      {
        property: "og:description",
        content:
          "UnifiedQR refund policy. Learn about our cancellation and refund terms for paid subscriptions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "canonical", href: "https://qr.nxtgensec.org/refund" },
      { rel: "alternate", hreflang: "en", href: "https://qr.nxtgensec.org/refund" },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">Refund Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Effective date: August 17, 2026</p>

      <div className="prose prose-sm mt-8 space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground">1. Overview</h2>
          <p>
            We want you to be satisfied with UnifiedQR. If you're not happy with a paid
            subscription, we offer refunds under the conditions described below.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">2. Free Plan</h2>
          <p>The Free plan is completely free with no obligation. There is nothing to refund.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">
            3. Paid Subscriptions (Flex and Pro)
          </h2>
          <h3 className="text-base font-bold text-foreground">3.1 New Subscriptions</h3>
          <p>
            If you subscribe to a paid plan for the first time and are not satisfied, you may
            request a full refund within <strong>7 days</strong> of your initial purchase. This is
            our money-back guarantee.
          </p>

          <h3 className="text-base font-bold text-foreground">3.2 Renewals</h3>
          <p>
            Subscription renewals are charged automatically. You may cancel your subscription at any
            time from the Billing page. Cancellation takes effect at the end of the current billing
            period — you will retain access until then. Renewal charges are non-refundable.
          </p>

          <h3 className="text-base font-bold text-foreground">3.3 Plan Downgrades</h3>
          <p>
            If you downgrade from a higher plan to a lower plan, the difference is not refunded for
            the current billing period. The downgrade takes effect at the next renewal date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">4. How to Request a Refund</h2>
          <p>
            Contact us at{" "}
            <a
              href="mailto:unifiedqr@nxtgensec.org"
              className="text-brand font-semibold hover:underline"
            >
              unifiedqr@nxtgensec.org
            </a>{" "}
            with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your account email address</li>
            <li>The reason for the refund request</li>
            <li>Date of the charge</li>
          </ul>
          <p>
            We process refund requests within 5-7 business days. Refunds are issued to the original
            payment method via Cashfree.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">5. Exceptions</h2>
          <p>Refunds may not be issued if:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The request is made more than 7 days after the initial purchase</li>
            <li>
              The account has been used to create or manage QR codes in violation of our{" "}
              <Link to="/terms" className="text-brand font-semibold hover:underline">
                Terms of Service
              </Link>
            </li>
            <li>The refund request is made in bad faith or is a pattern of repeated requests</li>
          </ul>
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
