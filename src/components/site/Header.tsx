import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import unifiedQrLogo from "@/assets/UnifiedQR_Logo.png";

const nav = [
  { label: "QR Code types", to: "/qr-code-types" },
  { label: "Pricing", to: "/pricing" },
  { label: "Contact", to: "/contact" },
];

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <img src={unifiedQrLogo} alt="UnifiedQR logo" className="size-9 shrink-0" />
      <span className="text-[17px] font-extrabold leading-tight tracking-tight">UnifiedQR</span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 lg:flex">
            <button className="flex items-center gap-1 text-sm font-semibold text-foreground/80 transition-colors hover:text-brand">
              Products <ChevronDown className="size-4" />
            </button>
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "text-brand" }}
                className="text-sm font-semibold text-foreground/80 transition-colors hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
            <button className="flex items-center gap-1 text-sm font-semibold text-foreground/80 transition-colors hover:text-brand">
              Resources <ChevronDown className="size-4" />
            </button>
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-foreground/80 hover:text-brand"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-bold hover:bg-surface"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm font-semibold text-foreground/80 hover:text-brand"
              >
                Log in
              </Link>
              <Link
                to="/auth"
                className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground shadow-card transition-transform hover:-translate-y-0.5"
              >
                Sign up free
              </Link>
            </>
          )}
        </div>

        <button className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="text-sm font-semibold text-foreground/80"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to={user ? "/dashboard" : "/auth"}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brand px-5 py-2.5 text-center text-sm font-bold text-brand-foreground"
            >
              {user ? "Dashboard" : "Sign up free"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
