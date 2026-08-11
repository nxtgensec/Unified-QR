import { supabase } from "@/integrations/supabase/client";

export type SavedCode = {
  id: string;
  user_id: string;
  name: string;
  type: string;
  content: string;
  is_dynamic: boolean;
  slug: string | null;
  destination: string | null;
  active: boolean;
  template_id: number;
  fg: string | null;
  bg: string | null;
  created_at: string;
};

export function makeSlug() {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 7; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function shortUrl(slug: string) {
  const origin = typeof window === "undefined" ? "https://unifiedqr.app" : window.location.origin;
  return `${origin}/r/${slug}`;
}

export async function listCodes() {
  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SavedCode[];
}

export async function scanCounts(ids: string[]) {
  if (ids.length === 0) return {} as Record<string, number>;
  const { data, error } = await supabase.from("scans").select("code_id").in("code_id", ids);
  if (error) throw error;
  const out: Record<string, number> = {};
  for (const row of data ?? []) out[row.code_id] = (out[row.code_id] ?? 0) + 1;
  return out;
}
