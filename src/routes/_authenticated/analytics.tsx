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
import { supabase } from "@/integrations/supabase/client";
import { effectivePlan, type PlanId } from "@/lib/plans";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  BarChart3,
  Download,
  Loader2,
  TrendingUp,
  Link2,
  Globe,
  Clock,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  MapPin,
  Crown,
} from "lucide-react";

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

const COUNTRY_FLAGS: Record<string, string> = {
  IN: "🇮🇳",
  US: "🇺🇸",
  GB: "🇬🇧",
  DE: "🇩🇪",
  FR: "🇫🇷",
  JP: "🇯🇵",
  BR: "🇧🇷",
  AU: "🇦🇺",
  CA: "🇨🇦",
  SG: "🇸🇬",
  AE: "🇦🇪",
  SA: "🇸🇦",
  ZA: "🇿🇦",
  NG: "🇳🇬",
  KE: "🇰🇪",
  PK: "🇵🇰",
  BD: "🇧🇩",
  PH: "🇵🇭",
  ID: "🇮🇩",
  MY: "🇲🇾",
  TH: "🇹🇭",
  VN: "🇻🇳",
  KR: "🇰🇷",
  CN: "🇨🇳",
  MX: "🇲🇽",
  IT: "🇮🇹",
  ES: "🇪🇸",
  NL: "🇳🇱",
  SE: "🇸🇪",
  PL: "🇵🇱",
  RU: "🇷🇺",
  TR: "🇹🇷",
  EG: "🇪🇬",
  NZ: "🇳🇿",
  IE: "🇮🇪",
  CH: "🇨🇭",
  AT: "🇦🇹",
  PT: "🇵🇹",
  GR: "🇬🇷",
  CZ: "🇨🇿",
  RO: "🇷🇴",
  HU: "🇭🇺",
  FI: "🇫🇮",
  NO: "🇳🇴",
  DK: "🇩🇰",
};

