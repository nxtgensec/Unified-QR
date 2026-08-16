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

export type ScanRow = {
  code_id: string;
  device: string | null;
  referrer: string | null;
  scanned_at: string;
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
    .select("code_id, device, referrer, scanned_at")
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

