import { Link } from "@tanstack/react-router";
import { Logo } from "./Header";

const columns = [
  {
    title: "Product",
    links: [
      { label: "QR Code types", to: "/qr-code-types" },
      { label: "Pricing", to: "/pricing" },
      { label: "Free QR generator", to: "/" },
      { label: "Contact sales", to: "/contact" },
    ],
  },
  {
    title: "QR Codes",
    links: [
      { label: "URL QR Code", to: "/qr-code-types" },
      { label: "vCard QR Code", to: "/qr-code-types" },
      { label: "PDF QR Code", to: "/qr-code-types" },
      { label: "WiFi QR Code", to: "/qr-code-types" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", to: "/contact" },
      { label: "Careers", to: "/contact" },
      { label: "Support", to: "/contact" },
      { label: "Partners", to: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", to: "/contact" },
      { label: "Terms of service", to: "/contact" },
      { label: "GDPR", to: "/contact" },
      { label: "Security", to: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              All-in-one tool to create free QR Codes, edit them, and track campaign
              performance. Trusted by 4M+ users worldwide.
            </p>
            <div className="mt-5 flex gap-2">
              {["X", "in", "f", "IG"].map((s) => (
                <span
                  key={s}
                  className="grid size-9 place-items-center rounded-full border border-border bg-background text-xs font-bold text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold">{col.title}</h3>
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
            aria-label="Language"
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold"
            defaultValue="en"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>
    </footer>
  );
}
