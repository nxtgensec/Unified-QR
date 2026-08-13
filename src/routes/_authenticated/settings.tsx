import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, BetaNotice } from "@/components/app/AppShell";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings (Beta) — UnifiedQR Workspace" },
      {
        name: "description",
        content:
          "Preview of UnifiedQR workspace settings: profile, custom short-link domain, default styles and data export.",
      },
      { property: "og:title", content: "Settings (Beta) — UnifiedQR" },
      { property: "og:description", content: "Profile, domain and default style settings preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        title="Settings"
        beta
        description="Workspace profile, branded short-link domain, default QR style and data export."
      />
      <BetaNotice>Fields are read-only until workspace settings ship.</BetaNotice>

      <div className="mt-8 space-y-4">
        <Field label="Signed in as" value={user?.email ?? ""} />
        <Field label="Workspace name" value="My workspace" />
        <Field label="Short-link domain" value="unifiedqr.app/r/…" />
        <Field label="Default template" value="Classic" />
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="text-sm font-bold">Export your data</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          A CSV of every saved code and its scans. Available once export leaves beta.
        </p>
        <button
          type="button"
          disabled
          className="mt-4 cursor-not-allowed rounded-full border border-border px-5 py-2.5 text-sm font-bold opacity-60"
        >
          Download CSV
        </button>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <input
        readOnly
        value={value}
        className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground outline-none"
      />
    </label>
  );
}
