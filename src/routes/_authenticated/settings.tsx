import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { PageHeader } from "@/components/app/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { listCodes, listScans, shortUrl, toCsv, downloadCsv } from "@/lib/codes";
import { templates } from "@/lib/qr";
import { effectivePlan, PLANS, type PlanId } from "@/lib/plans";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Download, FileJson, Loader2, Save, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Workspace Settings — UnifiedQR" },
      {
        name: "description",
        content:
          "Manage your UnifiedQR profile, default QR style, export every saved code and scan as CSV or JSON, and manage your plan.",
      },
      { property: "og:title", content: "Workspace Settings — UnifiedQR" },
      { property: "og:description", content: "Profile, plan, data export and account controls." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const deleteAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase.rpc("delete_my_account");
    return { ok: !error, message: error?.message };
  });

const TEMPLATE_KEY = "unifiedqr:default-template";

function SettingsPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [plan, setPlan] = useState<PlanId>("free");
  const [planExpiresAt, setPlanExpiresAt] = useState<string | null>(null);
  const [defaultTemplate, setDefaultTemplate] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingJson, setExportingJson] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const activePlan = effectivePlan(plan, planExpiresAt);
  const hasPaidPlan = activePlan !== "free";

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, plan, plan_expires_at")
        .eq("id", user.id)
        .maybeSingle();
      setDisplayName(data?.display_name ?? "");
      setPlan((data?.plan as PlanId) ?? "free");
      setPlanExpiresAt(data?.plan_expires_at ?? null);
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

  async function exportCsv() {
    if (!user) return;
    setExportingCsv(true);
    try {
      const codes = await listCodes(user.id);
      const scans = await listScans(codes.map((c) => c.id));
      const counts = new Map<string, number>();
      for (const s of scans) counts.set(s.code_id, (counts.get(s.code_id) ?? 0) + 1);
      downloadCsv(
        "unifiedqr-export.csv",
        toCsv([
          [
            "name",
            "type",
            "dynamic",
            "content",
            "destination",
            "short_link",
            "active",
            "scans",
            "created_at",
          ],
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
      toast.success("CSV export downloaded");
    } catch {
      toast.error("Export failed.");
    } finally {
      setExportingCsv(false);
    }
  }

  async function exportJson() {
    if (!user) return;
    setExportingJson(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, plan, plan_expires_at")
        .eq("id", user.id)
        .maybeSingle();
      const codes = await listCodes(user.id);
      const scans = await listScans(codes.map((c) => c.id));
      const payload = {
        profile: profile ?? {
          display_name: displayName.trim() || null,
          plan,
          plan_expires_at: planExpiresAt,
        },
        codes,
        scans,
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "unifiedqr-export.json";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("JSON export downloaded");
    } catch {
      toast.error("Export failed.");
    } finally {
      setExportingJson(false);
    }
  }

  async function handleDeleteAccount() {
    if (!user) return;
    setDeleting(true);
    try {
      const result = await deleteAccount();
      if (!result.ok) {
        toast.error(result.message ?? "Could not delete your account.");
        setDeleteDialogOpen(false);
        return;
      }
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch {
      toast.error("Could not delete your account.");
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
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
        description="Your workspace profile, current plan, exports of your data and account controls."
      />

      <div className="mt-8 space-y-4 rounded-2xl border border-border bg-background p-6 shadow-card">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Signed in as
          </span>
          <input
            readOnly
            value={user?.email ?? ""}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground outline-none"
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
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Default template
          </span>
          <select
            value={defaultTemplate}
            onChange={(e) => setDefaultTemplate(Number(e.target.value))}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
          >
            {templates.map((t, i) => (
              <option key={t.id} value={t.id}>
                Template {i + 1} — {t.shape} dots
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Plan</span>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                hasPaidPlan
                  ? "bg-brand text-brand-foreground"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {PLANS[activePlan].label}
            </span>
            {hasPaidPlan && planExpiresAt && (
              <span className="text-xs text-muted-foreground">
                expires {new Date(planExpiresAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => void saveProfile()}
            disabled={saving}
            className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save changes
          </button>
        </div>
      </div>

      {hasPaidPlan && (
        <div className="mt-6 rounded-2xl border border-border bg-background p-6 shadow-card">
          <h2 className="text-sm font-bold">Your plan</h2>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-foreground">
              {PLANS[activePlan].label}
            </span>
            {planExpiresAt && (
              <span className="text-sm text-muted-foreground">
                Active until{" "}
                {new Date(planExpiresAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Upgrade, switch or renew any time from the Billing page.
          </p>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-border bg-background p-5 shadow-card">
        <h2 className="text-sm font-bold">Export your data</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Every saved code, its short link and total scans as a CSV — or everything including your
          profile and raw scan rows as JSON.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void exportCsv()}
            disabled={exportingCsv || exportingJson}
            className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold disabled:opacity-60"
          >
            {exportingCsv ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            Download CSV
          </button>
          <button
            type="button"
            onClick={() => void exportJson()}
            disabled={exportingCsv || exportingJson}
            className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold disabled:opacity-60"
          >
            {exportingJson ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FileJson className="size-4" />
            )}
            Download JSON
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-red-500/30 bg-background p-5 shadow-card">
        <h2 className="flex items-center gap-2 text-sm font-bold text-red-600">
          <Trash2 className="size-4" /> Delete account
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-red-500 sm:max-w-xs"
          />
          <button
            type="button"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={deleteConfirmation !== "DELETE" || deleting}
            className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            Delete forever
          </button>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              Your account, every saved QR code and all scan history will be permanently removed.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleDeleteAccount();
              }}
              disabled={deleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="size-4" /> Yes, delete my account
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
