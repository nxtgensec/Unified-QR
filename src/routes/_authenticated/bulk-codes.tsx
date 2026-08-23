import { createFileRoute, Link } from "@tanstack/react-router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/app/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { listBulkCodes, scanCounts, shortUrl, type SavedCode } from "@/lib/codes";
import {
  renderQrSvg,
  svgToDataUrl,
  downloadPng,
  downloadSvg,
  templates,
  type BodyShape,
  type EyeShape,
} from "@/lib/qr";
import { effectivePlan, type PlanId } from "@/lib/plans";
import { toast } from "sonner";
import {
  BarChart3,
  ChevronDown,
  Copy,
  Download,
  Layers,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/bulk-codes")({
  head: () => ({
    meta: [
      { title: "Bulk QR Codes — UnifiedQR Workspace" },
      {
        name: "description",
        content: "View and manage your bulk-created QR Codes and their analytics.",
      },
    ],
  }),
  component: BulkCodesPage,
});

function codeData(c: SavedCode) {
  return c.is_dynamic && c.slug ? shortUrl(c.slug) : c.content || "https://qr.nxtgensec.org";
}

function buildCodeSvg(c: SavedCode, size = 256) {
  const base = templates.find((t) => t.id === c.template_id) ?? templates[0]!;
  return renderQrSvg(
    codeData(c),
    {
      templateId: c.template_id,
      fg: c.fg ?? base.fg,
      bg: c.bg ?? base.bg,
      eye: c.fg ?? base.eye,
      bodyShape: (c.body_shape as BodyShape | undefined) ?? base.shape,
      eyeShape: (c.eye_shape as EyeShape | undefined) ?? base.eyeShape,
      ...(c.gradient_type && c.gradient_color
        ? {
            gradient: {
              type: c.gradient_type as "linear" | "radial",
              color: c.gradient_color,
              angle: c.gradient_angle ?? 135,
            },
          }
        : {}),
      ...(c.frame_text
        ? {
            frame: {
              text: c.frame_text,
              style: (c.frame_style as "default" | "rounded" | "badge") ?? "default",
            },
          }
        : {}),
      ...(c.logo_url ? { logo: c.logo_url } : {}),
    },
    { size },
  );
}

function PromptDialog({
  title,
  label,
  initial,
  onClose,
  onSave,
}: {
  title: string;
  label: string;
  initial: string;
  onClose: () => void;
  onSave: (v: string) => Promise<void>;
}) {
  const [val, setVal] = useState(initial);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-float"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-extrabold">{title}</h2>
        <label className="mt-3 block text-xs font-semibold text-muted-foreground">{label}</label>
        <input
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void onSave(val);
          }}
          className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand"
        />
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-bold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void onSave(val)}
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

