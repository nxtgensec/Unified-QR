import { useMemo, useState, useCallback, useEffect } from "react";
import {
  buildPayload,
  downloadPng,
  downloadSvg,
  initialForm,
  renderQrSvg,
  svgToDataUrl,
  templates,
  type QrFormState,
  type QrType,
} from "@/lib/qr";
import { TypeTabs, qrTypes } from "./TypeTabs";
import { TypeForm } from "./TypeForm";
import { Download, Lock, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { makeSlug, shortUrl } from "@/lib/codes";

const PLACEHOLDER = "https://unifiedqr.app";


export function QrWidget() {
  const [type, setType] = useState<QrType>("url");
  const [form, setForm] = useState<QrFormState>(initialForm);
  const [templateId, setTemplateId] = useState(1);
  const [fg, setFg] = useState<string | null>(null);
  const [bg, setBg] = useState<string | null>(null);
  const [debounced, setDebounced] = useState("");

  const payload = buildPayload(type, form);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(payload), 180);
    return () => clearTimeout(id);
  }, [payload]);

  const template = useMemo(() => {
    const base = templates.find((t) => t.id === templateId) ?? templates[0]!;
    return { ...base, fg: fg ?? base.fg, bg: bg ?? base.bg, eye: fg ?? base.eye };
  }, [templateId, fg, bg]);

  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const data = debounced.trim() || PLACEHOLDER;
  const isEmpty = !debounced.trim();

  async function save(dynamic: boolean) {
    if (!user || isEmpty) return;
    setSaving(true);
    const slug = dynamic ? makeSlug() : null;
    const { error } = await supabase.from("qr_codes").insert({
      user_id: user.id,
      name: `${type.toUpperCase()} code`,
      type,
      content: payload,
      is_dynamic: dynamic,
      slug,
      destination: dynamic ? payload : null,
      template_id: templateId,
      fg: fg ?? template.fg,
      bg: bg ?? template.bg,
    });
    setSaving(false);
    if (error) {
      toast.error("Could not save this code. Please try again.");
      return;
    }
    toast.success(dynamic ? "Dynamic code created" : "Saved to your account", {
      description: dynamic && slug ? shortUrl(slug) : "Find it in your dashboard.",
    });
  }


  const svg = useMemo(
    () => renderQrSvg(data, template, { size: 512 }),
    [data, template],
  );

  const thumbs = useMemo(
    () =>
      templates.map((t) => ({
        id: t.id,
        src: svgToDataUrl(renderQrSvg("https://example.com", t, { size: 120, margin: 2 })),
      })),
    [],
  );

  const handleDownload = useCallback(
    async (format: "png" | "svg") => {
      const out = renderQrSvg(data, template, { size: 1024 });
      if (format === "svg") {
        downloadSvg(out);
      } else {
        await downloadPng(out);
      }
      toast.success(`QR Code downloaded as ${format.toUpperCase()}`);
    },
    [data, template],
  );

  const activeType = qrTypes.find((t) => t.id === type)!;

  return (
    <div
      id="generator"
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-float"
    >
      <div className="border-b border-border px-4 pt-4 sm:px-6">
        <TypeTabs active={type} onChange={setType} />
      </div>

      <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">{activeType.tagline}</p>
          <div className="mt-4">
            <TypeForm type={type} form={form} setForm={setForm} />
          </div>

          <div className="mt-6 space-y-3">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => void save(false)}
                  disabled={saving || isEmpty}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm font-semibold disabled:opacity-60"
                >
                  Save to my account
                  <Save className="size-4 text-brand" />
                </button>
                <button
                  type="button"
                  onClick={() => void save(true)}
                  disabled={saving || isEmpty || type !== "url"}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm font-semibold disabled:opacity-60"
                  title={type === "url" ? undefined : "Dynamic links work with the URL type"}
                >
                  Create dynamic, trackable link
                  <Sparkles className="size-4 text-premium" />
                </button>
                <p className="text-xs text-muted-foreground">
                  Dynamic codes stay scannable while you change the destination —{" "}
                  <Link to="/dashboard" className="font-semibold text-brand">
                    open your dashboard
                  </Link>
                </p>
              </>
            ) : (
              <div className="rounded-xl border border-border bg-surface p-4">
                <p className="flex items-center gap-2 text-sm font-bold">
                  <Sparkles className="size-4 text-premium" /> Save & track your codes
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sign in with Google to store your codes, create editable dynamic links and
                  see scan counts. Downloads are always free and never watermarked.
                </p>
                <Link
                  to="/auth"
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground shadow-card transition-transform hover:-translate-y-0.5"
                >
                  Sign in with Google
                </Link>
              </div>
            )}

          </div>

        </div>

        <div className="flex flex-col items-center">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <img
              src={svgToDataUrl(svg)}
              alt="QR Code preview"
              width={224}
              height={224}
              className="size-56 rounded-lg"
            />
          </div>
          {isEmpty && (
            <p className="mt-2 text-xs text-muted-foreground">
              Showing a sample code — start typing to make it yours
            </p>
          )}

          <div className="mt-5 grid w-full grid-cols-7 gap-1.5">
            {thumbs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTemplateId(t.id);
                  setFg(null);
                  setBg(null);
                }}
                aria-label={`QR template ${t.id}`}
                className={`overflow-hidden rounded-lg border p-0.5 transition-colors ${
                  templateId === t.id ? "border-brand ring-2 ring-brand/25" : "border-border"
                }`}
              >
                <img src={t.src} alt={`QR template ${t.id}`} className="w-full" />
              </button>
            ))}
          </div>

          <div className="mt-5 flex w-full items-center justify-center gap-6">
            <ColorPicker
              label="Code"
              value={fg ?? template.fg}
              onChange={setFg}
            />
            <ColorPicker
              label="Background"
              value={bg ?? template.bg}
              onChange={setBg}
            />
          </div>

          <div className="mt-6 flex w-full gap-2">
            <button
              type="button"
              onClick={() => handleDownload("png")}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-brand-foreground shadow-card transition-transform hover:-translate-y-0.5"
            >
              <Download className="size-4" /> Save PNG
            </button>
            <button
              type="button"
              onClick={() => handleDownload("svg")}
              className="rounded-full border border-border px-5 py-3 text-sm font-bold transition-colors hover:bg-surface"
            >
              SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PremiumToggle({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() =>
        toast("Premium feature", {
          description: "Sign up free to unlock tracking and watermark-free codes.",
        })
      }
      className="flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-left"
    >
      <span className="flex items-center gap-2 text-sm font-semibold">
        {label}
        <Sparkles className="size-4 text-premium" />
      </span>
      <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Lock className="size-3.5" /> Locked
      </span>
    </button>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="size-8 cursor-pointer rounded-lg border border-border bg-background p-0.5"
        aria-label={`${label} color`}
      />
      {label}
    </label>
  );
}
