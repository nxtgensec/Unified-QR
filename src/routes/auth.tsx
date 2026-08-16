import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BarChart3, Link2, ShieldCheck, Sparkles } from "lucide-react";
import unifiedQrLogo from "@/assets/UnifiedQR_Logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in to UnifiedQR — Save & Track Your QR Codes" },
      {
        name: "description",
        content:
          "Sign in with Google to save QR codes, create dynamic links you can edit anytime and see scan analytics.",
      },
      { property: "og:title", content: "Sign in to UnifiedQR" },
      {
        property: "og:description",
        content: "Google sign-in for saved QR codes, dynamic links and scan analytics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard", replace: true });
  }, [loading, user, navigate]);

  async function signIn() {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth`,
        queryParams: { prompt: "select_account" },
      },
    });

    if (error) {
      setBusy(false);
      toast.error("Could not sign in with Google. Please try again.");
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-brand p-12 text-brand-foreground lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-brand-foreground/10 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-brand-foreground/10 blur-3xl"
        />

        <Link
          to="/"
          className="relative flex items-center gap-2 text-lg font-extrabold tracking-tight"
        >
          <img src={unifiedQrLogo} alt="UnifiedQR logo" className="size-9 shrink-0" />
          UnifiedQR
        </Link>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
            One workspace for every QR Code you ship.
          </h2>
          <ul className="mt-8 space-y-4 text-sm">
            <Bullet icon={<Link2 className="size-4" />}>
              Dynamic short links you can re-point after printing.
            </Bullet>
            <Bullet icon={<BarChart3 className="size-4" />}>
              Scan tracking on every dynamic code, live from the first scan.
            </Bullet>
            <Bullet icon={<Sparkles className="size-4" />}>
              13 studio templates, custom colours, PNG and SVG exports.
            </Bullet>
          </ul>
        </div>

        <p className="relative flex items-center gap-2 text-xs text-brand-foreground/80">
          <ShieldCheck className="size-4" /> Google-verified sign-in. No passwords stored.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col justify-center bg-background px-6 py-16 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link
            to="/"
            className="flex items-center gap-2 text-base font-extrabold tracking-tight lg:hidden"
          >
            <img src={unifiedQrLogo} alt="UnifiedQR logo" className="size-8 shrink-0" />
            UnifiedQR
          </Link>

          <h1 className="mt-8 text-3xl font-extrabold tracking-tight lg:mt-0">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your workspace to manage saved codes, dynamic links and scan analytics.
          </p>

          <button
            type="button"
            onClick={signIn}
            disabled={busy}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-bold shadow-card transition-colors hover:bg-surface disabled:opacity-60"
          >
            <svg viewBox="0 0 48 48" className="size-5" aria-hidden>
              <path
                fill="#EA4335"
                d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.1 5.3-4.6 6.9l7.1 5.5c4.2-3.8 6.6-9.5 6.6-16.9z"
              />
              <path
                fill="#FBBC05"
                d="M10.4 28.7A14.5 14.5 0 0 1 9.6 24c0-1.6.3-3.2.8-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.4-4.6 2.2-8.8 2.2-6.4 0-11.7-3.7-13.6-9.2l-7.8 6.1C6.5 42.6 14.6 48 24 48z"
              />
            </svg>
            {busy ? "Opening Google…" : "Continue with Google"}
          </button>

          <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            Secure sign-in
            <span className="h-px flex-1 bg-border" />
          </div>

          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Google is currently the only sign-in method. By continuing you agree to our terms of
            service and privacy policy.
          </p>

          <Link
            to="/"
            className="mt-8 inline-block text-xs font-semibold text-brand hover:underline"
          >
            ← Back to the free generator
          </Link>
        </div>
      </main>
    </div>
  );
}

function Bullet({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-brand-foreground/15">
        {icon}
      </span>
      <span className="text-brand-foreground/90">{children}</span>
    </li>
  );
}
