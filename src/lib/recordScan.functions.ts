import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

type GeoResult = {
  status: string;
  country: string;
  countryCode: string;
  city: string;
};

const IP_CACHE = new Map<string, { geo: GeoResult; ts: number }>();
const CACHE_TTL = 10 * 60 * 1000;
const RATE_LIMIT = new Map<string, number>();
const RATE_TTL = 60 * 1000;

function getClientIp(): string | null {
  const request = getRequest();
  if (!request) return null;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf;
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return null;
}

async function geolocate(ip: string): Promise<GeoResult | null> {
  const cached = IP_CACHE.get(ip);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.geo;

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`, {
      signal: AbortSignal.timeout(3000),
    });
    const data: GeoResult = await res.json();
    if (data.status === "success") {
      IP_CACHE.set(ip, { geo: data, ts: Date.now() });
      return data;
    }
  } catch {
    // Geolocation failed — record scan without location
  }
  return null;
}

export const recordScan = createServerFn({ method: "POST" })
  .validator((input: { codeId: string; device: string; referrer: string | null }) => input)
  .handler(async ({ data }) => {
    const ip = getClientIp();

    if (ip) {
      const lastScan = RATE_LIMIT.get(`${ip}:${data.codeId}`);
      if (lastScan && Date.now() - lastScan < RATE_TTL) {
        return { ok: true, throttled: true };
      }
      RATE_LIMIT.set(`${ip}:${data.codeId}`, Date.now());
      if (RATE_LIMIT.size > 10000) {
        const now = Date.now();
        for (const [key, ts] of RATE_LIMIT) {
          if (now - ts > RATE_TTL) RATE_LIMIT.delete(key);
        }
      }
    }

    let geo: GeoResult | null = null;
    if (ip) {
      geo = await geolocate(ip);
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("scans").insert({
      code_id: data.codeId,
      device: data.device.slice(0, 200),
      referrer: data.referrer,
      city: geo?.city ?? null,
      country: geo?.country ?? null,
      country_code: geo?.countryCode ?? null,
    });

    if (error) {
      console.error("[recordScan] insert error:", error.message);
      return { ok: false };
    }

    return { ok: true };
  });
