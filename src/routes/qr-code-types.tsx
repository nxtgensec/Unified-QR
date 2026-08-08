import { createFileRoute, Link } from "@tanstack/react-router";
import { qrTypes } from "@/components/qr/TypeTabs";

export const Route = createFileRoute("/qr-code-types")({
  head: () => ({
    meta: [
      { title: "QR Code Types — URL, vCard, PDF, SMS and More | TQRCG" },
      {
        name: "description",
        content:
          "Explore every QR Code type you can create for free: website links, PDFs, multi-URL pages, vCard contacts, SMS, email, phone and social profiles.",
      },
      { property: "og:title", content: "QR Code Types — URL, vCard, PDF, SMS and More" },
      {
        property: "og:description",
        content: "Pick the right QR Code type for your campaign and create it in seconds.",
      },
      { property: "og:url", content: "/qr-code-types" },
    ],
    links: [{ rel: "canonical", href: "/qr-code-types" }],
  }),
  component: Types,
});

const details: Record<string, string> = {
  url: "Turn any flyer, product label or poster into a traffic booster by linking straight to your website, landing page or online store.",
  pdf: "Share menus, brochures, manuals and price lists without printing them. Point the code at a hosted PDF and update it anytime.",
  "multi-url": "Link websites, videos and social profiles in a single QR Code — ideal for campaigns that need more than one destination.",
  contact: "Share a full vCard with name, phone, email, company and website. One scan saves you to their address book.",
  text: "Display a plain text message instantly — perfect for instructions, WiFi notes, serial numbers or short announcements.",
  app: "Send visitors to the App Store or Google Play so they land on the right download page for their device.",
  sms: "Pre-fill a text message so customers can opt in, vote or request a callback with a single tap.",
  email: "Open a new email with the recipient, subject and body already filled in for faster support requests.",
  phone: "Let people call your business instantly without typing a number — great for signage and business cards.",
  social: "Group all your social profiles behind one code so followers can pick where to connect.",
};

function Types() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">QR Code types</h1>
        <p className="mt-4 text-muted-foreground">
          Every type below is free to create, has no scan limit and downloads as PNG or SVG.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {qrTypes.map((t) => (
          <div key={t.id} className="rounded-3xl border border-border bg-card p-7 shadow-card">
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand">
              <t.icon className="size-6" />
            </span>
            <h2 className="mt-4 text-lg font-bold">{t.label} QR Code</h2>
            <p className="mt-2 text-sm text-muted-foreground">{details[t.id]}</p>
            <Link to="/" hash="generator" className="mt-4 inline-block text-sm font-bold text-brand">
              Create a {t.label} code →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
