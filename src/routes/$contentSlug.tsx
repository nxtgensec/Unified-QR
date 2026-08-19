import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPage } from "@/data/pageRegistry";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/$contentSlug")({
  ssr: true,
  head: ({ params }) => {
    const page = getPage(params.contentSlug);
    if (!page) {
      return {
        meta: [{ title: "Page Not Found — UnifiedQR" }],
      };
    }
    return {
      meta: [
        { title: page.title },
        { name: "description", content: page.description },
        { property: "og:title", content: page.title },
        { property: "og:description", content: page.description },
        { property: "og:url", content: `https://qr.nxtgensec.org/${params.contentSlug}` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
      links: [
        {
          rel: "canonical",
          href: `https://qr.nxtgensec.org/${params.contentSlug}`,
        },
        {
          rel: "alternate",
          hreflang: "en",
          href: `https://qr.nxtgensec.org/${params.contentSlug}`,
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: page.h1,
              description: page.description,
              url: `https://qr.nxtgensec.org/${params.contentSlug}`,
              isPartOf: {
                "@type": "WebSite",
                name: "UnifiedQR",
                url: "https://qr.nxtgensec.org",
              },
            },
            ...(page.faqs.length > 0
              ? [
                  {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    mainEntity: page.faqs.map((f) => ({
                      "@type": "Question",
                      name: f.q,
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: f.a,
                      },
                    })),
                  },
                ]
              : []),
          ]),
        },
      ],
    };
  },
  component: ContentPage,
});

function ContentPage() {
  const { contentSlug } = Route.useParams();
  const page = getPage(contentSlug);

  if (!page) {
    throw notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{page.h1}</span>
      </nav>

      <div className="max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">{page.h1}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{page.intro}</p>
      </div>

      <div className="mt-12 space-y-12">
        {page.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl font-bold sm:text-2xl">{s.heading}</h2>
            <p className="mt-3 text-muted-foreground">{s.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <h2 className="text-xl font-bold sm:text-2xl">{page.cta}</h2>
        <Link
          to="/"
          hash="generator"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-brand-foreground"
        >
          Get started free <ArrowRight className="size-4" />
        </Link>
      </div>

      {page.faqs.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold tracking-tight">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-6">
            {page.faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left text-base font-bold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      {page.relatedSlugs.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold">Related pages</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {page.relatedSlugs.map((slug) => {
              const related = getPage(slug);
              return (
                <Link
                  key={slug}
                  to={`/${slug}` as never}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  {related?.h1 ?? slug}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
