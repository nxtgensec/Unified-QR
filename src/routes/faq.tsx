import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Frequently Asked Questions | UnifiedQR" },
      {
        name: "description",
        content:
          "Answers to common questions about UnifiedQR: are QR Codes free, what is a dynamic QR Code, can I add a logo, do scans have limits and more.",
      },
      { property: "og:title", content: "FAQ — Frequently Asked Questions | UnifiedQR" },
      {
        property: "og:description",
        content:
          "Get answers to the most common questions about QR Codes, plans and UnifiedQR features.",
      },
      { property: "og:url", content: "https://qr.nxtgensec.org/faq" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "canonical", href: "https://qr.nxtgensec.org/faq" },
      { rel: "alternate", hreflang: "en", href: "https://qr.nxtgensec.org/faq" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Are the QR Codes free forever?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Every static QR Code you create on UnifiedQR is free, has no expiry date and no scan limit.",
              },
            },
            {
              "@type": "Question",
              name: "What is the difference between static and dynamic QR Codes?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "A static QR Code stores the data directly inside the code. A dynamic QR Code points to a short link you control — you can change the destination later without reprinting.",
              },
            },
            {
              "@type": "Question",
              name: "Can I add my logo to a QR Code?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Pick a template, adjust your colours, and upload your logo in the customisation panel.",
              },
            },
            {
              "@type": "Question",
              name: "Is there a scan limit?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Static QR Codes have no scan limit. Dynamic QR Codes included in paid plans also have no scan limit.",
              },
            },
            {
              "@type": "Question",
              name: "Do I need to sign up?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. You can generate and download static QR Codes without an account. Signing up unlocks dynamic codes, analytics and saved designs.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: Faq,
});

const faqData = [
  {
    q: "Are the QR Codes free?",
    a: "Yes. Static QR Codes are completely free with no expiry and no scan limit. Dynamic QR Codes are available on paid plans starting from ₹9.",
  },
  {
    q: "What is the difference between static and dynamic QR Codes?",
    a: "A static QR Code encodes the destination URL directly into the code. A dynamic QR Code points to a short link managed by UnifiedQR — you can update the destination anytime without reprinting.",
  },
  {
    q: "Can I add my logo to a QR Code?",
    a: "Yes. Open the customisation panel, pick a template, set your colours, and upload a logo. The logo appears in the centre of the QR Code.",
  },
  {
    q: "Is there a scan limit?",
    a: "No. Both static and dynamic QR Codes have unlimited scans. Dynamic codes are part of the paid plans.",
  },
  {
    q: "Do I need to sign up to create a QR Code?",
    a: "No. You can generate and download static QR Codes without creating an account. Signing up is only required if you want dynamic codes, analytics or saved designs.",
  },
  {
    q: "What formats can I download in?",
    a: "You can download QR Codes as PNG, SVG, JPG, WebP or PDF. SVG is recommended for print, while PNG is best for screens and social media.",
  },
  {
    q: "Can I change the destination of a QR Code after printing?",
    a: "Yes, but only for dynamic QR Codes. If you print a static QR Code, the destination is fixed. Dynamic codes let you change the target URL at any time.",
  },
  {
    q: "How do I track scans?",
    a: "Save your QR Code as a dynamic code. Analytics include total scans, today/yesterday counts, device breakdown, referrers and peak hours.",
  },
  {
    q: "What file format is best for printing?",
    a: "SVG for high-resolution professional printing. PDF for vector documents. PNG at 300 DPI for most print use cases.",
  },
  {
    q: "Can I use UnifiedQR for my business?",
    a: "Absolutely. UnifiedQR is used by businesses of all sizes for menus, posters, business cards, product packaging, marketing campaigns and more.",
  },
];

function Faq() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
          Frequently asked questions
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Everything you need to know about UnifiedQR and QR Codes.
        </p>
      </section>

      <section className="mt-12">
        <Accordion type="single" collapsible>
          {faqData.map((item, i) => (
            <AccordionItem key={i} value={String(i)}>
              <AccordionTrigger className="text-left text-base font-bold">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
