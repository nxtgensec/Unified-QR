import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { renderQrSvg, svgToDataUrl, templates, downloadPng, downloadSvg } from "@/lib/qr";
import { listCodes, scanCounts, shortUrl, type SavedCode } from "@/lib/codes";
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
  Trash2,
  Users,
  CreditCard,
  Image as ImageIcon,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";

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
  return c.is_dynamic && c.slug ? shortUrl(c.slug) : c.content || "https://unifiedqr.app";
}

function codeSvg(c: SavedCode, size = 256) {
  const base = templates.find((t) => t.id === c.template_id) ?? templates[0]!;
  const tpl = { ...base, fg: c.fg ?? base.fg, bg: c.bg ?? base.bg, eye: c.fg ?? base.eye };
  return renderQrSvg(codeData(c), tpl, { size, watermark: false });
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [codes, setCodes] = useState<SavedCode[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const rows = await listCodes();
      setCodes(rows);
      setCounts(await scanCounts(rows.map((r) => r.id)));
    } catch {
      toast.error("Could not load your codes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

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
    const { error } = await supabase
      .from("qr_codes")
      .update({ active: !c.active })
      .eq("id", c.id);
    if (error) {
      toast.error("Update failed.");
      return;
    }
    setCodes((rows) => rows.map((r) => (r.id === c.id ? { ...r, active: !c.active } : r)));
  }

  async function editDestination(c: SavedCode) {
    const next = window.prompt("New destination URL", c.destination ?? "");
    if (next === null) return;
    const value = next.trim();
    if (!value) return;
    const { error } = await supabase
      .from("qr_codes")
      .update({ destination: value })
      .eq("id", c.id);
    if (error) {
      toast.error("Update failed.");
      return;
    }
    setCodes((rows) => rows.map((r) => (r.id === c.id ? { ...r, destination: value } : r)));
    toast.success("Destination updated — the printed code keeps working");
  }

  async function rename(c: SavedCode) {
    const next = window.prompt("Rename QR Code", c.name);
    if (!next?.trim()) return;
    const { error } = await supabase.from("qr_codes").update({ name: next.trim() }).eq("id", c.id);
    if (error) {
      toast.error("Rename failed.");
      return;
    }
    setCodes((rows) => rows.map((r) => (r.id === c.id ? { ...r, name: next.trim() } : r)));
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const totalScans = Object.values(counts).reduce((a, b) => a + b, 0);
  const dynamicCount = codes.filter((c) => c.is_dynamic).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your QR Codes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed in as {user?.email}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/"
            hash="generator"
            className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground shadow-card"
          >
            <Plus className="size-4" /> New QR Code
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-bold hover:bg-surface"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Saved codes" value={codes.length} icon={<Link2 className="size-4" />} />
        <Stat label="Dynamic codes" value={dynamicCount} icon={<Pencil className="size-4" />} />
        <Stat label="Total scans" value={totalScans} icon={<BarChart3 className="size-4" />} />
      </div>

      <section className="mt-10">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading your codes…
          </div>
        ) : codes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="font-semibold">No saved codes yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Build one on the generator and hit “Save to my account”.
            </p>
            <Link
              to="/"
              hash="generator"
              className="mt-5 inline-block rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground"
            >
              Open generator
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {codes.map((c) => (
              <li
                key={c.id}
                className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-card"
              >
                <img
                  src={svgToDataUrl(codeSvg(c))}
                  alt={`${c.name} QR Code`}
                  className="size-24 rounded-lg border border-border bg-surface"
                  width={96}
                  height={96}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate font-bold">{c.name}</h2>
                    <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold uppercase text-muted-foreground">
                      {c.is_dynamic ? "dynamic" : c.type}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {c.is_dynamic ? c.destination : c.content}
                  </p>
                  {c.is_dynamic && c.slug && (
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard.writeText(shortUrl(c.slug!));
                        toast.success("Short link copied");
                      }}
                      className="mt-1 flex items-center gap-1 text-xs font-semibold text-brand"
                    >
                      <Copy className="size-3" /> {shortUrl(c.slug)}
                    </button>
                  )}
                  <p className="mt-2 text-xs font-semibold">
                    {counts[c.id] ?? 0} scan{(counts[c.id] ?? 0) === 1 ? "" : "s"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                    <Action onClick={() => rename(c)}>Rename</Action>
                    {c.is_dynamic && (
                      <>
                        <Action onClick={() => editDestination(c)}>Edit destination</Action>
                        <Action onClick={() => toggleActive(c)}>
                          {c.active ? "Pause" : "Activate"}
                        </Action>
                      </>
                    )}
                    <Action onClick={() => downloadPng(codeSvg(c, 1024), `${c.name}.png`)}>
                      <Download className="size-3" /> PNG
                    </Action>
                    <Action onClick={() => downloadSvg(codeSvg(c, 1024), `${c.name}.svg`)}>
                      SVG
                    </Action>
                    <Action onClick={() => remove(c.id)}>
                      <Trash2 className="size-3" /> Delete
                    </Action>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14">
        <h2 className="text-lg font-extrabold tracking-tight">Coming next</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          These are in the works — you can see them, but they aren’t live yet.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BetaCard icon={<BarChart3 className="size-4" />} title="Advanced analytics">
            Scan charts over time, locations and devices.
          </BetaCard>
          <BetaCard icon={<Users className="size-4" />} title="Teams">
            Invite members and share code libraries.
          </BetaCard>
          <BetaCard icon={<CreditCard className="size-4" />} title="Billing">
            Flex and Pro subscriptions with plan limits.
          </BetaCard>
          <BetaCard icon={<ImageIcon className="size-4" />} title="Logos & frames">
            Center logos, “Scan me” frames, JPG and PDF export.
          </BetaCard>
        </div>
      </section>
    </div>
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

function BetaCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <span className="text-brand">{icon}</span>
        <h3 className="text-sm font-bold">{title}</h3>
        <span className="rounded-full bg-premium/15 px-2 py-0.5 text-[10px] font-bold uppercase text-premium">
          Beta
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{children}</p>
    </div>
  );
}
