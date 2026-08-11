import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/r/$slug")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Redirecting… — UnifiedQR" },
      { name: "description", content: "Taking you to the destination of this UnifiedQR code." },
      { property: "og:title", content: "Redirecting — UnifiedQR" },
      { property: "og:description", content: "UnifiedQR dynamic short link." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RedirectPage,
});

function RedirectPage() {
  const { slug } = Route.useParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error: err } = await supabase
        .from("qr_codes")
        .select("id, destination")
        .eq("slug", slug)
        .eq("is_dynamic", true)
        .eq("active", true)
        .maybeSingle();

      if (cancelled) return;
      if (err || !data?.destination) {
        setError("This link is inactive or does not exist.");
        return;
      }
      await supabase.from("scans").insert({
        code_id: data.id,
        device: navigator.userAgent.slice(0, 200),
        referrer: document.referrer || null,
      });
      const dest = /^https?:\/\//i.test(data.destination)
        ? data.destination
        : `https://${data.destination}`;
      window.location.replace(dest);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div className="grid min-h-[50vh] place-items-center px-4 text-center">
      <p className="text-sm text-muted-foreground">{error ?? "Redirecting…"}</p>
    </div>
  );
}