const BulkCodeCard = memo(function BulkCodeCard({
  code,
  count,
  countsLoading,
  userId,
  onRename,
  onEditDest,
  onToggleActive,
  onConfirmDelete,
}: {
  code: SavedCode;
  count: number;
  countsLoading: boolean;
  userId: string | undefined;
  onRename: (c: SavedCode) => void;
  onEditDest: (c: SavedCode) => void;
  onToggleActive: (c: SavedCode) => void;
  onConfirmDelete: (c: SavedCode) => void;
}) {
  const svgDataUrl = useMemo(() => svgToDataUrl(buildCodeSvg(code, 96)), [code]);
  const handleCopyLink = useCallback(() => {
    if (code.slug) {
      void navigator.clipboard.writeText(shortUrl(code.slug));
      toast.success("Short link copied");
    }
  }, [code.slug]);

  return (
    <li className="flex gap-4 rounded-2xl border border-border bg-background p-4 shadow-card">
      <img
        src={svgDataUrl}
        alt={`${code.name} QR Code`}
        className="size-16 shrink-0 rounded-lg border border-border bg-background"
        width={64}
        height={64}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-bold">{code.name}</h3>
          {!code.active && (
            <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-yellow-600">
              paused
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {code.is_dynamic ? code.destination : code.content}
        </p>
        {code.is_dynamic && code.slug && (
          <button
            type="button"
            onClick={handleCopyLink}
            className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-brand"
          >
            <Copy className="size-3" /> {shortUrl(code.slug)}
          </button>
        )}
        <div className="mt-2 flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground">
            {countsLoading ? (
              <Loader2 className="size-3 inline animate-spin" />
            ) : (
              `${count} scan${count === 1 ? "" : "s"}`
            )}
          </span>
          <div className="flex gap-1">
            <SmallAction onClick={() => onRename(code)}>
              <Pencil className="size-3" /> Rename
            </SmallAction>
            {code.is_dynamic && (
              <>
                <SmallAction onClick={() => onEditDest(code)}>Edit URL</SmallAction>
                <SmallAction onClick={() => onToggleActive(code)}>
                  {code.active ? "Pause" : "Activate"}
                </SmallAction>
              </>
            )}
            <SmallAction onClick={() => onConfirmDelete(code)} danger>
              <Trash2 className="size-3" />
            </SmallAction>
          </div>
        </div>
      </div>
    </li>
  );
});

function SmallAction({
  onClick,
  children,
  danger,
}: {
  onClick: () => void;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold transition-colors ${
        danger ? "hover:bg-destructive/10 hover:text-destructive" : "hover:bg-background"
      }`}
    >
      {children}
    </button>
  );
}

function BulkCodesPage() {
  const { user } = useAuth();
  const [codes, setCodes] = useState<SavedCode[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [countsLoading, setCountsLoading] = useState(true);

  async function refresh() {
    if (!user) return;
    try {
      const rows = await listBulkCodes(user.id);
      setCodes(rows);
      setLoading(false);
      setCountsLoading(true);
      scanCounts(rows.map((r) => r.id))
        .then((m) => {
          setCounts(m);
          setCountsLoading(false);
        })
        .catch(() => setCountsLoading(false));
    } catch {
      toast.error("Could not load bulk codes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user) return;
    void refresh();
  }, [user]);

  const batches = useMemo(() => {
    const map = new Map<string, SavedCode[]>();
    for (const c of codes) {
      const key = c.batch_id ?? "ungrouped";
      const arr = map.get(key);
      if (arr) arr.push(c);
      else map.set(key, [c]);
    }
    return [...map.entries()].sort((a, b) => {
      const aDate = a[1][0]?.created_at ?? "";
      const bDate = b[1][0]?.created_at ?? "";
      return bDate.localeCompare(aDate);
    });
  }, [codes]);

  const totalScans = Object.values(counts).reduce((a, b) => a + b, 0);

  async function remove(id: string) {
    const { error } = await supabase.from("qr_codes").delete().eq("id", id);
    if (error) {
      toast.error("Delete failed.");
      return;
    }
    setCodes((c) => c.filter((x) => x.id !== id));
    toast.success("Deleted");
  }

  async function toggleActive(c: SavedCode) {
    const { error } = await supabase.from("qr_codes").update({ active: !c.active }).eq("id", c.id);
    if (error) {
      toast.error("Update failed.");
      return;
    }
    setCodes((rows) => rows.map((r) => (r.id === c.id ? { ...r, active: !c.active } : r)));
  }

  async function saveDestination(c: SavedCode, value: string) {
    try {
      const url = new URL(value.startsWith("http") ? value : `https://${value}`);
      if (!["http:", "https:"].includes(url.protocol)) {
        toast.error("Only http/https URLs are allowed.");
        return;
      }
    } catch {
      toast.error("Please enter a valid URL.");
      return;
    }
    const { error } = await supabase.from("qr_codes").update({ destination: value }).eq("id", c.id);
    if (error) {
      toast.error("Update failed.");
      return;
    }
    setCodes((rows) => rows.map((r) => (r.id === c.id ? { ...r, destination: value } : r)));
    toast.success("Destination updated");
  }

  async function saveName(c: SavedCode, value: string) {
    const { error } = await supabase.from("qr_codes").update({ name: value }).eq("id", c.id);
    if (error) {
      toast.error("Rename failed.");
      return;
    }
    setCodes((rows) => rows.map((r) => (r.id === c.id ? { ...r, name: value } : r)));
    toast.success("Renamed");
  }

  const [dialog, setDialog] = useState<{
    title: string;
    label: string;
    value: string;
    onSave: (v: string) => Promise<void>;
  } | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<SavedCode | null>(null);

  const handleRename = useCallback(
    (c: SavedCode) =>
      setDialog({
        title: "Rename QR Code",
        label: "Name",
        value: c.name,
        onSave: (v) => saveName(c, v),
      }),
    [],
  );
  const handleEditDest = useCallback(
    (c: SavedCode) =>
      setDialog({
        title: "Edit destination",
        label: "Destination URL",
        value: c.destination ?? "",
        onSave: (v) => saveDestination(c, v),
      }),
    [],
  );
  const handleToggleActive = useCallback((c: SavedCode) => void toggleActive(c), []);
  const handleConfirmDelete = useCallback((c: SavedCode) => setConfirmDelete(c), []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        title="Bulk QR Codes"
        description="All QR codes created via CSV bulk import, grouped by batch."
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setCountsLoading(true);
                void refresh();
              }}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-background disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link
              to="/bulk"
              className="flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-bold text-brand-foreground"
            >
              <Plus className="size-4" /> New Bulk Import
            </Link>
          </div>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Bulk codes" value={codes.length} icon={<Layers className="size-4" />} />
        <Stat label="Batches" value={batches.length} icon={<BarChart3 className="size-4" />} />
        <Stat
          label="Total scans"
          value={totalScans}
          loading={countsLoading}
          icon={<BarChart3 className="size-4" />}
        />
      </div>

      <section className="mt-10">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading bulk codes…
          </div>
        ) : codes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <Layers className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 font-semibold">No bulk codes yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload a CSV to create QR codes in bulk.
            </p>
            <Link
              to="/bulk"
              className="mt-5 inline-block rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground"
            >
              Start bulk import
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {batches.map(([batchId, batchCodes]) => {
              const batchDate = batchCodes[0]?.created_at;
              const batchScans = batchCodes.reduce((sum, c) => sum + (counts[c.id] ?? 0), 0);
              return (
                <div
                  key={batchId}
                  className="rounded-2xl border border-border bg-background shadow-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
                    <div>
                      <span className="text-sm font-bold">
                        {batchId === "ungrouped" ? "Ungrouped" : "Batch"}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {batchCodes.length} code{batchCodes.length !== 1 ? "s" : ""}
                        {batchScans > 0 && ` · ${batchScans} scan${batchScans !== 1 ? "s" : ""}`}
                      </span>
                    </div>
                    {batchDate && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(batchDate).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <ul className="divide-y divide-border">
                    {batchCodes.map((c) => (
                      <BulkCodeCard
                        key={c.id}
                        code={c}
                        count={counts[c.id] ?? 0}
                        countsLoading={countsLoading}
                        userId={user?.id}
                        onRename={handleRename}
                        onEditDest={handleEditDest}
                        onToggleActive={handleToggleActive}
                        onConfirmDelete={handleConfirmDelete}
                      />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {dialog && (
        <PromptDialog
          title={dialog.title}
          label={dialog.label}
          initial={dialog.value}
          onClose={() => setDialog(null)}
          onSave={async (v) => {
            await dialog.onSave(v);
            setDialog(null);
          }}
        />
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onMouseDown={() => setConfirmDelete(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-float"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-extrabold">Delete "{confirmDelete.name}"?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This cannot be undone. Any printed version of this code will stop working.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-bold hover:bg-background"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  void remove(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="rounded-full bg-destructive px-5 py-2.5 text-sm font-bold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
  loading,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4 shadow-card">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-2xl font-extrabold">
        {loading ? <Loader2 className="inline size-5 animate-spin text-muted-foreground" /> : value}
      </p>
    </div>
  );
}
