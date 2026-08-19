import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ShieldAlert, ShieldCheck, LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getAdminStats, checkAdmin, type AdminStats } from "@/lib/admin.functions";
import { useLocale } from "@/lib/locale";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — UnifiedQR" },
      {
        name: "description",
        content: "UnifiedQR admin panel. Authorized access only.",
      },
      { property: "og:title", content: "Admin — UnifiedQR" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function GoogleIcon() {
  return (
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
  );
}

function AdminPage() {
  const { user, loading } = useAuth();
  const { t } = useLocale();
  const [busy, setBusy] = useState(false);

  const adminQuery = useQuery({
    queryKey: ["admin-check"],
    queryFn: () => checkAdmin(),
    enabled: !!user,
  });
  const isAdmin = adminQuery.data?.isAdmin ?? false;

  const statsQuery = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => getAdminStats(),
    enabled: !!user && isAdmin,
  });

  async function signIn() {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin`,
        queryParams: { prompt: "select_account" },
      },
    });
    if (error) {
      setBusy(false);
      toast.error("Could not sign in with Google. Please try again.");
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand">
          <ShieldCheck className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Admin panel</h1>
          <p className="text-sm text-muted-foreground">UnifiedQR · authorized access only</p>
        </div>
      </div>

      {loading ? (
        <Centered>
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </Centered>
      ) : !user ? (
        <Centered>
          <ShieldCheck className="size-12 text-brand" />
          <h2 className="mt-4 text-xl font-bold">Sign in to continue</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {t("admin.signInToContinue")}
          </p>
          <button
            type="button"
            onClick={signIn}
            disabled={busy}
            className="mt-6 flex items-center gap-3 rounded-full border border-border bg-card px-6 py-3 text-sm font-bold shadow-card transition-colors hover:bg-surface disabled:opacity-60"
          >
            <GoogleIcon />
            {busy ? t("auth.busy") : t("auth.signInWith")}
          </button>
          <Link to="/" className="mt-6 text-xs font-semibold text-brand hover:underline">
            {t("auth.back")}
          </Link>
        </Centered>
      ) : !isAdmin ? (
        <Centered>
          <ShieldAlert className="size-12 text-destructive" />
          <h2 className="mt-4 text-xl font-bold">Access denied</h2>
          <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
            {t("admin.unauthorized")}
          </p>
          <p className="mt-1 max-w-sm truncate text-xs font-semibold text-foreground">
            {user.email}
          </p>
          <button
            type="button"
            onClick={signOut}
            className="mt-6 flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold hover:bg-surface"
          >
            <LogOut className="size-4" /> {t("auth.signOut")}
          </button>
        </Centered>
      ) : statsQuery.isLoading ? (
        <Centered>
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </Centered>
      ) : statsQuery.isError || (statsQuery.data && !statsQuery.data.ok) ? (
        <Centered>
          <ShieldAlert className="size-12 text-destructive" />
          <h2 className="mt-4 text-xl font-bold">Access denied</h2>
          <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
            {t("admin.unauthorized")}
          </p>
        </Centered>
      ) : (
        <AdminDashboard data={(statsQuery.data as { ok: true; data: AdminStats }).data} />
      )}
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-card ${accent ? "border-brand bg-card" : "border-border bg-card"}`}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-4xl font-extrabold tracking-tight">{value.toLocaleString()}</p>
    </div>
  );
}

function AdminDashboard({ data }: { data: AdminStats }) {
  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Users" value={data.totalUsers} accent />
        <StatCard label="Total codes" value={data.totalCodes} />
        <StatCard label="Dynamic codes" value={data.dynamicCodes} />
        <StatCard label="Scans" value={data.totalScans} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg font-bold">Recent users</h2>
          <ul className="mt-4 divide-y divide-border">
            {data.recentUsers.length === 0 && (
              <li className="py-3 text-sm text-muted-foreground">No users yet.</li>
            )}
            {data.recentUsers.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {u.display_name ?? "Unnamed user"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {u.id.slice(0, 8)} · {new Date(u.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-2 text-xs">
                  <span className="rounded-full bg-surface px-2 py-0.5 font-semibold capitalize">
                    {u.plan}
                  </span>
                  <span className="text-muted-foreground">{u.codeCount} codes</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg font-bold">Top codes by scans</h2>
          <ul className="mt-4 divide-y divide-border">
            {data.topCodes.length === 0 && (
              <li className="py-3 text-sm text-muted-foreground">No scans recorded yet.</li>
            )}
            {data.topCodes.map((c, i) => (
              <li key={c.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.type} · {c.is_dynamic ? "dynamic" : "static"}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-2 text-xs font-bold">
                  <span className="grid size-6 place-items-center rounded-full bg-brand-soft text-brand">
                    {i + 1}
                  </span>
                  {c.scans.toLocaleString()} scans
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
