import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useLocale, type MessageKey } from "@/lib/locale";
import { PLANS } from "@/lib/plans";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Free, Flex and Pro QR Code Plans | UnifiedQR" },
      {
        name: "description",
        content:
          "Compare UnifiedQR plans: start free with static QR Codes, or upgrade for dynamic codes, scan analytics and team collaboration.",
      },
      { property: "og:title", content: "Pricing — Free, Flex and Pro QR Code Plans" },
      {
        property: "og:description",
        content: "Start free and pay only for the QR Code features you actually use.",
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
          description: "Compare UnifiedQR plans: free, Flex and Pro QR Code plans.",
          url: "https://qr.nxtgensec.org/pricing",
        }),
      },
    ],
  }),
  component: Pricing,
});

const plans = [
  {
    id: "free" as const,
    featuresKey: "pricing.freeFeatures" as MessageKey,
    ctaKey: "pricing.startFree" as MessageKey,
    noteKey: "pricing.forever" as MessageKey,
    highlight: false,
  },
  {
    id: "flex" as const,
    featuresKey: "pricing.flexFeatures" as MessageKey,
    ctaKey: "pricing.chooseFlex" as MessageKey,
    noteKey: "pricing.perMonth" as MessageKey,
    highlight: true,
  },
  {
    id: "pro" as const,
    featuresKey: "pricing.proFeatures" as MessageKey,
    ctaKey: "pricing.choosePro" as MessageKey,
    noteKey: "pricing.perMonth" as MessageKey,
    highlight: false,
  },
];

function Pricing() {
  const { t, formatMoney } = useLocale();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">{t("pricing.title")}</h1>
        <p className="mt-4 text-muted-foreground">{t("pricing.subtitle")}</p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {plans.map((p) => {
          const plan = PLANS[p.id];
          return (
            <div
              key={p.id}
              className={`flex flex-col rounded-3xl border p-7 shadow-card ${
                p.highlight ? "border-brand bg-card ring-2 ring-brand/20" : "border-border bg-card"
              }`}
            >
              {p.highlight && (
                <span className="mb-3 w-fit rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
                  {t("pricing.mostPopular")}
                </span>
              )}
              <h2 className="text-lg font-bold">{plan.label}</h2>
              <p className="mt-3">
                <span className="text-4xl font-extrabold">{formatMoney(plan.amount)}</span>{" "}
                <span className="text-sm text-muted-foreground">{t(p.noteKey)}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {(t(p.featuresKey) as unknown as string[]).map((f) => (
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
                  p.highlight
                    ? "bg-brand text-brand-foreground"
                    : "border border-border text-foreground hover:bg-surface"
                }`}
              >
                {t(p.ctaKey)}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
