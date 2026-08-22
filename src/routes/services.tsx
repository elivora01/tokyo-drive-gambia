import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CtaSection } from "@/components/sections/CtaSection";
import { SERVICES } from "@/data/services";
import { pageAssets } from "@/data/assets";
import { serviceEnquiryUrl } from "@/lib/whatsapp";
import { Reveal } from "@/components/ui/Reveal";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services | Tokyo Rentals & Concierge" },
      {
        name: "description",
        content:
          "Daily, weekly and long-term car rental in The Gambia, plus airport transfers, chauffeur service, corporate transportation and concierge assistance from Tokyo Rentals & Concierge.",
      },
      { property: "og:title", content: "Services | Tokyo Rentals & Concierge" },
      {
        property: "og:description",
        content:
          "Car rental, airport transfers, chauffeur service, corporate transport and concierge assistance across The Gambia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHero
        label="What We Do"
        title="Rentals & Concierge Services"
        copy="More than keys and a handshake — every service is delivered personally, with local knowledge and 24/7 support."
      />

      {/* Intro split */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:py-20 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <p className="label-caps">Our Approach</p>
          <h2 className="mt-3 font-display text-3xl font-medium leading-tight text-foreground md:text-4xl">
            One Team for Your Whole Journey
          </h2>
          <span className="heading-rule mt-5" aria-hidden />
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground md:text-base">
            From the moment you land at Banjul International Airport to the day
            you fly home, Tokyo Rentals &amp; Concierge can handle the driving.
            Hire a vehicle and take the wheel yourself, or sit back with a
            professional chauffeur — either way you get a prepared car, clear
            terms and a team that answers around the clock.
          </p>
          <div className="mt-8">
            <Link to="/fleet" className="btn-outline">
              Browse the Fleet
            </Link>
          </div>
        </Reveal>
        <Reveal scale delay="0.15s" className="border border-border p-2">
          <img
            src={pageAssets.showroom}
            alt="Premium vehicles prepared and presented for rental"
            loading="lazy"
            width={736}
            height={981}
            className="aspect-[4/5] w-full object-cover md:aspect-[5/4]"
          />
        </Reveal>
      </section>

      {/* Services grid */}
      <section className="border-t border-border bg-night" aria-label="All services">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-20 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.id} delay={`${(i % 3) * 0.1}s`} scale>
                <article
                  id={s.slug}
                  className="lux-card group flex h-full scroll-mt-28 flex-col p-7"
                >
                  <s.icon
                    className="size-7 text-gold transition-transform duration-300 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                  <h3 className="mt-5 font-display text-2xl font-medium text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {s.summary}
                  </p>
                  <ul className="mt-5 space-y-2.5 border-t border-border pt-5">
                    {s.details.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm text-foreground/80">
                        <Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={serviceEnquiryUrl(s.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 pt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gold transition-colors hover:text-gold-soft"
                  >
                    <MessageCircle className="size-4" aria-hidden />
                    Enquire via WhatsApp
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                  </a>
                </article>
              </Reveal>
            ))}

            {/* Fleet cross-sell card */}
            <Reveal delay="0.2s" scale>
              <Link
                to="/fleet"
                className="group flex h-full flex-col justify-between border border-gold/40 bg-gradient-to-br from-charcoal to-night p-7 transition-colors hover:border-gold"
              >
                <div>
                  <p className="label-caps">The Fleet</p>
                  <h3 className="mt-5 font-display text-2xl font-medium text-foreground">
                    Find the Car That Fits
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Economy runabouts to luxury SUVs — every service above starts
                    with the right vehicle.
                  </p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                  View the Fleet
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
