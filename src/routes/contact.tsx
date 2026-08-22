import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Clock, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { siteConfig } from "@/data/site";
import { contactMessage, GENERAL_ENQUIRY_URL, waUrl } from "@/lib/whatsapp";
import { Reveal } from "@/components/ui/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | Tokyo Rentals & Concierge" },
      {
        name: "description",
        content:
          "Contact Tokyo Rentals & Concierge in Banjul, The Gambia. Call +220 780 0015, message us on WhatsApp, or send an enquiry — 24/7 customer support, 7 days a week.",
      },
      { property: "og:title", content: "Contact Us | Tokyo Rentals & Concierge" },
      {
        property: "og:description",
        content:
          "Call, WhatsApp or send an enquiry — Tokyo Rentals & Concierge, Banjul, The Gambia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long")
    .regex(/^$|^[+\d][\d\s().-]*$/, "Please enter a valid phone number"),
  message: z.string().trim().min(10, "Please tell us a little more").max(1000, "Please keep your message under 1000 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const CONTACT_CARDS = [
  {
    icon: Phone,
    title: "Call Us",
    value: siteConfig.phoneDisplay,
    sub: "Speak directly with our team",
    href: siteConfig.phoneHref,
    cta: "Call Now",
    external: false,
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: siteConfig.phoneDisplay,
    sub: "Fastest response — day or night",
    href: GENERAL_ENQUIRY_URL,
    cta: "Chat on WhatsApp",
    external: true,
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: siteConfig.location,
    sub: "Office visits by appointment",
    href: siteConfig.mapsLink,
    cta: "Open in Maps",
    external: true,
  },
  {
    icon: Clock,
    title: "Business Hours",
    value: siteConfig.hoursLabel,
    sub: siteConfig.hoursDetail,
    href: undefined,
    cta: undefined,
    external: false,
  },
];

function ContactPage() {
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const set =
    (key: keyof ContactForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((er) => ({ ...er, [key]: undefined }));
      setSentUrl(null);
    };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const next: Partial<Record<keyof ContactForm, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactForm;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    const url = waUrl(contactMessage(parsed.data));
    window.open(url, "_blank", "noopener,noreferrer");
    setSentUrl(url);
  };

  return (
    <>
      <PageHero
        label="Contact"
        title="Talk to a Real Person"
        copy="Call, WhatsApp or send a message — our team in Banjul responds around the clock."
      />

      {/* Contact cards */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8" aria-label="Contact options">
        <div className="grid gap-px border border-border bg-border/50 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_CARDS.map((c, i) => (
            <Reveal key={c.title} delay={`${i * 0.08}s`} className="flex flex-col bg-night p-7">
              <c.icon className="size-6 text-gold" aria-hidden />
              <h2 className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                {c.title}
              </h2>
              <p className="mt-2 text-lg font-semibold text-foreground">{c.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.sub}</p>
              {c.href && c.cta && (
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="mt-auto inline-flex items-center gap-2 pt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold transition-colors hover:text-gold-soft"
                >
                  {c.cta}
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* Form + map */}
      <section className="border-t border-border bg-night" aria-label="Send a message and find us">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:py-20 lg:grid-cols-2 lg:px-8">
          <form onSubmit={onSubmit} noValidate className="border border-border bg-card p-6 md:p-8">
            <p className="label-caps">Send a Message</p>
            <h2 className="mt-3 font-display text-3xl font-medium text-foreground">
              We Reply Fast
            </h2>

            <div className="mt-7 grid gap-5">
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/80">
                  Full Name
                </label>
                <input id="contact-name" type="text" value={form.name} onChange={set("name")} placeholder="Your name" autoComplete="name" className="input-dark" />
                {errors.name && <p className="mt-2 text-xs font-medium text-destructive" role="alert">{errors.name}</p>}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/80">
                    Email Address
                  </label>
                  <input id="contact-email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email" className="input-dark" />
                  {errors.email && <p className="mt-2 text-xs font-medium text-destructive" role="alert">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="contact-phone" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/80">
                    Phone (optional)
                  </label>
                  <input id="contact-phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+220 …" autoComplete="tel" className="input-dark" />
                  {errors.phone && <p className="mt-2 text-xs font-medium text-destructive" role="alert">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/80">
                  Message
                </label>
                <textarea id="contact-message" value={form.message} onChange={set("message")} rows={5} placeholder="How can we help?" className="input-dark resize-none" />
                {errors.message && <p className="mt-2 text-xs font-medium text-destructive" role="alert">{errors.message}</p>}
              </div>
            </div>

            <button type="submit" className="btn-gold mt-7 w-full sm:w-auto">
              <Send className="size-4" aria-hidden />
              Send via WhatsApp
            </button>

            {sentUrl && (
              <p className="mt-4 border border-gold/40 bg-night px-4 py-3 text-sm text-foreground/85" role="status">
                WhatsApp should now be open with your message.{" "}
                <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold underline underline-offset-4">
                  Tap here if it didn't open.
                </a>
              </p>
            )}
          </form>

          <div className="flex flex-col">
            <div className="border border-border p-2">
              <iframe
                title="Map — Tokyo Rentals & Concierge, Banjul, The Gambia"
                src={siteConfig.mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[420px] w-full"
                allowFullScreen
              />
            </div>
            <div className="mt-4 flex items-start gap-3 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              <p>
                {siteConfig.name} — {siteConfig.location}. Pickup and return by
                arrangement; delivery available on request.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
