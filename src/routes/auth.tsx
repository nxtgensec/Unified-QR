import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
      extraParams: { prompt: "select_account" },
    });
    if (result.error) {
      setBusy(false);
      toast.error("Could not sign in with Google. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20">
      <h1 className="text-center text-3xl font-extrabold tracking-tight">
        Sign in to UnifiedQR
      </h1>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Save your codes, create editable dynamic links and track every scan. Google sign-in
        only — no passwords to remember.
      </p>

      <button
        type="button"
        onClick={signIn}
        disabled={busy}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-bold shadow-card transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        <svg viewBox="0 0 48 48" className="size-5" aria-hidden>
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.1 5.3-4.6 6.9l7.1 5.5c4.2-3.8 6.6-9.5 6.6-16.9z"/>
          <path fill="#FBBC05" d="M10.4 28.7A14.5 14.5 0 0 1 9.6 24c0-1.6.3-3.2.8-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1z"/>
          <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.4-4.6 2.2-8.8 2.2-6.4 0-11.7-3.7-13.6-9.2l-7.8 6.1C6.5 42.6 14.6 48 24 48z"/>
        </svg>
        {busy ? "Opening Google…" : "Continue with Google"}
      </button>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        By continuing you agree to our terms and privacy policy.{" "}
        <Link to="/" className="font-semibold text-brand">
          Back to generator
        </Link>
      </p>
    </div>
  );
}
