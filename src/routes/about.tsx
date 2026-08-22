import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CtaSection } from "@/components/sections/CtaSection";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { ABOUT_VALUES } from "@/data/content";
import { pageAssets } from "@/data/assets";
import { siteConfig } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | Tokyo Rentals & Concierge" },
      {
        name: "description",
        content:
          "Tokyo Rentals & Concierge is a car rental and concierge company based in Banjul, The Gambia — clean, maintained vehicles, professional service and genuine local knowledge.",
      },
      { property: "og:title", content: "About Us | Tokyo Rentals & Concierge" },
      {
        property: "og:description",
        content:
          "Clean, maintained vehicles and professional, personal service — based in Banjul, serving all of The Gambia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        label="About Us"
        title="Drive With Confidence. Travel With Class."
        copy="Tokyo Rentals & Concierge is a car rental and concierge company based in Banjul, The Gambia."
      />

      {/* Story */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:py-24 lg:grid-cols-2 lg:px-8">
        <Reveal className="order-2 lg:order-1">
          <p className="label-caps">Who We Are</p>
          <h2 className="mt-3 font-display text-3xl font-medium leading-tight text-foreground md:text-4xl">
            A Local Company With a Luxury Standard
          </h2>
          <span className="heading-rule mt-5" aria-hidden />
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            <p>
              Tokyo Rentals &amp; Concierge was built on a simple idea: renting
              a car in The Gambia should feel effortless. You choose a vehicle,
              message us on WhatsApp, and a clean, inspected, fuelled car is
              ready when and where you need it.
            </p>
            <p>
              Our fleet runs from dependable economy cars to luxury SUVs, and
              every one of them is maintained to the same standard. Behind the
              vehicles is a local team that knows the roads, the airports, the
              hotels and the hidden corners of the country — and treats every
              customer like a guest.
            </p>
            <p>
              Whether you're visiting for a weekend, settling in for a season,
              or organising transport for a company or celebration, you deal
              directly with people who answer the phone.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/fleet" className="btn-gold">
              Browse Our Fleet
            </Link>
            <Link to="/contact" className="btn-outline">
              Get in Touch
            </Link>
          </div>
        </Reveal>
        <Reveal scale delay="0.15s" className="order-1 lg:order-2">
          <div className="border border-border p-2">
            <img
              src={pageAssets.storefront}
              alt="Tokyo Rentals & Concierge office storefront in The Gambia"
              loading="lazy"
              width={765}
              height={1020}
              className="aspect-[4/5] w-full object-cover object-top"
            />
          </div>
          <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Our office — {siteConfig.location}
          </p>
        </Reveal>
      </section>

      {/* Values */}
      <section className="border-y border-border bg-night" aria-labelledby="values">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:py-24 lg:grid-cols-2 lg:px-8">
          <Reveal scale className="border border-border p-2">
            <img
              src={pageAssets.premises}
              alt="Tokyo Rentals & Concierge premises with vehicles ready for rental"
              loading="lazy"
              width={765}
              height={1020}
              className="aspect-[4/5] w-full object-cover md:aspect-[4/4.4]"
            />
          </Reveal>
          <Reveal delay="0.15s">
            <p className="label-caps">What We Stand For</p>
            <h2 id="values" className="mt-3 font-display text-3xl font-medium leading-tight text-foreground md:text-4xl">
              The Promises Behind Every Key Handover
            </h2>
            <span className="heading-rule mt-5" aria-hidden />
            <ul className="mt-8 space-y-4">
              {ABOUT_VALUES.map((v) => (
                <li key={v} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/85 md:text-base">
                  <Check className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden />
                  {v}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <WhyChooseUs />
      <CtaSection />
    </>
  );
}
