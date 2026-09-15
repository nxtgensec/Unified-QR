import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PLANS, type PlanId } from "@/lib/plans";

const ADMIN_EMAILS = ["unifiedqr@nxtgensec.org", "kiransavireddy@gmail.com"] as const;

export type AdminRecentUser = {
  id: string;
  display_name: string | null;
  plan: string;
  created_at: string;
  codeCount: number;
};

export type AdminTopCode = {
  id: string;
  name: string;
  type: string;
  is_dynamic: boolean;
  scans: number;
};

export type AdminStats = {
  totalUsers: number;
  totalCodes: number;
  dynamicCodes: number;
  totalScans: number;
  recentUsers: AdminRecentUser[];
  topCodes: AdminTopCode[];
};

export type AdminStatsResponse = { ok: true; data: AdminStats } | { ok: false; code: "forbidden" };

export type AdminCheckResult = { ok: true; isAdmin: boolean };

export const checkAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminCheckResult> => {
    const email = (context.claims ?? {})["email"];
    const isAdmin =
      typeof email === "string" &&
      ADMIN_EMAILS.some((e) => email.toLowerCase() === e.toLowerCase());
    return { ok: true, isAdmin };
  });

function isAdminEmail(email: unknown): boolean {
  const envEmail = process.env["ADMIN_EMAIL"];
  const emails = envEmail ? [envEmail] : [...ADMIN_EMAILS];
  return typeof email === "string" && emails.some((e) => email.toLowerCase() === e.toLowerCase());
}

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminStatsResponse> => {
    if (!isAdminEmail((context.claims ?? {}).email)) {
      return { ok: false, code: "forbidden" };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [usersCount, codesCount, dynamicCount, scansCount] = await Promise.all([
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("qr_codes").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("qr_codes")
        .select("id", { count: "exact", head: true })
        .eq("is_dynamic", true),
      supabaseAdmin.from("scans").select("id", { count: "exact", head: true }),
    ]);

    const { data: users } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name, plan, created_at")
      .order("created_at", { ascending: false })
      .limit(25);

    const userIds = (users ?? []).map((u) => u.id);

    const [ownerCountsResult, scanCountsResult] = await Promise.all([
      userIds.length > 0
        ? supabaseAdmin.from("qr_codes").select("user_id").in("user_id", userIds)
        : { data: [] as { user_id: string }[] },
      supabaseAdmin.from("scans").select("code_id").limit(2000),
    ]);

    const ownerCounts: Record<string, number> = {};
    for (const c of ownerCountsResult.data ?? []) {
      ownerCounts[c.user_id] = (ownerCounts[c.user_id] ?? 0) + 1;
    }

    const scanCountsMap: Record<string, number> = {};
    for (const s of scanCountsResult.data ?? []) {
      scanCountsMap[s.code_id] = (scanCountsMap[s.code_id] ?? 0) + 1;
    }

    const { data: topCodeRows } = await supabaseAdmin
      .from("qr_codes")
      .select("id, name, type, is_dynamic")
      .in("id", Object.keys(scanCountsMap).slice(0, 200));

    const recentUsers: AdminRecentUser[] = (users ?? []).map((u) => ({
      id: u.id,
      display_name: u.display_name,
      plan: u.plan,
      created_at: u.created_at,
      codeCount: ownerCounts[u.id] ?? 0,
    }));

    const topCodes: AdminTopCode[] = (topCodeRows ?? [])
      .map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        is_dynamic: c.is_dynamic,
        scans: scanCountsMap[c.id] ?? 0,
      }))
      .sort((a, b) => b.scans - a.scans)
      .slice(0, 10);

    return {
      ok: true,
      data: {
        totalUsers: usersCount.count ?? 0,
        totalCodes: codesCount.count ?? 0,
        dynamicCodes: dynamicCount.count ?? 0,
        totalScans: scansCount.count ?? 0,
        recentUsers,
        topCodes,
      },
    };
  });

const grantPremiumInput = z.object({
  email: z.string().trim().toLowerCase(),
  plan: z.enum(["day", "week", "month", "year"]),
});

export type GrantPremiumInput = z.infer<typeof grantPremiumInput>;

export type GrantPremiumResult =
  | { ok: true; email: string; plan: string; expiresAt: string }
  | { ok: false; code: "forbidden" | "user_not_found" | "error"; message: string };

