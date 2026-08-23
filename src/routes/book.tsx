import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { z } from "zod";
import { CalendarCheck, MessageCircle, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { useCurrency } from "@/components/site/CurrencyProvider";
import { siteConfig } from "@/data/site";
import { VEHICLES, getVehicleBySlug } from "@/data/vehicles";
import { bookingUrl } from "@/lib/whatsapp";

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>): { vehicle?: string | undefined } => ({
    vehicle:
      typeof search["vehicle"] === "string" && search["vehicle"] !== ""
        ? search["vehicle"]
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book a Car | Tokyo Rentals & Concierge" },
      {
        name: "description",
        content:
          "Book your rental car in The Gambia in minutes. Choose your vehicle, pick your dates and confirm directly through WhatsApp with Tokyo Rentals & Concierge.",
      },
      { property: "og:title", content: "Book a Car | Tokyo Rentals & Concierge" },
      {
        property: "og:description",
        content:
          "Choose your vehicle, pick your dates and confirm through WhatsApp — no online payment required.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookPage,
});

const bookingSchema = z
  .object({
    vehicleSlug: z.string().min(1, "Please choose a vehicle"),
    pickupDate: z.string().min(1, "Pickup date is required"),
    returnDate: z.string().min(1, "Return date is required"),
    pickupLocation: z
      .string()
      .trim()
      .min(3, "Please enter a pickup location")
      .max(120, "Location is too long"),
    returnLocation: z
      .string()
      .trim()
      .min(3, "Please enter a return location")
      .max(120, "Location is too long"),
    name: z.string().trim().min(2, "Please enter your full name").max(100, "Name is too long"),
    phone: z
      .string()
      .trim()
      .min(6, "Please enter your phone number")
      .max(20, "Phone number is too long")
      .regex(/^[+\d][\d\s().-]*$/, "Please enter a valid phone number"),
    email: z.string().trim().email("Please enter a valid email address").max(255),
    message: z.string().trim().max(600, "Please keep your request under 600 characters"),
  })
  .refine(
    (d) =>
      !d.pickupDate ||
      !d.returnDate ||
      new Date(d.returnDate) > new Date(d.pickupDate),
    { message: "Return date must be after the pickup date", path: ["returnDate"] },
  );

type BookingForm = z.infer<typeof bookingSchema>;

const todayIso = () => new Date().toISOString().split("T")[0];

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/** Canonical USD amount for the WhatsApp handoff (business quoting currency). */
const money = (n: number) => `$${n.toLocaleString("en-US")}`;

/**
 * Unique client-side booking reference (no backend yet). Shown on the
 * confirmation panel and embedded in the WhatsApp request so the team can
 * quote it back during confirmation.
 */
const makeBookingRef = () =>
  `TRC-${Date.now().toString(36).slice(-4)}${Math.random()
    .toString(36)
    .slice(2, 6)}`.toUpperCase();

function BookPage() {
  const search = Route.useSearch();
  const { format } = useCurrency();
  const [form, setForm] = useState<BookingForm>({
    vehicleSlug: search.vehicle && getVehicleBySlug(search.vehicle) ? search.vehicle : "",
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
    returnLocation: "",
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookingForm, string>>>({});
  /** Set after a validated submit — drives the confirmation panel. */
  const [confirmation, setConfirmation] = useState<{
    reference: string;
    url: string;
  } | null>(null);

  const vehicle = form.vehicleSlug ? getVehicleBySlug(form.vehicleSlug) : undefined;

  const days = useMemo(() => {
    if (!form.pickupDate || !form.returnDate) return 0;
    const diff =
      new Date(form.returnDate).getTime() - new Date(form.pickupDate).getTime();
    return diff > 0 ? Math.round(diff / 86_400_000) : 0;
  }, [form.pickupDate, form.returnDate]);

  const set =
    (key: keyof BookingForm) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((er) => ({ ...er, [key]: undefined }));
      setConfirmation(null);
    };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = bookingSchema.safeParse(form);
    if (!parsed.success) {
      const next: Partial<Record<keyof BookingForm, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof BookingForm;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    const v = getVehicleBySlug(parsed.data.vehicleSlug)!;
    const reference = makeBookingRef();
    // Structured booking payload — the single shape a future Supabase insert
    // will consume. Nothing is stored server-side today; it currently drives
    // the WhatsApp handoff and the on-page confirmation only.
    const booking = {
      reference,
      vehicle_slug: parsed.data.vehicleSlug,
      pickup_date: parsed.data.pickupDate,
      return_date: parsed.data.returnDate,
      rental_days: days > 0 ? days : null,
      pickup_location: parsed.data.pickupLocation,
      return_location: parsed.data.returnLocation,
      customer_name: parsed.data.name,
      customer_phone: parsed.data.phone,
      customer_email: parsed.data.email,
      notes: parsed.data.message.trim() || null,
      currency: v.currency,
      daily_rate: v.pricePerDay,
      estimated_total: days > 0 ? days * v.pricePerDay : null,
      created_at: new Date().toISOString(),
    };
    const url = bookingUrl({
      reference: booking.reference,
      vehicleName: v.name,
      pickupDate: fmtDate(booking.pickup_date),
      returnDate: fmtDate(booking.return_date),
      pickupLocation: booking.pickup_location,
      returnLocation: booking.return_location,
      rentalDays: booking.rental_days ?? undefined,
      estimatedTotal:
        booking.estimated_total !== null ? money(booking.estimated_total) : undefined,
      customerName: booking.customer_name,
      phone: booking.customer_phone,
      email: booking.customer_email,
      message: booking.notes ?? undefined,
    });
    window.open(url, "_blank", "noopener,noreferrer");
    setConfirmation({ reference, url });
  };

  return (
    <>
      <PageHero
        label="Book Now"
        title="Reserve Your Vehicle"
        copy="Choose your car and dates, review your booking, then confirm directly with our team through WhatsApp."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* Form */}
          <form onSubmit={onSubmit} noValidate className="border border-border bg-card p-6 md:p-8">
            {/* 01 — Vehicle & dates */}
            <section aria-labelledby="step-vehicle">
              <h2 id="step-vehicle" className="flex items-baseline gap-3">
                <span
                  aria-hidden
                  className="font-display text-lg font-medium leading-none text-gold"
                >
                  01
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-foreground/90">
                  Vehicle &amp; Dates
                </span>
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="Vehicle" error={errors.vehicleSlug} full>
                  <select
                    value={form.vehicleSlug}
                    onChange={set("vehicleSlug")}
                    className="input-dark"
                    aria-label="Select vehicle"
                  >
                    <option value="">Select a vehicle…</option>
                    {VEHICLES.map((v) => (
                      <option key={v.id} value={v.slug}>
                        {v.name} — {v.category} · {format(v.pricePerDay)}/day
                        {v.availability === "unavailable" ? " (currently booked)" : ""}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Pickup Date" error={errors.pickupDate}>
                  <input
                    type="date"
                    value={form.pickupDate}
                    min={todayIso()}
                    onChange={set("pickupDate")}
                    className="input-dark"
                  />
                </Field>

                <Field label="Return Date" error={errors.returnDate}>
                  <input
                    type="date"
                    value={form.returnDate}
                    min={form.pickupDate || todayIso()}
                    onChange={set("returnDate")}
                    className="input-dark"
                  />
                </Field>
              </div>
            </section>

            {/* 02 — Pickup & return locations */}
            <section
              aria-labelledby="step-locations"
              className="border-t border-border pt-8"
            >
              <h2 id="step-locations" className="flex items-baseline gap-3">
                <span
                  aria-hidden
                  className="font-display text-lg font-medium leading-none text-gold"
                >
                  02
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-foreground/90">
                  Pickup &amp; Return
                </span>
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Hotel, residence, airport or our {siteConfig.location} office —
                wherever suits your journey.
              </p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="Pickup Location" error={errors.pickupLocation}>
                  <input
                    type="text"
                    value={form.pickupLocation}
                    onChange={set("pickupLocation")}
                    placeholder="e.g. Banjul International Airport"
                    autoComplete="off"
                    className="input-dark"
                  />
                </Field>

                <Field label="Return Location" error={errors.returnLocation}>
                  <input
                    type="text"
                    value={form.returnLocation}
                    onChange={set("returnLocation")}
                    placeholder="e.g. Senegambia, Kololi"
                    autoComplete="off"
                    className="input-dark"
                  />
                </Field>

              </div>
            </section>

            {/* 03 — Customer details */}
            <section
              aria-labelledby="step-contact"
              className="border-t border-border pt-8"
            >
              <h2 id="step-contact" className="flex items-baseline gap-3">
                <span
                  aria-hidden
                  className="font-display text-lg font-medium leading-none text-gold"
                >
                  03
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-foreground/90">
                  Your Details
                </span>
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="Full Name" error={errors.name}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Your name"
                    autoComplete="name"
                    className="input-dark"
                  />
                </Field>

                <Field label="Phone Number" error={errors.phone}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+220 …"
                    autoComplete="tel"
                    className="input-dark"
                  />
                </Field>

                <Field label="Email Address" error={errors.email} full>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="input-dark"
                  />
                </Field>

                <Field label="Additional Request (optional)" error={errors.message} full>
                  <textarea
                    value={form.message}
                    onChange={set("message")}
                    rows={4}
                    placeholder="Airport pickup, child seat, chauffeur, delivery location…"
                    className="input-dark resize-none"
                  />
                </Field>
              </div>
            </section>

            <button type="submit" className="btn-gold mt-8 w-full sm:w-auto">
              <MessageCircle className="size-4" aria-hidden />
              Send Booking Request via WhatsApp
            </button>

            {confirmation && (
              <div
                role="status"
                className="mt-8 border border-gold/50 bg-night p-6 md:p-7"
              >
                <p className="label-caps">Request Prepared</p>
                <p className="mt-3 font-display text-2xl leading-snug text-foreground md:text-3xl">
                  Your booking reference is{" "}
                  <span className="text-gold">{confirmation.reference}</span>
                </p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Quote it whenever you speak with our team. WhatsApp has opened
                  with your request attached.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={confirmation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp flex-1 justify-center"
                  >
                    <MessageCircle className="size-4" aria-hidden />
                    Re-open WhatsApp Request
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((f) => ({
                        ...f,
                        pickupDate: "",
                        returnDate: "",
                        pickupLocation: "",
                        returnLocation: "",
                        name: "",
                        phone: "",
                        email: "",
                        message: "",
                      }));
                      setErrors({});
                      setConfirmation(null);
                    }}
                    className="btn-outline flex-1 justify-center"
                  >
                    Make Another Booking
                  </button>
                </div>
                <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                  This request is not stored on our website — it is delivered
                  directly to our team on WhatsApp, where availability and final
                  pricing are confirmed personally.
                </p>
              </div>
            )}

            <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              No online payment is taken. Your request goes straight to our team,
              who confirm availability and final pricing personally.
            </p>
          </form>

          {/* Live booking summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Booking summary">
            <div className="border border-border bg-night p-7">
              <h2 className="label-caps">Booking Summary</h2>

              {vehicle ? (
                <div className="mt-5">
                  <img
                    src={vehicle.thumbnail}
                    alt={`${vehicle.name}`}
                    width={765}
                    height={574}
                    className="aspect-[16/10] w-full border border-border object-cover"
                  />
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-2xl text-foreground">{vehicle.name}</p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-gold">
                        {vehicle.category}
                      </p>
                    </div>
                    <p className="text-right">
                      <span className="text-xl font-bold text-gold">{format(vehicle.pricePerDay)}</span>
                      <span className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        per day
                      </span>
                    </p>
                  </div>
                  {vehicle.availability === "unavailable" && (
                    <p className="mt-3 border border-destructive/40 px-3 py-2 text-[11px] uppercase tracking-[0.15em] text-destructive">
                      Currently booked — we'll confirm next availability
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-5 text-sm text-muted-foreground">
                  Select a vehicle to see your summary.
                </p>
              )}

              <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Pickup</dt>
                  <dd className="text-right font-medium text-foreground">
                    {form.pickupDate ? fmtDate(form.pickupDate) : "—"}
                    {form.pickupLocation.trim() && (
                      <span className="block text-xs font-normal text-muted-foreground">
                        {form.pickupLocation.trim()}
                      </span>
                    )}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Return</dt>
                  <dd className="text-right font-medium text-foreground">
                    {form.returnDate ? fmtDate(form.returnDate) : "—"}
                    {form.returnLocation.trim() && (
                      <span className="block text-xs font-normal text-muted-foreground">
                        {form.returnLocation.trim()}
                      </span>
                    )}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-border pt-3">
                  <dt className="text-muted-foreground">Daily rate</dt>
                  <dd className="font-medium text-foreground">
                    {vehicle ? format(vehicle.pricePerDay) : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Rental days</dt>
                  <dd className="font-medium text-foreground">{days > 0 ? days : "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-medium text-foreground">
                    {vehicle && days > 0
                      ? format(days * vehicle.pricePerDay)
                      : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-border pt-3">
                  <dt className="text-muted-foreground">Estimated total</dt>
                  <dd className="text-lg font-bold text-gold">
                    {vehicle && days > 0
                      ? format(days * vehicle.pricePerDay)
                      : "—"}
                  </dd>
                </div>
              </dl>

              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Estimate only — the final quote is confirmed on WhatsApp before
                any commitment. Security deposits or optional extras, where
                applicable, are agreed personally; nothing is charged online.
              </p>

              <Link
                to="/fleet"
                className="mt-6 inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-gold underline-offset-4 hover:underline"
              >
                Change vehicle
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  error,
  full,
  children,
}: {
  label: string;
  error?: string | undefined;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/80">
        {label}
        <span className="mt-2 block normal-case tracking-normal">
          {children}
        </span>
      </label>
      {error && (
        <p className="mt-2 text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
