import { Link } from "@tanstack/react-router";
import { brandAssets, pageAssets } from "@/data/assets";
import { Reveal } from "@/components/ui/Reveal";

/** Homepage brand showcase — original artwork + storefront, links to About. */
export function AboutTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:py-28 lg:px-8" aria-labelledby="about-teaser">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal scale className="relative">
          <div className="border border-border p-2">
            <img
              src={brandAssets.heroArtwork}
              alt="Tokyo Rentals & Concierge brand artwork featuring the signature Porsche Macan"
              loading="lazy"
              width={1536}
              height={1024}
              className="w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -right-2 hidden w-56 border border-gold/40 bg-night p-2 shadow-2xl shadow-black/60 md:block">
            <img
              src={pageAssets.storefront}
              alt="Tokyo Rentals & Concierge office storefront in The Gambia"
              loading="lazy"
              width={765}
              height={1020}
              className="h-40 w-full object-cover object-top"
            />
          </div>
        </Reveal>

        <Reveal delay="0.15s">
          <p className="label-caps">About Tokyo Rentals</p>
          <h2
            id="about-teaser"
            className="mt-3 font-display text-4xl font-medium leading-tight text-foreground md:text-5xl"
          >
            A Rental Company Built on Trust
          </h2>
          <span className="heading-rule mt-6" aria-hidden />
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground md:text-base">
            Based in Banjul, Tokyo Rentals &amp; Concierge pairs a carefully
            maintained fleet with genuine local hospitality. From airport
            pickups to long-term arrangements, every rental is handled
            personally — clean car, clear terms, and support around the clock.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            Whether you need an economy runabout, an executive sedan or a
            luxury SUV for a special occasion, you deal with people who know
            the vehicles and know The Gambia.
          </p>
          <div className="mt-8">
            <Link to="/about" className="btn-outline">
              Our Story
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
