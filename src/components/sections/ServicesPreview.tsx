import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/data/services";
import { Reveal } from "@/components/ui/Reveal";

/** Homepage services preview — full list lives on /services. */
export function ServicesPreview() {
  const highlighted = SERVICES.filter((s) =>
    ["daily-rentals", "airport-transfers", "chauffeur-service", "concierge-service"].includes(s.slug),
  );

  return (
    <section className="border-y border-border bg-night" aria-labelledby="services-preview">
      <div className="mx-auto max-w-7xl px-5 py-20 md:py-28 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label-caps">Services</p>
            <h2
              id="services-preview"
              className="mt-3 font-display text-4xl font-medium text-foreground md:text-5xl"
            >
              Rentals &amp; Concierge
            </h2>
            <span className="heading-rule mt-5" aria-hidden />
          </div>
          <Link
            to="/services"
            className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gold transition-colors hover:text-gold-soft"
          >
            All Services
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-px border border-border bg-border/50 sm:grid-cols-2 lg:grid-cols-4">
          {highlighted.map((s, i) => (
            <Reveal key={s.id} delay={`${i * 0.08}s`}>
              <Link
                to="/services"
                hash={s.slug}
                className="group block h-full bg-night p-7 transition-colors duration-300 hover:bg-charcoal"
              >
                <s.icon className="size-6 text-gold" aria-hidden />
                <h3 className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-foreground transition-colors group-hover:text-gold">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {s.summary}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
