import type { ComponentType } from "react";
import {
  Instagram,
  Youtube,
  Facebook,
  Linkedin,
  Github,
  Twitch,
  Dribbble,
  Mail,
  Phone,
  Globe,
  MapPin,
  MessageCircle,
  Send,
  Music,
  Calendar,
  FileText,
  Star,
} from "lucide-react";

export type BrandId =
  | "instagram"
  | "youtube"
  | "x"
  | "facebook"
  | "linkedin"
  | "whatsapp"
  | "telegram"
  | "github"
  | "email"
  | "phone"
  | "website"
  | "location"
  | "music"
  | "twitch"
  | "dribbble"
  | "booking"
  | "menu"
  | "reviews";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
    </svg>
  );
}

export const BRAND_ICONS: Record<
  BrandId,
  { label: string; Icon: ComponentType<{ className?: string }> }
> = {
  instagram: { label: "Instagram", Icon: Instagram },
  youtube: { label: "YouTube", Icon: Youtube },
  x: { label: "X / Twitter", Icon: XIcon },
  facebook: { label: "Facebook", Icon: Facebook },
  linkedin: { label: "LinkedIn", Icon: Linkedin },
  whatsapp: { label: "WhatsApp", Icon: MessageCircle },
  telegram: { label: "Telegram", Icon: Send },
  github: { label: "GitHub", Icon: Github },
  email: { label: "Email", Icon: Mail },
  phone: { label: "Phone", Icon: Phone },
  website: { label: "Website", Icon: Globe },
  location: { label: "Location", Icon: MapPin },
  music: { label: "Music", Icon: Music },
  twitch: { label: "Twitch", Icon: Twitch },
  dribbble: { label: "Dribbble", Icon: Dribbble },
  booking: { label: "Booking", Icon: Calendar },
  menu: { label: "Menu / Doc", Icon: FileText },
  reviews: { label: "Reviews", Icon: Star },
};

export const BRAND_LIST = (Object.keys(BRAND_ICONS) as BrandId[]).map((id) => ({
  id,
  ...BRAND_ICONS[id],
}));

export const BRAND_PREFIX = "brand:";

export function isBrandIcon(iconUrl: string | null | undefined): boolean {
  return !!iconUrl?.startsWith(BRAND_PREFIX);
}

export function brandIdFromUrl(iconUrl: string | null | undefined): string | null {
  return isBrandIcon(iconUrl) ? iconUrl!.slice(BRAND_PREFIX.length) : null;
}

export function BrandIconRender({ id, className }: { id: string; className?: string }) {
  const brand = BRAND_ICONS[id as BrandId];
  if (!brand) return null;
  const Icon = brand.Icon;
  return <Icon className={className ?? ""} />;
}
