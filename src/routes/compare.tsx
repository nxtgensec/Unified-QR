import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare QR Code Features — Free vs Paid Plans | UnifiedQR" },
      {
        name: "description",
        content:
          "Compare UnifiedQR free and paid plans side by side. See what's included: static codes, dynamic codes, analytics, bulk import, custom designs and more.",
      },
      { property: "og:title", content: "Compare QR Code Features — Free vs Paid Plans" },
      {
        property: "og:description",
        content:
          "Free unlimited static QR codes, or upgrade for dynamic codes, analytics and premium exports.",
      },
      { property: "og:url", content: "https://qr.nxtgensec.org/compare" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "canonical", href: "https://qr.nxtgensec.org/compare" },
      { rel: "alternate", hreflang: "en", href: "https://qr.nxtgensec.org/compare" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Compare UnifiedQR Plans",
          description: "Compare UnifiedQR free and paid plans side by side.",
          url: "https://qr.nxtgensec.org/compare",
        }),
      },
    ],
  }),
  component: Compare,
});

const features = [
  { category: "QR Code Generation", name: "Static QR Codes", free: true, paid: true },
  {
    category: "QR Code Generation",
    name: "Dynamic QR Codes",
    free: "Up to 2",
    paid: "Up to unlimited",
  },
  {
    category: "QR Code Generation",
    name: "QR Code types",
    free: "All 10 types",
    paid: "All 10 types",
  },
  { category: "QR Code Generation", name: "Bulk CSV import", free: false, paid: true },
  { category: "Design", name: "Templates (27 plain)", free: true, paid: true },
  { category: "Design", name: "Premium gradient templates (7)", free: false, paid: true },
  { category: "Design", name: "Custom colours & body shapes", free: true, paid: true },
  { category: "Design", name: "Gradients & angle control", free: false, paid: true },
  { category: "Design", name: "Custom logo upload", free: true, paid: true },
  { category: "Design", name: "Decorative frames", free: true, paid: true },
  { category: "Downloads", name: "PNG export", free: true, paid: true },
  { category: "Downloads", name: "SVG export", free: true, paid: true },
  { category: "Downloads", name: "JPG export", free: false, paid: true },
  { category: "Downloads", name: "WebP export", free: false, paid: true },
  { category: "Downloads", name: "PDF export", free: false, paid: true },
  { category: "Analytics", name: "Total scan count", free: true, paid: true },
  { category: "Analytics", name: "Today / yesterday breakdown", free: false, paid: true },
  { category: "Analytics", name: "Device & browser stats", free: false, paid: true },
  { category: "Analytics", name: "Referrer tracking", free: false, paid: true },
  { category: "Analytics", name: "Peak hours heatmap", free: false, paid: true },
  { category: "Links", name: "Link page (bio link)", free: true, paid: true },
  { category: "Links", name: "Custom avatar", free: true, paid: true },
  { category: "Links", name: "Unlimited link items", free: true, paid: true },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="size-4 text-green-600" />;
  if (value === false) return <X className="size-4 text-muted-foreground/50" />;
  return <span className="text-xs font-medium text-foreground/80">{value}</span>;
}

function Compare() {
  const categories = [...new Set(features.map((f) => f.category))];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Compare plans</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Everything you get for free, and what the paid plans unlock.
        </p>
      </section>

      <section className="mt-12 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-4 font-semibold text-muted-foreground">Feature</th>
              <th className="pb-3 px-4 text-center font-bold">Free</th>
              <th className="pb-3 pl-4 text-center font-bold text-brand">Paid plans</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <>
                <tr key={cat}>
                  <td
                    colSpan={3}
                    className="pb-2 pt-6 text-xs font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    {cat}
                  </td>
                </tr>
                {features
                  .filter((f) => f.category === cat)
                  .map((f) => (
                    <tr key={f.name} className="border-b border-border/50">
                      <td className="py-3 pr-4 text-foreground/80">{f.name}</td>
                      <td className="py-3 px-4 text-center">
                        <Cell value={f.free} />
                      </td>
                      <td className="py-3 pl-4 text-center">
                        <Cell value={f.paid} />
                      </td>
                    </tr>
                  ))}
              </>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-12 rounded-2xl border border-border bg-background p-8 text-center shadow-card">
        <h2 className="text-xl font-extrabold">Start for free today</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No credit card. No sign-up for static codes. Upgrade when you're ready.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground shadow-card"
          >
            Create a QR Code
          </Link>
          <Link
            to="/pricing"
            className="rounded-full border border-border px-6 py-2.5 text-sm font-bold transition-colors hover:bg-background"
          >
            View pricing
          </Link>
        </div>
      </section>
    </div>
  );
}
