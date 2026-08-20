import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, X, Crown, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      {
        title:
          "UnifiedQR vs QR Tiger vs QR Code Generator vs Beaconstac — Why UnifiedQR Is the Best Free Alternative",
      },
      {
        name: "description",
        content:
          "See how UnifiedQR compares to QR Tiger, QR Code Generator and Beaconstac. Unlimited free static QR codes, no watermarks, no sign-up — features others lock behind expensive plans.",
      },
      {
        property: "og:title",
        content: "UnifiedQR vs Top QR Code Generators — 100% Free, No Watermarks",
      },
      {
        property: "og:description",
        content:
          "Unlimited free static QR codes, custom designs, 5 export formats — all free. Competitors charge ₹1,200–₹5,000/yr for the same.",
      },
      { property: "og:url", content: "https://qr.nxtgensec.org/compare" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "canonical", href: "https://qr.nxtgensec.org/compare" },
      {
        rel: "alternate",
        hreflang: "en",
        href: "https://qr.nxtgensec.org/compare",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "UnifiedQR vs Top QR Code Alternatives",
          description:
            "Compare UnifiedQR with QR Tiger, QR Code Generator and Beaconstac. Free unlimited QR codes with no watermarks.",
          url: "https://qr.nxtgensec.org/compare",
        }),
      },
    ],
  }),
  component: Compare,
});

const competitors = [
  {
    name: "UnifiedQR",
    badge: "Best value",
    highlighted: true,
    price: "Free",
    priceNote: "Paid plans from ₹9",
    staticQR: true,
    dynamicQR: true,
    templates: "34",
    customDesign: true,
    logoUpload: true,
    gradientDesigns: true,
    exports: "5 formats",
    analytics: true,
    noWatermark: true,
    noSignupRequired: true,
    linkPage: true,
    languages: "29",
  },
  {
    name: "QR Tiger",
    highlighted: false,
    price: "₹1,200/yr",
    priceNote: "Starter plan",
    staticQR: true,
    dynamicQR: true,
    templates: "~20",
    customDesign: true,
    logoUpload: "Paid only",
    gradientDesigns: "Paid only",
    exports: "3 formats",
    analytics: true,
    noWatermark: "Paid only",
    noSignupRequired: false,
    linkPage: "Paid only",
    languages: "8",
  },
  {
    name: "QR Code Generator",
    highlighted: false,
    price: "₹3,500/yr",
    priceNote: "Pro plan",
    staticQR: true,
    dynamicQR: true,
    templates: "~15",
    customDesign: "Limited",
    logoUpload: "Paid only",
    gradientDesigns: false,
    exports: "2 formats",
    analytics: true,
    noWatermark: "Paid only",
    noSignupRequired: false,
    linkPage: "Paid only",
    languages: "6",
  },
  {
    name: "Beaconstac",
    highlighted: false,
    price: "₹5,000/yr",
    priceNote: "Starter plan",
    staticQR: true,
    dynamicQR: true,
    templates: "~10",
    customDesign: "Limited",
    logoUpload: "Paid only",
    gradientDesigns: false,
    exports: "2 formats",
    analytics: true,
    noWatermark: "Paid only",
    noSignupRequired: false,
    linkPage: "Paid only",
    languages: "5",
  },
];

const comparisonRows: {
  label: string;
  key: keyof (typeof competitors)[number];
  format?: (val: unknown) => React.ReactNode;
}[] = [
  { label: "Price to start", key: "price" },
  { label: "Static QR Codes", key: "staticQR" },
  { label: "Dynamic QR Codes", key: "dynamicQR" },
  { label: "Templates", key: "templates" },
  { label: "Custom design", key: "customDesign" },
  { label: "Logo upload", key: "logoUpload" },
  { label: "Gradient designs", key: "gradientDesigns" },
  { label: "Export formats", key: "exports" },
  { label: "Scan analytics", key: "analytics" },
  { label: "No watermarks", key: "noWatermark" },
  { label: "No sign-up required", key: "noSignupRequired" },
  { label: "Link page (bio link)", key: "linkPage" },
  { label: "Languages", key: "languages" },
];

