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
  downloadPng,
  type QrDesign,
  type BodyShape,
  type EyeShape,
} from "@/lib/qr";
import { toast } from "sonner";
import JSZip from "jszip";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  FileSpreadsheet,
  Loader2,
  Upload,
  Download,
  Eye,
  Sparkles,
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

  function renderSvg(destination: string): string {
    return renderQrSvg(destination, { templateId, ...design }, { size: 256, margin: 2 });
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

  async function downloadSinglePng(name: string, slug: string) {
    const svg = renderQrSvg(shortUrl(slug), { templateId, ...design }, { size: 1024, margin: 4 });
    const safeName = name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60);
    await downloadPng(svg, safeName + ".png", 1024);
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

  async function downloadZip() {
    const okResults = results.filter((r) => r.ok && r.slug);
    if (okResults.length === 0) return;

    const zip = new JSZip();
    const pngSize = 512;

    for (const r of okResults) {
      const svg = renderQrSvg(shortUrl(r.slug!), { templateId, ...design }, { size: pngSize, margin: 4 });
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
      const dataUrl = canvas.toDataURL("image/png");
      const base64 = dataUrl.split(",")[1] ?? "";
      const safeName = r.name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60);
      zip.file(safeName + ".png", base64, { base64: true });
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
    toast.success("ZIP downloaded");
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
                    onClick={() => setTemplateId(tpl.id)}
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
                          renderQrSvg("https://example.com", { templateId: tpl.id }, { size: 64, margin: 1 }),
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
            </div>

            <div className="rounded-2xl border border-border bg-background p-5 shadow-card">
              <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Customise
              </h2>
              <div className="mt-3 space-y-3">
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Foreground</span>
                    <input type="color" value={design.fg ?? templates.find((t) => t.id === templateId)?.fg ?? "#111827"} onChange={(e) => setDesign((prev) => ({ ...prev, fg: e.target.value }))} className="size-7 cursor-pointer rounded border border-border" />
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Background</span>
                    <input type="color" value={design.bg ?? templates.find((t) => t.id === templateId)?.bg ?? "#ffffff"} onChange={(e) => setDesign((prev) => ({ ...prev, bg: e.target.value }))} className="size-7 cursor-pointer rounded border border-border" />
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Eye</span>
                    <input type="color" value={design.eye ?? templates.find((t) => t.id === templateId)?.eye ?? "#111827"} onChange={(e) => setDesign((prev) => ({ ...prev, eye: e.target.value }))} className="size-7 cursor-pointer rounded border border-border" />
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Body shape</span>
                    <select value={design.bodyShape ?? ""} onChange={(e) => setDesign((prev) => ({ ...prev, bodyShape: (e.target.value || undefined) as BodyShape | undefined }))} className="rounded-lg border border-border bg-background px-2 py-1 text-xs outline-none">
                      <option value="">Default</option>
                      {bodyShapeOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Eye shape</span>
                    <select value={design.eyeShape ?? ""} onChange={(e) => setDesign((prev) => ({ ...prev, eyeShape: (e.target.value || undefined) as EyeShape | undefined }))} className="rounded-lg border border-border bg-background px-2 py-1 text-xs outline-none">
                      <option value="">Default</option>
                      {eyeShapeOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="border-t border-border pt-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={!!design.gradient} onChange={(e) => setDesign((prev) => ({ ...prev, gradient: e.target.checked ? { type: "linear", color: "#6366f1", angle: 135 } : null }))} className="size-3.5 rounded border-border" />
                    <span className="text-xs text-muted-foreground">Gradient fill</span>
                  </label>
                  {design.gradient && (
                    <div className="mt-2 flex flex-wrap items-center gap-3 pl-5">
                      <label className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground">Colour</span>
                        <input type="color" value={design.gradient.color} onChange={(e) => setDesign((prev) => ({ ...prev, gradient: prev.gradient ? { ...prev.gradient, color: e.target.value } : null }))} className="size-6 cursor-pointer rounded border border-border" />
                      </label>
                      <select value={design.gradient.type} onChange={(e) => setDesign((prev) => ({ ...prev, gradient: prev.gradient ? { ...prev.gradient, type: e.target.value as "linear" | "radial" } : null }))} className="rounded-lg border border-border bg-background px-2 py-1 text-[11px] outline-none">
                        <option value="linear">Linear</option>
                        <option value="radial">Radial</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => logoInputRef.current?.click()} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-bold">
                      {design.logo ? "Change logo" : "Add logo"}
                    </button>
                    {design.logo && (
                      <button type="button" onClick={removeLogo} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-destructive hover:bg-destructive/10">
                        <X className="size-3" /> Remove
                      </button>
                    )}
                  </div>
                  <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  {design.logo && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={design.logo} alt="Logo preview" className="size-10 rounded border border-border object-contain" />
                      <span className="text-[10px] text-muted-foreground">Logo will be placed at the centre of each QR code.</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button type="button" onClick={() => setStep("review")} className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold">
                  Back
                </button>
                <button type="button" onClick={() => setStep("preview")} className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground">
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
                <img src={svgToDataUrl(renderSvg(r.destination))} alt={r.name} className="size-24 rounded-md" />
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
            <button type="button" onClick={() => setStep("design")} className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold">
              Back
            </button>
            <button type="button" onClick={() => void runImport()} disabled={busy} className="flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground disabled:opacity-60">
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
              <span>{progress.done} of {progress.total}</span>
              <span>{progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-background">
              <div className="h-2 rounded-full bg-brand transition-all" style={{ width: progress.total > 0 ? Math.round((progress.done / progress.total) * 100) + "%" : "0%" }} />
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
              <button type="button" onClick={() => void downloadZip()} disabled={results.filter((r) => r.ok && r.slug).length === 0} className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground disabled:opacity-60">
                <Package className="size-4" /> Download ZIP
              </button>
              <button type="button" onClick={downloadLinksCsv} disabled={results.filter((r) => r.ok && r.slug).length === 0} className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold disabled:opacity-60">
                <Download className="size-4" /> Download CSV
              </button>
              <button type="button" onClick={() => navigate({ to: "/dashboard" })} className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold">
                Done
              </button>
            </div>
          </div>

          {results.filter((r) => r.ok && r.slug).length > 0 && (
            <div className="rounded-2xl border border-border bg-background shadow-card">
              <div className="border-b border-border px-5 py-4">
                <h3 className="text-sm font-bold">Individual codes</h3>
                <p className="text-xs text-muted-foreground">Download each QR code individually.</p>
              </div>
              <ul className="max-h-96 divide-y divide-border overflow-auto">
                {results.filter((r) => r.ok && r.slug).map((r) => (
                  <li key={r.name} className="flex items-center gap-3 px-5 py-3">
                    <img src={svgToDataUrl(renderQrSvg(shortUrl(r.slug!), { templateId, ...design }, { size: 48, margin: 1 }))} alt={r.name} className="size-10 shrink-0 rounded" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{r.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{shortUrl(r.slug!)}</span>
                    </span>
                    <button type="button" onClick={() => void downloadSinglePng(r.name, r.slug!)} className="shrink-0 flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-bold transition-colors hover:bg-surface">
                      <Download className="size-3" /> PNG
                    </button>
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
