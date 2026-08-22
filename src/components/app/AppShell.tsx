import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  CreditCard,
  LayoutGrid,
  Layers,
  Link2,
  LogOut,
  Menu,
  Plus,
  QrCode,
  Settings,
  X,
} from "lucide-react";
import unifiedQrLogo from "@/assets/UnifiedQR_Logo.png";

const nav: { to: string; label: string; icon: React.ReactNode; beta?: boolean }[] = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutGrid className="size-4" /> },
  { to: "/create", label: "Create QR Code", icon: <Plus className="size-4" /> },
  { to: "/links", label: "Workspace", icon: <Link2 className="size-4" />, beta: true },
  { to: "/analytics", label: "Analytics", icon: <BarChart3 className="size-4" />, beta: true },
  { to: "/bulk", label: "Bulk Create", icon: <Layers className="size-4" />, beta: true },
  { to: "/billing", label: "Billing", icon: <CreditCard className="size-4" /> },
  { to: "/settings", label: "Settings", icon: <Settings className="size-4" /> },
];

const bottomNav = [
  { to: "/dashboard", label: "Home", icon: LayoutGrid },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/links", label: "Workspace", icon: Link2 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const { data: plan } = useQuery({
    queryKey: ["user-plan", user?.id],
    queryFn: async () => {
      if (!user) return "free";
      const { data } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .maybeSingle();
      return (data?.plan ?? "free") as string;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    placeholderData: "free",
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const initials = (user?.email ?? "?").slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-background transition-transform lg:static lg:translate-x-0 ${
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
                preload="intent"
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
                  <span className="rounded-full bg-premium/10 px-2 py-0.5 text-[10px] font-bold text-premium">
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
              <span className="block text-[11px] capitalize text-muted-foreground">
                {plan} plan
              </span>
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
        <header className="flex h-16 items-center gap-3 border-b border-border bg-background px-4 lg:hidden">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <span className="flex items-center gap-2 font-extrabold tracking-tight">
            <img src={unifiedQrLogo} alt="UnifiedQR logo" className="size-6 shrink-0" />
            UnifiedQR
          </span>
        </header>
        <main className="min-w-0 flex-1 pb-20 lg:pb-0">{children}</main>
      </div>

      {/* Mobile bottom nav — PhonePe style */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg lg:hidden">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
          {bottomNav.slice(0, 2).map((item) => {
            const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex min-w-0 flex-1 flex-col items-center gap-0.5 py-1.5"
              >
                <span
                  className={`grid size-9 place-items-center rounded-full transition-colors ${
                    active ? "bg-brand-soft text-brand" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="size-5" />
                </span>
                <span
                  className={`text-[10px] font-semibold ${active ? "text-brand" : "text-muted-foreground"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          <Link to="/create" className="-mt-5 flex flex-col items-center">
            <span className="grid size-14 place-items-center rounded-full bg-brand text-white shadow-lg shadow-brand/30 transition-transform hover:scale-105">
              <QrCode className="size-6" />
            </span>
            <span className="mt-0.5 text-[10px] font-bold text-brand">Create</span>
          </Link>

          {bottomNav.slice(2).map((item) => {
            const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex min-w-0 flex-1 flex-col items-center gap-0.5 py-1.5"
              >
                <span
                  className={`grid size-9 place-items-center rounded-full transition-colors ${
                    active ? "bg-brand-soft text-brand" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="size-5" />
                </span>
                <span
                  className={`text-[10px] font-semibold ${active ? "text-brand" : "text-muted-foreground"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {actions}
    </div>
  );
}
