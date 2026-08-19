import { Link } from "@tanstack/react-router";
import { Logo } from "./Header";
import { useLocale, SUPPORTED_LOCALES, type MessageKey } from "@/lib/locale";

const columns: { title: MessageKey; links: { label: string; to: string }[] }[] = [
  {
    title: "footer.product",
    links: [
      { label: "QR Code types", to: "/qr-code-types" },
      { label: "Pricing", to: "/pricing" },
      { label: "Free QR generator", to: "/" },
      { label: "Contact sales", to: "/contact" },
    ],
  },
  {
    title: "footer.qrCodes",
    links: [
      { label: "URL QR Code", to: "/qr-code-types" },
      { label: "vCard QR Code", to: "/qr-code-types" },
      { label: "PDF QR Code", to: "/qr-code-types" },
      { label: "WiFi QR Code", to: "/qr-code-types" },
    ],
  },
  {
    title: "footer.company",
    links: [
      { label: "About us", to: "/about" },
      { label: "Support", to: "/contact" },
      { label: "All QR Code types", to: "/qr-code-types" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
  {
    title: "footer.legal",
    links: [
      { label: "Privacy policy", to: "/privacy" },
      { label: "Terms of service", to: "/terms" },
      { label: "Cookie policy", to: "/cookies" },
      { label: "Refund policy", to: "/refund" },
    ],
  },
];

export function Footer() {
  const { locale, setLocale, t } = useLocale();
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">{t("footer.tagline")}</p>
            <div className="mt-5 flex gap-2">
              {[
                { label: "X", href: "https://x.com/unifiedqr" },
                { label: "in", href: "https://linkedin.com/company/unifiedqr" },
                { label: "IG", href: "https://instagram.com/unifiedqr" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-9 place-items-center rounded-full border border-border bg-background text-xs font-bold text-muted-foreground transition-colors hover:text-brand hover:border-brand"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold">{t(col.title)}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l, i) => (
                  <li key={`${l.label}-${i}`}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-brand"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} UnifiedQR. All rights reserved.
          </p>
          <select
            aria-label={t("nav.language")}
            value={locale}
            onChange={(e) =>
              setLocale(e.target.value as (typeof SUPPORTED_LOCALES)[number]["code"])
            }
            className="cursor-pointer rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold"
          >
            {SUPPORTED_LOCALES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.native}
              </option>
            ))}
          </select>
        </div>
      </div>
    </footer>
  );
}
