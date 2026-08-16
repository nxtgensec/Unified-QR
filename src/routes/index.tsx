import { createFileRoute, Link } from "@tanstack/react-router";
import { QrWidget } from "@/components/qr/QrWidget";
import { qrTypes } from "@/components/qr/TypeTabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart3,
  RefreshCcw,
  Users,
  Headphones,
  Wallet,
  Star,
  Chrome,
  ArrowRight,
} from "lucide-react";
import step1 from "@/assets/step-1-choose-type.jpg";
import step2 from "@/assets/step-2-customize.jpg";
import step3 from "@/assets/step-3-download.jpg";
import analytics from "@/assets/feature-analytics.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Free QR Code Generator — Create & Download QR Codes | UnifiedQR" },
      {
        name: "description",
        content:
          "Create free QR Codes for URLs, PDFs, contacts, SMS, email and more. Customize colors and styles, then download as PNG or SVG in seconds.",
      },
      { property: "og:title", content: "Free QR Code Generator — Create & Download QR Codes" },
      {
        property: "og:description",
        content:
          "All-in-one tool to create free QR Codes, edit them, and track campaign performance.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "UnifiedQR",
          applicationCategory: "UtilitiesApplication",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: Home,
});

const steps = [
  {
    title: "Choose your QR Code type",
    body: "Choose your QR Code type (static or dynamic) based on what you want it to do: open a URL, share a PDF, display a menu, share contact details, and more.",
    img: step1,
  },
  {
    title: "Customize it your way",
    body: "Add your details, change the color, style your QR Code, add a logo, and test it in real time before downloading.",
    img: step2,
  },
  {
    title: "Download & share",
    body: "Pick PNG, or SVG format, hit download, and you're all set to share it anywhere!",
    img: step3,
  },
];

const faqs = [
  {
    q: "Are the QR Codes free forever?",
    a: "Yes. Every static QR Code you create here is free, has no expiry date and no scan limit. You can download it as PNG or SVG and use it commercially.",
  },
  {
    q: "What is the difference between static and dynamic QR Codes?",
    a: "A static QR Code stores the data directly inside the code, so it can never be changed. A dynamic QR Code points to a short link you control, so you can edit the destination and track scans at any time.",
  },
  {
    q: "Can I add my logo to a QR Code?",
    a: "Yes. Pick a template, adjust your colors, and add a logo in the customization panel. Keep the logo small so scanners can still read the code reliably.",
  },
  {
    q: "Which file format should I download?",
    a: "Use PNG for screens, social posts and documents. Use SVG for print, large-format signage or anywhere you need to resize without losing quality.",
  },
  {
    q: "Do QR Codes expire?",
    a: "Static QR Codes never expire. Dynamic QR Codes stay active as long as your account is active, and you can update where they point at any time.",
  },
];

