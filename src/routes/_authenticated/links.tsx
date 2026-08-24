import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/AppShell";
import {
  renderQrSvg,
  svgToDataUrl,
  downloadPng,
  downloadSvg,
  downloadJpg,
  downloadPdf,
} from "@/lib/qr";
import { readableQrColor, readableTextColor, urlHostname } from "@/lib/utils";
import { workspaceTemplates, type WorkspaceTemplate } from "@/lib/workspace-templates";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileImage,
  FileType,
  GripVertical,
  Link2,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/links")({
  head: () => ({
    meta: [
      { title: "Workspace — UnifiedQR" },
      {
        name: "description",
        content: "Create and manage your workspace — one QR code for all destinations.",
      },
      { property: "og:title", content: "Workspace — UnifiedQR" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LinksEditor,
});

type PageRow = { id: string; slug: string; title: string; updated_at: string };
type SectionRow = {
  id: string;
  title: string;
  sort_order: number;
  visible: boolean;
  parent_id: string | null;
};
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
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [confirmDeleteSection, setConfirmDeleteSection] = useState<SectionRow | null>(null);
  const [confirmDeletePage, setConfirmDeletePage] = useState<PageRow | null>(null);
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
      .select("id, title, sort_order, visible, parent_id")
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

  async function insertPage(values: {
    title: string;
    subtitle: string | null;
    theme_color: string;
    theme_bg: string;
    theme_font: string;
    avatar_url?: string | null;
  }): Promise<PageRow | null> {
    if (!user) return null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const slug = makeSlug();
      const { data, error } = await supabase
        .from("link_pages")
        .insert({ user_id: user.id, slug, ...values })
        .select("id, slug, title, updated_at")
        .single();
      if (!error) return data as PageRow;
      const msg = error.message.toLowerCase();
      if (!msg.includes("duplicate") && !msg.includes("unique")) {
        toast.error("Could not create page", { description: error.message });
        return null;
      }
    }
    toast.error("Could not create page", {
      description: "Could not generate a unique page link. Please try again.",
    });
    return null;
  }

  async function createPageFromTemplate(template: WorkspaceTemplate) {
    if (!user) return;
    setShowTemplatePicker(false);
    const pageData = await insertPage({
      title: template.title,
      subtitle: template.subtitle || null,
      theme_color: template.theme_color,
      theme_bg: template.theme_bg,
      theme_font: template.theme_font,
    });
    if (!pageData) return;

    for (let si = 0; si < template.sections.length; si++) {
      const sec = template.sections[si]!;
      const { data: secRow } = await supabase
        .from("link_sections")
        .insert({ page_id: pageData.id, title: sec.title, sort_order: si })
        .select("id")
        .single();
      if (!secRow) continue;

      for (let ii = 0; ii < sec.items.length; ii++) {
        const item = sec.items[ii]!;
        await supabase.from("link_items").insert({
          section_id: secRow.id,
          title: item.title,
          url: item.url,
          icon_emoji: item.icon_emoji,
          sort_order: ii,
        });
      }
    }

    setPages((prev) => [pageData, ...prev]);
    await loadPage(pageData.id);
    toast.success("Page created from template");
  }

  async function createBlankPage() {
    if (!user) return;
    setShowTemplatePicker(false);
    const pageData = await insertPage({
      title: "My Page",
      subtitle: null,
      theme_color: pageFields.theme_color,
      theme_bg: pageFields.theme_bg,
      theme_font: pageFields.theme_font,
    });
    if (!pageData) return;
    setPages((prev) => [pageData, ...prev]);
    await loadPage(pageData.id);
    toast.success("Page created");
  }

  async function deletePage(page: PageRow) {
    const { error } = await supabase.from("link_pages").delete().eq("id", page.id);
    if (error) {
      toast.error("Could not delete page", { description: error.message });
      return;
    }
    const remaining = pages.filter((p) => p.id !== page.id);
    setPages(remaining);
    setConfirmDeletePage(null);
    if (selectedPageId === page.id) {
      setSelectedPageId(null);
      setSections([]);
      setItems([]);
      if (remaining.length > 0) {
        void loadPage(remaining[0]!.id);
      } else {
        setPageFields({
          title: "My Links",
          subtitle: "",
          slug: "",
          avatar_url: "",
          theme_color: "#6366f1",
          theme_bg: "#ffffff",
          theme_font: "system",
        });
      }
    }
    toast.success("Page deleted");
  }

  async function saveAll() {
    if (!selectedPageId) return;
    if (!pageFields.slug.trim()) {
      toast.error("Slug cannot be empty", {
        description: "Set a slug so your page has a public link.",
      });
      return;
    }
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
      const msg = pageErr.message.toLowerCase();
      if (msg.includes("duplicate") || msg.includes("unique")) {
        toast.error("This link is taken", {
          description: `Another page already uses /p/${pageFields.slug}. Pick a different slug.`,
        });
      } else {
        toast.error("Save failed", { description: pageErr.message });
      }
      setSaving(false);
      return;
    }

    const normalizedItems = items.map((item) => ({
      ...item,
      url: normalizeItemUrl(item.url),
    }));
    const urlChanged = normalizedItems.some((item, idx) => item.url !== items[idx]!.url);
    if (urlChanged) setItems(normalizedItems);

    await Promise.all([
      ...sections.map((sec) =>
        supabase
          .from("link_sections")
          .update({
            title: sec.title,
            sort_order: sec.sort_order,
            visible: sec.visible,
            parent_id: sec.parent_id,
          })
          .eq("id", sec.id),
      ),
      ...normalizedItems.map((item) =>
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

  async function addSection(parentId: string | null = null) {
    if (!selectedPageId) return;
    const siblings = sections.filter((s) => s.parent_id === parentId);
    const order = siblings.length;
    const { data, error } = await supabase
      .from("link_sections")
      .insert({
        page_id: selectedPageId,
        title: "",
        sort_order: order,
        parent_id: parentId,
      })
      .select("id, title, sort_order, visible, parent_id")
      .single();
    if (error) {
      toast.error("Failed");
      return;
    }
    setSections((prev) => [...prev, data as SectionRow]);
  }

  async function deleteSection(sec: SectionRow) {
    const childIds = sections.filter((s) => s.parent_id === sec.id).map((s) => s.id);
    for (const childId of childIds) {
      await supabase.from("link_sections").delete().eq("id", childId);
    }
    const { error } = await supabase.from("link_sections").delete().eq("id", sec.id);
    if (error) {
      toast.error("Could not delete section", { description: error.message });
      return;
    }
    setSections((prev) => prev.filter((s) => s.id !== sec.id && !childIds.includes(s.id)));
    setItems((prev) =>
      prev.filter((i) => i.section_id !== sec.id && !childIds.includes(i.section_id)),
    );
    setConfirmDeleteSection(null);
    toast.success("Section deleted");
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

  function toggleCollapse(secId: string) {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(secId)) next.delete(secId);
      else next.add(secId);
      return next;
    });
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

  const previewSvg = useMemo(() => {
    if (!publicUrl) return null;
    const qrColor = readableQrColor(pageFields.theme_color, "#ffffff");
    return renderQrSvg(publicUrl, {
      templateId: 1,
      fg: qrColor,
      bg: "#ffffff",
      eye: qrColor,
      bodyShape: "square",
      eyeShape: "square",
    });
  }, [publicUrl, pageFields.theme_color]);

  const previewTextColor = useMemo(
    () => readableTextColor(pageFields.theme_color, pageFields.theme_bg),
    [pageFields.theme_color, pageFields.theme_bg],
  );

  const rootSections = useMemo(
    () => sections.filter((s) => !s.parent_id).sort((a, b) => a.sort_order - b.sort_order),
    [sections],
  );

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        title="Workspace"
        description="One QR code, many destinations — your multi-link workspace."
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
              onClick={() => setShowTemplatePicker(true)}
              className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold transition-colors hover:bg-background"
            >
              <Plus className="size-4" /> New Page
            </button>
          </div>
        }
      />

      {showTemplatePicker && (
        <TemplatePicker
          onSelect={(t) => void createPageFromTemplate(t)}
          onBlank={() => void createBlankPage()}
          onClose={() => setShowTemplatePicker(false)}
        />
      )}

      {confirmDeleteSection && (
        <DeleteSectionConfirm
          section={confirmDeleteSection}
          sections={sections}
          items={items}
          onClose={() => setConfirmDeleteSection(null)}
          onConfirm={() => void deleteSection(confirmDeleteSection)}
        />
      )}

      {confirmDeletePage && (
        <DeletePageConfirm
          page={confirmDeletePage}
          sectionCount={selectedPageId === confirmDeletePage.id ? sections.length : 0}
          itemCount={selectedPageId === confirmDeletePage.id ? items.length : 0}
          onClose={() => setConfirmDeletePage(null)}
          onConfirm={() => void deletePage(confirmDeletePage)}
        />
      )}

      {pages.length === 0 && !showTemplatePicker ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border p-10 text-center">
          <Sparkles className="mx-auto size-8 text-muted-foreground/40" />
          <p className="mt-3 font-semibold">No workspace pages yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first multi-link page — one QR code for everything.
          </p>
          <button
            type="button"
            onClick={() => setShowTemplatePicker(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground"
          >
            <Plus className="size-4" /> Create page
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr_320px]">
          {/* Page list sidebar */}
          <nav className="space-y-1">
            {pages.map((p) => (
              <div
                key={p.id}
                className={`flex items-center gap-1 rounded-xl pr-1 transition-colors ${
                  selectedPageId === p.id ? "bg-brand-soft" : "hover:bg-background"
                }`}
              >
                <button
                  type="button"
                  onClick={() => void loadPage(p.id)}
                  className={`flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                    selectedPageId === p.id
                      ? "text-brand"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex-1 truncate">{p.title || p.slug}</span>
                  <span className="text-[10px] opacity-50">/{p.slug}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDeletePage(p)}
                  className="rounded-lg p-1.5 text-muted-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
                  title="Delete page"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </nav>

          {/* Editor */}
          {selectedPageId && (
            <div className="space-y-6">
              {/* Page settings */}
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
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                    >
                      <ExternalLink className="size-3" /> Open public page
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard.writeText(publicUrl);
                        toast.success("Link copied");
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                    >
                      <Copy className="size-3" /> Copy link
                    </button>
                  </div>
                )}
              </div>

              {/* Sections */}
              <div className="space-y-4">
                {rootSections.map((sec) => (
                  <SectionBlock
                    key={sec.id}
                    section={sec}
                    depth={0}
                    allSections={sections}
                    items={items}
                    collapsedSections={collapsedSections}
                    onToggleCollapse={toggleCollapse}
                    onUpdateSection={updateSection}
                    onRequestDelete={setConfirmDeleteSection}
                    onAddItem={addItem}
                    onUpdateItem={updateItem}
                    onDeleteItem={deleteItem}
                    onAddSubSection={(parentId) => void addSection(parentId)}
                  />
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

          {/* Live preview + QR */}
          {selectedPageId && (
            <div className="space-y-4 lg:sticky lg:top-8 lg:self-start">
              <div className="rounded-2xl border border-border bg-background p-4 shadow-card">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Live Preview
                </h3>
                <div
                  className="overflow-hidden rounded-xl border border-border"
                  style={{ backgroundColor: pageFields.theme_bg }}
                >
                  <div className="max-h-[500px] overflow-y-auto px-4 py-6">
                    <div className="flex flex-col items-center text-center">
                      {pageFields.avatar_url && (
                        <img
                          src={pageFields.avatar_url}
                          alt=""
                          className="mb-3 size-14 rounded-full border-2 object-cover"
                          style={{ borderColor: previewTextColor }}
                        />
                      )}
                      <h2 className="text-base font-extrabold" style={{ color: previewTextColor }}>
                        {pageFields.title || "Page Title"}
                      </h2>
                      {pageFields.subtitle && (
                        <p
                          className="mt-0.5 text-xs opacity-70"
                          style={{ color: previewTextColor }}
                        >
                          {pageFields.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="mt-5 space-y-4">
                      {rootSections
                        .filter((s) => s.visible)
                        .map((sec) => {
                          const secItems = items
                            .filter((i) => i.section_id === sec.id && i.visible)
                            .sort((a, b) => a.sort_order - b.sort_order);
                          const subSecs = sections
                            .filter((s) => s.parent_id === sec.id && s.visible)
                            .sort((a, b) => a.sort_order - b.sort_order);
                          return (
                            <div key={sec.id}>
                              {sec.title && (
                                <p
                                  className="mb-1.5 text-[10px] font-bold uppercase tracking-widest opacity-50"
                                  style={{ color: previewTextColor }}
                                >
                                  {sec.title}
                                </p>
                              )}
                              <div className="space-y-1.5">
                                {secItems.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center gap-2 rounded-lg border px-3 py-2"
                                    style={{
                                      borderColor: `${pageFields.theme_color}25`,
                                      backgroundColor: `${pageFields.theme_color}08`,
                                    }}
                                  >
                                    <span className="text-xs">{item.icon_emoji || "🔗"}</span>
                                    <span
                                      className="flex-1 truncate text-xs font-semibold"
                                      style={{ color: previewTextColor }}
                                    >
                                      {item.title ||
                                        urlHostname(normalizeItemUrl(item.url)) ||
                                        "Link"}
                                    </span>
                                  </div>
                                ))}
                                {subSecs.map((sub) => {
                                  const subItems = items
                                    .filter((i) => i.section_id === sub.id && i.visible)
                                    .sort((a, b) => a.sort_order - b.sort_order);
                                  return (
                                    <div key={sub.id} className="ml-2 mt-2">
                                      {sub.title && (
                                        <p
                                          className="mb-1 text-[9px] font-bold uppercase tracking-wider opacity-40"
                                          style={{ color: previewTextColor }}
                                        >
                                          {sub.title}
                                        </p>
                                      )}
                                      {subItems.map((item) => (
                                        <div
                                          key={item.id}
                                          className="flex items-center gap-2 rounded-lg border px-2.5 py-1.5"
                                          style={{
                                            borderColor: `${pageFields.theme_color}15`,
                                            backgroundColor: `${pageFields.theme_color}05`,
                                          }}
                                        >
                                          <span className="text-[10px]">
                                            {item.icon_emoji || "🔗"}
                                          </span>
                                          <span
                                            className="flex-1 truncate text-[10px] font-semibold"
                                            style={{ color: previewTextColor }}
                                          >
                                            {item.title ||
                                              urlHostname(normalizeItemUrl(item.url)) ||
                                              "Link"}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              {previewSvg && (
                <div className="rounded-2xl border border-border bg-background p-4 shadow-card">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Workspace QR Code
                  </h3>
                  <div className="flex flex-col items-center">
                    <img
                      src={svgToDataUrl(previewSvg)}
                      alt="QR Code"
                      className="w-48 rounded-lg border border-border bg-white p-2 sm:w-52"
                    />
                    <p className="mt-2 text-[10px] text-muted-foreground break-all text-center">
                      {publicUrl}
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          void downloadPng(previewSvg, `workspace-${pageFields.slug}.png`)
                        }
                        className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold transition-colors hover:bg-background"
                      >
                        <FileImage className="size-3" /> PNG
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadSvg(previewSvg, `workspace-${pageFields.slug}.svg`)}
                        className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold transition-colors hover:bg-background"
                      >
                        <FileType className="size-3" /> SVG
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          void downloadJpg(previewSvg, `workspace-${pageFields.slug}.jpg`)
                        }
                        className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold transition-colors hover:bg-background"
                      >
                        <FileImage className="size-3" /> JPG
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          void downloadPdf(previewSvg, `workspace-${pageFields.slug}.pdf`)
                        }
                        className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold transition-colors hover:bg-background"
                      >
                        <FileType className="size-3" /> PDF
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SectionBlock({
  section,
  depth,
  allSections,
  items,
  collapsedSections,
  onToggleCollapse,
  onUpdateSection,
  onRequestDelete,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onAddSubSection,
}: {
  section: SectionRow;
  depth: number;
  allSections: SectionRow[];
  items: ItemRow[];
  collapsedSections: Set<string>;
  onToggleCollapse: (id: string) => void;
  onUpdateSection: (id: string, patch: Partial<SectionRow>) => void;
  onRequestDelete: (section: SectionRow) => void;
  onAddItem: (secId: string) => void;
  onUpdateItem: (id: string, patch: Partial<ItemRow>) => void;
  onDeleteItem: (id: string) => void;
  onAddSubSection: (parentId: string) => void;
}) {
  const isCollapsed = collapsedSections.has(section.id);
  const sectionItems = items
    .filter((i) => i.section_id === section.id)
    .sort((a, b) => a.sort_order - b.sort_order);
  const subSections = allSections
    .filter((s) => s.parent_id === section.id)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div
      className={`rounded-2xl border border-border bg-background shadow-card ${
        depth > 0 ? "p-3" : "p-4"
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onToggleCollapse(section.id)}
          className="rounded p-1 text-muted-foreground/50 hover:text-foreground"
        >
          {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
        {depth === 0 ? (
          <GripVertical className="size-4 text-muted-foreground/40" />
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">
            Sub
          </span>
        )}
        <input
          value={section.title}
          onChange={(e) => onUpdateSection(section.id, { title: e.target.value })}
          placeholder={depth === 0 ? "Section title (optional)" : "Sub-section title (optional)"}
          className="flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-muted-foreground/40"
        />
        <button
          type="button"
          onClick={() => onUpdateSection(section.id, { visible: !section.visible })}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-background"
          title={section.visible ? "Hide section" : "Show section"}
        >
          {section.visible ? (
            <Eye className="size-4" />
          ) : (
            <EyeOff className="size-4 text-muted-foreground/40" />
          )}
        </button>
        <button
          type="button"
          onClick={() => onRequestDelete(section)}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          title="Delete section"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div className="mt-3 space-y-2">
            {sectionItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2"
              >
                <input
                  value={item.icon_emoji ?? ""}
                  onChange={(e) => onUpdateItem(item.id, { icon_emoji: e.target.value || null })}
                  placeholder="😀"
                  className="w-10 bg-transparent text-center text-sm outline-none"
                  title="Emoji icon"
                />
                <input
                  value={item.title}
                  onChange={(e) => onUpdateItem(item.id, { title: e.target.value })}
                  placeholder="Link title"
                  className="w-32 bg-transparent text-xs font-semibold outline-none placeholder:text-muted-foreground/40"
                />
                <input
                  value={item.url}
                  onChange={(e) => onUpdateItem(item.id, { url: e.target.value })}
                  placeholder="https://…"
                  className="flex-1 bg-transparent text-xs text-muted-foreground outline-none placeholder:text-muted-foreground/40"
                />
                <button
                  type="button"
                  onClick={() => onUpdateItem(item.id, { visible: !item.visible })}
                  className="rounded p-1 text-muted-foreground/50 hover:text-foreground"
                >
                  {item.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteItem(item.id)}
                  className="rounded p-1 text-muted-foreground/50 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => onAddItem(section.id)}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <Plus className="size-3" /> Add link
            </button>
            {depth === 0 && (
              <button
                type="button"
                onClick={() => onAddSubSection(section.id)}
                className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-brand transition-colors hover:bg-brand-soft"
              >
                <Plus className="size-3" /> Add sub-section
              </button>
            )}
          </div>

          {subSections.length > 0 && (
            <div className="mt-3 ml-4 space-y-3 border-l-2 border-border pl-3">
              {subSections.map((sub) => (
                <SectionBlock
                  key={sub.id}
                  section={sub}
                  depth={depth + 1}
                  allSections={allSections}
                  items={items}
                  collapsedSections={collapsedSections}
                  onToggleCollapse={onToggleCollapse}
                  onUpdateSection={onUpdateSection}
                  onRequestDelete={onRequestDelete}
                  onAddItem={onAddItem}
                  onUpdateItem={onUpdateItem}
                  onDeleteItem={onDeleteItem}
                  onAddSubSection={onAddSubSection}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TemplatePicker({
  onSelect,
  onBlank,
  onClose,
}: {
  onSelect: (t: WorkspaceTemplate) => void;
  onBlank: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl border border-border bg-background p-6 shadow-float"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold">Choose a template</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Pick a starting point, then customize everything.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-background"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {workspaceTemplates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => (t.id === "blank" ? onBlank() : onSelect(t))}
              className="group flex flex-col items-center rounded-xl border border-border p-4 text-center transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-card"
            >
              <span className="text-3xl">{t.preview}</span>
              <h3 className="mt-2 text-sm font-bold">{t.name}</h3>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{t.description}</p>
              <div className="mt-3 flex gap-1" style={{ color: t.theme_color }}>
                <span
                  className="size-3 rounded-full border"
                  style={{ backgroundColor: t.theme_color }}
                />
                <span
                  className="size-3 rounded-full border"
                  style={{ backgroundColor: t.theme_bg }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeletePageConfirm({
  page,
  sectionCount,
  itemCount,
  onClose,
  onConfirm,
}: {
  page: PageRow;
  sectionCount: number;
  itemCount: number;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-float"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-destructive/10">
            <Trash2 className="size-5 text-destructive" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-extrabold">Delete page?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              "<span className="font-semibold text-foreground">{page.title || page.slug}</span>"
              will be permanently removed, including:
            </p>
            <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
              <li>• All sections and links on this page</li>
              {sectionCount > 0 && (
                <li>
                  • {sectionCount} section{sectionCount === 1 ? "" : "s"} and {itemCount} link
                  {itemCount === 1 ? "" : "s"}
                </li>
              )}
              <li>
                • Its public link{" "}
                <span className="font-semibold text-foreground">/p/{page.slug}</span> — it will stop
                working immediately
              </li>
              <li>• All page views and click analytics</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-destructive">
              This cannot be undone. QR codes printed with this link will stop working.
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-5 py-2 text-sm font-bold transition-colors hover:bg-background"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-destructive px-5 py-2 text-sm font-bold text-destructive-foreground transition-transform hover:-translate-y-0.5"
          >
            Delete page
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteSectionConfirm({
  section,
  sections,
  items,
  onClose,
  onConfirm,
}: {
  section: SectionRow;
  sections: SectionRow[];
  items: ItemRow[];
  onClose: () => void;
  onConfirm: () => void;
}) {
  const directItems = items.filter((i) => i.section_id === section.id).length;
  const subs = sections.filter((s) => s.parent_id === section.id);
  const subItems = items.filter((i) => subs.some((s) => s.id === i.section_id)).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-float"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-destructive/10">
            <Trash2 className="size-5 text-destructive" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-extrabold">Delete section?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              "
              <span className="font-semibold text-foreground">
                {section.title || "Untitled section"}
              </span>
              " and everything inside it will be permanently removed:
            </p>
            <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
              <li>
                • {directItems} link{directItems === 1 ? "" : "s"}
              </li>
              {subs.length > 0 && (
                <li>
                  • {subs.length} sub-section{subs.length === 1 ? "" : "s"} with {subItems} link
                  {subItems === 1 ? "" : "s"}
                </li>
              )}
            </ul>
            <p className="mt-2 text-xs font-semibold text-destructive">This cannot be undone.</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-5 py-2 text-sm font-bold transition-colors hover:bg-background"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-destructive px-5 py-2 text-sm font-bold text-destructive-foreground transition-transform hover:-translate-y-0.5"
          >
            Delete section
          </button>
        </div>
      </div>
    </div>
  );
}

function makeSlug() {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  const arr = new Uint8Array(7);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => chars[b % chars.length]).join("");
}

export function normalizeItemUrl(v: string): string {
  const t = v.trim();
  if (!t || t === "https://" || t === "http://") return "";
  if (/^(https?|mailto|tel|sms):/i.test(t)) return t;
  return `https://${t}`;
}
