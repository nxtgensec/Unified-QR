import { useEffect, useRef, useState } from "react";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

function todayKey() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function VisitorBadge() {
  const [total, setTotal] = useState<number | null>(null);
  const countedRef = useRef(false);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data: initial } = await supabase.rpc("get_total_visitor_count");
      if (active && typeof initial === "number") setTotal(initial);

      if (!countedRef.current) {
        countedRef.current = true;
        const day = todayKey();
        try {
          if (!window.localStorage.getItem(`unifiedqr:visited:${day}`)) {
            await supabase.rpc("increment_visitor_count", { p_day: day });
            window.localStorage.setItem(`unifiedqr:visited:${day}`, "1");
            const { data: fresh } = await supabase.rpc("get_total_visitor_count");
            if (active && typeof fresh === "number") setTotal(fresh);
          }
        } catch {
          /* badge still shows last known total */
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (total === null) return null;

  return (
    <div className="fixed bottom-3 left-3 z-40 flex items-center gap-2 rounded-full border border-border/70 bg-background/85 px-3.5 py-2 text-xs font-semibold text-foreground/80 shadow-card backdrop-blur">
      <Users className="size-3.5 text-muted-foreground" aria-hidden />
      <span>{total.toLocaleString("en-IN")}</span>
    </div>
  );
}
