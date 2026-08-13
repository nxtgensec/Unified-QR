import { createFileRoute } from "@tanstack/react-router";
import { QrWidget } from "@/components/qr/QrWidget";
import { PageHeader } from "@/components/app/AppShell";

export const Route = createFileRoute("/_authenticated/create")({
  head: () => ({
    meta: [
      { title: "Create a QR Code — UnifiedQR Workspace" },
      {
        name: "description",
        content:
          "Build a static or dynamic QR Code, style it and save it straight into your UnifiedQR workspace.",
      },
      { property: "og:title", content: "Create a QR Code — UnifiedQR" },
      {
        property: "og:description",
        content: "Build, style and save QR Codes inside your workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreatePage,
});

function CreatePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        title="Create a QR Code"
        description="Pick a type, style it, then save it to your workspace as a static code or a dynamic, trackable short link."
      />
      <div className="mt-8">
        <QrWidget />
      </div>
    </div>
  );
}
