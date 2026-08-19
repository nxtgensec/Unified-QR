import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ADMIN_EMAILS = ["unifiedqr@nxtgensec.org", "dev.nxtgensec@gmail.com"] as const;

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
