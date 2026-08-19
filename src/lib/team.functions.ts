import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const MEMBER_LIMITS: Record<string, number> = { free: 3, flex: 5, pro: 99 };
const TEAM_LIMITS: Record<string, number> = { free: 1, flex: 1, pro: 99 };

export type TeamInfo = {
  team: {
    id: string;
    name: string;
    createdBy: string;
    createdAt: string;
  } | null;
  myRole: "owner" | "admin" | "member" | null;
  members: {
    userId: string;
    role: "owner" | "admin" | "member";
    joinedAt: string;
    displayName: string | null;
  }[];
  invites: {
    id: string;
    token: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    expiresAt: string;
  }[];
};

export type TeamResult = { ok: true; data: TeamInfo } | { ok: false; message: string };

function randomToken() {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 24);
}

function buildOrigin() {
  const request = getRequest();
  const host =
    request?.headers?.get("x-forwarded-host") ??
    request?.headers?.get("host") ??
    "qr.nxtgensec.org";
  const proto = request?.headers?.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

const createInput = z.object({ name: z.string().trim().min(1).max(60) });
const inviteInput = z.object({
  email: z.string().trim().toLowerCase().max(200),
  role: z.enum(["admin", "member"]).default("member"),
});
const tokenInput = z.object({ token: z.string().min(10).max(200) });
const removeInput = z.object({ userId: z.string().min(1) });
const revokeInput = z.object({ inviteId: z.string().min(1) });

export type InviteMemberResult = { ok: true; link: string } | { ok: false; message: string };
export type AcceptInviteResult = { ok: true; teamName: string } | { ok: false; message: string };
export type SimpleTeamResult = { ok: true } | { ok: false; message: string };

export const getTeamInfo = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<TeamResult> => {
    const { supabase } = context;
    const me = context.userId;

    const { data: membership, error: membershipError } = await supabase
      .from("team_members")
      .select("team_id, role")
      .eq("user_id", me)
      .limit(1)
      .maybeSingle();

    if (membershipError) return { ok: false, message: "Could not load your team." };
    if (!membership)
      return { ok: true, data: { team: null, myRole: null, members: [], invites: [] } };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [{ data: team }, { data: members }, { data: invites }] = await Promise.all([
      supabaseAdmin
        .from("teams")
        .select("id, name, created_by, created_at")
        .eq("id", membership.team_id)
        .maybeSingle(),
      supabaseAdmin
        .from("team_members")
        .select("user_id, role, joined_at")
        .eq("team_id", membership.team_id),
      supabaseAdmin
        .from("team_invites")
        .select("id, token, email, role, status, created_at, expires_at")
        .eq("team_id", membership.team_id)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    if (!team) return { ok: false, message: "Team not found." };

    const memberUserIds = (members ?? []).map((m) => m.user_id);
    const { data: profiles } =
      memberUserIds.length > 0
        ? await supabaseAdmin.from("profiles").select("id, display_name").in("id", memberUserIds)
        : { data: [] };

    const names = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));

    return {
      ok: true,
      data: {
        team: {
          id: team.id,
          name: team.name,
          createdBy: team.created_by,
          createdAt: team.created_at,
        },
        myRole: membership.role as "owner" | "admin" | "member",
        members: (members ?? []).map((m) => ({
          userId: m.user_id,
          role: m.role as "owner" | "admin" | "member",
          joinedAt: m.joined_at,
          displayName: names.get(m.user_id) ?? null,
        })),
        invites: (invites ?? []).map((i) => ({
          id: i.id,
          token: i.token,
          email: i.email,
          role: i.role,
          status: i.status,
          createdAt: i.created_at,
          expiresAt: i.expires_at,
        })),
      },
    };
  });

export const createTeam = createServerFn({ method: "POST" })
  .validator(createInput)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }): Promise<SimpleTeamResult> => {
    const { supabase } = context;
    const me = context.userId;

    const { data: planRow } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", me)
      .maybeSingle();
    const plan = planRow?.plan ?? "free";

    const { count: teamCount } = await supabase
      .from("team_members")
      .select("team_id", { count: "exact", head: true })
      .eq("user_id", me);

    if ((teamCount ?? 0) >= (TEAM_LIMITS[plan] ?? 1)) {
      return {
        ok: false,
        message:
          plan === "free" || plan === "flex"
            ? "Your plan allows one team. Upgrade to Pro for unlimited teams."
            : "You have reached the team limit.",
      };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: team, error: teamError } = await supabaseAdmin
      .from("teams")
      .insert({ name: data.name, created_by: me })
      .select("id")
      .single();

    if (teamError || !team) return { ok: false, message: "Could not create the team." };

    const { error: memberError } = await supabaseAdmin
      .from("team_members")
      .insert({ team_id: team.id, user_id: me, role: "owner" });

    if (memberError) return { ok: false, message: "Could not add you to the team." };

    return { ok: true };
  });

