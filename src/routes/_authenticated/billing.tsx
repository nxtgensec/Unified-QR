import { createFileRoute, useSearch } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  createCashfreeOrder,
  verifyCashfreePayment,
  type CreateCashfreeOrderResult,
} from "@/lib/cashfree.functions";
import { startCashfreeCheckout } from "@/integrations/cashfree/client";
import { useLocale } from "@/lib/locale";
import { PLANS, type PlanId } from "@/lib/plans";
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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

const fetchUserPlan = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", context.userId)
      .maybeSingle();
    return (data?.plan as PlanId) ?? "free";
  });

type BillingSearchParams = {
  order_id?: string;
  plan?: string;
};

const planCards: Record<PlanId, { features: string[] }> = {
  free: {
    features: ["Unlimited static codes", "2 dynamic codes", "Scan totals", "PNG & SVG export"],
  },
  flex: {
    features: ["25 dynamic codes", "Full analytics", "Bulk CSV import", "Logos & frames"],
  },
  pro: {
    features: [
      "Unlimited dynamic codes",
      "Team workspace",
      "Campaigns & folders",
      "Priority support",
    ],
  },
};

const planOrder: PlanId[] = ["free", "flex", "pro"];
const MIN_AMOUNT = 9;
const MAX_AMOUNT = 999999;

function BillingPage() {
  const { t, formatMoney } = useLocale();
  const [busy, setBusy] = useState<PlanId | null>(null);
  const [userPlan, setUserPlan] = useState<PlanId>("free");
  const [verifying, setVerifying] = useState(false);
  const verifiedRef = useRef(false);

  const [inputPlan, setInputPlan] = useState<Extract<PlanId, "flex" | "pro"> | null>(null);
  const [amount, setAmount] = useState<string>("");

  const searchParams = useSearch({ from: Route.id }) as BillingSearchParams;

  useEffect(() => {
    fetchUserPlan().then((plan) => {
      if (plan === "flex" || plan === "pro" || plan === "free") setUserPlan(plan);
    });
  }, []);

  useEffect(() => {
    if (verifiedRef.current) return;
    const orderId = searchParams.order_id;
    const planParam = searchParams.plan;

    if (orderId && planParam && (planParam === "flex" || planParam === "pro")) {
      verifiedRef.current = true;
      setVerifying(true);

      verifyCashfreePayment({ data: { orderId, plan: planParam } })
        .then((result) => {
          if (result.ok) {
            setUserPlan(planParam);
            toast.success(`Successfully upgraded to ${PLANS[planParam].label}!`);
          } else {
            toast.error(result.message ?? "Payment verification failed. Contact support.");
          }
        })
        .catch(() => {
          toast.error("Could not verify payment. Contact support if you were charged.");
        })
        .finally(() => {
          setVerifying(false);
          window.history.replaceState({}, "", "/billing");
        });
    }
  }, [searchParams.order_id, searchParams.plan]);

  function openAmountInput(planId: Extract<PlanId, "flex" | "pro">) {
    setInputPlan(planId);
    setAmount("");
  }

  function cancelAmountInput() {
    setInputPlan(null);
    setAmount("");
  }

  async function proceedWithPayment() {
    if (!inputPlan) return;
    const num = Number(amount);
    if (!Number.isFinite(num) || !Number.isInteger(num) || num < MIN_AMOUNT || num > MAX_AMOUNT) {
      toast.error(
        `Amount must be between ₹${MIN_AMOUNT} and ₹${MAX_AMOUNT.toLocaleString("en-IN")}`,
      );
      return;
    }

    setBusy(inputPlan);
    try {
      const result: CreateCashfreeOrderResult = await createCashfreeOrder({
        data: { plan: inputPlan, amount: num },
      });
      if (!result.ok || !result.paymentSessionId) {
        toast.error(result.message ?? "Could not start checkout.");
        return;
      }
      await startCashfreeCheckout(result.paymentSessionId);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Payment error: ${msg}`);
    } finally {
      setBusy(null);
    }
  }

  function getButtonState(planId: PlanId) {
    const isCurrent = planId === userPlan;
    const planIdx = planOrder.indexOf(planId);
    const currentIdx = planOrder.indexOf(userPlan);
    const canUpgrade = planIdx > currentIdx;

    if (isCurrent) return "current";
    if (canUpgrade) return "upgrade";
    return "locked";
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader title={t("billing.title")} description={t("billing.subtitle")} />

      {verifying && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-brand/20 bg-brand-soft/30 px-4 py-3 text-sm text-brand">
          <Loader2 className="size-4 animate-spin" />
          Verifying your payment...
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {planOrder.map((planId) => {
          const plan = PLANS[planId];
          const { features } = planCards[planId];
          const isCurrent = planId === userPlan;
          const isPaying = inputPlan === planId;
          const isBusy = busy === planId;
          const buttonState = getButtonState(planId);

          return (
            <div
              key={planId}
              className={`rounded-2xl border p-6 shadow-card ${
                isCurrent
                  ? "border-brand bg-background ring-2 ring-brand/15"
                  : "border-border bg-background"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold">{plan.label}</h2>
                {isCurrent && (
                  <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-bold uppercase text-brand">
                    Current plan
                  </span>
                )}
              </div>

              {planId === "free" ? (
                <p className="mt-2 text-3xl font-extrabold tracking-tight">
                  {formatMoney(0)}{" "}
                  <span className="text-sm font-medium text-muted-foreground">Forever free</span>
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Pay what you want — min {formatMoney(MIN_AMOUNT)}
                </p>
              )}

              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" /> {f}
                  </li>
                ))}
              </ul>

              {isPaying && buttonState === "upgrade" ? (
                <div className="mt-6 space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-muted-foreground">
                      Amount (₹) — min {MIN_AMOUNT}, max {MAX_AMOUNT.toLocaleString("en-IN")}
                    </label>
                    <input
                      type="number"
                      min={MIN_AMOUNT}
                      max={MAX_AMOUNT}
                      step="1"
                      placeholder={`e.g. ${planId === "flex" ? "499" : "2999"}`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      autoFocus
                      className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void proceedWithPayment()}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground hover:-translate-y-0.5"
                    >
                      {isBusy ? (
                        <>
                          <Loader2 className="size-4 animate-spin" /> Processing...
                        </>
                      ) : amount ? (
                        `Pay ${formatMoney(Number(amount))}`
                      ) : (
                        "Pay now"
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={cancelAmountInput}
                      className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-background"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : buttonState === "current" ? (
                <button
                  type="button"
                  disabled
                  className="mt-6 flex w-full cursor-default items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-bold text-muted-foreground"
                >
                  Your plan
                </button>
              ) : buttonState === "upgrade" ? (
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => openAmountInput(planId as Extract<PlanId, "flex" | "pro">)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground hover:-translate-y-0.5"
                >
                  Upgrade to {plan.label}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-6 flex w-full cursor-default items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-bold text-muted-foreground opacity-50"
                >
                  Downgrade
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
