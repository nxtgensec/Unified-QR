import { createFileRoute, Link } from "@tanstack/react-router";
import { QrWidget } from "@/components/qr/QrWidget";
import { qrTypes } from "@/components/qr/TypeTabs";
import { VisitorBadge } from "@/components/site/VisitorBadge";
import { useLocale } from "@/lib/locale";
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
  QrCode,
  ArrowRight,
  MessageSquare,
  Mail,
  ExternalLink,
} from "lucide-react";
import step1 from "@/assets/step-1-choose-type.jpg";
import step2 from "@/assets/step-2-customize.jpg";
import step3 from "@/assets/step-3-download.jpg";
import analytics from "@/assets/feature-analytics.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "UnifiedQR — Free QR Code Generator | Create, Customise & Download QR Codes",
      },
      {
        name: "description",
        content:
          "100% free QR code generator. Create, customize, download and track QR codes for URLs, websites, PDFs, vCards, Wi-Fi, email, SMS and more. Customizable designs, multiple formats, scan tracking — all in one place.",
      },
      {
        property: "og:title",
        content: "UnifiedQR — Free QR Code Generator | Create, Customise & Download QR Codes",
      },
      {
        property: "og:description",
        content:
          "Generate professional QR Codes for free — supports URLs, PDFs, vCards, SMS, email and more. Customise colours, shapes and logos, download in multiple formats and track every scan.",
      },
      { property: "og:url", content: "https://qr.nxtgensec.org" },
    ],
    links: [
      { rel: "canonical", href: "https://qr.nxtgensec.org" },
      { rel: "alternate", hreflang: "en", href: "https://qr.nxtgensec.org" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "UnifiedQR",
            url: "https://qr.nxtgensec.org",
            description:
              "Professional QR Code platform. Generate, customise, download and manage QR codes for URLs, PDFs, vCards, SMS, email and more with real-time scan analytics.",
            applicationCategory: "https://schema.org/UtilitiesApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "AggregateOffer",
              lowPrice: "0",
              highPrice: "2999",
              priceCurrency: "INR",
              offerCount: 3,
            },
            featureList: [
              "Free static QR code generation with no watermarks",
              "Dynamic QR codes with editable destinations",
              "Real-time scan analytics with device and referrer tracking",
              "Team collaboration with role-based access",
              "CSV bulk import for enterprise workflows",
              "PNG, SVG, JPG, WebP and PDF downloads",
              "29 language support with auto-detection",
              "Custom colours, body shapes, eye styles, gradients, logos and frames",
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "UnifiedQR",
            url: "https://qr.nxtgensec.org",
            logo: "https://qr.nxtgensec.org/favicon.ico",
            description: "Professional QR Code platform trusted by 4K+ users worldwide.",
            email: "unifiedqr@nxtgensec.org",
            sameAs: ["https://github.com/nxtgensec/Unified-QR"],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Are the QR Codes free forever?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Every static QR Code you create here is free, has no expiry date and no scan limit.",
                },
              },
              {
                "@type": "Question",
                name: "What is the difference between static and dynamic QR Codes?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A static QR Code stores the data directly inside the code. A dynamic QR Code points to a short link you control.",
                },
              },
              {
                "@type": "Question",
                name: "Can I add my logo to a QR Code?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Pick a template, adjust your colors, and add a logo in the customization panel.",
                },
              },
            ],
          },
        ]),
      },
    ],
  }),
  component: Home,
});

const steps = [
  {
    key: "1" as const,
    img: step1,
  },
  {
    key: "2" as const,
    img: step2,
  },
  {
    key: "3" as const,
    img: step3,
  },
];

const faqKeys = ["1", "2", "3", "4", "5"] as const;

const scanSteps = [1, 2, 3, 4] as const;

const featureCards = [
  {
    icon: RefreshCcw,
    titleKey: "home.features.dynamic.title" as const,
    bodyKey: "home.features.dynamic.body" as const,
  },
  {
    icon: Users,
    titleKey: "home.features.collab.title" as const,
    bodyKey: "home.features.collab.body" as const,
  },
  {
    icon: Headphones,
    titleKey: "home.features.support.title" as const,
    bodyKey: "home.features.support.body" as const,
  },
  {
    icon: Wallet,
    titleKey: "home.features.pay.title" as const,
    bodyKey: "home.features.pay.body" as const,
  },
];

