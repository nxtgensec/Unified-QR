import qrcode from "qrcode-generator";

export type QrType =
  | "url"
  | "pdf"
  | "multi-url"
  | "contact"
  | "text"
  | "app"
  | "sms"
  | "email"
  | "phone"
  | "social";

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

export type QrTemplate = {
  id: number;
  fg: string;
  bg: string;
  eye: string;
  shape: "square" | "dot" | "rounded";
  eyeShape: "square" | "rounded" | "circle";
};

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
  { id: 11, fg: "#ffffff", bg: "#111827", eye: "#38bdf8", shape: "rounded", eyeShape: "rounded" },
  { id: 12, fg: "#be123c", bg: "#fff1f2", eye: "#be123c", shape: "dot", eyeShape: "circle" },
  { id: 13, fg: "#1e293b", bg: "#e2e8f0", eye: "#0ea5e9", shape: "rounded", eyeShape: "circle" },
];

type RenderOptions = {
  size?: number;
  margin?: number;
  watermark?: boolean;
};

function isEye(row: number, col: number, count: number) {
  return (
    (row < 7 && col < 7) ||
    (row < 7 && col >= count - 7) ||
    (row >= count - 7 && col < 7)
  );
}

function eyeGroup(
  x: number,
  y: number,
  unit: number,
  color: string,
  bg: string,
  eyeShape: QrTemplate["eyeShape"],
) {
  const r =
    eyeShape === "circle" ? unit * 3.5 : eyeShape === "rounded" ? unit * 2 : 0;
  const ri =
    eyeShape === "circle" ? unit * 1.5 : eyeShape === "rounded" ? unit * 0.9 : 0;
  return [
    `<rect x="${x}" y="${y}" width="${unit * 7}" height="${unit * 7}" rx="${r}" fill="${color}"/>`,
    `<rect x="${x + unit}" y="${y + unit}" width="${unit * 5}" height="${unit * 5}" rx="${Math.max(r - unit, 0)}" fill="${bg}"/>`,
    `<rect x="${x + unit * 2}" y="${y + unit * 2}" width="${unit * 3}" height="${unit * 3}" rx="${ri}" fill="${color}"/>`,
  ].join("");
}

export function renderQrSvg(
  data: string,
  template: QrTemplate,
  { size = 512, margin = 4, watermark = false }: RenderOptions = {},
): string {
  const qr = qrcode(0, "M");
  qr.addData(data);
  qr.make();
  const count = qr.getModuleCount();
  const total = count + margin * 2;
  const unit = size / total;
  const off = margin * unit;

  let body = "";
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (!qr.isDark(row, col)) continue;
      if (isEye(row, col, count)) continue;
      const x = off + col * unit;
      const y = off + row * unit;
      if (template.shape === "dot") {
        body += `<circle cx="${(x + unit / 2).toFixed(2)}" cy="${(y + unit / 2).toFixed(2)}" r="${(unit * 0.44).toFixed(2)}" fill="${template.fg}"/>`;
      } else if (template.shape === "rounded") {
        body += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${unit.toFixed(2)}" height="${unit.toFixed(2)}" rx="${(unit * 0.3).toFixed(2)}" fill="${template.fg}"/>`;
      } else {
        body += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${(unit + 0.4).toFixed(2)}" height="${(unit + 0.4).toFixed(2)}" fill="${template.fg}"/>`;
      }
    }
  }

  const eyes = [
    eyeGroup(off, off, unit, template.eye, template.bg, template.eyeShape),
    eyeGroup(off + (count - 7) * unit, off, unit, template.eye, template.bg, template.eyeShape),
    eyeGroup(off, off + (count - 7) * unit, unit, template.eye, template.bg, template.eyeShape),
  ].join("");

  const mark = watermark
    ? `<g><rect x="${size / 2 - size * 0.29}" y="${size - size * 0.12}" width="${size * 0.58}" height="${size * 0.075}" rx="${size * 0.0375}" fill="${template.fg}" opacity="0.9"/><text x="${size / 2}" y="${size - size * 0.065}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="${size * 0.036}" fill="${template.bg}">unifiedqr.app</text></g>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="${template.bg}"/>${body}${eyes}${mark}</svg>`;
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

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
