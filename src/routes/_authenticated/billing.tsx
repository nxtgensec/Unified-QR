import { createFileRoute, useSearch } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { Check, Loader2, Zap, Crown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  createCashfreeOrder,
  verifyCashfreePayment,
  type CreateCashfreeOrderResult,
} from "@/lib/cashfree.functions";
import { startCashfreeCheckout } from "@/integrations/cashfree/client";
import { useLocale } from "@/lib/locale";
import { PLANS, PAID_PLAN_IDS, type PlanId, effectivePlan } from "@/lib/plans";
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const Route = createFileRoute("/_authenticated/billing")({
  head: () => ({
    meta: [
      { title: "Billing — UnifiedQR Workspace" },
      {
        name: "description",
        content:
          "Choose a UnifiedQR plan: Day Pass, Week Pass, Monthly or Yearly for dynamic QR codes, analytics and more.",
      },
      { property: "og:title", content: "Billing — UnifiedQR" },
      { property: "og:description", content: "Plans, upgrades and invoices." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BillingPage,
});

const fetchUserProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("profiles")
      .select("plan, plan_expires_at")
      .eq("id", context.userId)
      .maybeSingle();
    return {
      plan: (data?.plan as PlanId) ?? "free",
      planExpiresAt: data?.plan_expires_at ?? null,
    };
  });

type BillingSearchParams = {
  order_id?: string;
  plan?: string;
};

const TOP_PLANS: PlanId[] = ["free", "year", "month"];
const BOTTOM_PLANS: PlanId[] = ["week", "day"];

function BillingPage() {
  const { t, formatMoney } = useLocale();
  const [busy, setBusy] = useState<PlanId | null>(null);
  const [userPlan, setUserPlan] = useState<PlanId>("free");
  const [planExpiresAt, setPlanExpiresAt] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const verifiedRef = useRef(false);

  const searchParams = useSearch({ from: Route.id }) as BillingSearchParams;

  const activePlan = effectivePlan(userPlan, planExpiresAt);

  useEffect(() => {
    fetchUserProfile().then((profile) => {
      setUserPlan(profile.plan);
      setPlanExpiresAt(profile.planExpiresAt);
    });
  }, []);

  useEffect(() => {
    if (verifiedRef.current) return;
    const orderId = searchParams.order_id;
    const planParam = searchParams.plan;

    if (orderId && planParam && (PAID_PLAN_IDS as string[]).includes(planParam)) {
      verifiedRef.current = true;
      setVerifying(true);

      verifyCashfreePayment({
        data: { orderId, plan: planParam as "day" | "week" | "month" | "year" },
      })
        .then((result) => {
          if (result.ok) {
            setUserPlan(planParam as PlanId);
            toast.success(`Successfully activated ${PLANS[planParam as PlanId].label}!`);
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

  async function handleCheckout(planId: PlanId) {
    if (planId === "free" || busy) return;
    setBusy(planId);
    try {
      const result: CreateCashfreeOrderResult = await createCashfreeOrder({
        data: { plan: planId },
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

  function getButtonLabel(planId: PlanId): string {
    if (planId === activePlan) return "Current plan";
    if (planId === "free") return activePlan !== "free" ? "Downgrade" : "Free forever";
    const planIdx = PAID_PLAN_IDS.indexOf(planId as (typeof PAID_PLAN_IDS)[number]);
    const currentIdx =
      activePlan === "free"
        ? -1
        : PAID_PLAN_IDS.indexOf(activePlan as (typeof PAID_PLAN_IDS)[number]);
    if (planIdx > currentIdx) return `Activate ${PLANS[planId].label}`;
    return `Switch to ${PLANS[planId].label}`;
  }

  function isButtonDisabled(planId: PlanId): boolean {
    return planId === activePlan || busy !== null;
  }

  function renderPlanCard(planId: PlanId, compact = false) {
    const plan = PLANS[planId];
    const isCurrent = planId === activePlan;
    const isBusy = busy === planId;

    return (
      <div
        key={planId}
        className={`relative flex flex-col rounded-2xl border transition-all ${
          compact ? "p-5" : "p-7"
        } shadow-card ${
          isCurrent
            ? "border-brand bg-background ring-2 ring-brand/15"
            : planId === "year"
              ? "border-brand/40 bg-background"
              : "border-border bg-background"
        }`}
      >
        {planId === "year" && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-0.5 text-[10px] font-bold text-brand-foreground">
            <Zap className="mr-0.5 inline size-3" /> Best Value
          </span>
        )}
        {planId === "month" && !isCurrent && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-soft px-3 py-0.5 text-[10px] font-bold text-brand">
            <Crown className="mr-0.5 inline size-3" /> Popular
          </span>
        )}
        {isCurrent && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-soft px-3 py-0.5 text-[10px] font-bold text-brand">
            Current
          </span>
        )}

        <h2 className={compact ? "text-sm font-bold" : "text-lg font-extrabold"}>{plan.label}</h2>

        <p className="mt-2">
          <span
            className={
              compact
                ? "text-xl font-extrabold tracking-tight"
                : "text-3xl font-extrabold tracking-tight"
            }
          >
            {formatMoney(plan.amount)}
          </span>
          {plan.durationDays && (
            <span className="ml-1 text-xs text-muted-foreground">
              /{" "}
              {plan.durationDays === 1
                ? "day"
                : plan.durationDays === 7
                  ? "week"
                  : plan.durationDays === 30
                    ? "month"
                    : "year"}
            </span>
          )}
          {!plan.durationDays && (
            <span className="ml-1 text-xs text-muted-foreground">forever</span>
          )}
        </p>

        {!compact && <div className="mt-5 border-t border-border" />}

        <ul
          className={`${compact ? "mt-3 space-y-1 text-xs" : "mt-5 flex-1 space-y-2 text-sm"} text-muted-foreground`}
        >
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-1.5">
              <Check
                className={`${compact ? "mt-0.5 size-3" : "mt-0.5 size-4"} shrink-0 text-brand`}
              />{" "}
              {f}
            </li>
          ))}
        </ul>

        <button
          type="button"
          disabled={isButtonDisabled(planId)}
          onClick={() => void handleCheckout(planId)}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all ${
            isCurrent
              ? "cursor-default border border-border text-muted-foreground"
              : planId === "free"
                ? "cursor-default border border-border text-muted-foreground opacity-60"
                : "bg-brand text-brand-foreground hover:-translate-y-0.5"
          }`}
        >
          {isBusy ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Processing...
            </>
          ) : (
            getButtonLabel(planId)
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader title={t("billing.title")} description={t("billing.subtitle")} />

      {verifying && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-brand/20 bg-brand-soft/30 px-4 py-3 text-sm text-brand">
          <Loader2 className="size-4 animate-spin" />
          Verifying your payment...
        </div>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TOP_PLANS.map((id) => renderPlanCard(id))}
      </div>

      <div className="mt-10">
        <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Short-term passes
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {BOTTOM_PLANS.map((id) => renderPlanCard(id, true))}
        </div>
      </div>

      {planExpiresAt && activePlan !== "free" && (
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Your {PLANS[activePlan].label} is active until{" "}
          {new Date(planExpiresAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          .
        </p>
      )}
    </div>
  );
}
