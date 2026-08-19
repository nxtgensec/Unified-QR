import qrcode from "qrcode-generator";
import { jsPDF } from "jspdf";

export type QrType =
  "url" | "pdf" | "multi-url" | "contact" | "text" | "app" | "sms" | "email" | "phone" | "social";

export type QrFormState = {
  url: string;
  pdfUrl: string;
  multiUrls: string[];
  contact: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    company: string;
    website: string;
  };
  text: string;
  app: { ios: string; android: string };
  sms: { number: string; message: string };
  email: { to: string; subject: string; body: string };
  phone: string;
  social: { instagram: string; youtube: string; x: string };
};

export const initialForm: QrFormState = {
  url: "",
  pdfUrl: "",
  multiUrls: ["", ""],
  contact: {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    website: "",
  },
  text: "",
  app: { ios: "", android: "" },
  sms: { number: "", message: "" },
  email: { to: "", subject: "", body: "" },
  phone: "",
  social: { instagram: "", youtube: "", x: "" },
};

function esc(value: string) {
  return value.replace(/([,;\\])/g, "\\$1");
}

export function buildPayload(type: QrType, form: QrFormState): string {
  switch (type) {
    case "url":
      return form.url.trim();
    case "pdf":
      return form.pdfUrl.trim();
    case "multi-url":
      return form.multiUrls
        .map((u) => u.trim())
        .filter(Boolean)
        .join("\n");
    case "contact": {
      const c = form.contact;
      if (!c.firstName && !c.lastName && !c.phone && !c.email) return "";
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${esc(c.lastName)};${esc(c.firstName)};;;`,
        `FN:${esc(`${c.firstName} ${c.lastName}`.trim())}`,
        c.company ? `ORG:${esc(c.company)}` : "",
        c.phone ? `TEL;TYPE=CELL:${esc(c.phone)}` : "",
        c.email ? `EMAIL:${esc(c.email)}` : "",
        c.website ? `URL:${esc(c.website)}` : "",
        "END:VCARD",
      ]
        .filter(Boolean)
        .join("\n");
    }
    case "text":
      return form.text;
    case "app": {
      const parts = [form.app.ios.trim(), form.app.android.trim()].filter(Boolean);
      return parts.join("\n");
    }
    case "sms": {
      const n = form.sms.number.trim();
      if (!n) return "";
      return `SMSTO:${n}:${form.sms.message}`;
    }
    case "email": {
      const to = form.email.to.trim();
      if (!to) return "";
      const q = new URLSearchParams();
      if (form.email.subject) q.set("subject", form.email.subject);
      if (form.email.body) q.set("body", form.email.body);
      const qs = q.toString();
      return `mailto:${to}${qs ? `?${qs}` : ""}`;
    }
    case "phone":
      return form.phone.trim() ? `tel:${form.phone.trim()}` : "";
    case "social": {
      const s = form.social;
      return [s.instagram, s.youtube, s.x]
        .map((v) => v.trim())
        .filter(Boolean)
        .join("\n");
    }
    default:
      return "";
  }
}

export type BodyShape = "square" | "dot" | "rounded" | "diamond" | "star" | "heart" | "triangle";
export type EyeShape = "square" | "rounded" | "circle";

export type QrTemplate = {
  id: number;
  fg: string;
  bg: string;
  eye: string;
  shape: BodyShape;
  eyeShape: EyeShape;
};

export type GradientConfig = {
  type: "linear" | "radial";
  color: string;
  angle?: number;
};

export type FrameConfig = {
  text: string;
  style: "default" | "rounded" | "badge";
};

export type QrDesign = {
  templateId: number;
  fg: string;
  bg: string;
  eye: string;
  bodyShape: BodyShape | null;
  eyeShape: EyeShape | null;
  gradient: GradientConfig | null;
  logo: string | null;
  frame: FrameConfig | null;
};

export const bodyShapeOptions: { value: BodyShape; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "dot", label: "Dot" },
  { value: "diamond", label: "Diamond" },
  { value: "star", label: "Star" },
  { value: "heart", label: "Heart" },
  { value: "triangle", label: "Triangle" },
];

export const eyeShapeOptions: { value: EyeShape; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "circle", label: "Circle" },
];

export const frameStyleOptions: { value: FrameConfig["style"]; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "rounded", label: "Rounded" },
  { value: "badge", label: "Badge" },
];

export const templates: QrTemplate[] = [
  { id: 1, fg: "#111827", bg: "#ffffff", eye: "#111827", shape: "square", eyeShape: "square" },
  { id: 2, fg: "#111827", bg: "#ffffff", eye: "#111827", shape: "dot", eyeShape: "circle" },
  { id: 3, fg: "#1d4ed8", bg: "#ffffff", eye: "#1d4ed8", shape: "rounded", eyeShape: "rounded" },
  { id: 4, fg: "#0f172a", bg: "#ffffff", eye: "#2563eb", shape: "rounded", eyeShape: "circle" },
  { id: 5, fg: "#7c3aed", bg: "#ffffff", eye: "#7c3aed", shape: "dot", eyeShape: "rounded" },
  { id: 6, fg: "#059669", bg: "#ffffff", eye: "#065f46", shape: "rounded", eyeShape: "rounded" },
  { id: 7, fg: "#dc2626", bg: "#ffffff", eye: "#111827", shape: "square", eyeShape: "rounded" },
  { id: 8, fg: "#0891b2", bg: "#ffffff", eye: "#0f172a", shape: "dot", eyeShape: "circle" },
  { id: 9, fg: "#ea580c", bg: "#ffffff", eye: "#ea580c", shape: "rounded", eyeShape: "square" },
  { id: 10, fg: "#111827", bg: "#fef3c7", eye: "#b45309", shape: "square", eyeShape: "square" },
  {
    id: 11,
    fg: "#ffffff",
    bg: "#111827",
    eye: "#38bdf8",
    shape: "rounded",
    eyeShape: "rounded",
  },
  { id: 12, fg: "#be123c", bg: "#fff1f2", eye: "#be123c", shape: "dot", eyeShape: "circle" },
  { id: 13, fg: "#1e293b", bg: "#e2e8f0", eye: "#0ea5e9", shape: "rounded", eyeShape: "circle" },
];

function buildDesign(
  design: Partial<QrDesign> & { templateId: number },
  base: QrTemplate,
): {
  fg: string;
  bg: string;
  eye: string;
  bodyShape: BodyShape;
  eyeShape: EyeShape;
  gradient: GradientConfig | null;
  logo: string | null;
  frame: FrameConfig | null;
} {
  const t = templates.find((x) => x.id === design.templateId) ?? base;
  return {
    fg: design.fg ?? t.fg,
    bg: design.bg ?? t.bg,
    eye: design.eye ?? t.eye,
    bodyShape: design.bodyShape ?? t.shape,
    eyeShape: design.eyeShape ?? t.eyeShape,
    gradient: design.gradient ?? null,
    logo: design.logo ?? null,
    frame: design.frame ?? null,
  };
}

type RenderOptions = {
  size?: number;
  margin?: number;
};

function isEye(row: number, col: number, count: number) {
  return (row < 7 && col < 7) || (row < 7 && col >= count - 7) || (row >= count - 7 && col < 7);
}

function eyeGroup(
  x: number,
  y: number,
  unit: number,
  color: string,
  bg: string,
  eyeShape: EyeShape,
) {
  const r = eyeShape === "circle" ? unit * 3.5 : eyeShape === "rounded" ? unit * 2 : 0;
  const ri = eyeShape === "circle" ? unit * 1.5 : eyeShape === "rounded" ? unit * 0.9 : 0;
  return [
    `<rect x="${x}" y="${y}" width="${unit * 7}" height="${unit * 7}" rx="${r}" fill="${color}"/>`,
    `<rect x="${x + unit}" y="${y + unit}" width="${unit * 5}" height="${unit * 5}" rx="${Math.max(r - unit, 0)}" fill="${bg}"/>`,
    `<rect x="${x + unit * 2}" y="${y + unit * 2}" width="${unit * 3}" height="${unit * 3}" rx="${ri}" fill="${color}"/>`,
  ].join("");
}

function bodyShapePath(
  cx: number,
  cy: number,
  unit: number,
  shape: BodyShape,
  fill: string,
): string {
  const r = unit * 0.44;
  switch (shape) {
    case "dot":
      return `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${r.toFixed(2)}" fill="${fill}"/>`;
    case "rounded": {
      const rx = unit * 0.3;
      const x = cx - unit / 2;
      const y = cy - unit / 2;
      return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${unit.toFixed(2)}" height="${unit.toFixed(2)}" rx="${rx.toFixed(2)}" fill="${fill}"/>`;
    }
    case "diamond": {
      const s = r * 1.2;
      return `<polygon points="${cx.toFixed(2)},${(cy - s).toFixed(2)} ${(cx + s).toFixed(2)},${cy.toFixed(2)} ${cx.toFixed(2)},${(cy + s).toFixed(2)} ${(cx - s).toFixed(2)},${cy.toFixed(2)}" fill="${fill}"/>`;
    }
    case "star": {
      const or = r * 1.2;
      const ir = or * 0.45;
      const pts: string[] = [];
      for (let i = 0; i < 5; i++) {
        const aOuter = Math.PI / 2 + (i * 2 * Math.PI) / 5;
        const aInner = aOuter + Math.PI / 5;
        pts.push(
          `${(cx + or * Math.cos(aOuter)).toFixed(2)},${(cy - or * Math.sin(aOuter)).toFixed(2)}`,
        );
        pts.push(
          `${(cx + ir * Math.cos(aInner)).toFixed(2)},${(cy - ir * Math.sin(aInner)).toFixed(2)}`,
        );
      }
      return `<polygon points="${pts.join(" ")}" fill="${fill}"/>`;
    }
    case "heart": {
      const s = r * 1.3;
      const x = cx - s;
      const y = cy - s * 0.8;
      const w = s * 2;
      const h = s * 2;
      return `<path d="M${cx.toFixed(2)},${(y + h * 0.7).toFixed(2)} C${(x + w * 0.1).toFixed(2)},${(y + h * 0.4).toFixed(2)} ${(x + w * 0.0).toFixed(2)},${y.toFixed(2)} ${cx.toFixed(2)},${(y + h * 0.25).toFixed(2)} C${(x + w * 1.0).toFixed(2)},${y.toFixed(2)} ${(x + w * 0.9).toFixed(2)},${(y + h * 0.4).toFixed(2)} ${cx.toFixed(2)},${(y + h * 0.7).toFixed(2)} Z" fill="${fill}"/>`;
    }
    case "triangle": {
      const s = r * 1.3;
      return `<polygon points="${cx.toFixed(2)},${(cy - s).toFixed(2)} ${(cx + s).toFixed(2)},${(cy + s * 0.7).toFixed(2)} ${(cx - s).toFixed(2)},${(cy + s * 0.7).toFixed(2)}" fill="${fill}"/>`;
    }
    default: {
      const u2 = unit + 0.4;
      const x = cx - u2 / 2;
      const y = cy - u2 / 2;
      return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${u2.toFixed(2)}" height="${u2.toFixed(2)}" fill="${fill}"/>`;
    }
  }
}

function buildGradientDef(id: string, fg: string, gradient: GradientConfig | null): string {
  if (!gradient) return "";
  const safeId = escXml(id);
  if (gradient.type === "radial") {
    return `<radialGradient id="${safeId}" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="${escXml(gradient.color)}"/><stop offset="100%" stop-color="${escXml(fg)}"/></radialGradient>`;
  }
  const angle = gradient.angle ?? 135;
  const rad = (angle * Math.PI) / 180;
  const x1 = 50 - Math.cos(rad) * 50;
  const y1 = 50 - Math.sin(rad) * 50;
  const x2 = 50 + Math.cos(rad) * 50;
  const y2 = 50 + Math.sin(rad) * 50;
  return `<linearGradient id="${safeId}" x1="${x1.toFixed(1)}%" y1="${y1.toFixed(1)}%" x2="${x2.toFixed(1)}%" y2="${y2.toFixed(1)}%"><stop offset="0%" stop-color="${escXml(gradient.color)}"/><stop offset="100%" stop-color="${escXml(fg)}"/></linearGradient>`;
}

export function renderQrSvg(
  data: string,
  design: Partial<QrDesign> & { templateId: number },
  { size = 512, margin = 4 }: RenderOptions = {},
): string {
  const tpl = templates.find((t) => t.id === design.templateId) ?? templates[0]!;
  const d = buildDesign(design, tpl);

  const hasLogo = !!d.logo;
  const ecLevel = hasLogo ? "H" : "M";
  const qr = qrcode(0, ecLevel);
  qr.addData(data);
  qr.make();
  const count = qr.getModuleCount();

  const hasFrame = !!d.frame?.text;
  const framePadding = hasFrame ? size * 0.12 : 0;
  const totalHeight = size + framePadding;
  const totalWidth = size;

  const total = count + margin * 2;
  const unit = size / total;
  const off = margin * unit;

  const parts: string[] = [];
  const defs: string[] = [];

  const gradId = "qr-fill";
  const hasGradient = !!d.gradient;
  const gradDef = buildGradientDef(gradId, d.fg, d.gradient);
  if (gradDef) defs.push(gradDef);
  const moduleFill = hasGradient ? `url(#${gradId})` : d.fg;

  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (!qr.isDark(row, col) || isEye(row, col, count)) continue;
      const cx = off + col * unit + unit / 2;
      const cy = off + row * unit + unit / 2;
      parts.push(bodyShapePath(cx, cy, unit, d.bodyShape, moduleFill));
    }
  }

  parts.push(
    eyeGroup(off, off, unit, d.eye, d.bg, d.eyeShape),
    eyeGroup(off + (count - 7) * unit, off, unit, d.eye, d.bg, d.eyeShape),
    eyeGroup(off, off + (count - 7) * unit, unit, d.eye, d.bg, d.eyeShape),
  );

  if (hasLogo) {
    const logoSize = unit * 7;
    const logoX = (size - logoSize) / 2;
    const logoY = (size - logoSize) / 2;
    const pad = unit;
    const rx = unit * 1.5;
    parts.push(
      `<rect x="${(logoX - pad).toFixed(2)}" y="${(logoY - pad).toFixed(2)}" width="${(logoSize + pad * 2).toFixed(2)}" height="${(logoSize + pad * 2).toFixed(2)}" rx="${rx.toFixed(2)}" fill="${d.bg}"/>`,
      `<image x="${logoX.toFixed(2)}" y="${logoY.toFixed(2)}" width="${logoSize.toFixed(2)}" height="${logoSize.toFixed(2)}" href="${escXml(d.logo ?? "")}" preserveAspectRatio="xMidYMid meet"/>`,
    );
  }

  const defsBlock = defs.length > 0 ? `<defs>${defs.join("")}</defs>` : "";

  let qrBlock: string;
  if (hasFrame) {
    const ft = d.frame!;
    const r = ft.style === "rounded" ? 16 : ft.style === "badge" ? size / 2 : 8;
    const strokeW = ft.style === "badge" ? 0 : 2;
    const bgColor = d.bg === "#ffffff" ? "#f8fafc" : d.bg;
    qrBlock = [
      `<rect width="${totalWidth}" height="${totalHeight}" rx="${r}" fill="${bgColor}"${strokeW ? ` stroke="${d.fg}" stroke-width="${strokeW}"` : ""}/>`,
      `<g transform="translate(0,0)">`,
      `<rect width="${size}" height="${size}" fill="${d.bg}"/>`,
      ...parts,
      `</g>`,
      `<text x="${totalWidth / 2}" y="${size + framePadding * 0.7}" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${framePadding * 0.35}" font-weight="700" fill="${d.fg}">${escXml(ft.text)}</text>`,
    ].join("");
  } else {
    qrBlock = [`<rect width="${size}" height="${size}" fill="${d.bg}"/>`, ...parts].join("");
  }

  const viewH = totalHeight;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalWidth}" height="${viewH}" viewBox="0 0 ${totalWidth} ${viewH}">${defsBlock}${qrBlock}</svg>`;
}

function escXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function svgToDataUrl(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function downloadSvg(svg: string, filename = "qr-code.svg") {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function downloadPng(svg: string, filename = "qr-code.png", size = 1024) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  const url = svgToDataUrl(svg);
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("render failed"));
    img.src = url;
  });
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(img, 0, 0, size, size);
  triggerDownload(canvas.toDataURL("image/png"), filename);
}

export async function downloadJpg(svg: string, filename = "qr-code.jpg", size = 1024) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  const url = svgToDataUrl(svg);
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("render failed"));
    img.src = url;
  });
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(img, 0, 0, size, size);
  triggerDownload(canvas.toDataURL("image/jpeg", 0.95), filename);
}

export async function downloadWebp(svg: string, filename = "qr-code.webp", size = 1024) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  const url = svgToDataUrl(svg);
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("render failed"));
    img.src = url;
  });
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(img, 0, 0, size, size);
  triggerDownload(canvas.toDataURL("image/webp", 0.95), filename);
}

export async function downloadPdf(svg: string, filename = "qr-code.pdf", size = 1024) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  const url = svgToDataUrl(svg);
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("render failed"));
    img.src = url;
  });
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(img, 0, 0, size, size);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [size, size],
  });
  pdf.addImage(imgData, "PNG", 0, 0, size, size);
  pdf.save(filename);
}

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
