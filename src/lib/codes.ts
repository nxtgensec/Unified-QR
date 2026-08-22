import { supabase } from "@/integrations/supabase/client";

export type SavedCode = {
  id: string;
  user_id: string;
  team_id: string | null;
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
  body_shape: string | null;
  eye_shape: string | null;
  gradient_type: string | null;
  gradient_color: string | null;
  gradient_angle: number | null;
  frame_text: string | null;
  frame_style: string | null;
  logo_url: string | null;
  created_at: string;
};

export function makeSlug() {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  const arr = new Uint8Array(7);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => chars[b % chars.length]).join("");
}

export function shortUrl(slug: string) {
  const origin =
    typeof window === "undefined" ? "https://qr.nxtgensec.org" : window.location.origin;
  return `${origin}/r/${slug}`;
}

export async function listCodes(userId?: string) {
  let uid = userId;
  if (!uid) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    uid = session?.user?.id;
  }
  if (!uid) return [] as SavedCode[];

  const query = supabase
    .from("qr_codes")
    .select(
      "id,user_id,team_id,name,type,content,is_dynamic,slug,destination,active,template_id,fg,bg,body_shape,eye_shape,gradient_type,gradient_color,gradient_angle,frame_text,frame_style,logo_url,created_at",
    )
    .eq("user_id", uid)
    .order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as SavedCode[];
}

export async function getCodeWithLogo(id: string, userId?: string): Promise<SavedCode | null> {
  let query = supabase
    .from("qr_codes")
    .select(
      "id,user_id,team_id,name,type,content,is_dynamic,slug,destination,active,template_id,fg,bg,body_shape,eye_shape,gradient_type,gradient_color,gradient_angle,frame_text,frame_style,logo_url,created_at",
    )
    .eq("id", id);
  if (userId) query = query.eq("user_id", userId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data as SavedCode | null;
}

export type ScanRow = {
  code_id: string;
  device: string | null;
  referrer: string | null;
  scanned_at: string;
  city: string | null;
  country: string | null;
  country_code: string | null;
};

export async function scanCounts(ids: string[]) {
  if (ids.length === 0) return {} as Record<string, number>;
  const { data, error } = await supabase.from("scans").select("code_id").in("code_id", ids);
  if (error) throw error;
  const out: Record<string, number> = {};
  for (const row of data ?? []) out[row.code_id] = (out[row.code_id] ?? 0) + 1;
  return out;
}

export async function listScans(ids: string[]) {
  if (ids.length === 0) return [] as ScanRow[];
  const { data, error } = await supabase
    .from("scans")
    .select("code_id, device, referrer, scanned_at, city, country, country_code")
    .in("code_id", ids)
    .order("scanned_at", { ascending: false })
    .limit(5000);
  if (error) throw error;
  return (data ?? []) as ScanRow[];
}

export function toCsv(rows: (string | number)[][]) {
  return rows
    .map((r) =>
      r
        .map((cell) => {
          const s = String(cell ?? "");
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(","),
    )
    .join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (cell.length || row.length) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}
