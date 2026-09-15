import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { recordScan } from "@/lib/recordScan.functions";

export type ResolveDynamicLinkResult = { destination: string } | { error: string };

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
      .eq("is_dynamic", true)
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
    const scanPromise = recordScan({
      data: {
        codeId: code.id,
        device: device.slice(0, 200),
        referrer: referrer ? referrer.slice(0, 2000) : null,
      },
    });
    // Non-blocking: keep the Worker alive past the 307 so the scan is
    // recorded, but never delay the redirect on the geolocation RPC.
    // (waitUntil is attached to the Request by the Cloudflare/Nitro runtime.)
    if (request) {
      const req = request as unknown as { waitUntil?: (p: Promise<unknown>) => void };
      if (typeof req.waitUntil === "function") req.waitUntil(scanPromise);
    }
    void scanPromise;

    return { destination: dest };
  });
