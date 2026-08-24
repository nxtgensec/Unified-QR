import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Palette, Download, Share2 } from "lucide-react";

export const Route = createFileRoute("/how-to-create")({
  head: () => ({
    meta: [
      { title: "How to Create a QR Code — Step by Step Guide | UnifiedQR" },
      {
        name: "description",
        content:
          "Learn how to create a free QR Code in 3 simple steps: pick a type, customise the design and download in PNG, SVG, JPG or PDF. No sign-up required.",
      },
      { property: "og:title", content: "How to Create a QR Code — Step by Step Guide" },
      {
        property: "og:description",
        content: "Create your first QR Code in under a minute. Free, no watermarks, no sign-up.",
      },
      { property: "og:url", content: "https://qr.nxtgensec.org/how-to-create" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "canonical", href: "https://qr.nxtgensec.org/how-to-create" },
      { rel: "alternate", hreflang: "en", href: "https://qr.nxtgensec.org/how-to-create" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to Create a QR Code with UnifiedQR",
          description:
            "Create a free QR Code in 3 steps: choose a type, customise the design and download.",
          step: [
            {
              "@type": "HowToStep",
              position: 1,
              name: "Choose your QR Code type",
              text: "Pick from URL, PDF, vCard, SMS, email, phone, text, app link, social or multi-URL.",
            },
            {
              "@type": "HowToStep",
              position: 2,
              name: "Customise the design",
              text: "Select a template, adjust colours, body shape, eye shape, add a logo and frame.",
            },
            {
              "@type": "HowToStep",
              position: 3,
              name: "Download your QR Code",
              text: "Export as PNG, SVG, JPG or PDF. No watermarks.",
            },
          ],
        }),
      },
    ],
  }),
  component: HowToCreate,
});

const steps = [
  {
    icon: ArrowRight,
    number: 1,
    title: "Choose your QR Code type",
    body: "Select what you want your QR Code to link to. Options include website URLs, PDFs, multi-link pages, vCard contacts, SMS messages, emails, phone numbers, plain text, app store links and social profiles.",
    tip: "Not sure? Start with a URL — it's the most common type and works everywhere.",
  },
  {
    icon: Palette,
    number: 2,
    title: "Customise the design",
    body: "Pick a template, then tweak the colours, body shape, eye shape, gradient angle and corner radius. Add your logo in the centre and choose a decorative frame.",
    tip: "High contrast between foreground and background colours ensures reliable scanning.",
  },
  {
    icon: Download,
    number: 3,
    title: "Download or save",
    body: "Hit the download button and choose your format — PNG, SVG, JPG or PDF. If you want to track scans or change the destination later, sign up for free and save it as a dynamic QR Code.",
    tip: "SVG is best for print. PNG is best for digital and social media.",
  },
];

const tips = [
  {
    title: "Test before printing",
    body: "Always scan your QR Code with at least two different phones before printing. Check that the URL is correct and the destination loads quickly.",
  },
  {
    title: "Size matters",
    body: "Aim for at least 2 cm × 2 cm (0.8 in × 0.8 in) for close-range scanning. For posters and signage viewed from a distance, make it larger.",
  },
  {
    title: "Don't over-customise",
    body: "Heavy gradients, very low contrast or extremely small codes can reduce scannability. Keep the design clean and test often.",
  },
  {
    title: "Use dynamic codes for campaigns",
    body: "If you're printing codes on physical materials, use a dynamic QR Code so you can update the destination without reprinting.",
  },
];

function HowToCreate() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
          How to create a QR Code
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Create your first QR Code in under a minute — free, no sign-up, no watermarks.
        </p>
      </section>

      <section className="mt-16 space-y-12">
        {steps.map((s) => (
          <div key={s.number} className="flex gap-6">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand text-lg font-extrabold text-brand-foreground">
              {s.number}
            </span>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">{s.title}</h2>
              <p className="mt-3 text-muted-foreground">{s.body}</p>
              <div className="mt-3 rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground shadow-card">
                <span className="font-bold text-brand">Tip: </span>
                {s.tip}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Best practices</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {tips.map((t) => (
            <div
              key={t.title}
              className="rounded-2xl border border-border bg-background p-6 shadow-card"
            >
              <h3 className="font-bold">{t.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-background p-8 text-center shadow-card">
        <h2 className="text-xl font-extrabold">Ready to create your QR Code?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No account needed. Just pick a type, design it and download.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-bold text-brand-foreground shadow-card"
        >
          Go to generator <ArrowRight className="size-4" />
        </Link>
      </section>
    </div>
  );
}
