import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MessageCircle, Search } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { VehicleCard } from "@/components/fleet/VehicleCard";
import {
  VEHICLES,
  VEHICLE_CATEGORIES,
  categorySlug,
} from "@/data/vehicles";
import { GENERAL_ENQUIRY_URL } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/fleet")({
  validateSearch: (search: Record<string, unknown>): { category?: string | undefined } => ({
    category:
      typeof search["category"] === "string" && search["category"] !== ""
        ? search["category"]
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Our Fleet | Tokyo Rentals & Concierge" },
      {
        name: "description",
        content:
          "Browse the Tokyo Rentals & Concierge fleet — economy, sedan, SUV, luxury, premium, executive and 4x4 vehicles for hire across The Gambia. Transparent daily rates, WhatsApp booking.",
      },
      { property: "og:title", content: "Our Fleet | Tokyo Rentals & Concierge" },
      {
        property: "og:description",
        content:
          "Economy to luxury — clean, reliable vehicles with transparent daily rates across The Gambia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FleetPage,
});

const chipCls = (active: boolean) =>
  cn(
    "border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors",
    active
      ? "border-gold bg-gold text-primary-foreground"
      : "border-border bg-transparent text-foreground/70 hover:border-gold/60 hover:text-gold",
  );

function FleetPage() {
  const { category } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VEHICLES.filter((v) => {
      if (category && categorySlug(v.category) !== category) return false;
      if (availableOnly && v.availability !== "available") return false;
      if (
        q &&
        !`${v.name} ${v.category} ${v.transmission} ${v.fuel}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [category, query, availableOnly]);

  const activeCategory = VEHICLE_CATEGORIES.find(
    (c) => categorySlug(c) === category,
  );

  return (
    <>
      <PageHero
        label="The Fleet"
        title={activeCategory ?? "Our Fleet"}
        copy="Every vehicle is cleaned, inspected and maintained before each rental. Transparent daily rates — no hidden extras."
      />

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8" aria-label="Fleet catalog">
        {/* Controls */}
        <div className="flex flex-col gap-6 border-b border-border pb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search vehicles…"
                aria-label="Search vehicles"
                className="input-dark !pl-10"
              />
            </div>
            <div className="flex items-center gap-2" role="group" aria-label="Availability filter">
              <button
                type="button"
                onClick={() => setAvailableOnly(false)}
                className={chipCls(!availableOnly)}
                aria-pressed={!availableOnly}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setAvailableOnly(true)}
                className={chipCls(availableOnly)}
                aria-pressed={availableOnly}
              >
                Available Now
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Category filter">
            <Link to="/fleet" search={{}} className={chipCls(!category)}>
              All Vehicles
            </Link>
            {VEHICLE_CATEGORIES.map((c) => (
              <Link
                key={c}
                to="/fleet"
                search={{ category: categorySlug(c) }}
                className={chipCls(category === categorySlug(c))}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>

        {/* Results */}
        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-muted-foreground" aria-live="polite">
          Showing <span key={filtered.length} className="count-pop font-semibold text-foreground">{filtered.length}</span> of {VEHICLES.length} vehicles
        </p>

        {filtered.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        ) : (
          <div className="mt-6 border border-border bg-card px-6 py-16 text-center">
            <p className="font-display text-3xl text-foreground">No vehicles match your search</p>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Try a different category or search term — or ask us directly. If a
              vehicle you need isn't listed, we can often source it.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/fleet" search={{}} className="btn-outline">
                Reset Filters
              </Link>
              <a
                href={GENERAL_ENQUIRY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <MessageCircle className="size-4" aria-hidden />
                Ask on WhatsApp
              </a>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
