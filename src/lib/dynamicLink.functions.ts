import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getClientIp } from "@/lib/client-ip";

export type ResolveDynamicLinkResult = { destination: string } | { error: string };

const IP_CACHE = new Map<
  string,
  { geo: { country: string; countryCode: string; city: string }; ts: number }
>();
const CACHE_TTL = 10 * 60 * 1000;
const RATE_LIMIT = new Map<string, number>();
const RATE_TTL = 60 * 1000;

async function geolocate(ip: string) {
  const cached = IP_CACHE.get(ip);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.geo;
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`, {
      signal: AbortSignal.timeout(3000),
    });
    const data = (await res.json()) as {
      status: string;
      country: string;
      countryCode: string;
      city: string;
    };
    if (data.status === "success") {
      IP_CACHE.set(ip, { geo: data, ts: Date.now() });
      return data;
    }
  } catch {
    // Geolocation failed — record scan without location
  }
  return null;
}

export const resolveDynamicLink = createServerFn({ method: "POST" })
  .validator((input: { slug: string }) => input)
  .handler(async ({ data }): Promise<ResolveDynamicLinkResult> => {
    const slug = typeof data.slug === "string" ? data.slug.trim() : "";
    if (!slug) return { error: "This link is inactive or does not exist." };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: code } = await supabaseAdmin
      .from("qr_codes")
      .select("id, destination")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();

    if (!code?.destination) {
      return { error: "This link is inactive or does not exist." };
    }

    let dest: string;
    try {
      const parsed = new URL(
        /^https?:\/\//i.test(code.destination) ? code.destination : `https://${code.destination}`,
      );
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return { error: "This link has an invalid destination." };
      }
      dest = parsed.href;
    } catch {
      return { error: "This link has an invalid destination." };
    }

    const request = getRequest();
    const device = request?.headers.get("user-agent") ?? "";
    const referrer = request?.headers.get("referer");

    const scanPromise = (async () => {
      try {
        const ip = getClientIp();
        let geo: { country: string; countryCode: string; city: string } | null = null;
        if (ip) {
          const lastScan = RATE_LIMIT.get(`${ip}:${code.id}`);
          if (!lastScan || Date.now() - lastScan >= RATE_TTL) {
            RATE_LIMIT.set(`${ip}:${code.id}`, Date.now());
            geo = await geolocate(ip);
          }
        }
        const { error: insertErr } = await supabaseAdmin.from("scans").insert({
          code_id: code.id,
          device: device.slice(0, 200),
          referrer: referrer ? referrer.slice(0, 2000) : null,
          city: geo?.city ?? null,
          country: geo?.country ?? null,
          country_code: geo?.countryCode ?? null,
        });
        if (insertErr) console.error("[resolveDynamicLink] scan insert error:", insertErr.message);
      } catch (err) {
        console.error("[resolveDynamicLink] scan error:", err);
      }
    })();

    if (request) {
      const req = request as unknown as { waitUntil?: (p: Promise<unknown>) => void };
      if (typeof req.waitUntil === "function") req.waitUntil(scanPromise);
    }
    void scanPromise;

    return { destination: dest };
  });
