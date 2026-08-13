import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, BetaNotice } from "@/components/app/AppShell";
import { FileSpreadsheet, Layers, FolderTree, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/bulk")({
  head: () => ({
    meta: [
      { title: "Bulk & Campaigns (Beta) — UnifiedQR Workspace" },
      {
        name: "description",
        content:
          "Preview of bulk QR generation, CSV import, campaign folders and branded frames in UnifiedQR.",
      },
      { property: "og:title", content: "Bulk & Campaigns (Beta) — UnifiedQR" },
      { property: "og:description", content: "CSV bulk generation and campaign grouping preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BulkPage,
});

function BulkPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        title="Bulk & campaigns"
        beta
        description="Generate hundreds of codes from a spreadsheet and group them into trackable campaigns."
      />
      <BetaNotice>
        Not connected yet. Create codes one at a time from “Create QR Code” in the meantime.
      </BetaNotice>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card icon={<FileSpreadsheet className="size-4" />} title="CSV import">
          Upload a spreadsheet of destinations and generate one dynamic code per row.
        </Card>
        <Card icon={<Layers className="size-4" />} title="Campaigns">
          Group codes by launch, print run or store location and compare their performance.
        </Card>
        <Card icon={<FolderTree className="size-4" />} title="Folders & tags">
          Organise a growing library with nested folders, tags and search.
        </Card>
        <Card icon={<ImageIcon className="size-4" />} title="Branded frames">
          Centre logos, “Scan me” captions and JPG / PDF print exports applied across a batch.
        </Card>
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <p className="font-semibold">Drop a CSV here</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload will be enabled when bulk generation leaves beta.
        </p>
        <button
          type="button"
          disabled
          className="mt-5 cursor-not-allowed rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground opacity-50"
        >
          Choose file
        </button>
      </div>
    </div>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center gap-2">
        <span className="text-brand">{icon}</span>
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{children}</p>
    </div>
  );
}
