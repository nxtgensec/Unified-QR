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
    // Geolocation failed — record without location
  }
  return null;
}

function checkRateLimit(key: string): boolean {
  const last = RATE_LIMIT.get(key);
  if (last && Date.now() - last < RATE_TTL) return true;
  RATE_LIMIT.set(key, Date.now());
  if (RATE_LIMIT.size > 10000) {
    const now = Date.now();
    for (const [k, ts] of RATE_LIMIT) {
      if (now - ts > RATE_TTL) RATE_LIMIT.delete(k);
    }
  }
  return false;
}

export const recordPageView = createServerFn({ method: "POST" })
  .validator((input: { pageId: string; device: string; referrer: string | null }) => input)
  .handler(async ({ data }) => {
    const ip = getClientIp();

    if (ip && checkRateLimit(`view:${ip}:${data.pageId}`)) {
      return { ok: true, throttled: true };
    }

    let geo: GeoResult | null = null;
    if (ip) {
      geo = await geolocate(ip);
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("link_page_views").insert({
      page_id: data.pageId,
      device: data.device.slice(0, 200),
      referrer: data.referrer,
      city: geo?.city ?? null,
      country: geo?.country ?? null,
      country_code: geo?.countryCode ?? null,
    });

    if (error) {
      console.error("[recordPageView] insert error:", error.message);
      return { ok: false };
    }

    return { ok: true };
  });

export const recordItemClick = createServerFn({ method: "POST" })
  .validator((input: { itemId: string; device: string; referrer: string | null }) => input)
  .handler(async ({ data }) => {
    const ip = getClientIp();

    if (ip && checkRateLimit(`click:${ip}:${data.itemId}`)) {
      return { ok: true, throttled: true };
    }

    let geo: GeoResult | null = null;
    if (ip) {
      geo = await geolocate(ip);
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("link_item_clicks").insert({
      item_id: data.itemId,
      device: data.device.slice(0, 200),
      referrer: data.referrer,
      city: geo?.city ?? null,
      country: geo?.country ?? null,
      country_code: geo?.countryCode ?? null,
    });

    if (error) {
      console.error("[recordItemClick] insert error:", error.message);
      return { ok: false };
    }

    return { ok: true };
  });