function Home() {
  const { t } = useLocale();
  return (
    <>
      <VisitorBadge />
      <section className="bg-gradient-to-b from-brand-soft/70 to-background pb-16 pt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              UnifiedQR
            </h1>
            <p className="mt-2 text-lg font-semibold text-brand sm:text-xl lg:text-2xl">
              100% Free QR Code Generator
            </p>
          </div>

          <div className="mt-10">
            <QrWidget />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-background py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold">4.8</span>
            <span className="flex text-premium">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </span>
            <span className="text-sm text-muted-foreground">{t("home.social.onGoogle")}</span>
          </div>
          <p className="text-sm font-semibold">
            {t("home.social.trusted")} <span className="text-brand">{t("home.social.users")}</span>
          </p>
          <div className="flex flex-col items-center gap-1">
            <a
              href="#generator"
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground"
            >
              {t("home.social.signupFree")}
            </a>
            <span className="text-xs text-muted-foreground">{t("home.social.noCreditCard")}</span>
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-extrabold tracking-tight sm:text-4xl">
            {t("home.steps.title")}
          </h2>
          <div className="mt-12 space-y-14">
            {steps.map((s, i) => (
              <div
                key={s.key}
                className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}
              >
                <div>
                  <span className="grid size-10 place-items-center rounded-full bg-brand text-lg font-extrabold text-brand-foreground">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-xl font-bold sm:text-2xl">
                    {t(`home.steps.${s.key}.title`)}
                  </h3>
                  <p className="mt-3 text-muted-foreground">{t(`home.steps.${s.key}.body`)}</p>
                </div>
                <img
                  src={s.img}
                  alt={t(`home.steps.${s.key}.title`)}
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
              {t("home.steps.cta")} <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
            {t("home.explained.title")}
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-bold">{t("home.explained.what.title")}</h3>
              <p className="mt-2 text-muted-foreground">{t("home.explained.what.body")}</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">{t("home.explained.why.title")}</h3>
              <p className="mt-2 text-muted-foreground">{t("home.explained.why.body")}</p>
            </div>
          </div>
          <div className="mt-10 rounded-2xl border border-border bg-background p-6 shadow-card">
            <h3 className="text-lg font-bold">{t("home.explained.how.title")}</h3>
            <ol className="mt-4 space-y-3">
              {scanSteps.map((n) => (
                <li key={n} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                    {n}
                  </span>
                  {t(`home.explained.how.${n}`)}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-foreground px-6 py-12 text-center text-background md:flex-row md:justify-between md:text-left">
          <div className="max-w-xl">
            <h2 className="text-2xl font-extrabold sm:text-3xl">{t("home.dashboard.title")}</h2>
            <p className="mt-3 text-sm opacity-80">{t("home.dashboard.body")}</p>
          </div>
          <a
            href="#generator"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-background px-6 py-3.5 text-sm font-bold text-foreground"
          >
            <QrCode className="size-4" /> {t("home.dashboard.cta")}
          </a>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="max-w-3xl text-2xl font-extrabold tracking-tight sm:text-4xl">
            {t("home.features.title")}
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <div className="rounded-3xl border border-border bg-background p-6 shadow-card lg:col-span-2">
              <BarChart3 className="size-8 text-brand" />
              <h3 className="mt-4 text-lg font-bold">{t("home.features.track.title")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t("home.features.track.body")}</p>
              <img
                src={analytics}
                alt={t("home.features.track.title")}
                loading="lazy"
                width={1280}
                height={720}
                className="mt-6 w-full rounded-xl border border-border"
              />
            </div>
            <div className="grid gap-5">
              {featureCards.map((f) => (
                <div
                  key={f.titleKey}
                  className="rounded-3xl border border-border bg-background p-6 shadow-card"
                >
                  <f.icon className="size-7 text-brand" />
                  <h3 className="mt-3 font-bold">{t(f.titleKey)}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{t(f.bodyKey)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand"
            >
              {t("home.features.cta")} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
            {t("home.types.title")}
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {qrTypes.map((qt) => (
              <div
                key={qt.id}
                className="rounded-2xl border border-border bg-background p-6 shadow-card transition-transform hover:-translate-y-1"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-brand-soft text-brand">
                  <qt.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-bold">{qt.label}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{qt.tagline}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              to="/qr-code-types"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand"
            >
              {t("home.types.cta")} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-extrabold tracking-tight sm:text-4xl">
            {t("home.faq.title")}
          </h2>
          <Accordion type="single" collapsible className="mt-8">
            {faqKeys.map((k) => (
              <AccordionItem key={k} value={k}>
                <AccordionTrigger className="text-left text-base font-bold">
                  {t(`home.faq.${k}.q`)}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t(`home.faq.${k}.a`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-card">
            <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_auto]">
              <div>
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-soft">
                  <MessageSquare className="size-6 text-brand" />
                </span>
                <h2 className="mt-5 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {t("home.community.title")}
                </h2>
                <p className="mt-3 max-w-lg text-muted-foreground">{t("home.community.body")}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a
                    href="https://github.com/nxtgensec/Unified-QR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-bold text-background transition-transform hover:-translate-y-0.5"
                  >
                    <ExternalLink className="size-4" /> {t("home.community.cta")}
                  </a>
                  <a
                    href="mailto:unifiedqr@nxtgensec.org"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-brand"
                  >
                    <Mail className="size-4" /> {t("home.community.email")}{" "}
                    <span className="font-bold text-brand">unifiedqr@nxtgensec.org</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