function flag(code: string | null | undefined): string {
  return (code && COUNTRY_FLAGS[code.toUpperCase()]) || "🌍";
}

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function AnalyticsPage() {
  const { user } = useAuth();
  const [codes, setCodes] = useState<SavedCode[]>([]);
  const [scans, setScans] = useState<ScanRow[]>([]);
  const [plan, setPlan] = useState<PlanId>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const rows = await listCodes(user.id);
        setCodes(rows);
        setScans(await listScans(rows.map((r) => r.id)));
      } catch {
        toast.error("Could not load analytics.");
      } finally {
        setLoading(false);
      }
    })();
    void supabase
      .from("profiles")
      .select("plan, plan_expires_at")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setPlan(effectivePlan(data?.plan, data?.plan_expires_at));
      });
  }, [user]);

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
  const prev7 = series.slice(-14, -7).reduce((a, b) => a + b.count, 0);
  const dynamicCount = codes.filter((c) => c.is_dynamic).length;
  const activeCount = codes.filter((c) => c.active).length;
  const max = Math.max(1, ...series.map((s) => s.count));

  const today = dayKey(new Date());
  const yesterday = dayKey(new Date(Date.now() - 86400000));
  const scansToday = scans.filter((s) => s.scanned_at.slice(0, 10) === today).length;
  const scansYesterday = scans.filter((s) => s.scanned_at.slice(0, 10) === yesterday).length;
  const todayGrowth =
    scansYesterday > 0
      ? Math.round(((scansToday - scansYesterday) / scansYesterday) * 100)
      : scansToday > 0
        ? 100
        : 0;

  const weekGrowth = prev7 > 0 ? Math.round(((last7 - prev7) / prev7) * 100) : last7 > 0 ? 100 : 0;

  const referrers = useMemo(() => {
    const out = new Map<string, number>();
    for (const s of scans) {
      const ref = s.referrer && s.referrer.trim() ? s.referrer : "Direct / None";
      out.set(ref, (out.get(ref) ?? 0) + 1);
    }
    return [...out.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [scans]);

  const peakHours = useMemo(() => {
    const hours = new Array(24).fill(0) as number[];
    for (const s of scans) {
      const h = new Date(s.scanned_at).getUTCHours();
      hours[h] = (hours[h] ?? 0) + 1;
    }
    const maxH = Math.max(1, ...hours);
    return { hours, maxH };
  }, [scans]);

  const uniqueSlugs = useMemo(() => {
    const set = new Set<string>();
    for (const s of scans) {
      const c = codes.find((x) => x.id === s.code_id);
      if (c?.slug) set.add(c.slug);
    }
    return set.size;
  }, [codes, scans]);

  const countries = useMemo(() => {
    const out = new Map<string, { count: number; code: string | null }>();
    for (const s of scans) {
      const name = s.country ?? "Unknown";
      const prev = out.get(name);
      out.set(name, { count: (prev?.count ?? 0) + 1, code: s.country_code });
    }
    return [...out.entries()]
      .map(([country, { count, code }]) => ({ country, count, code }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [scans]);

  const cities = useMemo(() => {
    const out = new Map<
      string,
      { count: number; country: string | null; countryCode: string | null }
    >();
    for (const s of scans) {
      const key = `${s.city}|${s.country}`;
      const prev = out.get(key);
      out.set(key, {
        count: (prev?.count ?? 0) + 1,
        country: s.country,
        countryCode: s.country_code,
      });
    }
    return [...out.entries()]
      .map(([key, { count, country, countryCode }]) => ({
        city: key.split("|")[0] ?? "Unknown",
        count,
        country,
        countryCode,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [scans]);

  const totalCountries = countries.length;
  const isPro = plan !== "free";

  function exportCsv() {
    const rows: (string | number)[][] = [
      ["scanned_at", "code_name", "short_link", "device", "referrer", "country", "city"],
    ];
    const byId = new Map(codes.map((c) => [c.id, c]));
    for (const s of scans) {
      const c = byId.get(s.code_id);
      rows.push([
        s.scanned_at,
        c?.name ?? "",
        c?.slug ? shortUrl(c.slug) : "",
        s.device ?? "",
        s.referrer ?? "",
        s.country ?? "",
        s.city ?? "",
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
        <Stat
          icon={<BarChart3 className="size-4" />}
          label="Total scans"
          value={total}
          trend={weekGrowth}
        />
        <Stat
          icon={<Zap className="size-4" />}
          label="Scans today"
          value={scansToday}
          trend={todayGrowth}
        />
        <Stat icon={<Link2 className="size-4" />} label="Active codes" value={activeCount} />
        <Stat
          icon={<Globe className="size-4" />}
          label="Countries reached"
          value={totalCountries}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-background p-6 shadow-card">
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
        <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
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
                  <div className="mt-1 h-2 rounded-full bg-background">
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

        <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
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

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
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

        <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-brand" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Peak scan hours (UTC)
            </h2>
          </div>
          <div className="mt-4 flex h-32 items-end gap-px">
            {peakHours.hours.map((count, h) => (
              <div
                key={h}
                title={`${h}:00 — ${count} scan${count === 1 ? "" : "s"}`}
                className="flex-1 rounded-t-sm bg-brand-soft transition-colors hover:bg-brand"
                style={{ height: `${Math.max(2, (count / peakHours.maxH) * 100)}%` }}
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
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {isPro ? (
          <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-brand" />
              <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Top cities
              </h2>
            </div>
            {cities.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No city data yet.</p>
            ) : (
              <ul className="mt-4 space-y-2.5">
                {cities.map(({ city, count, country, countryCode }) => (
                  <li key={`${city}|${country}`}>
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="flex min-w-0 items-center gap-2">
                        <span aria-hidden>{flag(countryCode)}</span>
                        <span className="truncate">{city}</span>
                        <span className="truncate text-xs font-normal text-muted-foreground">
                          {country ?? ""}
                        </span>
                      </span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-background">
                      <div
                        className="h-1.5 rounded-full bg-brand/60"
                        style={{ width: `${(count / (cities[0]?.count ?? 1)) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-start justify-center rounded-2xl border border-dashed border-border bg-background p-6 shadow-card">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-soft text-brand">
              <Lock className="size-4" />
            </span>
            <h2 className="mt-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              City-level analytics
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Upgrade to Pro to see city breakdowns across your QR codes.
            </p>
            <Link
              to="/billing"
              className="mt-4 flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold text-brand transition-colors hover:bg-brand-soft"
            >
              <Crown className="size-4" /> Upgrade to Pro
            </Link>
          </div>
        )}

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
