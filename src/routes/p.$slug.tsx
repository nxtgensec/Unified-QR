import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { recordPageView, recordItemClick } from "@/lib/workspaceAnalytics.functions";

type LinkItem = {
  id: string;
  section_id: string;
  title: string;
  url: string;
  icon_emoji: string | null;
  icon_url: string | null;
  sort_order: number;
};

type LinkSection = {
  id: string;
  title: string;
  sort_order: number;
  parent_id: string | null;
  items: LinkItem[];
  children: LinkSection[];
};

type LinkPageData = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  avatar_url: string | null;
  theme_color: string;
  theme_bg: string;
  theme_font: string;
  sections: LinkSection[];
};

export const Route = createFileRoute("/p/$slug")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Link Page — UnifiedQR" },
      { name: "description", content: "A link page created with UnifiedQR." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LinkPage,
});

function normalizePublicUrl(v: string): string | null {
  const t = v.trim();
  if (!t) return null;
  if (/^(https?|mailto|tel|sms):/i.test(t)) return t;
  return `https://${t}`;
}

function SectionBlock({
  section,
  themeColor,
  onItemClick,
}: {
  section: LinkSection;
  themeColor: string;
  onItemClick: (itemId: string) => void;
}) {
  return (
    <div>
      {section.title && (
        <h2
          className="mb-3 text-xs font-bold uppercase tracking-widest opacity-50"
          style={{ color: themeColor }}
        >
          {section.title}
        </h2>
      )}
      <div className="space-y-2">
        {section.items.map((item) => {
          const href = normalizePublicUrl(item.url);
          return (
            <a
              key={item.id}
              href={href ?? undefined}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              onClick={href ? () => onItemClick(item.id) : undefined}
              className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-card ${
                href ? "cursor-pointer" : "opacity-50"
              }`}
              style={{
                borderColor: `${themeColor}25`,
                backgroundColor: `${themeColor}08`,
              }}
            >
              {item.icon_url ? (
                <img src={item.icon_url} alt="" className="size-6 shrink-0 rounded" />
              ) : item.icon_emoji ? (
                <span className="text-lg">{item.icon_emoji}</span>
              ) : (
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                  style={{ backgroundColor: themeColor }}
                >
                  {item.title.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="flex-1 truncate text-sm font-semibold" style={{ color: themeColor }}>
                {item.title}
              </span>
              <svg
                className="size-4 shrink-0 opacity-30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          );
        })}
      </div>

      {section.children.length > 0 && (
        <div
          className="mt-3 ml-4 space-y-4 border-l-2 pl-4"
          style={{ borderColor: `${themeColor}20` }}
        >
          {section.children.map((child) => (
            <SectionBlock
              key={child.id}
              section={child}
              themeColor={themeColor}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LinkPage() {
  const { slug } = Route.useParams();
  const [page, setPage] = useState<LinkPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: pageData, error: pageErr } = await supabase
        .from("link_pages")
        .select("id, slug, title, subtitle, avatar_url, theme_color, theme_bg, theme_font")
        .eq("slug", slug)
        .maybeSingle();

      if (cancelled) return;
      if (pageErr || !pageData) {
        setError("This link page does not exist.");
        setLoading(false);
        return;
      }

      const { data: sectionsData } = await supabase
        .from("link_sections")
        .select("id, title, sort_order, visible, parent_id")
        .eq("page_id", pageData.id)
        .eq("visible", true)
        .order("sort_order");

      const secIds = (sectionsData ?? []).map((s) => s.id);

      let allItems: LinkItem[] = [];
      if (secIds.length > 0) {
        const { data: itemsData } = await supabase
          .from("link_items")
          .select("id, section_id, title, url, icon_emoji, icon_url, sort_order")
          .in("section_id", secIds)
          .eq("visible", true)
          .order("sort_order");
        allItems = (itemsData ?? []) as LinkItem[];
      }

      const flatSections: Array<{
        id: string;
        title: string;
        sort_order: number;
        parent_id: string | null;
      }> = (sectionsData ?? []) as Array<{
        id: string;
        title: string;
        sort_order: number;
        parent_id: string | null;
      }>;

      const sectionMap = new Map<string, LinkSection>();
      for (const sec of flatSections) {
        sectionMap.set(sec.id, {
          id: sec.id,
          title: sec.title,
          sort_order: sec.sort_order,
          parent_id: sec.parent_id,
          items: allItems.filter((i) => i.section_id === sec.id),
          children: [],
        });
      }

      const topLevel: LinkSection[] = [];
      for (const sec of sectionMap.values()) {
        if (sec.parent_id && sectionMap.has(sec.parent_id)) {
          sectionMap.get(sec.parent_id)!.children.push(sec);
        } else {
          topLevel.push(sec);
        }
      }

      topLevel.sort((a, b) => a.sort_order - b.sort_order);
      for (const sec of sectionMap.values()) {
        sec.children.sort((a, b) => a.sort_order - b.sort_order);
      }

      if (!cancelled) {
        setPage({ ...pageData, sections: topLevel } as LinkPageData);
        setLoading(false);

        void recordPageView({
          data: {
            pageId: pageData.id,
            device: navigator.userAgent.slice(0, 200),
            referrer: document.referrer || null,
          },
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleItemClick = useCallback((itemId: string) => {
    void recordItemClick({
      data: {
        itemId,
        device: navigator.userAgent.slice(0, 200),
        referrer: document.referrer || null,
      },
    });
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4 text-center">
        <p className="text-sm text-muted-foreground">{error ?? "Not found"}</p>
      </div>
    );
  }

  const fontFamily =
    page.theme_font === "serif"
      ? "Georgia, 'Times New Roman', serif"
      : page.theme_font === "mono"
        ? "'SF Mono', Consolas, monospace"
        : "system-ui, -apple-system, sans-serif";

  return (
    <div className="min-h-screen px-4 py-12" style={{ backgroundColor: page.theme_bg, fontFamily }}>
      <div className="mx-auto max-w-lg">
        <div className="flex flex-col items-center text-center">
          {page.avatar_url && (
            <img
              src={page.avatar_url}
              alt={page.title}
              className="mb-4 size-20 rounded-full border-2 object-cover shadow-card"
              style={{ borderColor: page.theme_color }}
            />
          )}
          <h1 className="text-xl font-extrabold tracking-tight" style={{ color: page.theme_color }}>
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="mt-1 text-sm opacity-70" style={{ color: page.theme_color }}>
              {page.subtitle}
            </p>
          )}
        </div>

        <div className="mt-8 space-y-6">
          {page.sections.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              themeColor={page.theme_color}
              onItemClick={handleItemClick}
            />
          ))}
        </div>

        <p className="mt-10 text-center text-[10px] uppercase tracking-widest opacity-30">
          Powered by UnifiedQR
        </p>
      </div>
    </div>
  );
}
