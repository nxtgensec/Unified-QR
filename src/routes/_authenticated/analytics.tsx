import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import {
  listCodes,
  listScans,
  toCsv,
  downloadCsv,
  shortUrl,
  type SavedCode,
  type ScanRow,
} from "@/lib/codes";
import { toast } from "sonner";
import { BarChart3, Download, Loader2, Smartphone, TrendingUp, Link2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({
    meta: [
      { title: "Scan Analytics — UnifiedQR Workspace" },
      {
        name: "description",
        content:
          "Live UnifiedQR scan analytics: scans over time, device breakdown, top performing codes and CSV export.",
      },
      { property: "og:title", content: "Scan Analytics — UnifiedQR" },
      { property: "og:description", content: "Live scan analytics for your dynamic QR Codes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyticsPage,
});

const DAYS = 30;

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function AnalyticsPage() {
  const [codes, setCodes] = useState<SavedCode[]>([]);
  const [scans, setScans] = useState<ScanRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const rows = await listCodes();
        setCodes(rows);
        setScans(await listScans(rows.map((r) => r.id)));
      } catch {
        toast.error("Could not load analytics.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const series = useMemo(() => {
    const buckets: { key: string; label: string; count: number }[] = [];
    const map = new Map<string, number>();
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      const key = dayKey(d);
      map.set(key, 0);
      buckets.push({
        key,
        label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        count: 0,
      });
    }
    for (const s of scans) {
      const key = s.scanned_at.slice(0, 10);
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
    }
    return buckets.map((b) => ({ ...b, count: map.get(b.key) ?? 0 }));
  }, [scans]);

  const devices = useMemo(() => {
    const out = new Map<string, number>();
    for (const s of scans) {
      const ua = (s.device ?? "").toLowerCase();
      const label = /iphone|ipad|ios/.test(ua)
        ? "iOS"
        : /android/.test(ua)
          ? "Android"
          : /windows|mac os|linux/.test(ua)
            ? "Desktop"
            : "Other";
      out.set(label, (out.get(label) ?? 0) + 1);
    }
    return [...out.entries()].sort((a, b) => b[1] - a[1]);
  }, [scans]);

  const perCode = useMemo(() => {
    const out = new Map<string, number>();
    for (const s of scans) out.set(s.code_id, (out.get(s.code_id) ?? 0) + 1);
    return codes
      .map((c) => ({ code: c, count: out.get(c.id) ?? 0 }))
      .sort((a, b) => b.count - a.count);
  }, [codes, scans]);

  const total = scans.length;
  const last7 = series.slice(-7).reduce((a, b) => a + b.count, 0);
  const dynamicCount = codes.filter((c) => c.is_dynamic).length;
  const max = Math.max(1, ...series.map((s) => s.count));

  function exportCsv() {
    const rows: (string | number)[][] = [["scanned_at", "code_name", "short_link", "device", "referrer"]];
    const byId = new Map(codes.map((c) => [c.id, c]));
    for (const s of scans) {
      const c = byId.get(s.code_id);
      rows.push([
        s.scanned_at,
        c?.name ?? "",
        c?.slug ? shortUrl(c.slug) : "",
        s.device ?? "",
        s.referrer ?? "",
      ]);
    }
    downloadCsv("unifiedqr-scans.csv", toCsv(rows));
    toast.success("Scan export downloaded");
  }

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading your scan data…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        title="Analytics"
        description="Live scan reporting across every dynamic code in your workspace."
        actions={
          <button
            type="button"
            onClick={exportCsv}
            disabled={total === 0}
            className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold disabled:opacity-50"
          >
            <Download className="size-4" /> Export CSV
          </button>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<BarChart3 className="size-4" />} label="Total scans" value={total} />
        <Stat icon={<TrendingUp className="size-4" />} label="Last 7 days" value={last7} />
        <Stat icon={<Link2 className="size-4" />} label="Dynamic codes" value={dynamicCount} />
        <Stat
          icon={<Smartphone className="size-4" />}
          label="Top device"
          value={devices[0]?.[0] ?? "—"}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Scans over the last {DAYS} days
        </h2>
        <div className="mt-6 flex h-40 items-end gap-1">
          {series.map((d) => (
            <div
              key={d.key}
              title={`${d.label}: ${d.count} scan${d.count === 1 ? "" : "s"}`}
              className="flex-1 rounded-t-md bg-brand-soft transition-colors hover:bg-brand"
              style={{ height: `${Math.max(2, (d.count / max) * 100)}%` }}
            />
          ))}
        </div>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>{series[0]?.label}</span>
          <span>{series[series.length - 1]?.label}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Devices
          </h2>
          {devices.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No scans recorded yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {devices.map(([label, count]) => (
                <li key={label}>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{label}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-surface">
                    <div
                      className="h-2 rounded-full bg-brand"
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Top codes
          </h2>
          {perCode.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No codes yet —{" "}
              <Link to="/create" className="font-bold text-brand">
                create one
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {perCode.slice(0, 8).map(({ code, count }) => (
                <li key={code.id} className="flex items-center gap-3 py-2.5">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{code.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {code.is_dynamic && code.slug ? shortUrl(code.slug) : "Static code"}
                    </span>
                  </span>
                  <span className="text-sm font-bold">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-brand">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-extrabold tracking-tight">{value}</p>
    </div>
  );
}
