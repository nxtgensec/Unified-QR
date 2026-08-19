import { createFileRoute } from "@tanstack/react-router";
import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  renderQrSvg,
  svgToDataUrl,
  templates,
  downloadPng,
  downloadSvg,
  downloadJpg,
  downloadWebp,
  downloadPdf,
  type BodyShape,
  type EyeShape,
} from "@/lib/qr";
import { listCodes, scanCounts, getCodeWithLogo, shortUrl, type SavedCode } from "@/lib/codes";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  BarChart3,
  Copy,
  Download,
  Link2,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  ChevronDown,
  FileImage,
  FileType,
  FileText,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your QR Codes — UnifiedQR Dashboard" },
      {
        name: "description",
        content:
          "Manage saved QR codes, edit dynamic link destinations and review scan counts from your UnifiedQR dashboard.",
      },
      { property: "og:title", content: "Your QR Codes — UnifiedQR Dashboard" },
      {
        property: "og:description",
        content: "Manage saved QR codes, dynamic links and scan analytics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
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

const CodeCard = memo(function CodeCard({
  code,
  count,
  userId,
  onRename,
  onEditDest,
  onToggleActive,
  onConfirmDelete,
}: {
  code: SavedCode;
  count: number;
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
  const handlePng = useCallback(async () => {
    const full = await getCodeWithLogo(code.id, userId);
    const c = full ?? code;
    await downloadPng(buildCodeSvg(c, 1024), `${code.name}.png`);
  }, [code, userId]);
  const handleSvg = useCallback(async () => {
    const full = await getCodeWithLogo(code.id, userId);
    const c = full ?? code;
    downloadSvg(buildCodeSvg(c, 1024), `${code.name}.svg`);
  }, [code, userId]);
  const handleJpg = useCallback(async () => {
    const full = await getCodeWithLogo(code.id, userId);
    const c = full ?? code;
    await downloadJpg(buildCodeSvg(c, 1024), `${code.name}.jpg`);
  }, [code, userId]);
  const handleWebp = useCallback(async () => {
    const full = await getCodeWithLogo(code.id, userId);
    const c = full ?? code;
    await downloadWebp(buildCodeSvg(c, 1024), `${code.name}.webp`);
  }, [code, userId]);
  const handlePdf = useCallback(async () => {
    const full = await getCodeWithLogo(code.id, userId);
    const c = full ?? code;
    await downloadPdf(buildCodeSvg(c, 1024), `${code.name}.pdf`);
  }, [code, userId]);

  const [dlOpen, setDlOpen] = useState(false);
  const dlRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    function onClick(e: MouseEvent) {
      if (!node!.contains(e.target as Node)) setDlOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDlOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <li className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-card">
      <img
        src={svgDataUrl}
        alt={`${code.name} QR Code`}
        className="size-24 rounded-lg border border-border bg-surface"
        width={96}
        height={96}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate font-bold">{code.name}</h2>
          <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold uppercase text-muted-foreground">
            {code.is_dynamic ? "dynamic" : code.type}
          </span>
          {code.team_id && code.user_id !== userId && (
            <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold uppercase text-brand">
              shared
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {code.is_dynamic ? code.destination : code.content}
        </p>
        {code.is_dynamic && code.slug && (
          <button
            type="button"
            onClick={handleCopyLink}
            className="mt-1 flex items-center gap-1 text-xs font-semibold text-brand"
          >
            <Copy className="size-3" /> {shortUrl(code.slug)}
          </button>
        )}
        <p className="mt-2 text-xs font-semibold">
          {count} scan{count === 1 ? "" : "s"}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
          <Action onClick={() => onRename(code)}>Rename</Action>
          {code.is_dynamic && (
            <>
              <Action onClick={() => onEditDest(code)}>Edit destination</Action>
              <Action onClick={() => onToggleActive(code)}>
                {code.active ? "Pause" : "Activate"}
              </Action>
            </>
          )}
          <div ref={dlRef} className="relative">
            <Action onClick={() => setDlOpen((v) => !v)}>
              <Download className="size-3" /> Download{" "}
              <ChevronDown
                className={`size-2.5 transition-transform ${dlOpen ? "rotate-180" : ""}`}
              />
            </Action>
            {dlOpen && (
              <div className="absolute left-0 top-full z-40 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-float">
                {[
                  { label: "PNG", icon: FileImage, handler: handlePng },
                  { label: "SVG", icon: FileType, handler: handleSvg },
                  { label: "JPG", icon: FileImage, handler: handleJpg },
                  { label: "WebP", icon: FileImage, handler: handleWebp },
                  { label: "PDF", icon: FileText, handler: handlePdf },
                ].map((f) => (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => {
                      void f.handler();
                      setDlOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors hover:bg-surface"
                  >
                    <f.icon className="size-3.5 text-muted-foreground" /> {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {(code.user_id === userId || !code.team_id) && (
            <Action onClick={() => onConfirmDelete(code)}>
              <Trash2 className="size-3" /> Delete
            </Action>
          )}
        </div>
      </div>
    </li>
  );
});

function Dashboard() {
  const { user } = useAuth();
  const [codes, setCodes] = useState<SavedCode[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  async function refresh() {
    if (!user) return;
    try {
      const rows = await listCodes(user.id);
      const scanMap = await scanCounts(rows.map((r) => r.id));
      setCodes(rows);
      setCounts(scanMap);
    } catch (e) {
      console.error("[Dashboard] refresh error:", e);
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === "string"
            ? e
            : (JSON.stringify(e) ?? "Unknown error");
      toast.error("Could not load your codes.", { description: msg });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, [user]);

  async function remove(id: string) {
    const { error } = await supabase.from("qr_codes").delete().eq("id", id);
    if (error) {
      toast.error("Delete failed.");
      return;
    }
    setCodes((c) => c.filter((x) => x.id !== id));
    toast.success("QR Code deleted");
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
    toast.success("Destination updated — the printed code keeps working");
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

  const [dialog, setDialog] = useState<{
    title: string;
    label: string;
    value: string;
    onSave: (v: string) => Promise<void>;
  } | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<SavedCode | null>(null);

  const totalScans = Object.values(counts).reduce((a, b) => a + b, 0);
  const dynamicCount = codes.filter((c) => c.is_dynamic).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Your QR Codes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Saved codes, dynamic links and scan totals for {user?.email}
          </p>
        </div>
        <Link
          to="/create"
          className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground shadow-card"
        >
          <Plus className="size-4" /> New QR Code
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Saved codes" value={codes.length} icon={<Link2 className="size-4" />} />
        <Stat label="Dynamic codes" value={dynamicCount} icon={<Pencil className="size-4" />} />
        <Stat label="Total scans" value={totalScans} icon={<BarChart3 className="size-4" />} />
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight">Your Codes</h2>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void refresh();
            }}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-surface disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading your codes…
          </div>
        ) : codes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="font-semibold">No saved codes yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Build one on the generator and hit "Save to my account".
            </p>
            <Link
              to="/create"
              className="mt-5 inline-block rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground"
            >
              Open generator
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {codes.map((c) => (
              <CodeCard
                key={c.id}
                code={c}
                count={counts[c.id] ?? 0}
                userId={user?.id}
                onRename={handleRename}
                onEditDest={handleEditDest}
                onToggleActive={handleToggleActive}
                onConfirmDelete={handleConfirmDelete}
              />
            ))}
          </ul>
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
        <Modal onClose={() => setConfirmDelete(null)}>
          <h2 className="text-lg font-extrabold">Delete “{confirmDelete.name}”?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This cannot be undone. Any printed version of this code will stop working.
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirmDelete(null)}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-bold hover:bg-surface"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                void remove(confirmDelete.id);
                setConfirmDelete(null);
              }}
              className="rounded-full bg-destructive px-5 py-2.5 text-sm font-bold text-destructive-foreground"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-float"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function PromptDialog({
  title,
  label,
  initial,
  onSave,
  onClose,
}: {
  title: string;
  label: string;
  initial: string;
  onSave: (value: string) => Promise<void>;
  onClose: () => void;
}) {
  const [value, setValue] = useState(initial);
  const [busy, setBusy] = useState(false);

  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-extrabold">{title}</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!value.trim() || busy) return;
          setBusy(true);
          await onSave(value.trim());
          setBusy(false);
        }}
      >
        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </label>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-brand"
        />
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-bold hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !value.trim()}
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon} {label}
      </p>
      <p className="mt-2 text-3xl font-extrabold">{value}</p>
    </div>
  );
}

function Action({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 transition-colors hover:bg-surface"
    >
      {children}
    </button>
  );
}
