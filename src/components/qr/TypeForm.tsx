import type { QrFormState, QrType } from "@/lib/qr";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

type Props = {
  type: QrType;
  form: QrFormState;
  setForm: (updater: (prev: QrFormState) => QrFormState) => void;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

const inputClass = "h-12 rounded-xl border-border bg-background text-base";

export function TypeForm({ type, form, setForm }: Props) {
  switch (type) {
    case "url":
      return (
        <Input
          className={inputClass}
          placeholder="Try something like https://example.com/"
          value={form.url}
          onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
        />
      );

    case "pdf":
      return (
        <Field label="Link to your PDF">
          <Input
            className={inputClass}
            placeholder="https://example.com/menu.pdf"
            value={form.pdfUrl}
            onChange={(e) => setForm((p) => ({ ...p, pdfUrl: e.target.value }))}
          />
        </Field>
      );

    case "multi-url":
      return (
        <div className="space-y-2">
          {form.multiUrls.map((u, i) => (
            <div key={i} className="flex gap-2">
              <Input
                className={inputClass}
                placeholder={`Link ${i + 1}`}
                value={u}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    multiUrls: p.multiUrls.map((v, idx) => (idx === i ? e.target.value : v)),
                  }))
                }
              />
              {form.multiUrls.length > 1 && (
                <button
                  type="button"
                  aria-label="Remove link"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      multiUrls: p.multiUrls.filter((_, idx) => idx !== i),
                    }))
                  }
                  className="grid size-12 shrink-0 place-items-center rounded-xl border border-border text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, multiUrls: [...p.multiUrls, ""] }))}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
          >
            <Plus className="size-4" /> Add another link
          </button>
        </div>
      );

    case "contact":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="First name">
            <Input
              className={inputClass}
              value={form.contact.firstName}
              onChange={(e) =>
                setForm((p) => ({ ...p, contact: { ...p.contact, firstName: e.target.value } }))
              }
            />
          </Field>
          <Field label="Last name">
            <Input
              className={inputClass}
              value={form.contact.lastName}
              onChange={(e) =>
                setForm((p) => ({ ...p, contact: { ...p.contact, lastName: e.target.value } }))
              }
            />
          </Field>
          <Field label="Phone">
            <Input
              className={inputClass}
              value={form.contact.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, contact: { ...p.contact, phone: e.target.value } }))
              }
            />
          </Field>
          <Field label="Email">
            <Input
              className={inputClass}
              value={form.contact.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, contact: { ...p.contact, email: e.target.value } }))
              }
            />
          </Field>
          <Field label="Company">
            <Input
              className={inputClass}
              value={form.contact.company}
              onChange={(e) =>
                setForm((p) => ({ ...p, contact: { ...p.contact, company: e.target.value } }))
              }
            />
          </Field>
          <Field label="Website">
            <Input
              className={inputClass}
              value={form.contact.website}
              onChange={(e) =>
                setForm((p) => ({ ...p, contact: { ...p.contact, website: e.target.value } }))
              }
            />
          </Field>
        </div>
      );

    case "text":
      return (
        <Textarea
          rows={4}
          className="rounded-xl border-border text-base"
          placeholder="Type the message you want to show after the scan"
          value={form.text}
          onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
        />
      );

    case "app":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="App Store link">
            <Input
              className={inputClass}
              placeholder="https://apps.apple.com/..."
              value={form.app.ios}
              onChange={(e) => setForm((p) => ({ ...p, app: { ...p.app, ios: e.target.value } }))}
            />
          </Field>
          <Field label="Google Play link">
            <Input
              className={inputClass}
              placeholder="https://play.google.com/..."
              value={form.app.android}
              onChange={(e) =>
                setForm((p) => ({ ...p, app: { ...p.app, android: e.target.value } }))
              }
            />
          </Field>
        </div>
      );

    case "sms":
      return (
        <div className="space-y-3">
          <Field label="Phone number">
            <Input
              className={inputClass}
              placeholder="+1 555 000 1234"
              value={form.sms.number}
              onChange={(e) => setForm((p) => ({ ...p, sms: { ...p.sms, number: e.target.value } }))}
            />
          </Field>
          <Field label="Message">
            <Textarea
              rows={3}
              className="rounded-xl border-border text-base"
              value={form.sms.message}
              onChange={(e) =>
                setForm((p) => ({ ...p, sms: { ...p.sms, message: e.target.value } }))
              }
            />
          </Field>
        </div>
      );

    case "email":
      return (
        <div className="space-y-3">
          <Field label="Send to">
            <Input
              className={inputClass}
              placeholder="hello@example.com"
              value={form.email.to}
              onChange={(e) => setForm((p) => ({ ...p, email: { ...p.email, to: e.target.value } }))}
            />
          </Field>
          <Field label="Subject">
            <Input
              className={inputClass}
              value={form.email.subject}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: { ...p.email, subject: e.target.value } }))
              }
            />
          </Field>
          <Field label="Message">
            <Textarea
              rows={3}
              className="rounded-xl border-border text-base"
              value={form.email.body}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: { ...p.email, body: e.target.value } }))
              }
            />
          </Field>
        </div>
      );

    case "phone":
      return (
        <Field label="Phone number">
          <Input
            className={inputClass}
            placeholder="+1 555 000 1234"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
        </Field>
      );

    case "social":
      return (
        <div className="space-y-3">
          <Field label="Instagram">
            <Input
              className={inputClass}
              placeholder="https://instagram.com/yourbrand"
              value={form.social.instagram}
              onChange={(e) =>
                setForm((p) => ({ ...p, social: { ...p.social, instagram: e.target.value } }))
              }
            />
          </Field>
          <Field label="YouTube">
            <Input
              className={inputClass}
              placeholder="https://youtube.com/@yourbrand"
              value={form.social.youtube}
              onChange={(e) =>
                setForm((p) => ({ ...p, social: { ...p.social, youtube: e.target.value } }))
              }
            />
          </Field>
          <Field label="X (Twitter)">
            <Input
              className={inputClass}
              placeholder="https://x.com/yourbrand"
              value={form.social.x}
              onChange={(e) =>
                setForm((p) => ({ ...p, social: { ...p.social, x: e.target.value } }))
              }
            />
          </Field>
        </div>
      );

    default:
      return null;
  }
}
