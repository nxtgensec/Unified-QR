import { createFileRoute, redirect } from "@tanstack/react-router";
import { resolveDynamicLink } from "@/lib/dynamicLink.functions";

export const Route = createFileRoute("/r/$slug")({
  head: () => ({
    meta: [
      { title: "Redirecting… — UnifiedQR" },
      { name: "description", content: "Taking you to the destination of this UnifiedQR code." },
      { property: "og:title", content: "Redirecting — UnifiedQR" },
      { property: "og:description", content: "UnifiedQR dynamic short link." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: async ({ params }) => {
    const result = await resolveDynamicLink({ data: { slug: params.slug } });
    if ("destination" in result) {
      throw redirect({ href: result.destination, statusCode: 307 });
    }
    return result;
  },
  component: RedirectPage,
});

function RedirectPage() {
  const data = Route.useLoaderData();
  return (
    <div className="grid min-h-[50vh] place-items-center px-4 text-center">
      <p className="text-sm text-muted-foreground">
        {data.error ?? "This link is inactive or does not exist."}
      </p>
    </div>
  );
}
