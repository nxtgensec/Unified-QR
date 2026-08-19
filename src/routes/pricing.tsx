import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Zap } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { PLANS, PLAN_IDS } from "@/lib/plans";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Free, Day, Week, Month & Year QR Code Plans | UnifiedQR" },
      {
        name: "description",
        content:
          "Compare UnifiedQR plans: start free, or choose Day Pass (₹9), Week Pass (₹49), Monthly (₹99) or Yearly (₹999) for dynamic QR codes and analytics.",
      },
      { property: "og:title", content: "Pricing — UnifiedQR QR Code Plans" },
      {
        property: "og:description",
        content:
          "Start free and pay only for the QR Code features you actually use. Plans from ₹9/day.",
      },
      { property: "og:url", content: "https://qr.nxtgensec.org/pricing" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "canonical", href: "https://qr.nxtgensec.org/pricing" },
      { rel: "alternate", hreflang: "en", href: "https://qr.nxtgensec.org/pricing" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "UnifiedQR Pricing",
          description:
            "Compare UnifiedQR plans: free, Day Pass, Week Pass, Monthly and Yearly QR Code plans.",
          url: "https://qr.nxtgensec.org/pricing",
        }),
      },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  const { formatMoney } = useLocale();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-muted-foreground">
          Start free. Upgrade only when you need dynamic codes, analytics and premium exports. Pay
          for exactly the time you use.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {PLAN_IDS.map((planId) => {
          const plan = PLANS[planId];
          const isPopular = planId === "month";

          return (
            <div
              key={planId}
              className={`relative flex flex-col rounded-3xl border p-6 shadow-card ${
                isPopular ? "border-brand ring-2 ring-brand/20" : "border-border"
              }`}
            >
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-xs font-bold text-brand-foreground">
                  <Zap className="mr-0.5 inline size-3" /> Best Value
                </span>
              )}

              <h2 className="text-lg font-bold">{plan.label}</h2>

              <p className="mt-3">
                <span className="text-3xl font-extrabold tracking-tight">
                  {formatMoney(plan.amount)}
                </span>
                {plan.durationDays ? (
                  <span className="ml-1 text-sm text-muted-foreground">
                    /{" "}
                    {plan.durationDays === 1
                      ? "day"
                      : plan.durationDays === 7
                        ? "week"
                        : plan.durationDays === 30
                          ? "month"
                          : "year"}
                  </span>
                ) : (
                  <span className="ml-1 text-sm text-muted-foreground">forever</span>
                )}
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/"
                hash="generator"
                className={`mt-7 rounded-full px-6 py-3 text-center text-sm font-bold ${
                  isPopular
                    ? "bg-brand text-brand-foreground"
                    : "border border-border text-foreground hover:bg-surface"
                }`}
              >
                {planId === "free" ? "Start free" : `Get ${plan.label}`}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
