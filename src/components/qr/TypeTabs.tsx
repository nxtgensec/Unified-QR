import type { QrType } from "@/lib/qr";
import {
  Link2,
  FileText,
  ListOrdered,
  Contact,
  Type,
  Smartphone,
  MessageSquare,
  Mail,
  Phone,
  Share2,
} from "lucide-react";

export const qrTypes: {
  id: QrType;
  label: string;
  icon: typeof Link2;
  tagline: string;
}[] = [
  { id: "url", label: "URL", icon: Link2, tagline: "Redirect to an existing web URL" },
  { id: "pdf", label: "PDF", icon: FileText, tagline: "Share a PDF document link" },
  { id: "multi-url", label: "Multi-Url", icon: ListOrdered, tagline: "Share multiple links in one code" },
  { id: "contact", label: "Contact", icon: Contact, tagline: "Share your contact details (vCard)" },
  { id: "text", label: "Plain Text", icon: Type, tagline: "Show a plain text message" },
  { id: "app", label: "App", icon: Smartphone, tagline: "Link to your app store pages" },
  { id: "sms", label: "SMS", icon: MessageSquare, tagline: "Send a pre-written text message" },
  { id: "email", label: "Email", icon: Mail, tagline: "Compose an email in one scan" },
  { id: "phone", label: "Phone", icon: Phone, tagline: "Dial a phone number instantly" },
  { id: "social", label: "Social", icon: Share2, tagline: "Link all your social profiles" },
];

export function TypeTabs({
  active,
  onChange,
}: {
  active: QrType;
  onChange: (t: QrType) => void;
}) {
  return (
    <div className="-mx-1 flex gap-1 overflow-x-auto pb-2">
      {qrTypes.map((t) => {
        const Icon = t.icon;
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`flex min-w-[84px] flex-col items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
              isActive
                ? "bg-brand-soft text-brand"
                : "text-muted-foreground hover:bg-surface hover:text-foreground"
            }`}
          >
            <Icon className="size-5" />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
