export type PlanId = "free" | "day" | "week" | "month" | "year";

export type PlanDef = {
  id: PlanId;
  label: string;
  amount: number;
  durationDays: number | null;
  dynamicLimit: number | null;
  features: string[];
};

export const PLANS: Record<PlanId, PlanDef> = {
  free: {
    id: "free",
    label: "Free",
    amount: 0,
    durationDays: null,
    dynamicLimit: 2,
    features: [
      "Unlimited static QR codes",
      "2 dynamic QR codes",
      "Basic scan totals",
      "PNG & SVG export",
    ],
  },
  day: {
    id: "day",
    label: "Day Pass",
    amount: 9,
    durationDays: 1,
    dynamicLimit: 5,
    features: [
      "5 dynamic QR codes",
      "Full scan analytics",
      "All 5 export formats",
      "Custom colours & frames",
      "Logo embedding",
      "Valid for 24 hours",
    ],
  },
  week: {
    id: "week",
    label: "Week Pass",
    amount: 49,
    durationDays: 7,
    dynamicLimit: 15,
    features: [
      "15 dynamic QR codes",
      "Full scan analytics",
      "All 5 export formats",
      "Custom colours, gradients & frames",
      "Logo embedding",
      "Bulk CSV import",
      "Valid for 7 days",
    ],
  },
  month: {
    id: "month",
    label: "Monthly",
    amount: 99,
    durationDays: 30,
    dynamicLimit: 50,
    features: [
      "50 dynamic QR codes",
      "Full scan analytics",
      "All 5 export formats",
      "Custom colours, gradients & frames",
      "Logo embedding",
      "Bulk CSV import",
      "Valid for 30 days",
    ],
  },
  year: {
    id: "year",
    label: "Yearly",
    amount: 999,
    durationDays: 365,
    dynamicLimit: null,
    features: [
      "Unlimited dynamic QR codes",
      "Full scan analytics",
      "All 5 export formats",
      "Custom colours, gradients & frames",
      "Logo embedding",
      "Bulk CSV import",
      "Valid for 365 days",
    ],
  },
};

export const PLAN_IDS: PlanId[] = ["free", "day", "week", "month", "year"];

export const PAID_PLAN_IDS: PlanId[] = ["day", "week", "month", "year"];

export function getDynamicLimit(plan: string | null | undefined): number {
  if (plan === "day") return 5;
  if (plan === "week") return 15;
  if (plan === "month") return 50;
  if (plan === "year") return Infinity;
  return 2;
}

export function isPlanActive(
  plan: string | null | undefined,
  planExpiresAt: string | null | undefined,
): boolean {
  if (!plan || plan === "free") return false;
  if (!planExpiresAt) return true;
  return new Date(planExpiresAt).getTime() > Date.now();
}

export function effectivePlan(
  plan: string | null | undefined,
  planExpiresAt: string | null | undefined,
): PlanId {
  if (isPlanActive(plan, planExpiresAt)) return plan as PlanId;
  return "free";
}
