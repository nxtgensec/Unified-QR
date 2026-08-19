import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/AppShell";
import {
  GripVertical,
  Loader2,
  Plus,
  Save,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Link2,
  Upload,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/links")({
  head: () => ({
    meta: [
      { title: "Link Pages — UnifiedQR" },
      { name: "description", content: "Create and manage your multi-link pages." },
      { property: "og:title", content: "Link Pages — UnifiedQR" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LinksEditor,
});

type PageRow = { id: string; slug: string; title: string; updated_at: string };
type SectionRow = { id: string; title: string; sort_order: number; visible: boolean };
type ItemRow = {
  id: string;
  section_id: string;
  title: string;
  url: string;
  icon_emoji: string | null;
  icon_url: string | null;
  sort_order: number;
  visible: boolean;
};

function LinksEditor() {
  const { user } = useAuth();
  const [pages, setPages] = useState<PageRow[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageFields, setPageFields] = useState({
    title: "My Links",
    subtitle: "",
    slug: "",
    avatar_url: "",
    theme_color: "#6366f1",
    theme_bg: "#ffffff",
    theme_font: "system",
  });

  const selectedPage = pages.find((p) => p.id === selectedPageId);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("link_pages")
        .select("id, slug, title, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (!cancelled) {
        setPages((data ?? []) as PageRow[]);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const loadPage = useCallback(async (pageId: string) => {
    setSelectedPageId(pageId);
    const { data: pageData } = await supabase
      .from("link_pages")
      .select("*")
      .eq("id", pageId)
      .maybeSingle();
    if (pageData) {
      setPageFields({
        title: pageData.title,
        subtitle: pageData.subtitle ?? "",
        slug: pageData.slug,
        avatar_url: pageData.avatar_url ?? "",
        theme_color: pageData.theme_color,
        theme_bg: pageData.theme_bg,
        theme_font: pageData.theme_font,
      });
    }
    const { data: secData } = await supabase
      .from("link_sections")
      .select("id, title, sort_order, visible")
      .eq("page_id", pageId)
      .order("sort_order");
    const secs = (secData ?? []) as SectionRow[];
    setSections(secs);

    const secIds = secs.map((s) => s.id);
    if (secIds.length > 0) {
      const { data: itemData } = await supabase
        .from("link_items")
        .select("id, section_id, title, url, icon_emoji, icon_url, sort_order, visible")
        .in("section_id", secIds)
        .order("sort_order");
      setItems((itemData ?? []) as ItemRow[]);
    } else {
      setItems([]);
    }
  }, []);

  async function createPage() {
    if (!user) return;
    const slug = pageFields.slug.trim() || makeSlug();
    const { data, error } = await supabase
      .from("link_pages")
      .insert({
        user_id: user.id,
        slug,
        title: pageFields.title || "My Links",
        subtitle: pageFields.subtitle || null,
        theme_color: pageFields.theme_color,
        theme_bg: pageFields.theme_bg,
        theme_font: pageFields.theme_font,
      })
      .select("id, slug, title, updated_at")
      .single();
    if (error) {
      toast.error("Could not create page", { description: error.message });
      return;
    }
    setPages((prev) => [data as PageRow, ...prev]);
    await loadPage(data.id);
    toast.success("Link page created");
  }

  async function saveAll() {
    if (!selectedPageId) return;
    setSaving(true);

    const { error: pageErr } = await supabase
      .from("link_pages")
      .update({
        title: pageFields.title,
        subtitle: pageFields.subtitle || null,
        slug: pageFields.slug,
        avatar_url: pageFields.avatar_url || null,
        theme_color: pageFields.theme_color,
        theme_bg: pageFields.theme_bg,
        theme_font: pageFields.theme_font,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedPageId);

    if (pageErr) {
      toast.error("Save failed", { description: pageErr.message });
      setSaving(false);
      return;
    }

    await Promise.all([
      ...sections.map((sec) =>
        supabase
          .from("link_sections")
          .update({ title: sec.title, sort_order: sec.sort_order, visible: sec.visible })
          .eq("id", sec.id),
      ),
      ...items.map((item) =>
        supabase
          .from("link_items")
          .update({
            title: item.title,
            url: item.url,
            icon_emoji: item.icon_emoji,
            sort_order: item.sort_order,
            visible: item.visible,
          })
          .eq("id", item.id),
      ),
    ]);

    setSaving(false);
    toast.success("Saved!");
    setPages((prev) =>
      prev.map((p) =>
        p.id === selectedPageId ? { ...p, title: pageFields.title, slug: pageFields.slug } : p,
      ),
    );
  }

  async function addSection() {
    if (!selectedPageId) return;
    const order = sections.length;
    const { data, error } = await supabase
      .from("link_sections")
      .insert({ page_id: selectedPageId, title: "", sort_order: order })
      .select("id, title, sort_order, visible")
      .single();
    if (error) {
      toast.error("Failed");
      return;
    }
    setSections((prev) => [...prev, data as SectionRow]);
  }

  async function deleteSection(secId: string) {
    await supabase.from("link_sections").delete().eq("id", secId);
    setSections((prev) => prev.filter((s) => s.id !== secId));
    setItems((prev) => prev.filter((i) => i.section_id !== secId));
  }

  async function addItem(secId: string) {
    const sectionItems = items.filter((i) => i.section_id === secId);
    const order = sectionItems.length;
    const { data, error } = await supabase
      .from("link_items")
      .insert({ section_id: secId, title: "", url: "https://", sort_order: order })
      .select("id, section_id, title, url, icon_emoji, icon_url, sort_order, visible")
      .single();
    if (error) {
      toast.error("Failed");
      return;
    }
    setItems((prev) => [...prev, data as ItemRow]);
  }

  async function deleteItem(itemId: string) {
    await supabase.from("link_items").delete().eq("id", itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }

  function updateSection(secId: string, patch: Partial<SectionRow>) {
    setSections((prev) => prev.map((s) => (s.id === secId ? { ...s, ...patch } : s)));
  }

  function updateItem(itemId: string, patch: Partial<ItemRow>) {
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, ...patch } : i)));
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selectedPageId) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Avatar must be under 4MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPageFields((f) => ({ ...f, avatar_url: reader.result as string }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  const publicUrl = selectedPage
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/p/${pageFields.slug || selectedPage.slug}`
    : "";

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        title="Link Pages"
        description="Create a beautiful page with all your links — one QR code for everything."
        actions={
          <div className="flex gap-2">
            {selectedPageId && (
              <button
                type="button"
                onClick={() => void saveAll()}
                disabled={saving}
                className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground shadow-card disabled:opacity-60"
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                {saving ? "Saving…" : "Save"}
              </button>
            )}
            <button
              type="button"
              onClick={() => void createPage()}
              className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold transition-colors hover:bg-background"
            >
              <Plus className="size-4" /> New Page
            </button>
          </div>
        }
      />

      {pages.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border p-10 text-center">
          <Link2 className="mx-auto size-8 text-muted-foreground/40" />
          <p className="mt-3 font-semibold">No link pages yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first multi-link page and share it with a single QR code.
          </p>
          <button
            type="button"
            onClick={() => void createPage()}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground"
          >
            <Plus className="size-4" /> Create page
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
          <nav className="space-y-1">
            {pages.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => void loadPage(p.id)}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                  selectedPageId === p.id
                    ? "bg-brand-soft text-brand"
                    : "text-muted-foreground hover:bg-background hover:text-foreground"
                }`}
              >
                <span className="flex-1 truncate">{p.title || p.slug}</span>
                <span className="text-[10px] opacity-50">/{p.slug}</span>
              </button>
            ))}
          </nav>

          {selectedPageId && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-background p-5 shadow-card">
                <h2 className="mb-4 text-sm font-bold">Page settings</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold text-muted-foreground">Title</span>
                    <input
                      value={pageFields.title}
                      onChange={(e) => setPageFields((f) => ({ ...f, title: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-muted-foreground">Subtitle</span>
                    <input
                      value={pageFields.subtitle}
                      onChange={(e) => setPageFields((f) => ({ ...f, subtitle: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-muted-foreground">Slug</span>
                    <div className="mt-1 flex items-center rounded-xl border border-border bg-background">
                      <span className="pl-3 text-xs text-muted-foreground">/p/</span>
                      <input
                        value={pageFields.slug}
                        onChange={(e) =>
                          setPageFields((f) => ({
                            ...f,
                            slug: e.target.value.replace(/[^a-z0-9-]/g, ""),
                          }))
                        }
                        className="w-full bg-transparent px-1 py-2 text-sm outline-none"
                      />
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-muted-foreground">Theme color</span>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="color"
                        value={pageFields.theme_color}
                        onChange={(e) =>
                          setPageFields((f) => ({ ...f, theme_color: e.target.value }))
                        }
                        className="size-8 cursor-pointer rounded-lg border border-border bg-background p-0.5"
                      />
                      <input
                        value={pageFields.theme_color}
                        onChange={(e) =>
                          setPageFields((f) => ({ ...f, theme_color: e.target.value }))
                        }
                        className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
                      />
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-muted-foreground">Background</span>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="color"
                        value={pageFields.theme_bg}
                        onChange={(e) => setPageFields((f) => ({ ...f, theme_bg: e.target.value }))}
                        className="size-8 cursor-pointer rounded-lg border border-border bg-background p-0.5"
                      />
                      <input
                        value={pageFields.theme_bg}
                        onChange={(e) => setPageFields((f) => ({ ...f, theme_bg: e.target.value }))}
                        className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
                      />
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-muted-foreground">Font</span>
                    <select
                      value={pageFields.theme_font}
                      onChange={(e) => setPageFields((f) => ({ ...f, theme_font: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
                    >
                      <option value="system">System</option>
                      <option value="serif">Serif</option>
                      <option value="mono">Monospace</option>
                    </select>
                  </label>
                </div>

                <div className="mt-3">
                  <span className="text-xs font-semibold text-muted-foreground">Avatar</span>
                  <div className="mt-1 flex items-center gap-3">
                    {pageFields.avatar_url ? (
                      <>
                        <img
                          src={pageFields.avatar_url}
                          alt="Avatar"
                          className="size-12 rounded-full border border-border object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setPageFields((f) => ({ ...f, avatar_url: "" }))}
                          className="rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-background px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-background">
                        <Upload className="size-4" /> Upload avatar
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/svg+xml"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {publicUrl && (
                  <div className="mt-4 flex items-center gap-2">
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                    >
                      <ExternalLink className="size-3" /> Open public page
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {sections.map((sec) => (
                  <div
                    key={sec.id}
                    className="rounded-2xl border border-border bg-background p-4 shadow-card"
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="size-4 text-muted-foreground/40" />
                      <input
                        value={sec.title}
                        onChange={(e) => updateSection(sec.id, { title: e.target.value })}
                        placeholder="Section title (optional)"
                        className="flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-muted-foreground/40"
                      />
                      <button
                        type="button"
                        onClick={() => updateSection(sec.id, { visible: !sec.visible })}
                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-background"
                        title={sec.visible ? "Hide section" : "Show section"}
                      >
                        {sec.visible ? (
                          <Eye className="size-4" />
                        ) : (
                          <EyeOff className="size-4 text-muted-foreground/40" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteSection(sec.id)}
                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="mt-3 space-y-2">
                      {items
                        .filter((i) => i.section_id === sec.id)
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2"
                          >
                            <span className="text-muted-foreground/40">⋮⋮</span>
                            <input
                              value={item.title}
                              onChange={(e) => updateItem(item.id, { title: e.target.value })}
                              placeholder="Link title"
                              className="w-32 bg-transparent text-xs font-semibold outline-none placeholder:text-muted-foreground/40"
                            />
                            <input
                              value={item.url}
                              onChange={(e) => updateItem(item.id, { url: e.target.value })}
                              placeholder="https://…"
                              className="flex-1 bg-transparent text-xs text-muted-foreground outline-none placeholder:text-muted-foreground/40"
                            />
                            <input
                              value={item.icon_emoji ?? ""}
                              onChange={(e) =>
                                updateItem(item.id, {
                                  icon_emoji: e.target.value || null,
                                })
                              }
                              placeholder="😀"
                              className="w-10 bg-transparent text-center text-sm outline-none"
                              title="Emoji icon"
                            />
                            <button
                              type="button"
                              onClick={() => updateItem(item.id, { visible: !item.visible })}
                              className="rounded p-1 text-muted-foreground/50 hover:text-foreground"
                            >
                              {item.visible ? (
                                <Eye className="size-3.5" />
                              ) : (
                                <EyeOff className="size-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => void deleteItem(item.id)}
                              className="rounded p-1 text-muted-foreground/50 hover:text-destructive"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => void addItem(sec.id)}
                      className="mt-2 flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                    >
                      <Plus className="size-3" /> Add link
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => void addSection()}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4 text-sm font-semibold text-muted-foreground transition-colors hover:border-brand hover:text-brand"
                >
                  <Plus className="size-4" /> Add section
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function makeSlug() {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  const arr = new Uint8Array(7);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => chars[b % chars.length]).join("");
}