export const inviteMember = createServerFn({ method: "POST" })
  .validator(inviteInput)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }): Promise<InviteMemberResult> => {
    const { supabase } = context;
    const me = context.userId;

    const { data: membership } = await supabase
      .from("team_members")
      .select("team_id, role")
      .eq("user_id", me)
      .limit(1)
      .maybeSingle();

    if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
      return { ok: false, message: "Only the team owner or an admin can invite members." };
    }

    const { data: planRow } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", me)
      .maybeSingle();
    const plan = planRow?.plan ?? "free";

    const { count: memberCount } = await supabase
      .from("team_members")
      .select("user_id", { count: "exact", head: true })
      .eq("team_id", membership.team_id);

    if ((memberCount ?? 0) >= (MEMBER_LIMITS[plan] ?? 3)) {
      return {
        ok: false,
        message:
          plan === "free"
            ? "The Free plan allows 3 team members. Upgrade to Flex (5) or Pro (unlimited)."
            : plan === "flex"
              ? "Flex allows 5 team members. Upgrade to Pro for unlimited members."
              : "Team member limit reached.",
      };
    }

    const { data: existing } = await supabase
      .from("team_invites")
      .select("id, token")
      .eq("team_id", membership.team_id)
      .eq("email", data.email)
      .eq("status", "pending")
      .maybeSingle();

    if (existing) {
      return { ok: true, link: `${buildOrigin()}/team?invite=${existing.token}` };
    }

    const token = randomToken();
    const { error: inviteError } = await supabase.from("team_invites").insert({
      team_id: membership.team_id,
      email: data.email,
      token,
      role: data.role,
      invited_by: me,
    });

    if (inviteError) {
      console.error("[Team] invite failed", inviteError.message);
      return { ok: false, message: "Could not create the invite. Please try again." };
    }

    return { ok: true, link: `${buildOrigin()}/team?invite=${token}` };
  });

export const acceptInvite = createServerFn({ method: "POST" })
  .validator(tokenInput)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }): Promise<AcceptInviteResult> => {
    const email = (context.claims ?? {})["email"];
    const me = context.userId;
    if (typeof email !== "string")
      return { ok: false, message: "Could not identify your account." };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: invite } = await supabaseAdmin
      .from("team_invites")
      .select("id, team_id, email, role, status, expires_at")
      .eq("token", data.token)
      .maybeSingle();

    if (!invite) return { ok: false, message: "This invite does not exist or has expired." };
    if (invite.status !== "pending")
      return { ok: false, message: "This invite has already been used." };
    if (invite.email.toLowerCase() !== email.toLowerCase()) {
      return { ok: false, message: "This invite was sent to a different email address." };
    }
    if (new Date(invite.expires_at).getTime() < Date.now()) {
      return { ok: false, message: "This invite has expired. Ask the team owner for a new one." };
    }

    const { data: existing } = await supabaseAdmin
      .from("team_members")
      .select("user_id")
      .eq("team_id", invite.team_id)
      .eq("user_id", me)
      .maybeSingle();

    if (existing) return { ok: false, message: "You are already a member of this team." };

    const { error: memberError } = await supabaseAdmin
      .from("team_members")
      .insert({ team_id: invite.team_id, user_id: me, role: invite.role });

    if (memberError) return { ok: false, message: "Could not join the team." };

    await supabaseAdmin.from("team_invites").update({ status: "accepted" }).eq("id", invite.id);

    const { data: team } = await supabaseAdmin
      .from("teams")
      .select("name")
      .eq("id", invite.team_id)
      .maybeSingle();

    return { ok: true, teamName: team?.name ?? "your team" };
  });

export const removeMember = createServerFn({ method: "POST" })
  .validator(removeInput)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }): Promise<SimpleTeamResult> => {
    const { supabase } = context;
    const me = context.userId;

    const { data: membership } = await supabase
      .from("team_members")
      .select("team_id, role")
      .eq("user_id", me)
      .limit(1)
      .maybeSingle();

    if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
      return { ok: false, message: "Only the owner or an admin can remove members." };
    }
    if (data.userId === me) return { ok: false, message: "You cannot remove yourself." };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: team } = await supabaseAdmin
      .from("teams")
      .select("created_by")
      .eq("id", membership.team_id)
      .maybeSingle();

    if (team?.created_by === data.userId)
      return { ok: false, message: "The owner cannot be removed." };

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("team_id", membership.team_id)
      .eq("user_id", data.userId);

    if (error) return { ok: false, message: "Could not remove the member." };
    return { ok: true };
  });

export const revokeInvite = createServerFn({ method: "POST" })
  .validator(revokeInput)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }): Promise<SimpleTeamResult> => {
    const { supabase } = context;

    const { data: invite } = await supabase
      .from("team_invites")
      .select("id, team_id")
      .eq("id", data.inviteId)
      .maybeSingle();

    if (!invite) return { ok: false, message: "Invite not found." };

    const { data: membership } = await supabase
      .from("team_members")
      .select("role")
      .eq("team_id", invite.team_id)
      .eq("user_id", context.userId)
      .maybeSingle();

    if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
      return { ok: false, message: "Only the owner or an admin can revoke invites." };
    }

    const { error } = await supabase
      .from("team_invites")
      .update({ status: "revoked" })
      .eq("id", invite.id);

    if (error) return { ok: false, message: "Could not revoke the invite." };
    return { ok: true };
  });

export const deleteTeam = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SimpleTeamResult> => {
    const { supabase } = context;
    const me = context.userId;

    const { data: membership } = await supabase
      .from("team_members")
      .select("team_id, role")
      .eq("user_id", me)
      .limit(1)
      .maybeSingle();

    if (!membership || membership.role !== "owner") {
      return { ok: false, message: "Only the team owner can delete the team." };
    }

    const { error } = await supabase.from("teams").delete().eq("id", membership.team_id);
    if (error) return { ok: false, message: "Could not delete the team." };
    return { ok: true };
  });
