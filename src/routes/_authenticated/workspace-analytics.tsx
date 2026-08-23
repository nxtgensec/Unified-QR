import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  listPageViews,
  listItemClicks,
  type PageViewRow,
  type ItemClickRow,
} from "@/lib/workspaceAnalytics";
import { toCsv, downloadCsv } from "@/lib/codes";
import { toast } from "sonner";
import {
  BarChart3,
  Download,
  Eye,
  Link2,
  Loader2,
  MousePointerClick,
  Globe,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/workspace-analytics")({
  head: () => ({
    meta: [
      { title: "Workspace Analytics — UnifiedQR" },
      {
        name: "description",
        content:
          "Live analytics for your workspace link pages: views, clicks, devices, and locations.",
      },
      { property: "og:title", content: "Workspace Analytics — UnifiedQR" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkspaceAnalyticsPage,
});

const DAYS = 30;

const COUNTRY_FLAGS: Record<string, string> = {
  IN: "\u{1F1EE}\u{1F1F3}",
  US: "\u{1F1FA}\u{1F1F8}",
  GB: "\u{1F1EC}\u{1F1E7}",
  DE: "\u{1F1E9}\u{1F1EA}",
  FR: "\u{1F1EB}\u{1F1F7}",
  JP: "\u{1F1EF}\u{1F1F5}",
  BR: "\u{1F1E7}\u{1F1F7}",
  AU: "\u{1F1E6}\u{1F1FA}",
  CA: "\u{1F1E8}\u{1F1E6}",
  SG: "\u{1F1F8}\u{1F1EC}",
  AE: "\u{1F1E6}\u{1F1EA}",
  SA: "\u{1F1F8}\u{1F1E6}",
  ZA: "\u{1F1FF}\u{1F1E6}",
  NG: "\u{1F1F3}\u{1F1EC}",
  KE: "\u{1F1F0}\u{1F1EA}",
  PK: "\u{1F1F5}\u{1F1F0}",
  BD: "\u{1F1E7}\u{1F1E9}",
  PH: "\u{1F1F5}\u{1F1ED}",
  ID: "\u{1F1EE}\u{1F1E9}",
  MY: "\u{1F1F2}\u{1F1FE}",
  TH: "\u{1F1F9}\u{1F1ED}",
  VN: "\u{1F1FB}\u{1F1F3}",
  KR: "\u{1F1F0}\u{1F1F7}",
  CN: "\u{1F1E8}\u{1F1F3}",
  MX: "\u{1F1F2}\u{1F1FD}",
  IT: "\u{1F1EE}\u{1F1F9}",
  ES: "\u{1F1EA}\u{1F1F8}",
  NL: "\u{1F1F3}\u{1F1F1}",
  SE: "\u{1F1F8}\u{1F1EA}",
  PL: "\u{1F1F5}\u{1F1F1}",
  RU: "\u{1F1F7}\u{1F1FA}",
  TR: "\u{1F1F9}\u{1F1F7}",
  EG: "\u{1F1EA}\u{1F1EC}",
  NZ: "\u{1F1F3}\u{1F1FF}",
  IE: "\u{1F1EE}\u{1F1EA}",
  CH: "\u{1F1E8}\u{1F1ED}",
  AT: "\u{1F1E6}\u{1F1F9}",
  PT: "\u{1F1F5}\u{1F1F9}",
  GR: "\u{1F1EC}\u{1F1F7}",
  CZ: "\u{1F1E8}\u{1F1FF}",
  RO: "\u{1F1F7}\u{1F1F4}",
  HU: "\u{1F1ED}\u{1F1FA}",
  FI: "\u{1F1EB}\u{1F1EE}",
  NO: "\u{1F1F3}\u{1F1F4}",
  DK: "\u{1F1E9}\u{1F1F0}",
};

function flag(code: string | null | undefined): string {
  return (code && COUNTRY_FLAGS[code.toUpperCase()]) || "\u{1F30D}";
}

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function WorkspaceAnalyticsPage() {
  const { user } = useAuth();
  const [pages, setPages] = useState<{ id: string; title: string; slug: string }[]>([]);
  const [views, setViews] = useState<PageViewRow[]>([]);
  const [clicks, setClicks] = useState<ItemClickRow[]>([]);
  const [allItems, setAllItems] = useState<{ id: string; title: string; section_id: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data: pagesData } = await supabase
          .from("link_pages")
          .select("id, title, slug")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        const pageRows = (pagesData ?? []) as { id: string; title: string; slug: string }[];
        setPages(pageRows);

        const pageIds = pageRows.map((p) => p.id);
        const [pageViews] = await Promise.all([listPageViews(pageIds)]);

        setViews(pageViews);

        if (pageIds.length > 0) {
          const { data: sectionsData } = await supabase
            .from("link_sections")
            .select("id")
            .in("page_id", pageIds);

          const secIds = (sectionsData ?? []).map((s: { id: string }) => s.id);
          if (secIds.length > 0) {
            const { data: itemsData } = await supabase
              .from("link_items")
              .select("id, title, section_id")
              .in("section_id", secIds);

            const itemRows = (itemsData ?? []) as {
              id: string;
              title: string;
              section_id: string;
            }[];
            setAllItems(itemRows);

            const itemIds = itemRows.map((i) => i.id);
            const itemClicksData = await listItemClicks(itemIds);
            setClicks(itemClicksData);
          }
        }
      } catch {
        toast.error("Could not load workspace analytics.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const viewSeries = useMemo(() => {
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
    for (const v of views) {
      const key = v.viewed_at.slice(0, 10);
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
    }
    return buckets.map((b) => ({ ...b, count: map.get(b.key) ?? 0 }));
  }, [views]);

  const clickSeries = useMemo(() => {
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
    for (const c of clicks) {
      const key = c.clicked_at.slice(0, 10);
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
    }
    return buckets.map((b) => ({ ...b, count: map.get(b.key) ?? 0 }));
  }, [clicks]);

  const devices = useMemo(() => {
    const out = new Map<string, number>();
    const all = [...views, ...clicks];
    for (const e of all) {
      const ua = (e.device ?? "").toLowerCase();
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
  }, [views, clicks]);

  const topPages = useMemo(() => {
    const out = new Map<string, number>();
    for (const v of views) out.set(v.page_id, (out.get(v.page_id) ?? 0) + 1);
    return pages
      .map((p) => ({ page: p, count: out.get(p.id) ?? 0 }))
      .sort((a, b) => b.count - a.count);
  }, [pages, views]);

  const perItem = useMemo(() => {
    const out = new Map<string, number>();
    for (const c of clicks) out.set(c.item_id, (out.get(c.item_id) ?? 0) + 1);
    return allItems
      .map((i) => ({ item: i, count: out.get(i.id) ?? 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [allItems, clicks]);

  const totalViews = views.length;
  const totalClicks = clicks.length;
  const totalCountries = useMemo(() => {
    const set = new Set<string>();
    for (const e of [...views, ...clicks]) set.add(e.country ?? "Unknown");
    return set.size;
  }, [views, clicks]);

  const today = dayKey(new Date());
  const yesterday = dayKey(new Date(Date.now() - 86400000));
  const viewsToday = views.filter((v) => v.viewed_at.slice(0, 10) === today).length;
  const viewsYesterday = views.filter((v) => v.viewed_at.slice(0, 10) === yesterday).length;
  const clicksToday = clicks.filter((c) => c.clicked_at.slice(0, 10) === today).length;
  const clicksYesterday = clicks.filter((c) => c.clicked_at.slice(0, 10) === yesterday).length;

  const viewsGrowth =
    viewsYesterday > 0
      ? Math.round(((viewsToday - viewsYesterday) / viewsYesterday) * 100)
      : viewsToday > 0
        ? 100
        : 0;
  const clicksGrowth =
    clicksYesterday > 0
      ? Math.round(((clicksToday - clicksYesterday) / clicksYesterday) * 100)
      : clicksToday > 0
        ? 100
        : 0;

  const last7Views = viewSeries.slice(-7).reduce((a, b) => a + b.count, 0);
  const prev7Views = viewSeries.slice(-14, -7).reduce((a, b) => a + b.count, 0);
  const weekGrowth =
    prev7Views > 0
      ? Math.round(((last7Views - prev7Views) / prev7Views) * 100)
      : last7Views > 0
        ? 100
        : 0;

  const referrers = useMemo(() => {
    const out = new Map<string, number>();
    const all = [...views, ...clicks];
    for (const e of all) {
      const ref = e.referrer && e.referrer.trim() ? e.referrer : "Direct / None";
      out.set(ref, (out.get(ref) ?? 0) + 1);
    }
    return [...out.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [views, clicks]);

  const countries = useMemo(() => {
    const out = new Map<string, { count: number; code: string | null }>();
    const all = [...views, ...clicks];
    for (const e of all) {
      const name = e.country ?? "Unknown";
      const prev = out.get(name);
      out.set(name, { count: (prev?.count ?? 0) + 1, code: e.country_code });
    }
    return [...out.entries()]
      .map(([country, { count, code }]) => ({ country, count, code }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [views, clicks]);

  const maxViews = Math.max(1, ...viewSeries.map((s) => s.count));
  const maxClicks = Math.max(1, ...clickSeries.map((s) => s.count));

  function exportCsv() {
    const rows: (string | number)[][] = [
      ["type", "timestamp", "item_title", "device", "referrer", "country", "city"],
    ];
    const itemMap = new Map(allItems.map((i) => [i.id, i.title]));
    for (const v of views) {
      rows.push([
        "view",
        v.viewed_at,
        "",
        v.device ?? "",
        v.referrer ?? "",
        v.country ?? "",
        v.city ?? "",
      ]);
    }
    for (const c of clicks) {
      rows.push([
        "click",
        c.clicked_at,
        itemMap.get(c.item_id) ?? "",
        c.device ?? "",
        c.referrer ?? "",
        c.country ?? "",
        c.city ?? "",
      ]);
    }
    downloadCsv("unifiedqr-workspace-analytics.csv", toCsv(rows));
    toast.success("Workspace analytics export downloaded");
  }

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading workspace analytics…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        title="Workspace Analytics"
        description="Views, clicks, and engagement across all your workspace link pages."
        actions={
          <button
            type="button"
            onClick={exportCsv}
            disabled={totalViews === 0 && totalClicks === 0}
            className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold disabled:opacity-50"
          >
            <Download className="size-4" /> Export CSV
          </button>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={<Eye className="size-4" />}
          label="Total views"
          value={totalViews}
          trend={weekGrowth}
        />
        <Stat
          icon={<MousePointerClick className="size-4" />}
          label="Total clicks"
          value={totalClicks}
        />
        <Stat
          icon={<Eye className="size-4" />}
          label="Views today"
          value={viewsToday}
          trend={viewsGrowth}
        />
        <Stat
          icon={<MousePointerClick className="size-4" />}
          label="Clicks today"
          value={clicksToday}
          trend={clicksGrowth}
        />
      </div>

      {/* Views over time */}
      <div className="mt-8 rounded-2xl border border-border bg-background p-6 shadow-card">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Views over the last {DAYS} days
        </h2>
        <div className="mt-6 flex h-40 items-end gap-1">
          {viewSeries.map((d) => (
            <div
              key={d.key}
              title={`${d.label}: ${d.count} view${d.count === 1 ? "" : "s"}`}
              className="flex-1 rounded-t-md bg-brand-soft transition-colors hover:bg-brand"
              style={{ height: `${Math.max(2, (d.count / maxViews) * 100)}%` }}
            />
          ))}
        </div>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>{viewSeries[0]?.label}</span>
          <span>{viewSeries[viewSeries.length - 1]?.label}</span>
        </div>
      </div>

      {/* Clicks over time */}
      <div className="mt-8 rounded-2xl border border-border bg-background p-6 shadow-card">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Clicks over the last {DAYS} days
        </h2>
        <div className="mt-6 flex h-40 items-end gap-1">
          {clickSeries.map((d) => (
            <div
              key={d.key}
              title={`${d.label}: ${d.count} click${d.count === 1 ? "" : "s"}`}
              className="flex-1 rounded-t-md bg-brand-soft transition-colors hover:bg-brand"
              style={{ height: `${Math.max(2, (d.count / maxClicks) * 100)}%` }}
            />
          ))}
        </div>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>{clickSeries[0]?.label}</span>
          <span>{clickSeries[clickSeries.length - 1]?.label}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {/* Devices */}
        <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Devices
          </h2>
          {devices.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No data recorded yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {devices.map(([label, count]) => (
                <li key={label}>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{label}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-background">
                    <div
                      className="h-2 rounded-full bg-brand"
                      style={{ width: `${(count / (totalViews + totalClicks)) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top pages */}
        <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Top pages
          </h2>
          {topPages.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No pages yet —{" "}
              <Link to="/links" className="font-bold text-brand">
                create one
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {topPages.slice(0, 8).map(({ page, count }) => (
                <li key={page.id} className="flex items-center gap-3 py-2.5">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{page.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      /{page.slug}
                    </span>
                  </span>
                  <span className="text-sm font-bold">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {/* Top links by clicks */}
        <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Top links by clicks
          </h2>
          {perItem.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No clicks recorded yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {perItem.map(({ item, count }) => (
                <li key={item.id} className="flex items-center gap-3 py-2.5">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{item.title}</span>
                  </span>
                  <span className="text-sm font-bold">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Peak hours */}
        <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-brand" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Peak activity hours (UTC)
            </h2>
          </div>
          <PeakHoursChart views={views} clicks={clicks} />
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {/* Countries */}
        <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-brand" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Top countries
            </h2>
          </div>
          {countries.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No location data yet.</p>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {countries.map(({ country, count, code }) => (
                <li key={country}>
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="flex min-w-0 items-center gap-2">
                      <span aria-hidden>{flag(code)}</span>
                      <span className="truncate">{country}</span>
                    </span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-background">
                    <div
                      className="h-1.5 rounded-full bg-brand/60"
                      style={{ width: `${(count / (countries[0]?.count ?? 1)) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Referrers */}
        <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-brand" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Top referrers
            </h2>
          </div>
          {referrers.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No referrer data yet.</p>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {referrers.map(([ref, count]) => (
                <li key={ref}>
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="truncate max-w-[200px]">{ref}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-background">
                    <div
                      className="h-1.5 rounded-full bg-brand/60"
                      style={{ width: `${(count / (referrers[0]?.[1] ?? 1)) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function PeakHoursChart({ views, clicks }: { views: PageViewRow[]; clicks: ItemClickRow[] }) {
  const { hours, maxH } = useMemo(() => {
    const h = new Array(24).fill(0) as number[];
    for (const v of views) {
      const hour = new Date(v.viewed_at).getUTCHours();
      h[hour] = (h[hour] ?? 0) + 1;
    }
    for (const c of clicks) {
      const hour = new Date(c.clicked_at).getUTCHours();
      h[hour] = (h[hour] ?? 0) + 1;
    }
    return { hours: h, maxH: Math.max(1, ...h) };
  }, [views, clicks]);

  return (
    <>
      <div className="mt-4 flex h-32 items-end gap-px">
        {hours.map((count, hour) => (
          <div
            key={hour}
            title={`${hour}:00 — ${count} event${count === 1 ? "" : "s"}`}
            className="flex-1 rounded-t-sm bg-brand-soft transition-colors hover:bg-brand"
            style={{ height: `${Math.max(2, (count / maxH) * 100)}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        <span>0:00</span>
        <span>6:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:00</span>
      </div>
    </>
  );
}

function Stat({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-card">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-brand">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-2xl font-extrabold tracking-tight">{value}</p>
        {trend !== undefined && trend !== 0 && (
          <span
            className={`flex items-center gap-0.5 text-xs font-bold ${trend > 0 ? "text-emerald-600" : "text-red-500"}`}
          >
            {trend > 0 ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}