function CellValue({ val }: { val: unknown }) {
  if (val === true) return <Check className="mx-auto size-4 text-green-600" />;
  if (val === false) return <X className="mx-auto size-4 text-red-400/70" />;
  return <span className="text-xs font-medium text-foreground/80">{String(val)}</span>;
}

function CompetitorCard({ c }: { c: (typeof competitors)[number] }) {
  return (
    <div
      className={`relative rounded-2xl border p-6 shadow-card ${
        c.highlighted ? "border-brand bg-brand-soft/30" : "border-border bg-background"
      }`}
    >
      {c.highlighted && (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-xs font-bold text-brand-foreground">
          <Crown className="size-3" /> {c.badge}
        </span>
      )}
      <h3 className={`text-lg font-extrabold ${c.highlighted ? "text-brand" : ""}`}>{c.name}</h3>
      <p className="mt-1 text-2xl font-extrabold">{c.price}</p>
      <p className="text-xs text-muted-foreground">{c.priceNote}</p>
      <ul className="mt-4 space-y-2">
        {[
          { ok: c.staticQR, text: "Unlimited static QR codes" },
          { ok: c.dynamicQR, text: "Dynamic QR codes" },
          { ok: c.noWatermark === true, text: "No watermarks" },
          { ok: c.noSignupRequired === true, text: "No sign-up needed" },
          { ok: c.logoUpload === true, text: "Free logo upload" },
          { ok: c.gradientDesigns === true, text: "Gradient designs" },
          { ok: c.linkPage === true, text: "Link page (bio link)" },
        ].map((item) => (
          <li key={item.text} className="flex items-center gap-2 text-sm">
            {item.ok ? (
              <Check className="size-4 shrink-0 text-green-600" />
            ) : (
              <X className="size-4 shrink-0 text-red-400/70" />
            )}
            <span className={item.ok ? "text-foreground/80" : "text-muted-foreground/60"}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>
      {c.highlighted ? (
        <Link
          to="/"
          className="mt-6 block rounded-full bg-brand px-5 py-2.5 text-center text-sm font-bold text-brand-foreground shadow-card transition-transform hover:-translate-y-0.5"
        >
          Try it free
        </Link>
      ) : (
        <p className="mt-6 text-xs text-muted-foreground">Paid plans required for most features</p>
      )}
    </div>
  );
}

function Compare() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
          UnifiedQR vs the competition
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Unlimited free QR codes, no watermarks, no sign-up. See how we compare to QR Tiger, QR
          Code Generator and Beaconstac.
        </p>
      </section>

      <section className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {competitors.map((c) => (
          <CompetitorCard key={c.name} c={c} />
        ))}
      </section>

      <section className="mt-16 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-4 font-semibold text-muted-foreground">Feature</th>
              {competitors.map((c) => (
                <th
                  key={c.name}
                  className={`pb-3 px-3 text-center text-xs ${c.highlighted ? "font-extrabold text-brand" : "font-bold"}`}
                >
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.label} className="border-b border-border/50">
                <td className="py-3 pr-4 text-foreground/80">{row.label}</td>
                {competitors.map((c) => {
                  const val = c[row.key];
                  const isUs = c.highlighted;
                  const isGood = val === true;
                  const isBad = val === false;
                  return (
                    <td
                      key={c.name}
                      className={`py-3 px-3 text-center ${
                        isUs && isGood
                          ? "bg-brand-soft/20"
                          : isUs && isBad
                            ? "bg-destructive/5"
                            : ""
                      }`}
                    >
                      <CellValue val={val} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-16 rounded-3xl border border-border bg-background p-8 text-center shadow-card sm:p-12">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
          <Crown className="size-3" /> Why UnifiedQR wins
        </span>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Everything others charge for, we give you for free.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Unlimited static QR codes with no watermarks. 34 templates. Custom colours, gradients,
          logos and frames. 5 export formats. No sign-up required. Competitors lock all of this
          behind ₹1,200 – ₹5,000/year plans.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-bold text-brand-foreground shadow-card transition-transform hover:-translate-y-0.5"
          >
            Create a QR Code free <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/pricing"
            className="rounded-full border border-border px-7 py-3 text-sm font-bold transition-colors hover:bg-background"
          >
            See our pricing
          </Link>
        </div>
      </section>
    </div>
  );
}
