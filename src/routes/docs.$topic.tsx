import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { docsTopics, getTopic } from "@/lib/docs-topics";

export const Route = createFileRoute("/docs/$topic")({
  beforeLoad: ({ params }) => {
    if (!getTopic(params.topic)) throw notFound();
  },
  head: ({ params }) => {
    const topic = getTopic(params.topic);
    return {
      meta: [
        {
          title: topic ? `${topic.title} — UnifiedQR Docs` : "UnifiedQR Docs",
        },
        {
          name: "description",
          content: topic?.description ?? "UnifiedQR documentation.",
        },
      ],
      links: [{ rel: "canonical", href: `https://qr.nxtgensec.org/docs/${params.topic}` }],
    };
  },
  component: DocsTopicPage,
});

function DocsTopicPage() {
  const { topic } = Route.useParams();
  const current = getTopic(topic)!;
  const index = docsTopics.findIndex((t) => t.id === current.id);
  const prev = index > 0 ? docsTopics[index - 1] : null;
  const next = index < docsTopics.length - 1 ? docsTopics[index + 1] : null;

  return (
    <article className="min-w-0 max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
          <current.icon className="size-5" />
        </span>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">{current.title}</h2>
          <p className="text-sm text-muted-foreground">{current.description}</p>
        </div>
      </div>

      <div className="mt-4">{current.content()}</div>

      <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-border pt-6">
        {prev ? (
          <Link
            to="/docs/$topic"
            params={{ topic: prev.id }}
            className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold transition-colors hover:bg-background"
          >
            <ArrowLeft className="size-4" /> {prev.title}
          </Link>
        ) : (
          <Link
            to="/docs"
            className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold transition-colors hover:bg-background"
          >
            <ArrowLeft className="size-4" /> Overview
          </Link>
        )}
        {next && (
          <Link
            to="/docs/$topic"
            params={{ topic: next.id }}
            className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground transition-transform hover:-translate-y-0.5"
          >
            {next.title} <ArrowRight className="size-4" />
          </Link>
        )}
      </div>
    </article>
  );
}
