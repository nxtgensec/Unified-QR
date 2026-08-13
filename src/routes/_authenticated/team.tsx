import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, BetaNotice } from "@/components/app/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Shield, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/team")({
  head: () => ({
    meta: [
      { title: "Team (Beta) — UnifiedQR Workspace" },
      {
        name: "description",
        content:
          "Preview of UnifiedQR team workspaces: invite members, share code libraries and manage roles.",
      },
      { property: "og:title", content: "Team (Beta) — UnifiedQR" },
      { property: "og:description", content: "Invites, shared libraries and roles preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        title="Team"
        beta
        description="Share a code library with colleagues, control who can edit destinations and keep an audit trail."
      />
      <BetaNotice>Invites are disabled. Your workspace is currently single-user.</BetaNotice>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Users className="size-4 text-brand" /> Members
          </h2>
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-full bg-brand px-4 py-2 text-xs font-bold text-brand-foreground opacity-50"
          >
            Invite member
          </button>
        </div>
        <ul className="divide-y divide-border">
          <li className="flex items-center gap-3 px-5 py-4">
            <span className="grid size-9 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">
              {(user?.email ?? "?").slice(0, 2).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{user?.email}</span>
              <span className="text-xs text-muted-foreground">You</span>
            </span>
            <span className="flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-[11px] font-bold uppercase text-muted-foreground">
              <Shield className="size-3" /> Owner
            </span>
          </li>
          <li className="flex items-center gap-3 px-5 py-4 opacity-60">
            <span className="grid size-9 place-items-center rounded-full bg-surface">
              <Mail className="size-4 text-muted-foreground" />
            </span>
            <span className="text-sm text-muted-foreground">
              Pending invites will appear here once team workspaces ship.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
