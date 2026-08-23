import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { LocaleProvider, useLocale, SUPPORTED_LOCALES } from "@/lib/locale";
import { Globe, X } from "lucide-react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    console.error("Route error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "UnifiedQR — Professional QR Code Generator, Customiser & Analytics Platform",
      },
      {
        name: "description",
        content:
          "100% free QR code generator. Create, customize, download and track QR codes for URLs, websites, PDFs, vCards, Wi-Fi, email, SMS and more. Customizable designs, multiple formats, scan tracking — all in one place.",
      },
      { name: "author", content: "UnifiedQR" },
      { name: "theme-color", content: "#16a34a" },
      { name: "robots", content: "index, follow" },
      { property: "og:site_name", content: "UnifiedQR" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:url", content: "https://qr.nxtgensec.org" },
      {
        property: "og:title",
        content: "UnifiedQR — Professional QR Code Generator, Customiser & Analytics Platform",
      },
      {
        property: "og:description",
        content:
          "Generate, customise and download high-quality QR Codes for URLs, PDFs, vCards, SMS and email. Dynamic codes with real-time scan analytics, team collaboration and CSV bulk create.",
      },
      {
        property: "og:image",
        content: "https://qr.nxtgensec.org/og-default.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "UnifiedQR — Professional QR Code Generator, Customiser & Analytics Platform",
      },
      {
        name: "twitter:description",
        content:
          "Generate, customise and download QR Codes for URLs, PDFs, vCards, SMS and more. Real-time analytics, dynamic codes and team collaboration — all free.",
      },
      {
        name: "twitter:image",
        content: "https://qr.nxtgensec.org/og-default.png",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
      { rel: "alternate", hrefLang: "en", href: "https://qr.nxtgensec.org" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "UnifiedQR",
          url: "https://qr.nxtgensec.org",
          description:
            "Professional QR Code platform. Generate, customise, download and manage QR codes for URLs, PDFs, vCards, SMS, email and more with real-time analytics.",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://qr.nxtgensec.org/qr-code-types?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const APP_PREFIXES = [
  "/auth",
  "/dashboard",
  "/create",
  "/analytics",
  "/bulk",
  "/bulk-analytics",
  "/billing",
  "/settings",
  "/links",
  "/workspace-analytics",
];

const STANDALONE_PREFIXES = ["/p"];

function LanguageChooser() {
  const { needsLanguageChooser, setLocale, markLanguageChosen, t } = useLocale();
  const [dismissed, setDismissed] = useState(false);

  if (!needsLanguageChooser || dismissed) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-5 shadow-float">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-soft">
              <Globe className="size-5 text-brand" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground">{t("chooser.title")}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{t("chooser.subtitle")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              markLanguageChosen();
              setDismissed(true);
            }}
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-background"
            aria-label="Dismiss"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-4 max-h-64 overflow-y-auto rounded-xl border border-border">
          <div className="grid grid-cols-2 gap-1 p-1 sm:grid-cols-3">
            {SUPPORTED_LOCALES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLocale(l.code);
                  markLanguageChosen();
                  setDismissed(true);
                }}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:-translate-y-px hover:border-brand hover:bg-background hover:shadow-card"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-brand-soft text-[9px] font-bold text-brand">
                  {l.code.toUpperCase()}
                </span>
                <span className="truncate">{l.native}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isApp = APP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isStandalone = STANDALONE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        {isStandalone ? (
          <Outlet />
        ) : isApp ? (
          <div className="min-h-screen bg-background font-sans antialiased">
            <Outlet />
          </div>
        ) : (
          <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
            <Header />
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
          </div>
        )}
        <Toaster />
      </LocaleProvider>
    </QueryClientProvider>
  );
}
