import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import {
  buildPayload,
  downloadPng,
  downloadSvg,
  downloadJpg,
  downloadWebp,
  downloadPdf,
  initialForm,
  renderQrSvg,
  svgToDataUrl,
  templates,
  bodyShapeOptions,
  eyeShapeOptions,
  frameStyleOptions,
  type QrFormState,
  type QrType,
  type BodyShape,
  type EyeShape,
  type GradientConfig,
  type FrameConfig,
} from "@/lib/qr";
import { TypeTabs, qrTypes } from "./TypeTabs";
import { TypeForm } from "./TypeForm";
import {
  Download,
  Save,
  Sparkles,
  Users,
  Upload,
  ChevronDown,
  ChevronRight,
  Palette,
  Image,
  Frame,
  Loader2,
  FileImage,
  FileType,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { makeSlug, shortUrl } from "@/lib/codes";

const PLACEHOLDER = "https://qr.nxtgensec.org";

export function QrWidget() {
  const [type, setType] = useState<QrType>("url");
  const [form, setForm] = useState<QrFormState>(initialForm);
  const [templateId, setTemplateId] = useState(1);
  const [fg, setFg] = useState<string | null>(null);
  const [bg, setBg] = useState<string | null>(null);
  const [bodyShape, setBodyShape] = useState<BodyShape | null>(null);
  const [eyeShape, setEyeShape] = useState<EyeShape | null>(null);
  const [gradient, setGradient] = useState<GradientConfig | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [frame, setFrame] = useState<FrameConfig | null>(null);
  const [debounced, setDebounced] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);

  const payload = buildPayload(type, form);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(payload), 180);
    return () => clearTimeout(id);
  }, [payload]);

  const template = useMemo(() => {
    const base = templates.find((t) => t.id === templateId) ?? templates[0]!;
    return {
      templateId,
      fg: fg ?? base.fg,
      bg: bg ?? base.bg,
      eye: fg ?? base.eye,
      bodyShape: bodyShape ?? base.shape,
      eyeShape: eyeShape ?? base.eyeShape,
      gradient,
      logo,
      frame,
    };
  }, [templateId, fg, bg, bodyShape, eyeShape, gradient, logo, frame]);

  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [teamId, setTeamId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setTeamId(null);
      return;
    }
    let active = true;
    supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id)
      .limit(1)
      .then(
        ({ data, error }) => {
          if (active) setTeamId(error ? null : (data?.[0]?.team_id ?? null));
        },
        () => {
          if (active) setTeamId(null);
        },
      );
    return () => {
      active = false;
    };
  }, [user]);

  const data = debounced.trim() || PLACEHOLDER;
  const isEmpty = !debounced.trim();

  async function save(dynamic: boolean, toTeam = false) {
    if (!user || isEmpty) return;

    if (dynamic) {
      try {
        const url = new URL(
          debounced.trim().startsWith("http") ? debounced.trim() : `https://${debounced.trim()}`,
        );
        if (!["http:", "https:"].includes(url.protocol)) {
          toast.error("Only http/https URLs are allowed.");
          return;
        }
      } catch {
        toast.error("Please enter a valid URL.");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .maybeSingle();
      const plan = profile?.plan ?? "free";
      const limit = plan === "pro" ? Infinity : plan === "flex" ? 25 : 2;

      const { count } = await supabase
        .from("qr_codes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_dynamic", true);

      if ((count ?? 0) >= limit) {
        toast.error(
          `You've reached your dynamic code limit (${limit}). Upgrade your plan for more.`,
        );
        return;
      }
    }

    setSaving(true);
    const slug = dynamic ? makeSlug() : null;
    const { error } = await supabase.from("qr_codes").insert({
      user_id: user.id,
      team_id: toTeam ? teamId : null,
      name: `${type.toUpperCase()} code`,
      type,
      content: payload,
      is_dynamic: dynamic,
      slug,
      destination: dynamic ? payload : null,
      template_id: templateId,
      fg: fg,
      bg: bg,
      body_shape: bodyShape,
      eye_shape: eyeShape,
      gradient_type: gradient?.type ?? null,
      gradient_color: gradient?.color ?? null,
      gradient_angle: gradient?.angle ?? null,
      frame_text: frame?.text ?? null,
      frame_style: frame?.style ?? null,
      logo_url: logo,
    });
    setSaving(false);
    if (error) {
      console.error("[QrWidget] save error:", error.message);
      toast.error("Could not save this code", {
        description: "Please try again.",
      });
      return;
    }
    toast.success(
      dynamic ? "Dynamic code created" : toTeam ? "Saved to your team" : "Saved to your account",
      {
        description: dynamic && slug ? shortUrl(slug) : "Find it in your dashboard.",
      },
    );
  }

  const svg = useMemo(() => renderQrSvg(data, template, { size: 512 }), [data, template]);

  const thumbs = useMemo(
    () =>
      templates.map((t) => ({
        id: t.id,
        src: svgToDataUrl(
          renderQrSvg(
            "https://example.com",
            {
              templateId: t.id,
              fg: t.fg,
              bg: t.bg,
              eye: t.eye,
              bodyShape: t.shape,
              eyeShape: t.eyeShape,
            },
            { size: 120, margin: 2 },
          ),
        ),
      })),
    [],
  );

  const handleDownload = useCallback(
    async (format: "png" | "svg" | "jpg" | "webp" | "pdf") => {
      const out = renderQrSvg(data, template, { size: 1024 });
      const baseName = `unifiedqr-${type}`;
      switch (format) {
        case "svg":
          downloadSvg(out, `${baseName}.svg`);
          break;
        case "png":
          await downloadPng(out, `${baseName}.png`);
          break;
        case "jpg":
          await downloadJpg(out, `${baseName}.jpg`);
          break;
        case "webp":
          await downloadWebp(out, `${baseName}.webp`);
          break;
        case "pdf":
          await downloadPdf(out, `${baseName}.pdf`);
          break;
      }
      toast.success(`QR Code downloaded as ${format.toUpperCase()}`);
    },
    [data, template, type],
  );

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function resetAllCustom() {
    setFg(null);
    setBg(null);
    setBodyShape(null);
    setEyeShape(null);
    setGradient(null);
    setLogo(null);
    setFrame(null);
  }

  const activeType = qrTypes.find((t) => t.id === type)!;

  return (
    <div
      id="generator"
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-float"
    >
      <div className="border-b border-border px-4 pt-4 sm:px-6">
        <TypeTabs active={type} onChange={setType} />
      </div>

      {/* ── Input at top ── */}
      <div className="border-b border-border px-5 pt-5 sm:px-8">
        <p className="mb-2 text-sm font-semibold text-muted-foreground">{activeType.tagline}</p>
        <TypeForm type={type} form={form} setForm={setForm} />
      </div>

      {/* ── Template carousel ── */}
      <TemplateCarousel
        thumbs={thumbs}
        activeId={templateId}
        onSelect={(id) => {
          setTemplateId(id);
          resetAllCustom();
        }}
      />

      <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* ── Left column: design controls + save ── */}
        <div className="order-2 lg:order-1">
          <div className="flex items-center justify-center gap-6">
            <ColorPicker label="Code" value={fg ?? template.fg} onChange={setFg} />
            <ColorPicker label="Background" value={bg ?? template.bg} onChange={setBg} />
          </div>

          <DesignControls
            bodyShape={bodyShape}
            setBodyShape={setBodyShape}
            eyeShape={eyeShape}
            setEyeShape={setEyeShape}
            gradient={gradient}
            setGradient={setGradient}
            logo={logo}
            onLogoUpload={handleLogoUpload}
            onLogoRemove={() => setLogo(null)}
            logoInputRef={logoInputRef}
            frame={frame}
            setFrame={setFrame}
          />

          <div className="mt-6 space-y-3">
            {user ? (
              <>
                <SaveSection
                  saving={saving}
                  isEmpty={isEmpty}
                  type={type}
                  teamId={teamId}
                  onSaveStatic={() => void save(false)}
                  onSaveDynamic={() => void save(true)}
                  onSaveTeam={() => void save(false, true)}
                />
              </>
            ) : (
              <div className="rounded-xl border border-border bg-surface p-4">
                <p className="flex items-center gap-2 text-sm font-bold">
                  <Sparkles className="size-4 text-premium" /> Save & track your codes
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sign in with Google to store your codes, create editable dynamic links and see
                  scan counts. Downloads are always free and never watermarked.
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

        {/* ── Right column: preview + download ── */}
        <div className="order-1 flex flex-col items-center lg:order-2">
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

          <div className="mt-6">
            <FormatDropdown onDownload={handleDownload} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateCarousel({
  thumbs,
  activeId,
  onSelect,
}: {
  thumbs: { id: number; src: string }[];
  activeId: number;
  onSelect: (id: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const dragRef = useRef({ dragging: false, startX: 0, scrollLeft: 0 });
  const speed = 0.5;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf: number;
    function tick() {
      if (el && !pausedRef.current && !dragRef.current.dragging && el.isConnected) {
        el.scrollLeft -= speed;
        if (el.scrollLeft <= 0) el.scrollLeft += el.scrollWidth / 2;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    const el = trackRef.current;
    if (!el) return;
    dragRef.current = { dragging: true, startX: e.clientX, scrollLeft: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
    el.style.cursor = "grabbing";
  }
  function onPointerMove(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d.dragging || !trackRef.current) return;
    trackRef.current.scrollLeft = d.scrollLeft - (e.clientX - d.startX);
  }
  function onPointerUp(e: React.PointerEvent) {
    dragRef.current.dragging = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
    void e;
  }

  const doubled = [...thumbs, ...thumbs];

  return (
    <div
      className="border-b border-border relative overflow-hidden"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-brand/5 via-brand/10 to-brand/5 pointer-events-none" />
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative flex gap-2 overflow-x-auto px-5 py-3 sm:px-8 cursor-grab select-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex gap-2 shrink-0">
          {doubled.map((t, i) => (
            <button
              key={`${t.id}-${i}`}
              type="button"
              onClick={() => onSelect(t.id)}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label={`QR template ${t.id}`}
              className={`shrink-0 overflow-hidden rounded-xl border-2 p-0.5 transition-all hover:scale-105 ${
                t.id === activeId
                  ? "border-brand ring-2 ring-brand/25 shadow-md"
                  : "border-border hover:border-brand/50"
              }`}
            >
              <img
                src={t.src}
                alt={`QR template ${t.id}`}
                className="size-14 rounded-lg sm:size-16"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FormatDropdown({
  onDownload,
}: {
  onDownload: (format: "png" | "svg" | "jpg" | "webp" | "pdf") => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const formats = [
    { value: "png" as const, label: "PNG", desc: "Best for screens & social media" },
    { value: "svg" as const, label: "SVG", desc: "Scalable, ideal for print" },
    { value: "jpg" as const, label: "JPG", desc: "Universal, smaller file size" },
    { value: "webp" as const, label: "WebP", desc: "Modern, optimised for web" },
    { value: "pdf" as const, label: "PDF", desc: "Ready for documents & print" },
  ];

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-brand-foreground shadow-card transition-transform hover:-translate-y-0.5"
      >
        <Download className="size-4" /> Download QR Code{" "}
        <ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute bottom-full left-0 z-50 mb-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-float">
          {formats.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                onDownload(f.value);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface"
            >
              <span className="grid size-8 place-items-center rounded-lg bg-brand-soft text-brand">
                {f.value === "pdf" ? (
                  <FileText className="size-4" />
                ) : f.value === "svg" ? (
                  <FileType className="size-4" />
                ) : (
                  <FileImage className="size-4" />
                )}
              </span>
              <div>
                <span className="block text-sm font-bold">{f.label}</span>
                <span className="block text-[11px] text-muted-foreground">{f.desc}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SaveSection({
  saving,
  isEmpty,
  type,
  teamId,
  onSaveStatic,
  onSaveDynamic,
  onSaveTeam,
}: {
  saving: boolean;
  isEmpty: boolean;
  type: QrType;
  teamId: string | null;
  onSaveStatic: () => void;
  onSaveDynamic: () => void;
  onSaveTeam: () => void;
}) {
  const [mode, setMode] = useState<"static" | "dynamic">("static");
  const dynamicDisabled = type !== "url";

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setMode("static")}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
            mode === "static"
              ? "bg-brand text-brand-foreground"
              : "text-muted-foreground hover:bg-surface/80"
          }`}
        >
          <Save className="mr-1 inline size-3" /> Static
        </button>
        <button
          type="button"
          onClick={() => {
            if (!dynamicDisabled) setMode("dynamic");
          }}
          disabled={dynamicDisabled}
          title={dynamicDisabled ? "Dynamic links work with the URL type" : undefined}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
            mode === "dynamic"
              ? "bg-premium text-white"
              : dynamicDisabled
                ? "cursor-not-allowed text-muted-foreground/40"
                : "text-muted-foreground hover:bg-surface/80"
          }`}
        >
          <Sparkles className="mr-1 inline size-3" /> Dynamic
        </button>
      </div>

      <p className="mt-2 text-[11px] text-muted-foreground">
        {mode === "static"
          ? "Printed code — content is permanent once saved."
          : "Editable link — change the destination anytime from your dashboard."}
      </p>

      <button
        type="button"
        onClick={mode === "static" ? onSaveStatic : onSaveDynamic}
        disabled={saving || isEmpty}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground shadow-card transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="size-4 animate-spin" />
        ) : mode === "static" ? (
          <Save className="size-4" />
        ) : (
          <Sparkles className="size-4" />
        )}
        {saving ? "Saving…" : mode === "static" ? "Save QR Code" : "Create Dynamic Link"}
      </button>

      {teamId && (
        <button
          type="button"
          onClick={onSaveTeam}
          disabled={saving || isEmpty}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-brand/40 bg-brand-soft/40 px-5 py-2 text-xs font-bold text-brand transition-colors hover:bg-brand-soft/60 disabled:opacity-60"
        >
          <Users className="size-3.5" /> Save to team library
        </button>
      )}

      {mode === "dynamic" && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          <Link to="/dashboard" className="font-semibold text-brand">
            Dashboard
          </Link>{" "}
          — edit destination, pause, or delete anytime.
        </p>
      )}
    </div>
  );
}

function DesignControls({
  bodyShape,
  setBodyShape,
  eyeShape,
  setEyeShape,
  gradient,
  setGradient,
  logo,
  onLogoUpload,
  onLogoRemove,
  logoInputRef,
  frame,
  setFrame,
}: {
  bodyShape: BodyShape | null;
  setBodyShape: (v: BodyShape | null) => void;
  eyeShape: EyeShape | null;
  setEyeShape: (v: EyeShape | null) => void;
  gradient: GradientConfig | null;
  setGradient: (v: GradientConfig | null) => void;
  logo: string | null;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoRemove: () => void;
  logoInputRef: React.RefObject<HTMLInputElement | null>;
  frame: FrameConfig | null;
  setFrame: (v: FrameConfig | null) => void;
}) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  function toggle(section: string) {
    setOpenSection((prev) => (prev === section ? null : section));
  }

  return (
    <div className="mt-4 space-y-1">
      <Collapsible
        icon={<Palette className="size-4" />}
        label="Body Shape"
        value={bodyShape}
        onOpen={() => toggle("body")}
        isOpen={openSection === "body"}
      >
        <div className="flex flex-wrap gap-1.5 pt-1">
          {bodyShapeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setBodyShape(bodyShape === opt.value ? null : opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                bodyShape === opt.value
                  ? "bg-brand text-brand-foreground"
                  : "bg-surface text-muted-foreground hover:bg-surface/80"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Collapsible>

      <Collapsible
        icon={<Frame className="size-4" />}
        label="Eye Style"
        value={eyeShape}
        onOpen={() => toggle("eye")}
        isOpen={openSection === "eye"}
      >
        <div className="flex flex-wrap gap-1.5 pt-1">
          {eyeShapeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setEyeShape(eyeShape === opt.value ? null : opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                eyeShape === opt.value
                  ? "bg-brand text-brand-foreground"
                  : "bg-surface text-muted-foreground hover:bg-surface/80"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Collapsible>

      <Collapsible
        icon={<Palette className="size-4" />}
        label="Gradient"
        value={gradient ? `${gradient.type} gradient` : null}
        onOpen={() => toggle("gradient")}
        isOpen={openSection === "gradient"}
      >
        <div className="space-y-2 pt-1">
          <div className="flex gap-1.5">
            {(["linear", "radial"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() =>
                  setGradient(
                    gradient?.type === t ? null : { type: t, color: "#6366f1", angle: 135 },
                  )
                }
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  gradient?.type === t
                    ? "bg-brand text-brand-foreground"
                    : "bg-surface text-muted-foreground hover:bg-surface/80"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {gradient && (
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <input
                  type="color"
                  value={gradient.color}
                  onChange={(e) => setGradient({ ...gradient, color: e.target.value })}
                  className="size-7 cursor-pointer rounded-lg border border-border bg-background p-0.5"
                />
                Start color
              </label>
              {gradient.type === "linear" && (
                <input
                  type="number"
                  min={0}
                  max={360}
                  value={gradient.angle ?? 135}
                  onChange={(e) =>
                    setGradient({
                      ...gradient,
                      angle: Number(e.target.value),
                    })
                  }
                  className="h-8 w-20 rounded-lg border border-border bg-background px-2 text-xs"
                  placeholder="Angle"
                />
              )}
            </div>
          )}
        </div>
      </Collapsible>

      <Collapsible
        icon={<Image className="size-4" />}
        label="Logo"
        value={logo ? "Logo added" : null}
        onOpen={() => toggle("logo")}
        isOpen={openSection === "logo"}
      >
        <div className="pt-1">
          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            onChange={onLogoUpload}
            className="hidden"
          />
          {logo ? (
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Logo preview"
                className="size-12 rounded-lg border border-border object-contain bg-background p-0.5"
              />
              <button
                type="button"
                onClick={onLogoRemove}
                className="rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-surface px-4 py-3 text-xs font-semibold text-muted-foreground hover:bg-surface/80"
            >
              <Upload className="size-4" />
              Upload logo (max 2MB)
            </button>
          )}
          {logo && (
            <p className="mt-1.5 text-[10px] text-muted-foreground">
              Error correction raised to 30% for logo clarity
            </p>
          )}
        </div>
      </Collapsible>

      <Collapsible
        icon={<Frame className="size-4" />}
        label="Frame & CTA"
        value={frame?.text || null}
        onOpen={() => toggle("frame")}
        isOpen={openSection === "frame"}
      >
        <div className="space-y-2 pt-1">
          <input
            type="text"
            value={frame?.text ?? ""}
            onChange={(e) =>
              setFrame(
                e.target.value
                  ? {
                      text: e.target.value,
                      style: frame?.style ?? "default",
                    }
                  : null,
              )
            }
            placeholder="CTA text (e.g. Scan Me)"
            className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs"
          />
          {frame && (
            <div className="flex gap-1.5">
              {frameStyleOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFrame({ ...frame, style: opt.value })}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    frame.style === opt.value
                      ? "bg-brand text-brand-foreground"
                      : "bg-surface text-muted-foreground hover:bg-surface/80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </Collapsible>
    </div>
  );
}

function Collapsible({
  icon,
  label,
  value,
  onOpen,
  isOpen,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  onOpen: () => void;
  isOpen: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/50">
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
      >
        <span className="text-muted-foreground">{icon}</span>
        <span className="flex-1 text-xs font-semibold">{label}</span>
        {value && (
          <span className="max-w-[80px] truncate rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
            {value}
          </span>
        )}
        {isOpen ? (
          <ChevronDown className="size-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-3.5 text-muted-foreground" />
        )}
      </button>
      {isOpen && <div className="border-t border-border px-3 py-2.5">{children}</div>}
    </div>
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
