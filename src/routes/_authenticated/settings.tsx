import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, BetaNotice } from "@/components/app/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { listCodes, listScans, shortUrl, toCsv, downloadCsv } from "@/lib/codes";
import { templates } from "@/lib/qr";
import { toast } from "sonner";
import { Download, Loader2, Save } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Workspace Settings — UnifiedQR" },
      {
        name: "description",
        content:
          "Manage your UnifiedQR profile, default QR style and export every saved code and scan as CSV.",
      },
      { property: "og:title", content: "Workspace Settings — UnifiedQR" },
      { property: "og:description", content: "Profile, default style and data export." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const TEMPLATE_KEY = "unifiedqr:default-template";

function SettingsPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [plan, setPlan] = useState("free");
  const [defaultTemplate, setDefaultTemplate] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, plan")
        .eq("id", user.id)
        .maybeSingle();
      setDisplayName(data?.display_name ?? "");
      setPlan(data?.plan ?? "free");
      const stored = Number(localStorage.getItem(TEMPLATE_KEY));
      if (stored) setDefaultTemplate(stored);
      setLoading(false);
    })();
  }, [user]);

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, display_name: displayName.trim() || null });
    localStorage.setItem(TEMPLATE_KEY, String(defaultTemplate));
    setSaving(false);
    if (error) {
      toast.error("Could not save your settings.");
      return;
    }
    toast.success("Settings saved");
  }

  async function exportData() {
    setExporting(true);
    try {
      const codes = await listCodes();
      const scans = await listScans(codes.map((c) => c.id));
      const counts = new Map<string, number>();
      for (const s of scans) counts.set(s.code_id, (counts.get(s.code_id) ?? 0) + 1);
      downloadCsv(
        "unifiedqr-export.csv",
        toCsv([
          ["name", "type", "dynamic", "content", "destination", "short_link", "active", "scans", "created_at"],
          ...codes.map((c) => [
            c.name,
            c.type,
            c.is_dynamic ? "yes" : "no",
            c.content,
            c.destination ?? "",
            c.slug ? shortUrl(c.slug) : "",
            c.active ? "active" : "paused",
            counts.get(c.id) ?? 0,
            c.created_at,
          ]),
        ]),
      );
      toast.success("Export downloaded");
    } catch {
      toast.error("Export failed.");
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading settings…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        title="Settings"
        description="Your workspace profile, default QR style and a full export of your data."
      />

      <div className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Signed in as
          </span>
          <input
            readOnly
            value={user?.email ?? ""}
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground outline-none"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Display name
          </span>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-brand"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Default template
          </span>
          <select
            value={defaultTemplate}
            onChange={(e) => setDefaultTemplate(Number(e.target.value))}
            className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-brand"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            Plan: <span className="font-bold uppercase text-foreground">{plan}</span>
          </span>
          <button
            type="button"
            onClick={saveProfile}
            disabled={saving}
            className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save changes
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="text-sm font-bold">Export your data</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          A CSV of every saved code, its short link and total scans.
        </p>
        <button
          type="button"
          onClick={exportData}
          disabled={exporting}
          className="mt-4 flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold disabled:opacity-60"
        >
          {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          Download CSV
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="text-sm font-bold">Branded short-link domain</h2>
        <BetaNotice>
          Custom domains for your short links are still being built. Links currently use this
          workspace domain.
        </BetaNotice>
      </div>
    </div>
  );
}
