import { Link } from "@tanstack/react-router";
import { MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/data/site";
import { GENERAL_ENQUIRY_URL } from "@/lib/whatsapp";
import { Reveal } from "@/components/ui/Reveal";

export function CtaSection() {
  return (
    <section className="border-t border-border bg-night" aria-labelledby="cta">
      <div className="mx-auto max-w-7xl px-5 py-20 text-center md:py-24 lg:px-8">
        <Reveal>
          <p className="label-caps">Ready When You Are</p>
          <h2
            id="cta"
            className="mx-auto mt-4 max-w-2xl font-display text-4xl font-medium leading-tight text-foreground md:text-5xl"
          >
            Your Car Is One Message Away
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Choose your vehicle, pick your dates and confirm through WhatsApp —
            a real person replies, every time.
          </p>
        </Reveal>
        <Reveal delay="0.15s">
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/book" className="btn-gold">
              Book a Car
            </Link>
            <a
              href={GENERAL_ENQUIRY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <MessageCircle className="size-4" aria-hidden />
              WhatsApp Us
            </a>
            <a href={siteConfig.phoneHref} className="btn-outline">
              <Phone className="size-4" aria-hidden />
              {siteConfig.phoneDisplay}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
