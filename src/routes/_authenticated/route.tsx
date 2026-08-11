import { createFileRoute, Outlet, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="grid min-h-[50vh] place-items-center px-4">
        <p className="text-sm text-muted-foreground">
          Checking your session…{" "}
          <Link to="/auth" className="font-semibold text-brand">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return <Outlet />;
}
