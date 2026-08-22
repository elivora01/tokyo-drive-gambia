import { Link } from "@tanstack/react-router";
import { Cog, Fuel, Snowflake, Users } from "lucide-react";
import { formatPrice, type Vehicle } from "@/data/vehicles";
import { vehicleEnquiryUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function AvailabilityBadge({
  availability,
  className,
}: {
  availability: Vehicle["availability"];
  className?: string;
}) {
  const available = availability === "available";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]",
        available
          ? "border-gold/40 bg-night/80 text-gold"
          : "border-destructive/50 bg-night/80 text-destructive",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          available ? "bg-gold" : "bg-destructive",
        )}
        aria-hidden
      />
      {available ? "Available" : "Currently Booked"}
    </span>
  );
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const available = vehicle.availability === "available";

  return (
    <article className="lux-card card-shine group flex h-full flex-col overflow-hidden transition-all duration-500 hover:border-gold/50 hover:shadow-xl hover:shadow-black/60">
      <Link
        to="/fleet/$slug"
        params={{ slug: vehicle.slug }}
        className="relative block aspect-[4/3] overflow-hidden"
        aria-label={`View details of the ${vehicle.name}`}
      >
        <img
          src={vehicle.thumbnail}
          alt={`${vehicle.name} — ${vehicle.category} rental vehicle`}
          loading="lazy"
          width={765}
          height={574}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent opacity-70"
          aria-hidden
        />
        <AvailabilityBadge
          availability={vehicle.availability}
          className="absolute top-3 left-3"
        />
        {vehicle.featured && (
          <span className="absolute top-3 right-3 bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground">
            Featured
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
              {vehicle.category}
            </p>
            <h3 className="mt-1 font-display text-2xl font-medium text-foreground">
              <Link
                to="/fleet/$slug"
                params={{ slug: vehicle.slug }}
                className="transition-colors hover:text-gold"
              >
                {vehicle.name}
              </Link>
            </h3>
          </div>
          <p className="shrink-0 text-right">
            <span className="text-xl font-bold text-gold">
              {formatPrice(vehicle)}
            </span>
            <span className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              per day
            </span>
          </p>
        </div>

        <ul className="mt-4 grid grid-cols-4 gap-2 border-y border-border py-3 text-[11px] text-muted-foreground">
          <li className="flex flex-col items-center gap-1 text-center">
            <Users className="size-4 text-gold/80" aria-hidden />
            {vehicle.seats} Seats
          </li>
          <li className="flex flex-col items-center gap-1 text-center">
            <Cog className="size-4 text-gold/80" aria-hidden />
            {vehicle.transmission}
          </li>
          <li className="flex flex-col items-center gap-1 text-center">
            <Fuel className="size-4 text-gold/80" aria-hidden />
            {vehicle.fuel}
          </li>
          <li className="flex flex-col items-center gap-1 text-center">
            <Snowflake className="size-4 text-gold/80" aria-hidden />
            {vehicle.airConditioning ? "A/C" : "No A/C"}
          </li>
        </ul>

        <div className="mt-auto flex gap-2 pt-5">
          <Link
            to="/fleet/$slug"
            params={{ slug: vehicle.slug }}
            className="btn-outline flex-1 !px-3 !py-2.5 text-[10px]"
          >
            View Details
          </Link>
          {available ? (
            <Link
              to="/book"
              search={{ vehicle: vehicle.slug }}
              className="btn-gold flex-1 !px-3 !py-2.5 text-[10px]"
            >
              Book Now
            </Link>
          ) : (
            <a
              href={vehicleEnquiryUrl(vehicle.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp flex-1 !px-3 !py-2.5 text-[10px]"
            >
              Enquire
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
