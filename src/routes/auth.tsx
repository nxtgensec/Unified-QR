import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/lib/locale";
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

const OAUTH_ERROR_HINT: Record<string, string> = {
  unexpected_failure:
    "usually a server-side configuration problem (Google OAuth app or Supabase redirect URLs)",
  access_denied: "the Google account was not authorized",
};

function oauthErrorMessage(errorCode: string | null, description: string | null) {
  const hint = errorCode ? OAUTH_ERROR_HINT[errorCode] : null;
  const detail = description || errorCode || "Unknown error";
  return hint
    ? `Google sign-in failed: ${detail} — ${hint}. Please try again.`
    : `Google sign-in failed: ${detail}. Please try again.`;
}

function AuthPage() {
  const { user, loading } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard", replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search);
    const error = params.get("error");
    const errorCode = params.get("error_code");
    const description = params.get("error_description");
    if (error) {
      toast.error(oauthErrorMessage(errorCode, description), { duration: 8000 });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

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
            {t("auth.brand.tagline")}
          </h2>
          <ul className="mt-8 space-y-4 text-sm">
            <Bullet icon={<Link2 className="size-4" />}>{t("auth.brand.dynamic")}</Bullet>
            <Bullet icon={<BarChart3 className="size-4" />}>{t("auth.brand.analytics")}</Bullet>
            <Bullet icon={<Sparkles className="size-4" />}>{t("auth.brand.templates")}</Bullet>
          </ul>
        </div>

        <p className="relative flex items-center gap-2 text-xs text-brand-foreground/80">
          <ShieldCheck className="size-4" /> {t("auth.brand.secure")}
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

          <h1 className="mt-8 text-3xl font-extrabold tracking-tight lg:mt-0">{t("auth.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("auth.subtitle")}</p>

          <button
            type="button"
            onClick={signIn}
            disabled={busy}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-bold shadow-card transition-colors hover:bg-background disabled:opacity-60"
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
            {busy ? t("auth.busy") : t("auth.signInWith")}
          </button>

          <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            Secure sign-in
            <span className="h-px flex-1 bg-border" />
          </div>

          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            {t("auth.googleOnly")}
          </p>

          <Link
            to="/"
            className="mt-8 inline-block text-xs font-semibold text-brand hover:underline"
          >
            {t("auth.back")}
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
