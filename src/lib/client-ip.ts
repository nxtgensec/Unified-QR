import { getRequest } from "@tanstack/react-start/server";

// Cloudflare (the production host) sets cf-connecting-ip, which cannot be
// spoofed by the client. X-Forwarded-For is attacker-controllable and must not
// be trusted first. x-real-ip is a safe common alternative.
export function getClientIp(): string | null {
  const request = getRequest();
  if (!request) return null;
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf;
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return null;
}
