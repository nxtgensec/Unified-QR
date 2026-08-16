import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  CreditCard,
  LayoutGrid,
  Layers,
  LogOut,
  Menu,
  Plus,
  Settings,
  Users,
  X,
} from "lucide-react";
import unifiedQrLogo from "@/assets/UnifiedQR_Logo.png";

type NavItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
  beta?: boolean;
};

const nav: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutGrid className="size-4" /> },
  { to: "/create", label: "Create QR Code", icon: <Plus className="size-4" /> },
  { to: "/analytics", label: "Analytics", icon: <BarChart3 className="size-4" /> },
  { to: "/bulk", label: "Bulk import", icon: <Layers className="size-4" /> },
  { to: "/team", label: "Team", icon: <Users className="size-4" />, beta: true },
  { to: "/billing", label: "Billing", icon: <CreditCard className="size-4" />, beta: true },
  { to: "/settings", label: "Settings", icon: <Settings className="size-4" /> },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const initials = (user?.email ?? "?").slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <span className="flex items-center gap-2 font-extrabold tracking-tight">
            <img src={unifiedQrLogo} alt="UnifiedQR logo" className="size-8 shrink-0" />
            UnifiedQR
          </span>
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-brand-soft text-brand"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                }`}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.beta && (
                  <span className="rounded-full bg-premium/15 px-2 py-0.5 text-[10px] font-bold uppercase text-premium">
                    Beta
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">
              {initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold">{user?.email}</span>
              <span className="block text-[11px] text-muted-foreground">Free plan</span>
            </span>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-foreground/40 lg:hidden"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-border bg-card px-4 lg:hidden">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <span className="flex items-center gap-2 font-extrabold tracking-tight">
            <img src={unifiedQrLogo} alt="UnifiedQR logo" className="size-6 shrink-0" />
            UnifiedQR
          </span>
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  beta,
  actions,
}: {
  title: string;
  description: string;
  beta?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
          {beta && (
            <span className="rounded-full bg-premium/15 px-2.5 py-1 text-[10px] font-bold uppercase text-premium">
              Beta
            </span>
          )}
        </div>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {actions}
    </div>
  );
}

export function BetaNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-2xl border border-premium/30 bg-premium/10 p-4 text-sm text-foreground">
      <span className="font-bold">Beta preview — </span>
      {children}
    </div>
  );
}
