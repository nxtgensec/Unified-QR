import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Check,
  Layers,
  Link2,
  QrCode,
  Download,
  Palette,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — UnifiedQR User Guide" },
      {
        name: "description",
        content:
          "Complete UnifiedQR documentation: create QR codes, dynamic links, bulk creation, workspace link pages, analytics, downloads and free plan limits — explained step by step.",
      },
      { property: "og:title", content: "UnifiedQR Documentation" },
      {
        property: "og:description",
        content:
          "Everything you need to know about creating, customizing and tracking QR codes — free.",
      },
      { property: "og:type", content: "article" },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
    links: [{ rel: "canonical", href: "https://qr.nxtgensec.org/docs" }],
  }),
  component: DocsPage,
});

const toc = [
  { id: "what", label: "What is UnifiedQR?" },
  { id: "who", label: "Who is it for?" },
  { id: "quickstart", label: "Quick start" },
  { id: "types", label: "QR code types" },
  { id: "static-dynamic", label: "Static vs Dynamic" },
  { id: "design", label: "Customizing design" },
  { id: "download", label: "Downloading" },
  { id: "analytics", label: "Scans & analytics" },
  { id: "bulk", label: "Bulk creation" },
  { id: "workspace", label: "Workspace pages" },
  { id: "sharing", label: "Sharing publicly" },
  { id: "free", label: "Free vs Paid limits" },
  { id: "support", label: "Help & support" },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 pt-4 text-2xl font-extrabold tracking-tight">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 leading-relaxed text-muted-foreground">{children}</p>;
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
    <div className="rounded-2xl border border-border bg-background p-5 shadow-card">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
          {icon}
        </span>
        <h3 className="font-bold">{title}</h3>
      </div>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

function DocsPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-brand-soft/60 to-background py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">Documentation</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            UnifiedQR user guide
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Everything you need to create, customize, share and track QR codes — explained in plain
            language. No sign-up needed to start.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[220px_1fr]">
        {/* TOC */}
        <nav className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            On this page
          </p>
          <ul className="mt-3 space-y-1.5">
            {toc.map((t) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-brand"
                >
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <article className="min-w-0 max-w-3xl">
          <H2 id="what">What is UnifiedQR?</H2>
          <P>
            UnifiedQR is a <strong className="text-foreground">free QR code generator</strong> that
            lets anyone create a QR code in seconds — for a website, a PDF menu, a Wi-Fi password, a
            contact card and more. You can customize how the code looks, download it in print-ready
            formats, and (optionally) create{" "}
            <strong className="text-foreground">dynamic QR codes</strong> whose destination you can
            change even after printing.
          </P>
          <P>
            It also includes two power tools:{" "}
            <strong className="text-foreground">Bulk creation</strong> (generate hundreds of codes
            from a CSV) and <strong className="text-foreground">Workspace</strong> (one QR code that
            opens a page with many links — like a personal homepage).
          </P>

          <H2 id="who">Who is it for?</H2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Card icon={<Sparkles className="size-4" />} title="Creators & individuals">
              Put all your socials on one page, share your Wi-Fi, or make a contact card QR for your
              resume.
            </Card>
            <Card icon={<Zap className="size-4" />} title="Small businesses">
              Restaurant menus, shop catalogs with WhatsApp ordering, flyers, packaging and posters
              — no watermarks, ever.
            </Card>
            <Card icon={<BarChart3 className="size-4" />} title="Marketers">
              Dynamic codes you can re-target anytime, plus scan analytics: devices, countries,
              referrers and peak hours.
            </Card>
            <Card icon={<Layers className="size-4" />} title="Teams & operations">
              Bulk-create labeled codes for inventory, table tents, events or asset tags from a
              single CSV upload.
            </Card>
          </div>

          <H2 id="quickstart">Quick start (no sign-up)</H2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground">
            <li>
              Open the{" "}
              <Link to="/" className="font-semibold text-brand hover:underline">
                generator
              </Link>{" "}
              and pick a type (URL, PDF, Wi-Fi, vCard…).
            </li>
            <li>Fill in the content — the QR preview updates live.</li>
            <li>Optionally customize colors, shapes, a logo or a "Scan me" frame.</li>
            <li>Click Download and choose PNG, SVG, JPG or PDF. Done — it's yours forever.</li>
          </ol>
          <P>
            Sign in with Google only if you want to <em>save</em> codes, create dynamic links, or
            use bulk & workspace tools.
          </P>

          <H2 id="types">QR code types</H2>
          <P>UnifiedQR supports 10 types. Each one encodes different content:</P>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {[
                  ["URL", "Opens any website link"],
                  ["PDF", "Opens a PDF you host anywhere (menu, brochure)"],
                  ["Multi-URL", "Shows a small list of several links"],
                  ["Contact (vCard)", "Saves name, phone, email to the phone's contacts"],
                  ["Text", "Shows any plain text message"],
                  ["App", "Links to your app on the App Store / Play Store"],
                  ["SMS", "Opens a pre-filled text message to a number"],
                  ["Email", "Opens a pre-filled email with subject & body"],
                  ["Phone", "Starts a call to a number"],
                  ["Social", "Opens your social profiles list"],
                ].map(([name, desc]) => (
                  <tr key={name} className="bg-background">
                    <td className="w-40 px-4 py-2.5 font-semibold">{name}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <H2 id="static-dynamic">Static vs Dynamic QR codes</H2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Card icon={<QrCode className="size-4" />} title="Static — free forever">
              The content is baked directly into the code. It <strong>never expires</strong>, has no
              scan limit, and works offline forever. Trade-off: if the content is wrong, you must
              reprint.
            </Card>
            <Card icon={<Link2 className="size-4" />} title="Dynamic — editable">
              The code points to a short link (qr.nxtgensec.org/r/xxxx) that you control. Change the
              destination anytime from your dashboard — the printed code keeps working. Also enables
              scan analytics. Free plan includes 3 dynamic codes.
            </Card>
          </div>

          <H2 id="design">Customizing the design</H2>
          <P>Every code can be restyled before downloading:</P>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">34 templates</strong> — one click presets for
              colors and shapes
            </li>
            <li>
              <strong className="text-foreground">Custom colors</strong> — foreground & background
              pickers
            </li>
            <li>
              <strong className="text-foreground">Body shapes</strong> — square, rounded, dot,
              diamond, star, heart, triangle
            </li>
            <li>
              <strong className="text-foreground">Eye styles</strong> — square, rounded or circle
              corners
            </li>
            <li>
              <strong className="text-foreground">Gradients</strong> — linear or radial two-color
              blends
            </li>
            <li>
              <strong className="text-foreground">Logo</strong> — upload your logo; error correction
              is raised automatically so it still scans
            </li>
            <li>
              <strong className="text-foreground">Frame & CTA</strong> — add a "Scan me" caption
            </li>
          </ul>
          <P>
            Tip: keep strong contrast between the code and its background. Light colors are
            auto-darkened in the workspace QR so it always scans.
          </P>

          <H2 id="download">Downloading</H2>
          <P>
            All four formats are{" "}
            <strong className="text-foreground">free, with no watermark</strong>:
          </P>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {[
                  ["PNG", "Screens, social media, messaging apps", "Best all-rounder"],
                  ["SVG", "Print, signage, packaging", "Infinite scaling, never pixelates"],
                  ["JPG", "Email, docs, older software", "Smaller file, white background"],
                  ["PDF", "Handing off to a printer", "Ready-to-print document"],
                ].map(([fmt, use, why]) => (
                  <tr key={fmt}>
                    <td className="w-20 px-4 py-2.5 font-bold text-brand">{fmt}</td>
                    <td className="px-4 py-2.5 font-semibold">{use}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P>
            Rule of thumb:{" "}
            <strong className="text-foreground">PNG for screens, SVG for print</strong>.
          </P>

          <H2 id="analytics">Scans & analytics</H2>
          <P>Dynamic QR codes track every scan automatically. Your analytics page shows:</P>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
            <li>Total scans over time (daily chart)</li>
            <li>Devices (Android / iPhone / desktop)</li>
            <li>Countries — free on every plan</li>
            <li>Referrers (where the scan came from)</li>
            <li>City-level detail — on paid plans</li>
            <li>CSV export of raw scan data</li>
          </ul>
          <P>Workspace pages track page views and link clicks the same way — completely free.</P>

          <H2 id="bulk">Bulk creation</H2>
          <P>
            Need 200 labeled codes for tables, products or assets? Upload a CSV with a name and
            destination per row:
          </P>
          <pre className="mt-3 overflow-x-auto rounded-xl border border-border bg-muted/40 p-4 text-xs">
            {`name,destination
Table 1,https://yourmenu.com/t1
Table 2,https://yourmenu.com/t2`}
          </pre>
          <P>
            Preview, apply one shared design, then create them all at once. Download everything as a
            ZIP (PNG, SVG or JPG) plus a links.csv mapping. Free plan allows 20 codes per batch;
            paid plans go up to 500.
          </P>

          <H2 id="workspace">Workspace — one QR, many links</H2>
          <P>
            A workspace page is like a mini homepage: one QR code that opens a page with all your
            links, organized into sections and sub-sections.
          </P>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground">
            <li>Go to Workspace → New Page.</li>
            <li>Pick what it's for (personal, business, shop, restaurant…).</li>
            <li>Choose a template — links and icons come pre-filled.</li>
            <li>
              Edit titles, URLs, icons (Instagram, WhatsApp, YouTube brand icons built in), theme
              colors and fonts.
            </li>
            <li>Customize the QR design and download it in any format.</li>
          </ol>
          <P>
            Every workspace page gets its own public link (qr.nxtgensec.org/p/your-slug), page view
            tracking and link click tracking — free.
          </P>

          <H2 id="sharing">Sharing publicly</H2>
          <P>
            Every QR code you create is{" "}
            <strong className="text-foreground">made to be shared</strong>:
          </P>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Static codes</strong> contain the data itself —
              anyone with any phone camera can scan them, forever, no account needed.
            </li>
            <li>
              <strong className="text-foreground">Dynamic codes</strong> redirect through a public
              short link — works on any device, and you can pause or re-target anytime.
            </li>
            <li>
              <strong className="text-foreground">Workspace pages</strong> are public by design —
              share the QR or the link on Instagram bios, business cards, posters or packaging.
            </li>
          </ul>
          <P>
            No login is ever required to scan. Visitors don't see ads or paywalls — just your
            content.
          </P>

          <H2 id="free">Free vs Paid limits</H2>
          <P>Every feature is free to try — paid plans only raise the limits:</P>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="px-4 py-2.5 font-bold">Feature</th>
                  <th className="px-4 py-2.5 font-bold">Free</th>
                  <th className="px-4 py-2.5 font-bold">Paid (from ₹9)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Static QR codes", "Unlimited", "Unlimited"],
                  ["All download formats", "PNG, SVG, JPG, PDF", "Same"],
                  ["Design customization", "Full access", "Same"],
                  ["Dynamic QR codes", "3", "5 – unlimited"],
                  ["Bulk codes per batch", "20", "50 – 500"],
                  ["Scan analytics", "Totals + country", "+ City-level detail"],
                  ["Workspace pages", "Unlimited", "Unlimited"],
                  ["Workspace analytics", "Views + clicks", "Same"],
                  ["Watermarks", "None", "None"],
                ].map(([f, free, paid]) => (
                  <tr key={f}>
                    <td className="px-4 py-2.5 font-semibold">{f}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      <span className="mr-1 inline-block size-1.5 rounded-full bg-green-500 align-middle" />
                      {free}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{paid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P>
            See the{" "}
            <Link to="/pricing" className="font-semibold text-brand hover:underline">
              pricing page
            </Link>{" "}
            for day, week, month and year passes.
          </P>

          <H2 id="support">Help & support</H2>
          <P>
            Stuck? Check the{" "}
            <Link to="/faq" className="font-semibold text-brand hover:underline">
              FAQs
            </Link>{" "}
            or reach us at{" "}
            <span className="font-semibold text-foreground">unifiedqr@nxtgensec.org</span>. Paid
            plans include priority support.
          </P>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-brand-foreground shadow-card transition-transform hover:-translate-y-0.5"
            >
              Create your first QR code <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/qr-code-types"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-bold transition-colors hover:bg-background"
            >
              Browse QR types
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
