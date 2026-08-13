import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, BetaNotice } from "@/components/app/AppShell";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/billing")({
  head: () => ({
    meta: [
      { title: "Billing (Beta) — UnifiedQR Workspace" },
      {
        name: "description",
        content:
          "Preview of UnifiedQR billing: plan limits, invoices and upgrades for Flex and Pro workspaces.",
      },
      { property: "og:title", content: "Billing (Beta) — UnifiedQR" },
      { property: "og:description", content: "Plans, limits and invoices preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BillingPage,
});

const plans = [
  {
    name: "Free",
    price: "$0",
    current: true,
    features: ["Unlimited static codes", "2 dynamic codes", "Scan totals", "PNG & SVG export"],
  },
  {
    name: "Flex",
    price: "$14/mo",
    current: false,
    features: ["25 dynamic codes", "Full analytics", "Bulk CSV import", "Logos & frames"],
  },
  {
    name: "Pro",
    price: "$39/mo",
    current: false,
    features: ["Unlimited dynamic codes", "Team workspace", "Campaigns & folders", "Priority support"],
  },
];

function BillingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        title="Billing"
        beta
        description="Plan limits, upgrades and invoices. Everything in your workspace is free while billing is in beta."
      />
      <BetaNotice>No card is required and no charges are possible yet.</BetaNotice>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-2xl border p-6 shadow-card ${
              p.current ? "border-brand bg-card" : "border-border bg-card"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold">{p.name}</h2>
              {p.current && (
                <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-bold uppercase text-brand">
                  Current
                </span>
              )}
            </div>
            <p className="mt-2 text-3xl font-extrabold tracking-tight">{p.price}</p>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" /> {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled
              className={`mt-6 w-full cursor-not-allowed rounded-full px-5 py-2.5 text-sm font-bold opacity-60 ${
                p.current
                  ? "border border-border"
                  : "bg-brand text-brand-foreground"
              }`}
            >
              {p.current ? "Your plan" : "Upgrade (beta)"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
