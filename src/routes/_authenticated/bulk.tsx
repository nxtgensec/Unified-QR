import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/app/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  makeSlug,
  parseCsv,
  shortUrl,
  toCsv,
  downloadCsv,
  listScans,
  type ScanRow,
} from "@/lib/codes";
import { getDynamicLimit, getBulkLimit, effectivePlan } from "@/lib/plans";
import {
  renderQrSvg,
  svgToDataUrl,
  downloadPng,
  downloadSvg,
  downloadJpg,
  downloadWebp,
} from "@/lib/qr";
import { QrWidget, type QrWidgetDesign } from "@/components/qr/QrWidget";
import { toast } from "sonner";
import JSZip from "jszip";
import {
  AlertTriangle,
  BarChart3,
  Check,
  ChevronRight,
  FileSpreadsheet,
  Globe,
  Loader2,
  Upload,
  Download,
  Eye,
  Package,
  X,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/bulk")({
  head: () => ({
    meta: [
      { title: "Bulk Create \u2014 UnifiedQR Workspace" },
      {
        name: "description",
        content:
          "Upload a CSV of names and destinations to create customised QR Codes in bulk with UnifiedQR.",
      },
      { property: "og:title", content: "Bulk Create \u2014 UnifiedQR" },
      { property: "og:description", content: "CSV bulk creation of customised QR Codes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BulkPage,
});

type Parsed = { name: string; destination: string };

type ImportResult = {
  name: string;
  slug: string | null;
  ok: boolean;
  error?: string;
};

type StepId = "upload" | "review" | "design" | "preview" | "import" | "results";

const STEPS: { id: StepId; label: string; icon: typeof Upload }[] = [
  { id: "upload", label: "Upload", icon: FileSpreadsheet },
  { id: "review", label: "Review", icon: Eye },
  { id: "design", label: "Design", icon: Eye },
  { id: "preview", label: "Preview", icon: Eye },
  { id: "import", label: "Create", icon: Package },
  { id: "results", label: "Results", icon: Check },
];

const DEMO_ROWS: Parsed[] = [
  { name: "Store Berlin", destination: "https://example.com/berlin" },
  { name: "Store Paris", destination: "https://example.com/paris" },
  { name: "Product Launch", destination: "https://example.com/product" },
  { name: "Event Page", destination: "https://example.com/event" },
  { name: "Support Portal", destination: "https://example.com/support" },
];

function normalizeUrl(v: string) {
  const t = v.trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : "https://" + t;
}

function BulkPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<StepId>("upload");
  const [rows, setRows] = useState<Parsed[]>([]);
  const [fileName, setFileName] = useState("");
  const [bulkDesign, setBulkDesign] = useState<QrWidgetDesign | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [results, setResults] = useState<ImportResult[]>([]);
  const [bulkLimit, setBulkLimit] = useState(20);
  const [userPlan, setUserPlan] = useState("free");

  const [bulkScans, setBulkScans] = useState<ScanRow[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const stepIdx = STEPS.findIndex((s) => s.id === step);

  useState(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("plan, plan_expires_at")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        const plan = effectivePlan(data?.plan, data?.plan_expires_at);
        setUserPlan(plan);
        setBulkLimit(getBulkLimit(plan));
      });
  });

  const createdIds = results.filter((r) => r.ok).map((r) => r.name);

  useEffect(() => {
    if (step !== "results" || createdIds.length === 0) return;
    setAnalyticsLoading(true);
    const slugIds = results.filter((r) => r.ok && r.slug).map((r) => r.name);
    if (slugIds.length === 0) {
      setAnalyticsLoading(false);
      return;
    }

    supabase
      .from("qr_codes")
      .select("id")
      .eq("user_id", user?.id ?? "")
      .eq("is_dynamic", true)
      .order("created_at", { ascending: false })
      .limit(500)
      .then(async ({ data }) => {
        const ids = (data ?? []).map((r) => r.id);
        try {
          const scans = await listScans(ids);
          setBulkScans(scans);
        } catch {
          // ignore
        } finally {
          setAnalyticsLoading(false);
        }
      });
  }, [step, user]);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseCsv(String(reader.result ?? ""));
      if (parsed.length === 0) {
        toast.error("That file looks empty.");
        return;
      }
      const first = parsed[0]!.map((c) => c.trim().toLowerCase());
      const hasHeader =
        first.includes("destination") || first.includes("url") || first.includes("name");
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
      if (out.length > bulkLimit) {
        toast.warning(
          "File has " + out.length + " rows. Truncating to " + bulkLimit + " (your plan limit).",
        );
      }
      setRows(out.slice(0, bulkLimit));
      setFileName(file.name);
      setStep("review");
      toast.success(out.length + " row" + (out.length === 1 ? "" : "s") + " found");
    };
    reader.readAsText(file);
  }

  function loadDemo() {
    setRows([...DEMO_ROWS]);
    setFileName("demo-data.csv");
    setStep("review");
    toast.success("5 demo rows loaded");
  }

  function removeRow(idx: number) {
    setRows((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateRow(idx: number, field: keyof Parsed, value: string) {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  }

  function downloadTemplate() {
    downloadCsv(
      "unifiedqr-template.csv",
      toCsv([
        ["name", "destination"],
        ["Store poster - Berlin", "https://example.com/berlin"],
        ["Store poster - Paris", "https://example.com/paris"],
      ]),
    );
  }

  function getDesign() {
    if (!bulkDesign) return { templateId: 1 };
    return {
      templateId: bulkDesign.templateId,
      fg: bulkDesign.fg,
      bg: bulkDesign.bg,
      eye: bulkDesign.eye,
      bodyShape: bulkDesign.bodyShape,
      eyeShape: bulkDesign.eyeShape,
      gradient: bulkDesign.gradient,
      logo: bulkDesign.logo,
      frame: bulkDesign.frame,
    };
  }

  function renderSvgFor(destination: string, size: number, margin: number): string {
    return renderQrSvg(destination, getDesign(), { size, margin });
  }

  async function downloadSingleFormat(
    name: string,
    slug: string,
    format: "png" | "svg" | "jpg" | "webp",
  ) {
    const svg = renderSvgFor(shortUrl(slug), 1024, 4);
    const safeName = name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60);
    switch (format) {
      case "svg":
        downloadSvg(svg, `${safeName}.svg`);
        break;
      case "png":
        await downloadPng(svg, `${safeName}.png`, 1024);
        break;
      case "jpg":
        await downloadJpg(svg, `${safeName}.jpg`, 1024);
        break;
      case "webp":
        await downloadWebp(svg, `${safeName}.webp`, 1024);
        break;
    }
    toast.success(`${safeName}.${format} downloaded`);
  }

  async function runImport() {
    if (!user || rows.length === 0) return;
    setStep("import");
    setBusy(true);
    setProgress({ done: 0, total: rows.length });

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, plan_expires_at")
      .eq("id", user.id)
      .maybeSingle();
    const plan = effectivePlan(profile?.plan, profile?.plan_expires_at);
    const limit = getDynamicLimit(plan);

    const { count: existingDynamic } = await supabase
      .from("qr_codes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_dynamic", true);

    const available = Math.max(0, limit - (existingDynamic ?? 0));
    const allowed = rows.slice(0, available);

    if (allowed.length === 0) {
      setBusy(false);
      toast.error(
        "You've reached your dynamic code limit (" + limit + "). Upgrade your plan for more.",
      );
      setStep("review");
      return;
    }
    if (allowed.length < rows.length) {
      toast.warning(
        "Only " +
          allowed.length +
          " of " +
          rows.length +
          " codes will be created (plan limit: " +
          limit +
          ").",
      );
    }

    const validDestinations = allowed.filter((r) => {
      try {
        const url = new URL(
          r.destination.startsWith("http") ? r.destination : "https://" + r.destination,
        );
        return ["http:", "https:"].includes(url.protocol);
      } catch {
        return false;
      }
    });

    const d = getDesign();
    const batchSize = 25;
    const importResults: ImportResult[] = [];

    for (let i = 0; i < validDestinations.length; i += batchSize) {
      const batch = validDestinations.slice(i, i + batchSize);
      const payload = batch.map((r) => ({
        user_id: user.id,
        name: r.name,
        type: "url",
        content: r.destination,
        is_dynamic: true,
        slug: makeSlug(),
        destination: r.destination,
        template_id: d.templateId,
        fg: d.fg ?? null,
        bg: d.bg ?? null,
        body_shape: d.bodyShape ?? null,
        eye_shape: d.eyeShape ?? null,
        gradient_type: d.gradient?.type ?? null,
        gradient_color: d.gradient?.color ?? null,
        gradient_angle: d.gradient?.angle ?? null,
        frame_text: d.frame?.text ?? null,
        frame_style: d.frame?.style ?? null,
        logo_url: d.logo ?? null,
      }));

      const { data, error } = await supabase.from("qr_codes").insert(payload).select("name, slug");

      if (error) {
        for (const r of batch) {
          importResults.push({ name: r.name, slug: null, ok: false, error: error.message });
        }
      } else {
        for (let j = 0; j < batch.length; j++) {
          const row = data?.[j];
          importResults.push({
            name: row?.name ?? batch[j]!.name,
            slug: row?.slug ?? null,
            ok: true,
          });
        }
      }

      setProgress({
        done: Math.min(i + batchSize, validDestinations.length),
        total: validDestinations.length,
      });
    }

    setResults(importResults);
    setBusy(false);
    const succeeded = importResults.filter((r) => r.ok).length;
    const failed = importResults.filter((r) => !r.ok).length;
    toast.success(succeeded + " codes created" + (failed > 0 ? " (" + failed + " failed)" : ""));
    setStep("results");
  }

  async function downloadBulkZip(format: "png" | "svg" | "jpg" | "webp") {
    const okResults = results.filter((r) => r.ok && r.slug);
    if (okResults.length === 0) return;

    const zip = new JSZip();
    const pngSize = 512;

    for (const r of okResults) {
      const svg = renderSvgFor(shortUrl(r.slug!), pngSize, 4);
      const safeName = r.name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60);

      if (format === "svg") {
        zip.file(`${safeName}.svg`, svg);
      } else {
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Failed to render " + r.name));
          img.src = svgToDataUrl(svg);
        });
        const canvas = document.createElement("canvas");
        canvas.width = pngSize;
        canvas.height = pngSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        ctx.drawImage(img, 0, 0, pngSize, pngSize);
        const mimeType =
          format === "jpg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png";
        const dataUrl = canvas.toDataURL(mimeType);
        const base64 = dataUrl.split(",")[1] ?? "";
        zip.file(`${safeName}.${format}`, base64, { base64: true });
      }
    }

    zip.file(
      "links.csv",
      toCsv([
        ["name", "short_link"],
        ...okResults.map((r) => [r.name, r.slug ? shortUrl(r.slug) : ""]),
      ]),
    );

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "unifiedqr-bulk-codes.zip";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`ZIP (${format.toUpperCase()}) downloaded`);
  }

  function downloadLinksCsv() {
    const okResults = results.filter((r) => r.ok && r.slug);
    if (okResults.length === 0) return;
    downloadCsv(
      "unifiedqr-bulk-links.csv",
      toCsv([
        ["name", "short_link"],
        ...okResults.map((r) => [r.name, r.slug ? shortUrl(r.slug) : ""]),
      ]),
    );
    toast.success("CSV downloaded");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        title="Bulk create"
        description="Upload a CSV, customise your design, preview and create QR Codes in one go."
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

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = s.id === step;
          const isDone = i < stepIdx;
          return (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors " +
                  (isActive
                    ? "bg-brand text-brand-foreground"
                    : isDone
                      ? "bg-brand-soft text-brand"
                      : "bg-background text-muted-foreground")
                }
              >
                {isDone ? <Check className="size-3" /> : <Icon className="size-3" />}
                {s.label}
              </div>
              {i < STEPS.length - 1 && <ChevronRight className="size-3 text-muted-foreground" />}
            </div>
          );
        })}
      </div>

      {step === "upload" && (
        <div className="mt-8 space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-amber-300/50 bg-amber-50 p-4 text-sm dark:bg-amber-950/30">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-200">
                Bulk-created QR codes are dynamic
              </p>
              <p className="mt-1 text-amber-700 dark:text-amber-300">
                These codes get short links you can update later. Track scans, change destinations
                and manage everything from your{" "}
                <a href="/dashboard" className="font-bold underline">
                  Dashboard
                </a>
                .
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 text-sm">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">How it works:</span> Prepare a CSV
              with two columns &mdash; <code>name</code> and <code>destination</code> (URL). Upload
              it, customise the QR design, preview, then create up to{" "}
              <span className="font-bold text-brand">{bulkLimit}</span> codes at once (
              <span className="capitalize">{userPlan}</span> plan).
            </p>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
            className="rounded-2xl border border-dashed border-border bg-background p-10 text-center"
          >
            <FileSpreadsheet className="mx-auto size-8 text-brand" />
            <p className="mt-3 font-semibold">Drop a CSV here</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Columns: <code>name</code>, <code>destination</code>. Up to {bulkLimit} rows per
              batch.
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
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground"
              >
                Choose file
              </button>
              <button
                type="button"
                onClick={loadDemo}
                className="rounded-full border border-border px-6 py-2.5 text-sm font-bold"
              >
                Try demo data
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "review" && (
        <div className="mt-8">
          <div className="rounded-2xl border border-border bg-background shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <p className="text-sm font-bold">
                {rows.length} row{rows.length === 1 ? "" : "s"} from {fileName}
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  (limit: {bulkLimit})
                </span>
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep("upload")}
                  className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep("design")}
                  disabled={rows.length === 0}
                  className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground disabled:opacity-60"
                >
                  Next: Design <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
            <ul className="max-h-96 divide-y divide-border overflow-auto">
              {rows.map((r, i) => (
                <li key={i} className="flex items-center gap-3 px-5 py-3">
                  <span className="min-w-0 flex-1">
                    <input
                      value={r.name}
                      onChange={(e) => updateRow(i, "name", e.target.value)}
                      className="block w-full truncate rounded bg-transparent px-1 -ml-1 text-sm font-semibold outline-none focus:ring-1 focus:ring-brand"
                    />
                    <input
                      value={r.destination}
                      onChange={(e) => updateRow(i, "destination", e.target.value)}
                      className="block w-full truncate rounded bg-transparent px-1 -ml-1 text-xs text-muted-foreground outline-none focus:ring-1 focus:ring-brand"
                    />
                  </span>
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {step === "design" && (
        <div className="mt-8">
          <QrWidget
            onDesignChange={setBulkDesign}
            hideSaveSection
            initialTemplateId={bulkDesign?.templateId}
          />
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep("review")}
              className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep("preview")}
              className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground"
            >
              Next: Preview <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {step === "preview" && (
        <div className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Preview ({rows.length} codes)
          </h2>
          <div className="mt-4 grid max-h-[500px] grid-cols-2 gap-3 overflow-auto rounded-2xl border border-border bg-background p-4 shadow-card sm:grid-cols-3 lg:grid-cols-4">
            {rows.slice(0, 50).map((r, i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded-xl border border-border p-3"
              >
                <img
                  src={svgToDataUrl(renderSvgFor(r.destination, 256, 2))}
                  alt={r.name}
                  className="size-24 rounded-md"
                />
                <span className="mt-2 block w-full truncate text-center text-xs font-semibold">
                  {r.name}
                </span>
              </div>
            ))}
            {rows.length > 50 && (
              <div className="col-span-full py-4 text-center text-xs text-muted-foreground">
                Showing 50 of {rows.length} previews...
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => setStep("design")}
              className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => void runImport()}
              disabled={busy}
              className="flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground disabled:opacity-60"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              Create {rows.length} codes
            </button>
          </div>
        </div>
      )}

      {step === "import" && (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-border bg-background p-10 shadow-card">
          <Loader2 className="size-8 animate-spin text-brand" />
          <p className="mt-4 text-sm font-bold">Creating your QR codes...</p>
          <div className="mt-4 w-full max-w-md">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {progress.done} of {progress.total}
              </span>
              <span>
                {progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0}%
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-background">
              <div
                className="h-2 rounded-full bg-brand transition-all"
                style={{
                  width:
                    progress.total > 0
                      ? Math.round((progress.done / progress.total) * 100) + "%"
                      : "0%",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {step === "results" && (
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-border bg-background p-8 shadow-card">
            <div className="text-center">
              <Check className="mx-auto size-10 text-emerald-500" />
              <h2 className="mt-3 text-lg font-extrabold">Creation complete</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {results.filter((r) => r.ok).length} codes created
                {results.filter((r) => !r.ok).length > 0 &&
                  ", " + results.filter((r) => !r.ok).length + " failed"}
                .
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => void downloadBulkZip("png")}
                disabled={results.filter((r) => r.ok && r.slug).length === 0}
                className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground disabled:opacity-60"
              >
                <Package className="size-4" /> Download ZIP (PNG)
              </button>
              <button
                type="button"
                onClick={() => void downloadBulkZip("svg")}
                disabled={results.filter((r) => r.ok && r.slug).length === 0}
                className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold disabled:opacity-60"
              >
                <Package className="size-4" /> ZIP (SVG)
              </button>
              <button
                type="button"
                onClick={() => void downloadBulkZip("jpg")}
                disabled={results.filter((r) => r.ok && r.slug).length === 0}
                className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold disabled:opacity-60"
              >
                <Package className="size-4" /> ZIP (JPG)
              </button>
              <button
                type="button"
                onClick={() => void downloadBulkZip("webp")}
                disabled={results.filter((r) => r.ok && r.slug).length === 0}
                className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold disabled:opacity-60"
              >
                <Package className="size-4" /> ZIP (WebP)
              </button>
              <button
                type="button"
                onClick={downloadLinksCsv}
                disabled={results.filter((r) => r.ok && r.slug).length === 0}
                className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold disabled:opacity-60"
              >
                <Download className="size-4" /> Links CSV
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/dashboard" })}
                className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold"
              >
                Done
              </button>
            </div>
          </div>

          <BulkAnalytics scans={bulkScans} loading={analyticsLoading} />

          {results.filter((r) => r.ok && r.slug).length > 0 && (
            <div className="rounded-2xl border border-border bg-background shadow-card">
              <div className="border-b border-border px-5 py-4">
                <h3 className="text-sm font-bold">Individual codes</h3>
                <p className="text-xs text-muted-foreground">
                  Download each QR code individually in your preferred format.
                </p>
              </div>
              <ul className="max-h-96 divide-y divide-border overflow-auto">
                {results
                  .filter((r) => r.ok && r.slug)
                  .map((r) => (
                    <li key={r.name} className="flex items-center gap-3 px-5 py-3">
                      <img
                        src={svgToDataUrl(renderSvgFor(shortUrl(r.slug!), 48, 1))}
                        alt={r.name}
                        className="size-10 shrink-0 rounded"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{r.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {shortUrl(r.slug!)}
                        </span>
                      </span>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {(["png", "svg", "jpg", "webp"] as const).map((fmt) => (
                          <button
                            key={fmt}
                            type="button"
                            onClick={() => void downloadSingleFormat(r.name, r.slug!, fmt)}
                            className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] font-bold transition-colors hover:bg-surface"
                          >
                            <Download className="size-3" /> {fmt.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BulkAnalytics({ scans, loading }: { scans: ScanRow[]; loading: boolean }) {
  const total = scans.length;

  const devices = (() => {
    const out = new Map<string, number>();
    for (const s of scans) {
      const ua = (s.device ?? "").toLowerCase();
      const label = /iphone|ipad|ios/.test(ua)
        ? "iOS"
        : /android/.test(ua)
          ? "Android"
          : /windows|mac os|linux/.test(ua)
            ? "Desktop"
            : "Other";
      out.set(label, (out.get(label) ?? 0) + 1);
    }
    return [...out.entries()].sort((a, b) => b[1] - a[1]);
  })();

  const countries = (() => {
    const out = new Map<string, { count: number; code: string | null }>();
    for (const s of scans) {
      const name = s.country ?? "Unknown";
      const prev = out.get(name);
      out.set(name, { count: (prev?.count ?? 0) + 1, code: s.country_code });
    }
    return [...out.entries()]
      .map(([country, { count, code }]) => ({ country, count, code }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  })();

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading analytics...
        </p>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-center shadow-card">
        <BarChart3 className="mx-auto size-6 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Analytics will appear here once your codes start getting scanned.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
      <div className="flex items-center gap-2">
        <BarChart3 className="size-4 text-brand" />
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Bulk code analytics
        </h3>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Total scans
          </p>
          <p className="mt-1 text-2xl font-extrabold">{total}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Codes with scans
          </p>
          <p className="mt-1 text-2xl font-extrabold">
            {new Set(scans.map((s) => s.code_id)).size}
          </p>
        </div>
      </div>

      {devices.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Devices</p>
          <ul className="mt-2 space-y-2">
            {devices.map(([label, count]) => (
              <li key={label}>
                <div className="flex justify-between text-sm font-semibold">
                  <span>{label}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-background">
                  <div
                    className="h-1.5 rounded-full bg-brand"
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {countries.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Top countries
          </p>
          <ul className="mt-2 space-y-2">
            {countries.map(({ country, count, code }) => (
              <li key={country}>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="flex items-center gap-2">
                    <Globe className="size-3 text-muted-foreground" />
                    {country}
                  </span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-background">
                  <div
                    className="h-1.5 rounded-full bg-brand/60"
                    style={{ width: `${(count / (countries[0]?.count ?? 1)) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
