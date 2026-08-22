import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { getFeaturedVehicles } from "@/data/vehicles";
import { VehicleCard } from "@/components/fleet/VehicleCard";
import { Reveal } from "@/components/ui/Reveal";

export function FeaturedFleet() {
  const featured = getFeaturedVehicles();

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:py-28 lg:px-8" aria-labelledby="featured-fleet">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-caps">Featured Fleet</p>
          <h2
            id="featured-fleet"
            className="mt-3 font-display text-4xl font-medium text-foreground md:text-5xl"
          >
            Signature Vehicles
          </h2>
          <span className="heading-rule mt-5" aria-hidden />
        </div>
        <Link
          to="/fleet"
          className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gold transition-colors hover:text-gold-soft"
        >
          View Full Fleet
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((v, i) => (
          <Reveal key={v.id} delay={`${i * 0.1}s`} scale>
            <VehicleCard vehicle={v} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
