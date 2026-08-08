import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Free, Flex and Pro QR Code Plans | TQRCG" },
      {
        name: "description",
        content:
          "Compare TQRCG plans: start free with static QR Codes, or upgrade for dynamic codes, scan analytics and team collaboration.",
      },
      { property: "og:title", content: "Pricing — Free, Flex and Pro QR Code Plans" },
      {
        property: "og:description",
        content: "Start free and pay only for the QR Code features you actually use.",
      },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: Pricing,
});

const plans = [
  {
    name: "Free",
    price: "$0",
    note: "forever",
    features: [
      "Unlimited static QR Codes",
      "2 dynamic QR Codes",
      "PNG & SVG downloads",
      "13 design templates",
      "Commercial use",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Flex",
    price: "$9",
    note: "per month",
    features: [
      "Everything in Free",
      "25 dynamic QR Codes",
      "Scan analytics & locations",
      "No watermark",
      "Logo upload",
      "Email support",
    ],
    cta: "Choose Flex",
    highlight: true,
  },
  {
    name: "Pro",
    price: "$39",
    note: "per month",
    features: [
      "Everything in Flex",
      "Unlimited dynamic QR Codes",
      "5 team members",
      "Bulk creation & API access",
      "Custom short domain",
      "24/7 priority support",
    ],
    cta: "Choose Pro",
    highlight: false,
  },
];

function Pricing() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
          Pay only for what you use
        </h1>
        <p className="mt-4 text-muted-foreground">
          Every plan includes unlimited free static QR Codes. Upgrade when you need tracking,
          editable codes or team access.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`flex flex-col rounded-3xl border p-7 shadow-card ${
              p.highlight ? "border-brand bg-card ring-2 ring-brand/20" : "border-border bg-card"
            }`}
          >
            {p.highlight && (
              <span className="mb-3 w-fit rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
                Most popular
              </span>
            )}
            <h2 className="text-lg font-bold">{p.name}</h2>
            <p className="mt-3">
              <span className="text-4xl font-extrabold">{p.price}</span>{" "}
              <span className="text-sm text-muted-foreground">{p.note}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="/#generator"
              className={`mt-7 rounded-full px-6 py-3 text-center text-sm font-bold ${
                p.highlight
                  ? "bg-brand text-brand-foreground"
                  : "border border-border text-foreground hover:bg-surface"
              }`}
            >
              {p.cta}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
