import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Users, Zap, Globe } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — UnifiedQR" },
      {
        name: "description",
        content:
          "Learn about UnifiedQR — the free QR code platform trusted by millions. Our mission, team and values.",
      },
      { property: "og:title", content: "About Us — UnifiedQR" },
      {
        property: "og:description",
        content: "Learn about UnifiedQR — the free QR code platform trusted by millions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "canonical", href: "https://qr.nxtgensec.org/about" },
      { rel: "alternate", hreflang: "en", href: "https://qr.nxtgensec.org/about" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "UnifiedQR",
          url: "https://qr.nxtgensec.org",
          logo: "https://qr.nxtgensec.org/favicon.ico",
          description: "Free QR Code generator and tracker for URLs, PDFs, contacts, SMS and more.",
          email: "unifiedqr@nxtgensec.org",
          foundingDate: "2026",
          sameAs: ["https://github.com/nxtgensec/Unified-QR"],
        }),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">About UnifiedQR</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          We're building the simplest, most powerful QR Code platform — free for everyone.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-extrabold tracking-tight">Our Mission</h2>
        <p className="mt-4 text-muted-foreground">
          UnifiedQR was created with one goal: make QR Code generation accessible to everyone,
          without paywalls, watermarks or complexity. Whether you're a small business owner printing
          menus, a marketer running campaigns, or a developer integrating QR flows — we want you to
          have a tool that just works.
        </p>
        <p className="mt-3 text-muted-foreground">
          We believe the core QR Code experience should always be free. Dynamic codes, analytics and
          team features are available for users who need more, at honest prices with no hidden fees.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-extrabold tracking-tight">What We Stand For</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {[
            {
              icon: Zap,
              title: "Speed & Simplicity",
              body: "Generate a QR Code in seconds. No sign-up required for static codes. The generator just works.",
            },
            {
              icon: Shield,
              title: "Privacy First",
              body: "No advertising trackers. No third-party analytics. Minimal cookies. Your data stays yours.",
            },
            {
              icon: Users,
              title: "Built for Teams",
              body: "Collaborate on shared QR code libraries. Invite team members with role-based access controls.",
            },
            {
              icon: Globe,
              title: "For Everyone",
              body: "Available in 40 languages. Free for personal and commercial use. No watermarks on downloads.",
            },
          ].map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <v.icon className="size-7 text-brand" />
              <h3 className="mt-3 font-bold">{v.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-extrabold tracking-tight">By the Numbers</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: "4K+", label: "Users worldwide" },
            { value: "Free", label: "Static QR codes" },
            { value: "40", label: "Languages supported" },
            { value: "99.9%", label: "Uptime SLA" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-5 text-center shadow-card"
            >
              <p className="text-2xl font-extrabold text-brand">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <h2 className="text-xl font-extrabold">Get in Touch</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Have a question, partnership inquiry or just want to say hello?
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            to="/contact"
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground"
          >
            Contact us
          </Link>
          <a
            href="https://github.com/nxtgensec/Unified-QR"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border px-6 py-2.5 text-sm font-bold transition-colors hover:bg-surface"
          >
            View on GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
