import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { docsTopics } from "@/lib/docs-topics";
import { useRouterState } from "@tanstack/react-router";

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
    ],
    links: [{ rel: "canonical", href: "https://qr.nxtgensec.org/docs" }],
  }),
  component: DocsLayout,
});

function DocsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-brand-soft/60 to-background py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
            <BookOpen className="size-4" /> Documentation
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            UnifiedQR user guide
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Everything you need to create, customize, share and track QR codes — explained in plain
            language, one topic at a time.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[240px_1fr]">
        {/* Topic nav */}
        <nav className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Topics
          </p>
          <ul className="mt-3 space-y-0.5">
            <li>
              <Link
                to="/docs"
                className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  pathname === "/docs"
                    ? "bg-brand-soft font-semibold text-brand"
                    : "text-muted-foreground hover:bg-background hover:text-foreground"
                }`}
              >
                Overview
              </Link>
            </li>
            {docsTopics.map((t) => {
              const active = pathname === `/docs/${t.id}`;
              return (
                <li key={t.id}>
                  <Link
                    to="/docs/$topic"
                    params={{ topic: t.id }}
                    className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                      active
                        ? "bg-brand-soft font-semibold text-brand"
                        : "text-muted-foreground hover:bg-background hover:text-foreground"
                    }`}
                  >
                    {t.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content */}
        <div className="min-w-0">
          {/* Mobile topic chips */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            <Link
              to="/docs"
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                pathname === "/docs"
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-border text-muted-foreground"
              }`}
            >
              Overview
            </Link>
            {docsTopics.map((t) => {
              const active = pathname === `/docs/${t.id}`;
              return (
                <Link
                  key={t.id}
                  to="/docs/$topic"
                  params={{ topic: t.id }}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {t.title}
                </Link>
              );
            })}
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
