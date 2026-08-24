export type PlanId = "free" | "day" | "week" | "month" | "year";

export type PlanDef = {
  id: PlanId;
  label: string;
  amount: number;
  durationDays: number | null;
  dynamicLimit: number | null;
  bulkLimit: number;
  features: string[];
};

export const PLANS: Record<PlanId, PlanDef> = {
  free: {
    id: "free",
    label: "Free",
    amount: 0,
    durationDays: null,
    dynamicLimit: 3,
    bulkLimit: 20,
    features: [
      "Unlimited static QR codes",
      "3 dynamic QR codes",
      "20 bulk-created codes per batch",
      "Basic scan totals",
      "All export formats — PNG, SVG, JPG & PDF",
      "Country-level analytics",
    ],
  },
  day: {
    id: "day",
    label: "Day Pass",
    amount: 9,
    durationDays: 1,
    dynamicLimit: 5,
    bulkLimit: 50,
    features: [
      "5 dynamic QR codes",
      "50 bulk-created codes per batch",
      "Full scan analytics",
      "Custom colours & frames",
      "Logo embedding",
      "City-level analytics",
      "Valid for 24 hours",
    ],
  },
  week: {
    id: "week",
    label: "Week Pass",
    amount: 49,
    durationDays: 7,
    dynamicLimit: 15,
    bulkLimit: 100,
    features: [
      "15 dynamic QR codes",
      "100 bulk-created codes per batch",
      "Full scan analytics",
      "Custom colours, gradients & frames",
      "Logo embedding",
      "Bulk CSV import",
      "City-level analytics",
      "Valid for 7 days",
    ],
  },
  month: {
    id: "month",
    label: "Monthly",
    amount: 99,
    durationDays: 30,
    dynamicLimit: 50,
    bulkLimit: 200,
    features: [
      "50 dynamic QR codes",
      "200 bulk-created codes per batch",
      "Full scan analytics",
      "Custom colours, gradients & frames",
      "Logo embedding",
      "Bulk CSV import",
      "City-level analytics",
      "Priority support",
      "Valid for 30 days",
    ],
  },
  year: {
    id: "year",
    label: "Yearly",
    amount: 999,
    durationDays: 365,
    dynamicLimit: null,
    bulkLimit: 500,
    features: [
      "Unlimited dynamic QR codes",
      "500 bulk-created codes per batch",
      "Full scan analytics",
      "Custom colours, gradients & frames",
      "Logo embedding",
      "Bulk CSV import",
      "City-level analytics",
      "Priority support",
      "Best value — save 17%",
      "Valid for 365 days",
    ],
  },
};

export const PLAN_IDS: PlanId[] = ["free", "day", "week", "month", "year"];

export const PAID_PLAN_IDS: PlanId[] = ["day", "week", "month", "year"];

export function getDynamicLimit(plan: string | null | undefined): number {
  const id = effectivePlan(plan, null);
  return PLANS[id].dynamicLimit ?? Infinity;
}

export function getBulkLimit(plan: string | null | undefined): number {
  const id = effectivePlan(plan, null);
  return PLANS[id].bulkLimit;
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
