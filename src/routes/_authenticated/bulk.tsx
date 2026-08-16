import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { PageHeader, BetaNotice } from "@/components/app/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { makeSlug, parseCsv, shortUrl, toCsv, downloadCsv } from "@/lib/codes";
import { toast } from "sonner";
import { FileSpreadsheet, Loader2, Upload, Download, FolderTree } from "lucide-react";

export const Route = createFileRoute("/_authenticated/bulk")({
  head: () => ({
    meta: [
      { title: "Bulk QR Generation — UnifiedQR Workspace" },
      {
        name: "description",
        content:
          "Import a CSV of names and destinations to generate dynamic, trackable QR Codes in bulk with UnifiedQR.",
      },
      { property: "og:title", content: "Bulk QR Generation — UnifiedQR" },
      { property: "og:description", content: "CSV bulk generation of dynamic trackable QR Codes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BulkPage,
});

type Parsed = { name: string; destination: string };

function normalizeUrl(v: string) {
  const t = v.trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

function BulkPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Parsed[]>([]);
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseCsv(String(reader.result ?? ""));
      if (parsed.length === 0) {
        toast.error("That file looks empty.");
        return;
      }
      const first = parsed[0]!.map((c) => c.trim().toLowerCase());
      const hasHeader = first.includes("destination") || first.includes("url") || first.includes("name");
      const nameIdx = hasHeader ? Math.max(0, first.indexOf("name")) : 0;
      const destIdx = hasHeader
        ? first.includes("destination")
          ? first.indexOf("destination")
          : first.indexOf("url")
        : 1;
      const body = hasHeader ? parsed.slice(1) : parsed;
      const out: Parsed[] = [];
      for (const r of body) {
        const destination = normalizeUrl(r[destIdx] ?? r[1] ?? r[0] ?? "");
        if (!destination) continue;
        const name = (r[nameIdx] ?? "").trim() || destination;
        out.push({ name: name.slice(0, 80), destination });
      }
      if (out.length === 0) {
        toast.error("No valid destinations found in that CSV.");
        return;
      }
      setRows(out.slice(0, 200));
      setFileName(file.name);
      toast.success(`${out.length} row${out.length === 1 ? "" : "s"} ready to import`);
    };
    reader.readAsText(file);
  }

  async function importAll() {
    if (!user || rows.length === 0) return;
    setBusy(true);
    const payload = rows.map((r) => ({
      user_id: user.id,
      name: r.name,
      type: "url",
      content: r.destination,
      is_dynamic: true,
      slug: makeSlug(),
      destination: r.destination,
      template_id: 1,
    }));
    const { data, error } = await supabase.from("qr_codes").insert(payload).select("name, slug");
    setBusy(false);
    if (error) {
      toast.error("Import failed. Please try again.");
      return;
    }
    downloadCsv(
      "unifiedqr-bulk-links.csv",
      toCsv([
        ["name", "short_link"],
        ...(data ?? []).map((d) => [d.name, d.slug ? shortUrl(d.slug) : ""]),
      ]),
    );
    toast.success(`${payload.length} dynamic codes created`, {
      description: "A CSV of the new short links was downloaded.",
    });
    setRows([]);
    setFileName("");
    navigate({ to: "/dashboard" });
  }

  function downloadTemplate() {
    downloadCsv(
      "unifiedqr-template.csv",
      toCsv([
        ["name", "destination"],
        ["Store poster – Berlin", "https://example.com/berlin"],
        ["Store poster – Paris", "https://example.com/paris"],
      ]),
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        title="Bulk generation"
        description="Upload a CSV of names and destinations to create dynamic, trackable QR Codes in one go."
        actions={
          <button
            type="button"
            onClick={downloadTemplate}
            className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold"
          >
            <Download className="size-4" /> CSV template
          </button>
        }
      />

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        className="mt-8 rounded-2xl border border-dashed border-border bg-card p-10 text-center"
      >
        <FileSpreadsheet className="mx-auto size-8 text-brand" />
        <p className="mt-3 font-semibold">Drop a CSV here</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Columns: <code>name</code>, <code>destination</code>. Up to 200 rows per import.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground"
        >
          Choose file
        </button>
      </div>

      {rows.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <p className="text-sm font-bold">
              {rows.length} rows from {fileName}
            </p>
            <button
              type="button"
              onClick={importAll}
              disabled={busy}
              className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground disabled:opacity-60"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              Create {rows.length} dynamic codes
            </button>
          </div>
          <ul className="max-h-80 divide-y divide-border overflow-auto">
            {rows.map((r, i) => (
              <li key={i} className="flex items-center gap-3 px-5 py-3">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{r.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {r.destination}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <FolderTree className="size-4 text-brand" /> Campaigns, folders & branded frames
        </h2>
        <BetaNotice>
          Grouping codes into campaigns and folders, plus centre logos and print frames, are still
          being built. Imported codes appear in your{" "}
          <Link to="/dashboard" className="font-bold text-brand">
            dashboard
          </Link>{" "}
          and are fully trackable today.
        </BetaNotice>
      </div>
    </div>
  );
}
