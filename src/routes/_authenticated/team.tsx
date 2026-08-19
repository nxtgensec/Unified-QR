import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/app/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { Copy, Crown, Loader2, Mail, ShieldCheck, Trash2, UserMinus, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  acceptInvite,
  createTeam,
  deleteTeam,
  getTeamInfo,
  inviteMember,
  removeMember,
  revokeInvite,
  type TeamResult,
} from "@/lib/team.functions";

export const Route = createFileRoute("/_authenticated/team")({
  validateSearch: z.object({ invite: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Team — UnifiedQR Workspace" },
      {
        name: "description",
        content:
          "Create a UnifiedQR team, invite members by email and share a code library with full control.",
      },
      { property: "og:title", content: "Team — UnifiedQR" },
      { property: "og:description", content: "Invites, shared libraries and roles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const search = Route.useSearch();

  const [teamName, setTeamName] = useState("");
  const [creating, setCreating] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [inviting, setInviting] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["team-info"],
    queryFn: () => getTeamInfo(),
    enabled: !!user,
  });

  async function handleAccept(token: string) {
    if (!user || accepting) return;
    setAccepting(true);
    try {
      const result = await acceptInvite({ data: { token } });
      if (result.ok) {
        toast.success(`You joined ${result.teamName}`, {
          description: "Shared codes now appear in your dashboard.",
        });
        await router.navigate({ to: "/team", search: {} });
        await queryClient.invalidateQueries({ queryKey: ["team-info"] });
      } else {
        toast.error(result.message);
        await router.navigate({ to: "/team", search: {} });
      }
    } catch {
      toast.error("Could not accept the invite. Please try again.");
      await router.navigate({ to: "/team", search: {} });
    } finally {
      setAccepting(false);
    }
  }

  useEffect(() => {
    if (search.invite) void handleAccept(search.invite);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.invite, user]);

  async function handleCreate() {
    if (!teamName.trim()) return;
    setCreating(true);
    const result = await createTeam({ data: { name: teamName.trim() } });
    setCreating(false);
    if (result.ok) {
      toast.success("Team created");
      setTeamName("");
      await queryClient.invalidateQueries({ queryKey: ["team-info"] });
    } else {
      toast.error(result.message);
    }
  }

  async function handleInvite() {
    const email = inviteEmail.trim();
    if (!email) return;
    setInviting(true);
    const result = await inviteMember({ data: { email, role: inviteRole } });
    setInviting(false);
    if (result.ok) {
      setInviteEmail("");
      toast.success("Invite created", {
        description: "Copy the invite link and send it to your teammate.",
      });
      setInviteEmail(result.link);
    } else {
      toast.error(result.message);
    }
  }

  async function copyInviteLink(link: string) {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Invite link copied");
    } catch {
      toast.error("Could not copy the link.");
    }
  }

  async function handleRemove(userId: string) {
    setBusyId(userId);
    const result = await removeMember({ data: { userId } });
    setBusyId(null);
    if (result.ok) {
      toast.success("Member removed");
      await queryClient.invalidateQueries({ queryKey: ["team-info"] });
    } else {
      toast.error(result.message);
    }
  }

  async function handleRevoke(inviteId: string) {
    setBusyId(inviteId);
    const result = await revokeInvite({ data: { inviteId } });
    setBusyId(null);
    if (result.ok) {
      toast.success("Invite revoked");
      await queryClient.invalidateQueries({ queryKey: ["team-info"] });
    } else {
      toast.error(result.message);
    }
  }

  async function handleLeave() {
    const ok = window.confirm("Leave this team? Shared codes will stay with the team.");
    if (!ok) return;
    setBusyId("leave");
    const { supabase } = await import("@/integrations/supabase/client");
    const { data: membership } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", user?.id ?? "")
      .maybeSingle();
    if (membership) {
      await supabase
        .from("team_members")
        .delete()
        .eq("team_id", membership.team_id)
        .eq("user_id", user?.id ?? "");
    }
    setBusyId(null);
    await queryClient.invalidateQueries({ queryKey: ["team-info"] });
    toast.success("You left the team");
  }

  async function handleDeleteTeam() {
    const ok = window.confirm("Delete this team for everyone? This cannot be undone.");
    if (!ok) return;
    setBusyId("delete");
    const result = await deleteTeam();
    setBusyId(null);
    if (result.ok) {
      toast.success("Team deleted");
      await queryClient.invalidateQueries({ queryKey: ["team-info"] });
    } else {
      toast.error(result.message);
    }
  }

  if (query.isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const data: TeamResult = query.data ?? { ok: false, message: "Could not load your team." };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        title="Team"
        description="Invite members by email, share a code library and control who can edit destinations."
      />

      {!data.ok ? (
        <EmptyState icon={<Users className="size-8" />} title={data.message} />
      ) : !data.data.team ? (
        <div className="mt-8 rounded-2xl border border-border bg-background p-6 shadow-card">
          <h2 className="text-lg font-extrabold">Create your team</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Teams let everyone see and manage the same code library. You'll be the owner.
          </p>
          <div className="mt-4 flex max-w-md gap-2">
            <input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void handleCreate()}
              placeholder="e.g. NxtGenSec Marketing"
              maxLength={60}
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
            <button
              type="button"
              onClick={() => void handleCreate()}
              disabled={creating || !teamName.trim()}
              className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground disabled:opacity-60"
            >
              {creating && <Loader2 className="size-4 animate-spin" />}
              Create team
            </button>
          </div>
        </div>
      ) : (
        <TeamDashboard
          data={data.data}
          me={user?.id ?? ""}
          busyId={busyId}
          inviteEmail={inviteEmail}
          inviteRole={inviteRole}
          inviting={inviting}
          onInviteEmail={setInviteEmail}
          onInviteRole={setInviteRole}
          onInvite={() => void handleInvite()}
          onCopy={(link) => void copyInviteLink(link)}
          onRemove={(id) => void handleRemove(id)}
          onRevoke={(id) => void handleRevoke(id)}
          onLeave={() => void handleLeave()}
          onDelete={() => void handleDeleteTeam()}
        />
      )}
    </div>
  );
}

