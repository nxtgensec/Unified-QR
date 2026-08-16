import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, BetaNotice } from "@/components/app/AppShell";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { createCashfreeOrder, type CreateCashfreeOrderResult } from "@/lib/cashfree.functions";
import { startCashfreeCheckout } from "@/integrations/cashfree/client";

export const Route = createFileRoute("/_authenticated/billing")({
  head: () => ({
    meta: [
      { title: "Billing — UnifiedQR Workspace" },
      {
        name: "description",
        content:
          "Upgrade to Flex or Pro with Cashfree: more dynamic codes, full analytics, teams and more.",
      },
      { property: "og:title", content: "Billing — UnifiedQR" },
      { property: "og:description", content: "Plans, upgrades and invoices." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BillingPage,
});

const plans = [
  {
    id: "free" as const,
    name: "Free",
    price: "$0",
    current: true,
    features: ["Unlimited static codes", "2 dynamic codes", "Scan totals", "PNG & SVG export"],
  },
  {
    id: "flex" as const,
    name: "Flex",
    price: "$14/mo",
    current: false,
    features: ["25 dynamic codes", "Full analytics", "Bulk CSV import", "Logos & frames"],
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: "$39/mo",
    current: false,
    features: [
      "Unlimited dynamic codes",
      "Team workspace",
      "Campaigns & folders",
      "Priority support",
    ],
  },
];

function BillingPage() {
  const { user } = useAuth();
  const [busy, setBusy] = useState<string | null>(null);

  async function upgrade(planId: "flex" | "pro") {
    if (!user) {
      toast.error("Sign in to upgrade your plan.");
      return;
    }
    setBusy(planId);
    try {
      const result: CreateCashfreeOrderResult = await createCashfreeOrder({
        data: {
          plan: planId,
          email: user.email ?? "",
          name: user.email ?? "",
        },
      });
      if (!result.ok || !result.paymentSessionId) {
        toast.error(result.message ?? "Could not start checkout.");
        return;
      }
      await startCashfreeCheckout(result.paymentSessionId);
    } catch (err) {
      console.error(err);
      toast.error("Payment could not be started. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        title="Billing"
        description="Plan limits, upgrades and invoices. Payments are processed securely by Cashfree."
      />
      <BetaNotice>
        Checkout is wired to Cashfree. Complete your Cashfree merchant keys in .env.local to go
        live.
      </BetaNotice>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map((p) => {
          const isBusy = busy === p.id;
          return (
            <div
              key={p.id}
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
                disabled={p.current || isBusy}
                onClick={() => {
                  if (p.id !== "free") void upgrade(p.id);
                }}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold ${
                  p.current
                    ? "cursor-not-allowed border border-border"
                    : "bg-brand text-brand-foreground hover:-translate-y-0.5"
                }`}
              >
                {isBusy ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Starting checkout…
                  </>
                ) : p.current ? (
                  "Your plan"
                ) : (
                  "Upgrade"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
