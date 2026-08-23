import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { PageHeader } from "@/components/app/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { makeSlug, parseCsv, shortUrl, toCsv, downloadCsv } from "@/lib/codes";
import { getDynamicLimit, getBulkLimit, effectivePlan } from "@/lib/plans";
import {
  renderQrSvg,
  svgToDataUrl,
  templates,
  bodyShapeOptions,
  eyeShapeOptions,
  frameStyleOptions,
  downloadPng,
  downloadSvg,
  downloadJpg,
  downloadWebp,
  type QrDesign,
  type BodyShape,
  type EyeShape,
  type GradientConfig,
  type FrameConfig,
} from "@/lib/qr";
import { toast } from "sonner";
import JSZip from "jszip";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  ChevronDown,
  FileSpreadsheet,
  Loader2,
  Upload,
  Download,
  Eye,
  Sparkles,
  Package,
  X,
  Palette,
  Image,
  Frame,
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
  { id: "design", label: "Design", icon: Sparkles },
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
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<StepId>("upload");
  const [rows, setRows] = useState<Parsed[]>([]);
  const [fileName, setFileName] = useState("");
  const [templateId, setTemplateId] = useState(1);
  const [design, setDesign] = useState<Partial<QrDesign>>({});
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [results, setResults] = useState<ImportResult[]>([]);
  const [bulkLimit, setBulkLimit] = useState(20);
  const [userPlan, setUserPlan] = useState("free");

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

  const tplBase = templates.find((t) => t.id === templateId) ?? templates[0]!;
  const fullDesign = {
    templateId,
    fg: design.fg ?? tplBase.fg,
    bg: design.bg ?? tplBase.bg,
    eye: design.eye ?? tplBase.eye,
    bodyShape: design.bodyShape ?? tplBase.shape,
    eyeShape: design.eyeShape ?? tplBase.eyeShape,
    gradient: design.gradient ?? null,
    logo: design.logo ?? null,
    frame: design.frame ?? null,
  };

  function renderSvgFor(destination: string, size: number, margin: number): string {
    return renderQrSvg(destination, fullDesign, { size, margin });
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500000) {
      toast.error("Logo must be under 500KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setDesign((prev) => ({ ...prev, logo: dataUrl }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function removeLogo() {
    setDesign((prev) => ({ ...prev, logo: null }));
  }

  function resetAllCustom() {
    setDesign({});
    const tpl = templates.find((t) => t.id === templateId) ?? templates[0]!;
    setTemplateId(tpl.id);
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
        "Only " + allowed.length + " of " + rows.length + " codes will be created (plan limit: " + limit + ").",
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
        template_id: templateId,
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
        const img = window.Image ? new window.Image() : document.createElement("img");
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
    a.download = `unifiedqr-bulk-codes.${format === "svg" ? "zip" : "zip"}`;
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

  const activeTpl = templates.find((t) => t.id === templateId) ?? templates[0]!;

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
                Bulk-created QR codes are static
              </p>
              <p className="mt-1 text-amber-700 dark:text-amber-300">
                These codes encode your URL directly and do not track scans. For dynamic codes with
                scan analytics, use the{" "}
                <a href="/create" className="font-bold underline">
                  Create QR Code
                </a>{" "}
                page instead.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 text-sm">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">How it works:</span> Prepare a CSV with
              two columns &mdash; <code>name</code> and <code>destination</code> (URL). Upload it,
              customise the QR design with colours, shapes and a logo, preview, then create up to{" "}
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
          <p className="mb-4 text-sm text-muted-foreground">
            Design one QR code — this same design will be applied to all {rows.length} codes.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Template
              </h2>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {templates.map((tpl, i) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      setTemplateId(tpl.id);
                      setDesign({});
                    }}
                    className={
                      "relative flex flex-col items-center rounded-xl border p-2 transition-all " +
                      (templateId === tpl.id
                        ? "border-brand ring-2 ring-brand/15 bg-brand-soft/30"
                        : "border-border hover:border-brand/40 bg-background") +
                      (i === 0 ? " ring-1 ring-brand/20" : "")
                    }
                  >
                    {i === 0 && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-brand px-2 py-0.5 text-[9px] font-bold text-brand-foreground">
                        Recommended
                      </span>
                    )}
                    <div className="size-16">
                      <img
                        src={svgToDataUrl(
                          renderQrSvg(
                            "https://example.com",
                            { templateId: tpl.id },
                            { size: 64, margin: 1 },
                          ),
                        )}
                        alt={"Template " + tpl.id}
                        className="size-full rounded-md"
                      />
                    </div>
                    <span className="mt-1 text-[9px] font-semibold text-muted-foreground">
                      #{tpl.id}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-center gap-6">
                <label className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Code</span>
                  <input
                    type="color"
                    value={design.fg ?? activeTpl.fg}
                    onChange={(e) => setDesign((prev) => ({ ...prev, fg: e.target.value }))}
                    className="size-8 cursor-pointer rounded-lg border border-border bg-background p-0.5"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Background</span>
                  <input
                    type="color"
                    value={design.bg ?? activeTpl.bg}
                    onChange={(e) => setDesign((prev) => ({ ...prev, bg: e.target.value }))}
                    className="size-8 cursor-pointer rounded-lg border border-border bg-background p-0.5"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Eye</span>
                  <input
                    type="color"
                    value={design.eye ?? activeTpl.eye}
                    onChange={(e) => setDesign((prev) => ({ ...prev, eye: e.target.value }))}
                    className="size-8 cursor-pointer rounded-lg border border-border bg-background p-0.5"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-5 shadow-card">
              <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Customise
              </h2>
              <div className="mt-3 space-y-1">
                <BulkDesignCollapsible
                  icon={<Palette className="size-4" />}
                  label="Body Shape"
                  value={design.bodyShape ?? null}
                >
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {bodyShapeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setDesign((prev) => ({
                            ...prev,
                            bodyShape:
                              prev.bodyShape === opt.value
                                ? (undefined as unknown as BodyShape | null)
                                : opt.value,
                          }))
                        }
                        className={
                          "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors " +
                          (design.bodyShape === opt.value
                            ? "bg-brand text-brand-foreground"
                            : "bg-background text-muted-foreground hover:bg-background/80")
                        }
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </BulkDesignCollapsible>

                <BulkDesignCollapsible
                  icon={<Frame className="size-4" />}
                  label="Eye Style"
                  value={design.eyeShape ?? null}
                >
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {eyeShapeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setDesign((prev) => ({
                            ...prev,
                            eyeShape:
                              prev.eyeShape === opt.value
                                ? (undefined as unknown as EyeShape | null)
                                : opt.value,
                          }))
                        }
                        className={
                          "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors " +
                          (design.eyeShape === opt.value
                            ? "bg-brand text-brand-foreground"
                            : "bg-background text-muted-foreground hover:bg-background/80")
                        }
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </BulkDesignCollapsible>

                <BulkDesignCollapsible
                  icon={<Palette className="size-4" />}
                  label="Gradient"
                  value={
                    design.gradient
                      ? `${design.gradient.type} gradient`
                      : null
                  }
                >
                  <div className="space-y-2 pt-1">
                    <div className="flex gap-1.5">
                      {(["linear", "radial"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() =>
                            setDesign((prev) => ({
                              ...prev,
                              gradient:
                                prev.gradient?.type === t
                                  ? (null as GradientConfig | null)
                                  : { type: t, color: "#6366f1", angle: 135 },
                            }))
                          }
                          className={
                            "rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors " +
                            (design.gradient?.type === t
                              ? "bg-brand text-brand-foreground"
                              : "bg-background text-muted-foreground hover:bg-background/80")
                          }
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    {design.gradient && (
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                          <input
                            type="color"
                            value={design.gradient.color}
                            onChange={(e) =>
                              setDesign((prev) => ({
                                ...prev,
                                gradient: prev.gradient
                                  ? { ...prev.gradient, color: e.target.value }
                                  : null,
                              }))
                            }
                            className="size-7 cursor-pointer rounded-lg border border-border bg-background p-0.5"
                          />
                          Colour
                        </label>
                        {design.gradient.type === "linear" && (
                          <input
                            type="number"
                            min={0}
                            max={360}
                            value={design.gradient.angle ?? 135}
                            onChange={(e) =>
                              setDesign((prev) => ({
                                ...prev,
                                gradient: prev.gradient
                                  ? { ...prev.gradient, angle: Number(e.target.value) }
                                  : null,
                              }))
                            }
                            className="h-8 w-20 rounded-lg border border-border bg-background px-2 text-xs"
                            placeholder="Angle"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </BulkDesignCollapsible>

                <BulkDesignCollapsible
                  icon={<Image className="size-4" />}
                  label="Logo"
                  value={design.logo ? "Logo added" : null}
                >
                  <div className="pt-1">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    {design.logo ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={design.logo}
                          alt="Logo preview"
                          className="size-12 rounded-lg border border-border object-contain bg-background p-0.5"
                        />
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-background px-4 py-3 text-xs font-semibold text-muted-foreground hover:bg-background/80"
                      >
                        <Upload className="size-4" />
                        Upload logo (max 500KB)
                      </button>
                    )}
                    {design.logo && (
                      <p className="mt-1.5 text-[10px] text-muted-foreground">
                        Logo will be placed at the centre of each QR code.
                      </p>
                    )}
                  </div>
                </BulkDesignCollapsible>

                <BulkDesignCollapsible
                  icon={<Frame className="size-4" />}
                  label="Frame & CTA"
                  value={design.frame?.text || null}
                >
                  <div className="space-y-2 pt-1">
                    <input
                      type="text"
                      value={design.frame?.text ?? ""}
                      onChange={(e) =>
                        setDesign((prev) => ({
                          ...prev,
                          frame: e.target.value
                            ? {
                                text: e.target.value,
                                style: prev.frame?.style ?? "default",
                              }
                            : (null as FrameConfig | null),
                        }))
                      }
                      placeholder="CTA text (e.g. Scan Me)"
                      className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs"
                    />
                    {design.frame && (
                      <div className="flex gap-1.5">
                        {frameStyleOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              setDesign((prev) => ({
                                ...prev,
                                frame: prev.frame
                                  ? { ...prev.frame, style: opt.value }
                                  : null,
                              }))
                            }
                            className={
                              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors " +
                              (design.frame?.style === opt.value
                                ? "bg-brand text-brand-foreground"
                                : "bg-background text-muted-foreground hover:bg-background/80")
                            }
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </BulkDesignCollapsible>
              </div>

              <div className="mt-4 flex items-center justify-between">
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
              <div key={i} className="flex flex-col items-center rounded-xl border border-border p-3">
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
                {progress.total > 0
                  ? Math.round((progress.done / progress.total) * 100)
                  : 0}
                %
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

          {results.filter((r) => r.ok && r.slug).length > 0 && (
            <div className="rounded-2xl border border-border bg-background shadow-card">
              <div className="border-b border-border px-5 py-4">
                <h3 className="text-sm font-bold">Individual codes</h3>
                <p className="text-xs text-muted-foreground">
                  Download each QR code individually in your preferred format.
                </p>
              </div>
              <ul className="max-h-96 divide-y divide-border overflow-auto">
                {results.filter((r) => r.ok && r.slug).map((r) => (
                  <li key={r.name} className="flex items-center gap-3 px-5 py-3">
                    <img
                      src={svgToDataUrl(
                        renderSvgFor(shortUrl(r.slug!), 48, 1),
                      )}
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

function BulkDesignCollapsible({
  icon,
  label,
  value,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-background/50">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
      >
        <span className="text-muted-foreground">{icon}</span>
        <span className="flex-1 text-xs font-semibold">{label}</span>
        {value && (
          <span className="max-w-[80px] truncate rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
            {value}
          </span>
        )}
        {open ? (
          <ChevronDown className="size-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-3.5 text-muted-foreground" />
        )}
      </button>
      {open && <div className="border-t border-border px-3 py-2.5">{children}</div>}
    </div>
  );
}