function Home() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-soft/70 to-background pb-16 pt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              UnifiedQR
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              All-in-one tool to create free QR Codes, edit them, and track campaign
              performance.
            </p>
          </div>

          <div className="mt-10">
            <QrWidget />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold">4.8</span>
            <span className="flex text-premium">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </span>
            <span className="text-sm text-muted-foreground">on Google</span>
          </div>
          <p className="text-sm font-semibold">
            Trusted by <span className="text-brand">4M+ users</span>
          </p>
          <div className="flex flex-col items-center gap-1">
            <a
              href="#generator"
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground"
            >
              Sign up free
            </a>
            <span className="text-xs text-muted-foreground">No credit card required</span>
          </div>
        </div>
      </section>


      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-extrabold tracking-tight sm:text-4xl">
            How to create a free QR Code in 3 simple steps
          </h2>
          <div className="mt-12 space-y-14">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}
              >
                <div>
                  <span className="grid size-10 place-items-center rounded-full bg-brand text-lg font-extrabold text-brand-foreground">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-xl font-bold sm:text-2xl">{s.title}</h3>
                  <p className="mt-3 text-muted-foreground">{s.body}</p>
                </div>
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  width={1280}
                  height={784}
                  className="w-full rounded-2xl border border-border shadow-card"
                />
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <a
              href="#generator"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-brand-foreground shadow-card"
            >
              Create a free QR Code <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
            QR Codes explained
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-bold">What is a QR Code?</h3>
              <p className="mt-2 text-muted-foreground">
                A QR Code is a two-dimensional barcode that stores information, such as URLs,
                contact details, payment data, or text, in a grid of black and white squares. It
                can be scanned with a smartphone camera to instantly access the stored content
                without typing.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Why do so many people use QR Codes in 2026?</h3>
              <p className="mt-2 text-muted-foreground">
                QR Codes provide a quick, contactless and low-cost way to link offline experiences
                to digital content. Businesses rely on them for real-time updates and to reduce
                print waste while giving users instant access with just a smartphone camera.
              </p>
            </div>
          </div>
          <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="text-lg font-bold">How do I scan one?</h3>
            <ol className="mt-4 space-y-3">
              {[
                "Open the camera app on your smartphone or tablet. Most modern devices scan QR Codes automatically.",
                "Point your camera at the QR Code, making sure it's clearly visible within the frame.",
                "Hold steady for a few seconds until the camera recognizes the code.",
                "Tap the notification or link that appears to open the website, video or contact card.",
              ].map((t, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-foreground px-6 py-12 text-center text-background md:flex-row md:justify-between md:text-left">
          <div className="max-w-xl">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Generate a QR Code without leaving your tab
            </h2>
            <p className="mt-3 text-sm opacity-80">
              No more switching screens or copying links. Just tap the UnifiedQR Chrome Extension to
              create a QR Code with a single click.
            </p>
          </div>
          <a
            href="#generator"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-background px-6 py-3.5 text-sm font-bold text-foreground"
          >
            <Chrome className="size-4" /> Get the free extension
          </a>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="max-w-3xl text-2xl font-extrabold tracking-tight sm:text-4xl">
            Why 4 Million+ users trust UnifiedQR for ROI driven QR Code campaigns
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card lg:col-span-2">
              <BarChart3 className="size-8 text-brand" />
              <h3 className="mt-4 text-lg font-bold">Track every scan</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Know how your QR Code campaign is performing with real-time insights. Get data on
                scans, unique users, locations and devices.
              </p>
              <img
                src={analytics}
                alt="QR Code scan analytics dashboard"
                loading="lazy"
                width={1280}
                height={720}
                className="mt-6 w-full rounded-xl border border-border"
              />
            </div>
            <div className="grid gap-5">
              {[
                {
                  icon: RefreshCcw,
                  title: "Free dynamic QR Codes",
                  body: "Create up to 2 dynamic QR Codes for free and update their content anytime.",
                },
                {
                  icon: Users,
                  title: "Collaborate with your team",
                  body: "Invite up to 5 team members to manage and share QR Codes on one dashboard.",
                },
                {
                  icon: Headphones,
                  title: "24/7 customer support",
                  body: "Our team is always ready to fix issues quickly, via email or call.",
                },
                {
                  icon: Wallet,
                  title: "Pay for what you use",
                  body: "Flexible pricing — pay only for the features or extra codes you need.",
                },
              ].map((f) => (
                <div key={f.title} className="rounded-3xl border border-border bg-card p-6 shadow-card">
                  <f.icon className="size-7 text-brand" />
                  <h3 className="mt-3 font-bold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand"
            >
              Explore Flex plans <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
            What types of QR Codes can you create for free?
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {qrTypes.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-card transition-transform hover:-translate-y-1"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-brand-soft text-brand">
                  <t.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-bold">{t.label}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{t.tagline}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              to="/qr-code-types"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand"
            >
              See all QR Code types <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-extrabold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="mt-8">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left text-base font-bold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}
