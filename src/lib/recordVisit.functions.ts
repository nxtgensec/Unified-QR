import { createServerFn } from "@tanstack/react-start";
import { getClientIp } from "@/lib/client-ip";

// Visitor counter increments previously ran straight from the browser RPC,
// which any anonymous caller could hammer with no rate limit. Move the write
// behind a server fn keyed on the real client IP.
const RATE_LIMIT = new Map<string, number>();
const RATE_TTL = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10000;

function checkRateLimit(key: string): boolean {
  const last = RATE_LIMIT.get(key);
  if (last && Date.now() - last < RATE_TTL) return true;
  RATE_LIMIT.set(key, Date.now());
  if (RATE_LIMIT.size > RATE_LIMIT_MAX) {
    const now = Date.now();
    for (const [k, ts] of RATE_LIMIT) {
      if (now - ts > RATE_TTL) RATE_LIMIT.delete(k);
    }
  }
  return false;
}

export const recordVisit = createServerFn({ method: "POST" })
  .validator((input: { day: string }) => input)
  .handler(async ({ data }) => {
    const ip = getClientIp();
    if (ip && checkRateLimit(`visit:${ip}:${data.day}`)) {
      return { ok: true, throttled: true };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.rpc("increment_visitor_count", { p_day: data.day });

    if (error) {
      console.error("[recordVisit] increment error:", error.message);
      return { ok: false };
    }

    return { ok: true };
  });