function EmptyState({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-border bg-background p-10 text-center shadow-card">
      <span className="text-muted-foreground">{icon}</span>
      <p className="mt-3 text-sm text-muted-foreground">{title}</p>
    </div>
  );
}

function TeamDashboard({
  data,
  me,
  busyId,
  inviteEmail,
  inviteRole,
  inviting,
  onInviteEmail,
  onInviteRole,
  onInvite,
  onCopy,
  onRemove,
  onRevoke,
  onLeave,
  onDelete,
}: {
  data: Extract<TeamResult, { ok: true }>["data"];
  me: string;
  busyId: string | null;
  inviteEmail: string;
  inviteRole: "admin" | "member";
  inviting: boolean;
  onInviteEmail: (v: string) => void;
  onInviteRole: (v: "admin" | "member") => void;
  onInvite: () => void;
  onCopy: (link: string) => void;
  onRemove: (id: string) => void;
  onRevoke: (id: string) => void;
  onLeave: () => void;
  onDelete: () => void;
}) {
  const team = data.team!;
  const canManage = data.myRole === "owner" || data.myRole === "admin";
  const isOwner = data.myRole === "owner";
  const [linkCache, setLinkCache] = useState<Record<string, string>>({});

  async function makeLink(token: string) {
    if (linkCache[token]) return linkCache[token]!;
    const link = `${window.location.origin}/team?invite=${token}`;
    setLinkCache((c) => ({ ...c, [token]: link }));
    return link;
  }

  return (
    <>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Users className="size-4 text-brand" /> {team.name}
              <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                {data.members.length} {data.members.length === 1 ? "member" : "members"}
              </span>
            </h2>
            <div className="flex items-center gap-2">
              {isOwner && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={busyId === "delete"}
                  className="flex items-center gap-1.5 rounded-full border border-destructive/30 px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/5"
                >
                  {busyId === "delete" ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Trash2 className="size-3" />
                  )}
                  Delete team
                </button>
              )}
              {!isOwner && (
                <button
                  type="button"
                  onClick={onLeave}
                  disabled={busyId === "leave"}
                  className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:bg-background"
                >
                  {busyId === "leave" ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <UserMinus className="size-3" />
                  )}
                  Leave team
                </button>
              )}
            </div>
          </div>

          <ul className="divide-y divide-border">
            {data.members.map((m) => {
              const isMe = m.userId === me;
              return (
                <li key={m.userId} className="flex items-center gap-3 px-5 py-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                    {(m.displayName ?? m.userId.slice(0, 2)).slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {m.displayName ?? "Team member"}
                      {isMe && (
                        <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                          (you)
                        </span>
                      )}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      Joined {new Date(m.joinedAt).toLocaleDateString()}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-background px-3 py-1 text-[11px] font-bold uppercase text-muted-foreground">
                    {m.role === "owner" ? (
                      <Crown className="size-3 text-premium" />
                    ) : (
                      <ShieldCheck className="size-3" />
                    )}
                    {m.role}
                  </span>
                  {canManage && m.userId !== me && (
                    <button
                      type="button"
                      onClick={() => onRemove(m.userId)}
                      disabled={busyId === m.userId}
                      aria-label={`Remove ${m.displayName ?? "member"}`}
                      className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-60"
                    >
                      {busyId === m.userId ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <UserMinus className="size-4" />
                      )}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-background p-5 shadow-card">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Mail className="size-4 text-brand" /> Invite a member
          </h2>
          {canManage ? (
            <>
              <div className="mt-4 flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => onInviteEmail(e.target.value)}
                  placeholder="teammate@company.com"
                  className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => onInviteRole(e.target.value as "admin" | "member")}
                  className="rounded-xl border border-border bg-background px-2 py-2 text-xs font-semibold outline-none"
                  aria-label="Invite role"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                type="button"
                onClick={onInvite}
                disabled={inviting || !inviteEmail.trim()}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground disabled:opacity-60"
              >
                {inviting && <Loader2 className="size-4 animate-spin" />}
                Generate invite link
              </button>
              <p className="mt-3 text-xs text-muted-foreground">
                We generate a secure link you send to your teammate — no email service needed. Links
                expire after 7 days.
              </p>
            </>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">
              Only the owner or an admin can invite members.
            </p>
          )}

          {data.invites.filter((i) => i.status === "pending").length > 0 && (
            <div className="mt-5 border-t border-border pt-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Pending invites
              </h3>
              <ul className="mt-2 space-y-2">
                {data.invites
                  .filter((i) => i.status === "pending")
                  .map((i) => (
                    <li key={i.id} className="flex items-center justify-between gap-2 text-sm">
                      <span className="min-w-0 truncate">{i.email}</span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        <span className="text-[11px] font-bold uppercase text-muted-foreground">
                          {i.role}
                        </span>
                        <InviteActions
                          token={i.token}
                          busy={busyId === i.id}
                          onCopy={() => void (async () => onCopy(await makeLink(i.token)))()}
                          onRevoke={() => onRevoke(i.id)}
                        />
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Shared codes: any code saved to this team appears in every member's dashboard. Non-owners
        can pause a code and change its destination, but cannot delete it.
      </p>
    </>
  );
}

function InviteActions({
  token,
  busy,
  onCopy,
  onRevoke,
}: {
  token: string;
  busy: boolean;
  onCopy: () => void;
  onRevoke: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <span className="flex items-center gap-1">
      {expanded ? (
        <button
          type="button"
          onClick={async () => {
            const l = `${window.location.origin}/team?invite=${token}`;
            try {
              await navigator.clipboard.writeText(l);
              toast.success("Invite link copied");
            } catch {
              toast.error("Could not copy the link.");
            }
            setExpanded(false);
          }}
          className="rounded-full bg-background px-3 py-1 text-xs font-bold hover:bg-brand-soft hover:text-brand"
        >
          Copy link
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex items-center gap-1 rounded-full bg-background px-3 py-1 text-xs font-bold hover:bg-brand-soft hover:text-brand"
        >
          <Copy className="size-3" /> Link
        </button>
      )}
      <button
        type="button"
        onClick={onRevoke}
        disabled={busy}
        aria-label="Revoke invite"
        className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-60"
      >
        {busy ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
      </button>
    </span>
  );
}
