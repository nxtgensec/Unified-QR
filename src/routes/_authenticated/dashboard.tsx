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
  downloadPdf,
  type BodyShape,
  type EyeShape,
} from "@/lib/qr";
import { listCodes, scanCounts, getCodeWithLogo, shortUrl, type SavedCode } from "@/lib/codes";
import { useAuth } from "@/hooks/useAuth";
import { effectivePlan, type PlanId } from "@/lib/plans";
import { toast } from "sonner";
import {
  BarChart3,
  Copy,
  Download,
  Link2,
  Loader2,
  Lock,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  ChevronDown,
  Crown,
  FileImage,
  FileType,
  FileText,
  Layers,
  QrCode,
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

type DlFormat = {
  label: string;
  ext: string;
  icon: typeof FileImage;
  pro: boolean;
  handler: () => Promise<void>;
};

const CodeCard = memo(function CodeCard({
  code,
  count,
  countsLoading,
  isPro,
  userId,
  onRename,
  onEditDest,
  onToggleActive,
  onConfirmDelete,
}: {
  code: SavedCode;
  count: number;
  countsLoading: boolean;
  isPro: boolean;
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

  const fetchFull = useCallback(async () => {
    const full = await getCodeWithLogo(code.id, userId);
    return full ?? code;
  }, [code, userId]);

  const dlFormats: DlFormat[] = useMemo(
    () => [
      {
        label: "PNG",
        ext: "png",
        icon: FileImage,
        pro: false,
        handler: async () => {
          const c = await fetchFull();
          await downloadPng(buildCodeSvg(c, 1024), `${code.name}.png`);
        },
      },
      {
        label: "SVG",
        ext: "svg",
        icon: FileType,
        pro: false,
        handler: async () => {
          const c = await fetchFull();
          downloadSvg(buildCodeSvg(c, 1024), `${code.name}.svg`);
        },
      },
      {
        label: "JPG",
        ext: "jpg",
        icon: FileImage,
        pro: true,
        handler: async () => {
          const c = await fetchFull();
          await downloadJpg(buildCodeSvg(c, 1024), `${code.name}.jpg`);
        },
      },
      {
        label: "PDF",
        ext: "pdf",
        icon: FileText,
        pro: true,
        handler: async () => {
          const c = await fetchFull();
          await downloadPdf(buildCodeSvg(c, 1024), `${code.name}.pdf`);
        },
      },
    ],
    [fetchFull, code],
  );

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
    <li className="flex gap-4 rounded-2xl border border-border bg-background p-4 shadow-card">
      <img
        src={svgDataUrl}
        alt={`${code.name} QR Code`}
        className="size-24 rounded-lg border border-border bg-background"
        width={96}
        height={96}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate font-bold">{code.name}</h2>
          <span className="rounded-full bg-background px-2 py-0.5 text-[11px] font-semibold uppercase text-muted-foreground">
            {code.is_dynamic ? "dynamic" : code.type}
          </span>
          {code.team_id && code.user_id !== userId && (
            <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold uppercase text-brand">
              shared
            </span>
          )}
          {code.source === "bulk" && (
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase text-blue-500">
              bulk
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
          {countsLoading ? (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Loader2 className="size-3 animate-spin" /> loading scans…
            </span>
          ) : (
            <>
              {count} scan{count === 1 ? "" : "s"}
            </>
          )}
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
              <div className="absolute left-0 top-full z-40 mt-1 w-52 overflow-hidden rounded-xl border border-border bg-background shadow-float">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Free formats
                </div>
                {dlFormats
                  .filter((f) => !f.pro)
                  .map((f) => (
                    <button
                      key={f.label}
                      type="button"
                      onClick={() => {
                        void f.handler();
                        setDlOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors hover:bg-muted"
                    >
                      <f.icon className="size-3.5 text-muted-foreground" /> {f.label}
                      <span className="ml-auto text-[10px] text-muted-foreground">Free</span>
                    </button>
                  ))}
                <div className="mx-2 my-1 border-t border-border" />
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Pro formats
                </div>
                {dlFormats
                  .filter((f) => f.pro)
                  .map((f) => {
                    const locked = !isPro;
                    return (
                      <button
                        key={f.label}
                        type="button"
                        disabled={locked}
                        onClick={() => {
                          if (locked) {
                            toast.error("Pro feature", {
                              description: "Upgrade your plan to unlock JPG & PDF exports.",
                            });
                            return;
                          }
                          void f.handler();
                          setDlOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors ${
                          locked ? "cursor-not-allowed text-muted-foreground/50" : "hover:bg-muted"
                        }`}
                      >
                        {locked ? (
                          <Lock className="size-3.5 text-muted-foreground/50" />
                        ) : (
                          <f.icon className="size-3.5 text-muted-foreground" />
                        )}
                        {f.label}
                        {locked && (
                          <span className="ml-auto inline-flex items-center gap-0.5 rounded-full bg-premium/10 px-1.5 py-0.5 text-[10px] font-bold text-premium">
                            <Crown className="size-2.5" /> Pro
                          </span>
                        )}
                      </button>
                    );
                  })}
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
  const [countsLoading, setCountsLoading] = useState(true);
  const [plan, setPlan] = useState<PlanId>("free");

  const [bulkCodes, setBulkCodes] = useState<SavedCode[]>([]);
  const [bulkCounts, setBulkCounts] = useState<Record<string, number>>({});

  const [workspacePages, setWorkspacePages] = useState<
    { id: string; title: string; slug: string }[]
  >([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);

  const [dialog, setDialog] = useState<{
    title: string;
    label: string;
    value: string;
    onSave: (v: string) => Promise<void>;
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<SavedCode | null>(null);

  const isPro = plan !== "free";

  async function refresh() {
    if (!user) return;
    try {
      const rows = await listCodes(user.id);
      setCodes(rows);
      setLoading(false);
      setCountsLoading(true);

      scanCounts(rows.map((r) => r.id))
        .then((scanMap) => {
          setCounts(scanMap);
          setCountsLoading(false);
        })
        .catch((e) => {
          console.error("[Dashboard] scanCounts error:", e);
          setCountsLoading(false);
        });

      const bulk = rows.filter((r) => r.source === "bulk");
      setBulkCodes(bulk);
      if (bulk.length > 0) {
        scanCounts(bulk.map((r) => r.id))
          .then(setBulkCounts)
          .catch(() => {});
      }

      const { data: pagesData } = await supabase
        .from("link_pages")
        .select("id, title, slug")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      const pages = (pagesData ?? []) as { id: string; title: string; slug: string }[];
      setWorkspacePages(pages);

      if (pages.length > 0) {
        const pageIds = pages.map((p) => p.id);
        const viewsData = await supabase
          .from("link_page_views")
          .select("id", { count: "exact", head: true })
          .in("page_id", pageIds);
        setTotalViews(viewsData.count ?? 0);

        const { data: sectionsData } = await supabase
          .from("link_sections")
          .select("id")
          .in("page_id", pageIds);
        const sectionIds = (sectionsData ?? []).map((s) => s.id);

        if (sectionIds.length > 0) {
          const { data: itemsData } = await supabase
            .from("link_items")
            .select("id")
            .in("section_id", sectionIds);
          const itemIds = (itemsData ?? []).map((i) => i.id);

          if (itemIds.length > 0) {
            const clicksData = await supabase
              .from("link_item_clicks")
              .select("id", { count: "exact", head: true })
              .in("item_id", itemIds);
            setTotalClicks(clicksData.count ?? 0);
          } else {
            setTotalClicks(0);
          }
        } else {
          setTotalClicks(0);
        }
      }
    } catch (e) {
      console.error("[Dashboard] refresh error:", e);
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === "string"
            ? e
            : (JSON.stringify(e) ?? "Unknown error");
      toast.error("Could not load your data.", { description: msg });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user) return;
    void refresh();
    supabase
      .from("profiles")
      .select("plan, plan_expires_at")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setPlan(effectivePlan(data?.plan, data?.plan_expires_at));
      });
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

  const totalScans = Object.values(counts).reduce((a, b) => a + b, 0);
  const dynamicCount = codes.filter((c) => c.is_dynamic).length;
  const regularCodes = codes.filter((c) => c.source !== "bulk");
  const bulkTotalScans = Object.values(bulkCounts).reduce((a, b) => a + b, 0);
  const batches = useMemo(() => {
    const set = new Set<string>();
    for (const c of bulkCodes) if (c.batch_id) set.add(c.batch_id);
    return set.size;
  }, [bulkCodes]);
  const recentCodes = useMemo(() => codes.filter((c) => c.source !== "bulk").slice(0, 3), [codes]);
  const recentBulk = useMemo(() => bulkCodes.slice(0, 3), [bulkCodes]);

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading dashboard…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of everything you've built — {user?.email}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            setCountsLoading(true);
            void refresh();
          }}
          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-background disabled:opacity-50"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* ── QR Codes Card ── */}
        <div className="flex flex-col rounded-2xl border border-border bg-background p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand">
              <QrCode className="size-5" />
            </span>
            <div>
              <h2 className="font-extrabold">QR Codes</h2>
              <p className="text-xs text-muted-foreground">Create, manage & track scans</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <MiniStat label="Codes" value={regularCodes.length} loading={loading} />
            <MiniStat label="Dynamic" value={dynamicCount} loading={loading} />
            <MiniStat label="Scans" value={totalScans} loading={countsLoading} />
          </div>

          {recentCodes.length > 0 && (
            <div className="mt-5 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Recent
              </p>
              {recentCodes.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2"
                >
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold">{c.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {counts[c.id] ?? 0} scans
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto pt-5 flex gap-2">
            <Link
              to="/create"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold text-brand-foreground"
            >
              <Plus className="size-3" /> Create
            </Link>
            <Link
              to="/analytics"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold transition-colors hover:bg-background"
            >
              <BarChart3 className="size-3" /> Analytics
            </Link>
          </div>
        </div>

        {/* ── Bulk Card ── */}
        <div className="flex flex-col rounded-2xl border border-border bg-background p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
              <Layers className="size-5" />
            </span>
            <div>
              <h2 className="font-extrabold">Bulk Creation</h2>
              <p className="text-xs text-muted-foreground">Batch generate QR codes</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <MiniStat label="Codes" value={bulkCodes.length} loading={loading} />
            <MiniStat label="Batches" value={batches} loading={loading} />
            <MiniStat label="Scans" value={bulkTotalScans} loading={countsLoading} />
          </div>

          {recentBulk.length > 0 && (
            <div className="mt-5 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Recent
              </p>
              {recentBulk.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2"
                >
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold">{c.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {bulkCounts[c.id] ?? 0} scans
                  </span>
                </div>
              ))}
            </div>
          )}

          {bulkCodes.length === 0 && (
            <div className="mt-5 flex-1 rounded-xl border border-dashed border-border p-4 text-center">
              <p className="text-xs text-muted-foreground">
                No bulk codes yet — create batches of QR codes at once.
              </p>
            </div>
          )}

          <div className="mt-auto pt-5 flex gap-2">
            <Link
              to="/bulk"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold text-brand-foreground"
            >
              <Plus className="size-3" /> Bulk Create
            </Link>
            <Link
              to="/bulk-analytics"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold transition-colors hover:bg-background"
            >
              <BarChart3 className="size-3" /> Analytics
            </Link>
          </div>
        </div>

        {/* ── Workspace Card ── */}
        <div className="flex flex-col rounded-2xl border border-border bg-background p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <Link2 className="size-5" />
            </span>
            <div>
              <h2 className="font-extrabold">Workspace</h2>
              <p className="text-xs text-muted-foreground">Multi-link pages & bio links</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <MiniStat label="Pages" value={workspacePages.length} loading={loading} />
            <MiniStat label="Views" value={totalViews} loading={loading} />
            <MiniStat label="Clicks" value={totalClicks} loading={loading} />
          </div>

          {workspacePages.length > 0 && (
            <div className="mt-5 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Your pages
              </p>
              {workspacePages.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2"
                >
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold">{p.title}</span>
                  <span className="text-[10px] text-muted-foreground">/{p.slug}</span>
                </div>
              ))}
            </div>
          )}

          {workspacePages.length === 0 && (
            <div className="mt-5 flex-1 rounded-xl border border-dashed border-border p-4 text-center">
              <p className="text-xs text-muted-foreground">
                No workspace pages yet — create a multi-link page with one QR code.
              </p>
            </div>
          )}

          <div className="mt-auto pt-5 flex gap-2">
            <Link
              to="/links"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold text-brand-foreground"
            >
              <Plus className="size-3" /> Editor
            </Link>
            <Link
              to="/workspace-analytics"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold transition-colors hover:bg-background"
            >
              <BarChart3 className="size-3" /> Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* ── All QR Codes Section ── */}
      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight">All QR Codes</h2>
          <Link
            to="/create"
            className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold text-brand-foreground"
          >
            <Plus className="size-3" /> New QR Code
          </Link>
        </div>
        {codes.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-10 text-center">
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
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {codes.map((c) => (
              <CodeCard
                key={c.id}
                code={c}
                count={counts[c.id] ?? 0}
                countsLoading={countsLoading}
                isPro={isPro}
                userId={user?.id}
                onRename={(c) =>
                  setDialog({
                    title: "Rename QR Code",
                    label: "Name",
                    value: c.name,
                    onSave: (v) => saveName(c, v),
                  })
                }
                onEditDest={(c) =>
                  setDialog({
                    title: "Edit destination",
                    label: "Destination URL",
                    value: c.destination ?? "",
                    onSave: (v) => saveDestination(c, v),
                  })
                }
                onToggleActive={(c) => void toggleActive(c)}
                onConfirmDelete={(c) => setConfirmDelete(c)}
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

function MiniStat({ label, value, loading }: { label: string; value: number; loading?: boolean }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background p-3 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-xl font-extrabold">
        {loading ? (
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
          </span>
        ) : (
          value.toLocaleString()
        )}
      </p>
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
        className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-float"
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
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
        />
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-bold hover:bg-background"
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

function Action({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 transition-colors hover:bg-background"
    >
      {children}
    </button>
  );
}
