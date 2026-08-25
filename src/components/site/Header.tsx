import { Link } from "@tanstack/react-router";
import { Check, Globe, LayoutGrid, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocale, SUPPORTED_LOCALES } from "@/lib/locale";
import { useAuth } from "@/hooks/useAuth";
import unifiedQrLogo from "@/assets/UnifiedQR_Logo.png";

const nav: { label: string; href: string }[] = [
  { label: "Home", href: "/#hero" },
  { label: "About", href: "/#about" },
  { label: "How to create", href: "/#how-to-create" },
  { label: "QR Types", href: "/#qr-types" },
  { label: "FAQs", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
  { label: "Docs", href: "/docs" },
];

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <img src={unifiedQrLogo} alt="UnifiedQR logo" className="size-9 shrink-0" />
      <span className="text-[17px] font-extrabold leading-tight tracking-tight">UnifiedQR</span>
    </Link>
  );
}

function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const code = locale.toUpperCase();

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={t("nav.language")}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide text-foreground/70 transition-colors hover:bg-surface focus:outline-none"
      >
        <Globe className="size-3.5" aria-hidden />
        <span>{code}</span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("nav.language")}
          className="absolute right-0 top-full z-50 mt-1.5 w-52 max-h-80 overflow-y-auto rounded-xl border border-border bg-background shadow-float"
        >
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("nav.language")}
          </div>
          {SUPPORTED_LOCALES.map((l) => (
            <button
              key={l.code}
              role="option"
              aria-selected={l.code === locale}
              type="button"
              onClick={() => {
                setLocale(l.code);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 border-t border-border/50 px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-surface first:border-t-0"
            >
              <span className="flex size-6 items-center justify-center rounded-md bg-brand-soft text-[10px] font-bold text-brand">
                {l.code.toUpperCase()}
              </span>
              <span className="flex-1 text-left">{l.native}</span>
              {l.code === locale && <Check className="size-4 text-brand" aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useLocale();
  const { user, loading } = useAuth();

  const authLinks = loading ? null : user ? (
    <Link
      to="/dashboard"
      className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground shadow-card transition-transform hover:-translate-y-0.5"
    >
      <LayoutGrid className="size-4" /> Dashboard
    </Link>
  ) : (
    <>
      <Link
        to="/auth"
        className="text-sm font-semibold text-foreground/80 transition-colors hover:text-brand"
      >
        {t("header.signIn")}
      </Link>
      <Link
        to="/auth"
        className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground shadow-card transition-transform hover:-translate-y-0.5"
      >
        Sign up free
      </Link>
    </>
  );

  const mobileAuthLink = loading ? null : user ? (
    <Link
      to="/dashboard"
      onClick={() => setOpen(false)}
      className="mt-2 flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-center text-sm font-bold text-brand-foreground"
    >
      <LayoutGrid className="size-4" /> Dashboard
    </Link>
  ) : (
    <Link
      to="/auth"
      onClick={() => setOpen(false)}
      className="mt-2 rounded-full bg-brand px-5 py-2.5 text-center text-sm font-bold text-brand-foreground"
    >
      Sign up free
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map((item) =>
              item.href.includes("#") ? (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-semibold text-foreground/80 transition-colors hover:text-brand"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-sm font-semibold text-foreground/80 transition-colors hover:text-brand"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          {authLinks}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          {!loading && !user && (
            <Link
              to="/auth"
              className="rounded-full bg-brand px-4 py-2 text-xs font-bold text-brand-foreground"
            >
              Sign up free
            </Link>
          )}
          <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-[72px] z-50 border-t border-border bg-background px-4 py-4 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-3">
            {nav.map((item) =>
              item.href.includes("#") ? (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-semibold text-foreground/80"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-semibold text-foreground/80"
                >
                  {item.label}
                </Link>
              ),
            )}
            <LanguageSwitcher className="py-1.5" />
            {mobileAuthLink}
          </nav>
        </div>
      )}
    </header>
  );
}
