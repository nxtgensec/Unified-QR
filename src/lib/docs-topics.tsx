import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Check,
  Download,
  Layers,
  Link2,
  Palette,
  QrCode,
  Share2,
  Sparkles,
  LifeBuoy,
  ToggleLeft,
} from "lucide-react";
import type { ComponentType } from "react";

export type DocsTopic = {
  id: string;
  title: string;
  short: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  content: () => React.ReactNode;
};

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 leading-relaxed text-muted-foreground">{children}</p>;
}

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left">
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-4 py-2.5 ${j === 0 ? "font-semibold" : "text-muted-foreground"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ol>
  );
}

export const docsTopics: DocsTopic[] = [
  {
    id: "qr-types",
    title: "QR code types",
    short: "The 10 types and what each one does",
    description: "URL, PDF, vCard, Wi-Fi, SMS, email and more — what to pick when.",
    icon: QrCode,
    content: () => (
      <>
        <P>
          UnifiedQR supports 10 QR code types. Each type encodes different content — pick the one
          that matches what should happen when someone scans.
        </P>
        <Table
          head={["Type", "What it does"]}
          rows={[
            ["URL", "Opens any website link — the most common choice"],
            ["PDF", "Opens a PDF you host anywhere (menu, brochure, guide)"],
            ["Multi-URL", "Shows a small list of several links to choose from"],
            ["Contact (vCard)", "Saves name, phone and email straight to the phone's contacts"],
            ["Text", "Displays any plain text message"],
            ["App", "Links to your app on the App Store / Play Store"],
            ["SMS", "Opens a pre-filled text message to a number"],
            ["Email", "Opens a pre-filled email with subject and body"],
            ["Phone", "Starts a phone call to a number"],
            ["Social", "Opens a list of your social profiles"],
          ]}
        />
        <P>
          Not sure? Start with <strong className="text-foreground">URL</strong> — you can always
          create another code later. Every type is free to create and download.
        </P>
      </>
    ),
  },
  {
    id: "static-vs-dynamic",
    title: "Static vs Dynamic",
    short: "Which one to choose and why",
    description: "Permanent codes vs editable, trackable codes — explained simply.",
    icon: ToggleLeft,
    content: () => (
      <>
        <P>This is the most important choice when creating a code. The difference is simple:</P>
        <div className="mt-4 grid gap-4">
          <div className="rounded-2xl border border-border bg-background p-5 shadow-card">
            <h3 className="font-bold">Static — free forever</h3>
            <P>
              The content is baked directly into the code. It never expires, has no scan limit, and
              works offline forever. Best for Wi-Fi, contact cards, fixed URLs and anything that
              will never change. Trade-off: if the content is wrong, you must reprint.
            </P>
          </div>
          <div className="rounded-2xl border border-border bg-background p-5 shadow-card">
            <h3 className="font-bold">Dynamic — editable & trackable</h3>
            <P>
              The code points to a short link (qr.nxtgensec.org/r/xxxx) that you control. Change the
              destination anytime from your dashboard — the printed code keeps working. Every scan
              is recorded for analytics. You can also pause a dynamic code to stop it working
              temporarily.
            </P>
          </div>
        </div>
        <P>
          <strong className="text-foreground">Rule of thumb:</strong> use static for permanent
          things, dynamic for anything you might change or want to measure. The free plan includes 3
          dynamic codes so you can try it.
        </P>
      </>
    ),
  },
  {
    id: "design",
    title: "Customizing design",
    short: "Templates, colors, shapes, logos & frames",
    description: "Make your code match your brand — 34 templates and full control.",
    icon: Palette,
    content: () => (
      <>
        <P>Every code can be restyled before downloading — all of it free:</P>
        <List
          items={[
            <>
              <strong className="text-foreground">34 templates</strong> — one-click presets for
              colors and shapes
            </>,
            <>
              <strong className="text-foreground">Custom colors</strong> — foreground and background
              pickers
            </>,
            <>
              <strong className="text-foreground">Body shapes</strong> — square, rounded, dot,
              diamond, star, heart, triangle
            </>,
            <>
              <strong className="text-foreground">Eye styles</strong> — square, rounded or circle
              corners
            </>,
            <>
              <strong className="text-foreground">Gradients</strong> — linear or radial two-color
              blends
            </>,
            <>
              <strong className="text-foreground">Logo</strong> — upload your logo; error correction
              rises automatically so it still scans
            </>,
            <>
              <strong className="text-foreground">Frame & CTA</strong> — add a "Scan me" caption
              around the code
            </>,
          ]}
        />
        <P>
          <strong className="text-foreground">Scannability tip:</strong> keep strong contrast
          between the code and its background. Dark code on a light background scans best. In the
          workspace editor, light theme colors are automatically darkened for the QR so it always
          scans.
        </P>
      </>
    ),
  },
  {
    id: "downloads",
    title: "Downloading",
    short: "PNG, SVG, JPG, PDF — which and when",
    description: "All four formats are free, with no watermarks.",
    icon: Download,
    content: () => (
      <>
        <P>
          All four formats are <strong className="text-foreground">free, with no watermark</strong>:
        </P>
        <Table
          head={["Format", "Best for", "Why"]}
          rows={[
            ["PNG", "Screens, social media, messaging apps", "Best all-rounder, crisp at any size"],
            ["SVG", "Print, signage, packaging", "Infinite scaling — never pixelates"],
            ["JPG", "Email, docs, older software", "Smaller file, white background"],
            ["PDF", "Handing off to a printer", "Ready-to-print document"],
          ]}
        />
        <P>
          <strong className="text-foreground">Rule of thumb:</strong> PNG for screens, SVG for
          print. Downloads are 1024px for raster formats — sharp enough for posters.
        </P>
      </>
    ),
  },
  {
    id: "analytics",
    title: "Scans & analytics",
    short: "What gets tracked and where to see it",
    description: "Devices, countries, referrers, peak hours — automatic with dynamic codes.",
    icon: BarChart3,
    content: () => (
      <>
        <P>
          Dynamic QR codes track every scan automatically — no extra setup. Your analytics page
          shows:
        </P>
        <List
          items={[
            "Total scans over time (daily chart)",
            "Devices — Android, iPhone, desktop",
            "Countries — free on every plan",
            "Referrers — where the scan came from",
            "Peak scanning hours",
            "City-level detail — on paid plans",
            "CSV export of the raw scan data",
          ]}
        />
        <P>
          Workspace pages track{" "}
          <strong className="text-foreground">page views and link clicks</strong> the same way —
          completely free on every plan.
        </P>
      </>
    ),
  },
  {
    id: "bulk",
    title: "Bulk creation",
    short: "Hundreds of codes from one CSV",
    description: "Upload, preview, design once, create them all — with ZIP download.",
    icon: Layers,
    content: () => (
      <>
        <P>
          Need 200 labeled codes for tables, products or assets? Bulk creation builds them all from
          a CSV file with a name and destination per row:
        </P>
        <pre className="mt-3 overflow-x-auto rounded-xl border border-border bg-muted/40 p-4 text-xs">
          {`name,destination
Table 1,https://yourmenu.com/t1
Table 2,https://yourmenu.com/t2`}
        </pre>
        <Steps
          items={[
            "Go to Bulk → upload your CSV (or paste rows, or use the sample).",
            "Review the parsed rows — fix anything before continuing.",
            "Pick one shared design for the whole batch.",
            "Preview, then create — progress is shown live.",
            "Download everything as a ZIP (PNG, SVG or JPG) plus a links.csv mapping.",
          ]}
        />
        <P>
          The free plan allows 20 codes per batch; paid plans go up to 500. Each bulk code gets its
          own dynamic short link and scan tracking.
        </P>
      </>
    ),
  },
  {
    id: "workspace",
    title: "Workspace pages",
    short: "One QR code for all your links",
    description: "Bio-style pages with sections, brand icons, themes and templates.",
    icon: Link2,
    content: () => (
      <>
        <P>
          A workspace page is like a mini homepage: one QR code that opens a page with all your
          links, organized into sections and sub-sections.
        </P>
        <Steps
          items={[
            "Go to Workspace → New Page.",
            "Pick what it's for — personal, business, shop, restaurant, coaching and more.",
            "Choose a template — links and brand icons come pre-filled.",
            <>
              Edit titles, URLs and icons (Instagram, WhatsApp, YouTube brand icons built in), theme
              colors, fonts and your avatar.
            </>,
            "Customize the QR design — color, body shape, eye style — and download it in any format.",
          ]}
        />
        <P>
          Every workspace page gets its own public link (qr.nxtgensec.org/p/your-slug), page view
          tracking and link click tracking — free and unlimited.
        </P>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Sharing publicly",
    short: "How every code works for anyone, anywhere",
    description: "No logins, no paywalls for scanners — print and share freely.",
    icon: Share2,
    content: () => (
      <>
        <P>
          Every QR code you create is <strong className="text-foreground">made to be shared</strong>
          :
        </P>
        <List
          items={[
            <>
              <strong className="text-foreground">Static codes</strong> contain the data itself —
              anyone with any phone camera can scan them, forever, no account needed.
            </>,
            <>
              <strong className="text-foreground">Dynamic codes</strong> redirect through a public
              short link — works on any device, and you can pause or re-target anytime.
            </>,
            <>
              <strong className="text-foreground">Workspace pages</strong> are public by design —
              share the QR or the link on Instagram bios, business cards, posters or packaging.
            </>,
          ]}
        />
        <P>
          No login is ever required to scan. Visitors never see ads or paywalls — just your content.
          QR codes work in WhatsApp, Instagram, printed posters, TV screens and everywhere else.
        </P>
      </>
    ),
  },
  {
    id: "free-vs-paid",
    title: "Free vs Paid limits",
    short: "Everything is free to try — limits only",
    description: "Exact free limits for every feature, and what paid plans raise.",
    icon: Sparkles,
    content: () => (
      <>
        <P>Every feature works free from the start — paid plans only raise the limits:</P>
        <Table
          head={["Feature", "Free", "Paid (from ₹9)"]}
          rows={[
            ["Static QR codes", "Unlimited", "Unlimited"],
            ["All download formats", "PNG, SVG, JPG, PDF", "Same"],
            ["Design customization", "Full access", "Same"],
            ["Dynamic QR codes", "3", "5 – unlimited"],
            ["Bulk codes per batch", "20", "50 – 500"],
            ["Scan analytics", "Totals + country", "+ City-level detail"],
            ["Workspace pages", "Unlimited", "Unlimited"],
            ["Workspace analytics", "Views + clicks", "Same"],
            ["Watermarks", "None", "None"],
          ]}
        />
        <P>
          See the{" "}
          <Link to="/pricing" className="font-semibold text-brand hover:underline">
            pricing page
          </Link>{" "}
          for day, week, month and year passes. No subscription required — passes simply expire.
        </P>
      </>
    ),
  },
  {
    id: "support",
    title: "Help & support",
    short: "Get unstuck fast",
    description: "FAQs, contact email and priority support on paid plans.",
    icon: LifeBuoy,
    content: () => (
      <>
        <P>Stuck? Here's the fastest path to an answer:</P>
        <List
          items={[
            <>
              Check the{" "}
              <Link to="/faq" className="font-semibold text-brand hover:underline">
                FAQs
              </Link>{" "}
              — most questions are answered there.
            </>,
            <>
              Browse the{" "}
              <Link to="/qr-code-types" className="font-semibold text-brand hover:underline">
                QR code types
              </Link>{" "}
              guide for type-specific help.
            </>,
            <>
              Email us at{" "}
              <span className="font-semibold text-foreground">unifiedqr@nxtgensec.org</span> — we
              reply to everything.
            </>,
            "Paid plans include priority support.",
          ]}
        />
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-brand-soft/30 p-4">
          <Check className="size-4 shrink-0 text-brand" />
          <p className="text-sm text-muted-foreground">
            Tip: you can always test a QR code by scanning it with your own phone before printing —
            we recommend it for print jobs.
          </p>
        </div>
      </>
    ),
  },
];

export function getTopic(id: string | undefined): DocsTopic | undefined {
  return docsTopics.find((t) => t.id === id);
}
