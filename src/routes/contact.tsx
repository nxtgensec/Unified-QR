import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact UnifiedQR — Talk to the QR Code Team" },
      {
        name: "description",
        content:
          "Questions about QR Codes, plans or enterprise campaigns? Send the UnifiedQR team a message and we'll reply within one business day.",
      },
      { property: "og:title", content: "Contact UnifiedQR — Talk to the QR Code Team" },
      {
        property: "og:description",
        content: "Reach the UnifiedQR team about pricing, dynamic QR Codes or enterprise support.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  type Errors = { name?: string; email?: string; message?: string };
  const [errors, setErrors] = useState<Errors>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Enter a valid email address";
    if (values.message.trim().length < 10) next.message = "Tell us a little more (10+ characters)";
    setErrors(next);
    if (Object.keys(next).length) return;
    toast.success("Message sent", { description: "We'll get back to you within one business day." });
    setValues({ name: "", email: "", message: "" });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Contact us</h1>
      <p className="mt-3 text-muted-foreground">
        Questions about plans, dynamic QR Codes or a large campaign? Send us a message.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Name</label>
          <Input
            className="h-12 rounded-xl"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Email</label>
          <Input
            className="h-12 rounded-xl"
            type="email"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Message
          </label>
          <Textarea
            rows={5}
            className="rounded-xl"
            value={values.message}
            onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          />
          {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
        </div>
        <button
          type="submit"
          className="rounded-full bg-brand px-7 py-3 text-sm font-bold text-brand-foreground shadow-card"
        >
          Send message
        </button>
      </form>
    </div>
  );
}