const REVOKED_PLAN = "free";

async function findAuthUserByEmail(email: string): Promise<{ id: string } | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const normalized = email.toLowerCase();

  let page = 1;
  let total = 0;
  do {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error || !data?.users) {
      return null;
    }
    const match = data.users.find((u) => u.email?.toLowerCase() === normalized);
    if (match) {
      return { id: match.id };
    }
    total = data.total ?? data.users.length;
    page += 1;
  } while ((page - 1) * 1000 < total && page <= 10);

  return null;
}

export const grantPremiumAccess = createServerFn({ method: "POST" })
  .validator(grantPremiumInput)
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }): Promise<GrantPremiumResult> => {
    if (!isAdminEmail((context.claims ?? {}).email)) {
      return { ok: false, code: "forbidden", message: "Forbidden" };
    }

    const planId = data.plan as PlanId;
    const planDef = PLANS[planId];
    if (!planDef?.durationDays) {
      return { ok: false, code: "error", message: "Unknown plan" };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const target = await findAuthUserByEmail(data.email);
    if (!target) {
      return { ok: false, code: "user_not_found", message: `No user found for ${data.email}` };
    }

    const profile = await supabaseAdmin
      .from("profiles")
      .select("plan, plan_expires_at")
      .eq("id", target.id)
      .maybeSingle();

    if (profile.error || !profile.data) {
      return { ok: false, code: "error", message: "Could not load user profile" };
    }

    const currentExpiry = profile.data.plan_expires_at
      ? new Date(profile.data.plan_expires_at).getTime()
      : 0;
    const base = Math.max(Date.now(), currentExpiry);
    const expiresAt = new Date(base + planDef.durationDays * 86400000).toISOString();

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ plan: planId, plan_expires_at: expiresAt })
      .eq("id", target.id);

    if (updateError) {
      console.error("[Admin] grant plan update failed", updateError);
      return { ok: false, code: "error", message: "Could not update the user plan" };
    }

    const { error: auditError } = await supabaseAdmin.from("admin_plan_grants").insert({
      target_email: data.email,
      target_user_id: target.id,
      plan: planId,
      expires_at: expiresAt,
      granted_by: context.userId ? context.userId : null,
    });

    if (auditError) {
      console.error("[Admin] grant audit insert failed", auditError);
    }

    return { ok: true, email: data.email, plan: planId, expiresAt };
  });

export const revokePremiumAccess = createServerFn({ method: "POST" })
  .validator(grantPremiumInput.omit({ plan: true }))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }): Promise<GrantPremiumResult> => {
    if (!isAdminEmail((context.claims ?? {}).email)) {
      return { ok: false, code: "forbidden", message: "Forbidden" };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const target = await findAuthUserByEmail(data.email);
    if (!target) {
      return { ok: false, code: "user_not_found", message: `No user found for ${data.email}` };
    }

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ plan: REVOKED_PLAN, plan_expires_at: null })
      .eq("id", target.id);

    if (updateError) {
      console.error("[Admin] revoke plan update failed", updateError);
      return { ok: false, code: "error", message: "Could not revoke the user plan" };
    }

    const { error: auditError } = await supabaseAdmin.from("admin_plan_grants").insert({
      target_email: data.email,
      target_user_id: target.id,
      plan: REVOKED_PLAN,
      expires_at: null,
      granted_by: context.userId ? context.userId : null,
    });

    if (auditError) {
      console.error("[Admin] revoke audit insert failed", auditError);
    }

    return { ok: true, email: data.email, plan: REVOKED_PLAN, expiresAt: "" };
  });

export type AdminGrantRow = {
  id: string;
  target_email: string;
  plan: string;
  expires_at: string | null;
  created_at: string;
};

export const getAdminGrants = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(
    async ({
      context,
    }): Promise<{ ok: true; data: AdminGrantRow[] } | { ok: false; code: "forbidden" }> => {
      if (!isAdminEmail((context.claims ?? {}).email)) {
        return { ok: false, code: "forbidden" };
      }

      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      const { data } = await supabaseAdmin
        .from("admin_plan_grants")
        .select("id, target_email, plan, expires_at, created_at")
        .order("created_at", { ascending: false })
        .limit(20);

      return { ok: true, data: (data ?? []) as AdminGrantRow[] };
    },
  );
