import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarCheck,
  Cog,
  DoorOpen,
  Fuel,
  MessageCircle,
  Snowflake,
  Users,
} from "lucide-react";
import {
  getRelatedVehicles,
  getVehicleBySlug,
} from "@/data/vehicles";
import { siteConfig } from "@/data/site";
import { vehicleEnquiryUrl } from "@/lib/whatsapp";
import { AvailabilityBadge, VehicleCard } from "@/components/fleet/VehicleCard";
import { useCurrency } from "@/components/site/CurrencyProvider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/fleet/$slug")({
  head: ({ params }) => {
    const v = getVehicleBySlug(params.slug);
    const title = v
      ? `${v.name} Rental | Tokyo Rentals & Concierge`
      : "Vehicle | Tokyo Rentals & Concierge";
    const description = v
      ? `Rent the ${v.name} in The Gambia — ${v.category} class, $${v.pricePerDay}/day, ${v.seats} seats, ${v.transmission.toLowerCase()}. Book in minutes via WhatsApp with Tokyo Rentals & Concierge.`
      : "Vehicle rental in The Gambia with Tokyo Rentals & Concierge.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: VehicleDetailPage,
  notFoundComponent: VehicleNotFound,
});

function VehicleNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-20">
      <div className="max-w-md text-center">
        <p className="label-caps">Fleet</p>
        <h1 className="mt-4 font-display text-4xl text-foreground">
          Vehicle not found
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This vehicle may have moved or been removed from the fleet.
        </p>
        <Link to="/fleet" className="btn-gold mt-8">
          Browse the Fleet
        </Link>
      </div>
    </div>
  );
}

function VehicleDetailPage() {
  const { slug } = Route.useParams();
  const vehicle = getVehicleBySlug(slug);
  const [imageIndex, setImageIndex] = useState(0);
  const { format } = useCurrency();

  if (!vehicle) throw notFound();

  const available = vehicle.availability === "available";
  const related = getRelatedVehicles(vehicle);
  const mainImage = vehicle.images[imageIndex] ?? vehicle.thumbnail;

  const specs = [
    { icon: Users, label: "Seats", value: String(vehicle.seats) },
    { icon: DoorOpen, label: "Doors", value: String(vehicle.doors) },
    { icon: Cog, label: "Transmission", value: vehicle.transmission },
    { icon: Fuel, label: "Fuel", value: vehicle.fuel },
    {
      icon: Snowflake,
      label: "Air Conditioning",
      value: vehicle.airConditioning ? "Yes" : "No",
    },
    { icon: BadgeCheck, label: "Category", value: vehicle.category },
  ];

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pt-28 pb-16 md:pt-36 lg:px-8">
        <Link
          to="/fleet"
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-gold"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Fleet
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* Gallery */}
          <div>
            <div className="overflow-hidden border border-border">
              <img
                key={mainImage}
                src={mainImage}
                alt={`${vehicle.name} — ${vehicle.category} rental in The Gambia`}
                width={1024}
                height={768}
                className="img-switch aspect-[4/3] w-full object-cover"
              />
            </div>
            {vehicle.images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {vehicle.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setImageIndex(i)}
                    aria-label={`View photo ${i + 1} of the ${vehicle.name}`}
                    aria-pressed={i === imageIndex}
                    className={cn(
                      "overflow-hidden border transition-colors",
                      i === imageIndex
                        ? "border-gold"
                        : "border-border hover:border-gold/50",
                    )}
                  >
                    <img
                      src={img}
                      alt=""
                      loading="lazy"
                      width={256}
                      height={192}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Specs */}
            <div className="mt-10">
              <h2 className="label-caps">Specifications</h2>
              <dl className="mt-5 grid grid-cols-2 gap-px border border-border bg-border/50 sm:grid-cols-3">
                {specs.map((s) => (
                  <div key={s.label} className="bg-night p-5">
                    <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      <s.icon className="size-4 text-gold" aria-hidden />
                      {s.label}
                    </dt>
                    <dd className="mt-2 text-sm font-semibold text-foreground">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Features */}
            <div className="mt-10">
              <h2 className="label-caps">Features</h2>
              <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {vehicle.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 border border-border bg-card px-4 py-3 text-sm text-foreground/85"
                  >
                    <BadgeCheck className="size-4 shrink-0 text-gold" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Rental information */}
            <div className="mt-10 border border-border bg-card p-6">
              <h2 className="label-caps">Rental Information</h2>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                <li>· Booking is confirmed personally through WhatsApp — no online payment required.</li>
                <li>· Pickup and return arranged in {siteConfig.location}; delivery can be organised on request.</li>
                <li>· Daily, weekly and long-term rates available — ask about reduced pricing for longer rentals.</li>
                <li>· Every rental is prepared cleaned, fuelled and inspected.</li>
                <li>· 24/7 customer support throughout your rental.</li>
              </ul>
            </div>
          </div>

          {/* Summary / booking panel */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-border bg-card p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                {vehicle.category}
              </p>
              <h1 className="mt-2 font-display text-4xl font-medium leading-tight text-foreground md:text-5xl">
                {vehicle.name}
              </h1>
              <div className="mt-4">
                <AvailabilityBadge availability={vehicle.availability} />
              </div>
              <p className="mt-5 border-y border-border py-4">
                <span className="text-3xl font-bold text-gold">
                  {format(vehicle.pricePerDay)}
                </span>
                <span className="ml-2 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  per day
                </span>
              </p>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {vehicle.description}
              </p>
              <div className="mt-7 flex flex-col gap-3">
                {available ? (
                  <Link
                    to="/book"
                    search={{ vehicle: vehicle.slug }}
                    className="btn-gold w-full"
                  >
                    <CalendarCheck className="size-4" aria-hidden />
                    Book This Car
                  </Link>
                ) : (
                  <p className="border border-destructive/40 bg-night px-4 py-3 text-center text-xs uppercase tracking-[0.15em] text-destructive">
                    Currently booked — enquire for next availability
                  </p>
                )}
                <a
                  href={vehicleEnquiryUrl(vehicle.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Ask About This Car
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related vehicles */}
      {related.length > 0 && (
        <section className="border-t border-border bg-night" aria-labelledby="related">
          <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
            <p className="label-caps">Keep Looking</p>
            <h2 id="related" className="mt-3 font-display text-3xl font-medium text-foreground md:text-4xl">
              You May Also Like
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
