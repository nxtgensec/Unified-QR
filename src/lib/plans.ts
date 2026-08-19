export type PlanId = "free" | "flex" | "pro";

export const PLANS: Record<PlanId, { id: PlanId; label: string; amount: number }> = {
  free: { id: "free", label: "Free", amount: 0 },
  flex: { id: "flex", label: "Flex", amount: 749 },
  pro: { id: "pro", label: "Pro", amount: 2999 },
};
