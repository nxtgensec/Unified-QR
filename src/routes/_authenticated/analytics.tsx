import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, BetaNotice } from "@/components/app/AppShell";
import { BarChart3, Globe2, Smartphone, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics (Beta) — UnifiedQR Workspace" },
      {
        name: "description",
        content:
          "Preview of UnifiedQR scan analytics: scans over time, top locations, device breakdown and CSV export.",
      },
      { property: "og:title", content: "Analytics (Beta) — UnifiedQR" },
      { property: "og:description", content: "Scan analytics preview for dynamic QR Codes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        title="Analytics"
        beta
        description="Deep scan reporting for your dynamic codes. Total scan counts are already live on the dashboard — these breakdowns are still being built."
      />
      <BetaNotice>
        Charts below are illustrative. Live scan totals per code are available on your dashboard
        today.
      </BetaNotice>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card icon={<BarChart3 className="size-4" />} title="Scans over time">
          Hourly, daily and weekly trend lines per code and per campaign.
        </Card>
        <Card icon={<Globe2 className="size-4" />} title="Locations">
          Country and city breakdown resolved from the scan request.
        </Card>
        <Card icon={<Smartphone className="size-4" />} title="Devices">
          iOS, Android and desktop split with browser detail.
        </Card>
        <Card icon={<Clock className="size-4" />} title="Peak hours">
          Best-performing times of day to schedule campaigns.
        </Card>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Scans over time
        </h2>
        <div className="mt-6 flex h-40 items-end gap-2">
          {[18, 32, 24, 46, 38, 62, 50, 71, 58, 80, 66, 92].map((v, i) => (
            <div key={i} className="flex-1 rounded-t-md bg-brand-soft" style={{ height: `${v}%` }} />
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Sample data — not your account data.</p>
      </div>
    </div>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center gap-2">
        <span className="text-brand">{icon}</span>
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{children}</p>
    </div>
  );
}
