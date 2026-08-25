import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { docsTopics } from "@/lib/docs-topics";

export const Route = createFileRoute("/docs/")({
  component: DocsOverview,
});

function DocsOverview() {
  return (
    <article className="min-w-0 max-w-3xl">
      <h2 className="text-2xl font-extrabold tracking-tight">What is UnifiedQR?</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        UnifiedQR is a <strong className="text-foreground">free QR code generator</strong> that lets
        anyone create a QR code in seconds — for a website, a PDF menu, a Wi-Fi password, a contact
        card and more. You can customize how the code looks, download it in print-ready formats, and
        (optionally) create <strong className="text-foreground">dynamic QR codes</strong> whose
        destination you can change even after printing.
      </p>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        It also includes two power tools: <strong className="text-foreground">Bulk creation</strong>{" "}
        (generate hundreds of codes from a CSV) and{" "}
        <strong className="text-foreground">Workspace</strong> (one QR code that opens a page with
        many links — like a personal homepage).
      </p>

      <h2 className="pt-8 text-2xl font-extrabold tracking-tight">Who is it for?</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background p-5 shadow-card">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <Sparkles className="size-4" />
            </span>
            <h3 className="font-bold">Creators & individuals</h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Put all your socials on one page, share your Wi-Fi, or make a contact card QR for your
            resume.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-5 shadow-card">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <Zap className="size-4" />
            </span>
            <h3 className="font-bold">Small businesses</h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Restaurant menus, shop catalogs with WhatsApp ordering, flyers, packaging and posters —
            no watermarks, ever.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-5 shadow-card">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <ArrowRight className="size-4" />
            </span>
            <h3 className="font-bold">Marketers</h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Dynamic codes you can re-target anytime, plus scan analytics: devices, countries,
            referrers and peak hours.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-5 shadow-card">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <ArrowRight className="size-4" />
            </span>
            <h3 className="font-bold">Teams & operations</h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Bulk-create labeled codes for inventory, table tents, events or asset tags from a single
            CSV upload.
          </p>
        </div>
      </div>

      <h2 className="pt-8 text-2xl font-extrabold tracking-tight">Quick start (no sign-up)</h2>
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
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Sign in with Google only if you want to <em>save</em> codes, create dynamic links, or use
        bulk & workspace tools.
      </p>

      <h2 className="pt-8 text-2xl font-extrabold tracking-tight">Learn by topic</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Each topic has its own page — pick what you need:
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {docsTopics.map((t) => (
          <Link
            key={t.id}
            to="/docs/$topic"
            params={{ topic: t.id }}
            className="group flex items-start gap-3 rounded-xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-card"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <t.icon className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold">{t.title}</span>
              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                {t.short}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </article>
  );
}
