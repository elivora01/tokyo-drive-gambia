import { Link } from "@tanstack/react-router";
import { BOOKING_STEPS } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";

export function BookingSteps() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:py-28 lg:px-8" aria-labelledby="booking-steps">
      <Reveal className="text-center">
        <p className="label-caps">How It Works</p>
        <h2
          id="booking-steps"
          className="mt-3 font-display text-4xl font-medium text-foreground md:text-5xl"
        >
          Booking in Three Steps
        </h2>
      </Reveal>

      <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
        {BOOKING_STEPS.map((step, i) => (
          <Reveal
            key={step.step}
            as="li"
            delay={`${i * 0.12}s`}
            scale
            className="group relative text-center md:px-6"
          >
            <span
              className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 font-display text-8xl font-medium text-gold/10 transition-colors duration-500 group-hover:text-gold/20 md:text-9xl"
              aria-hidden
            >
              {step.step}
            </span>
            <div className="relative">
              <step.icon className="mx-auto size-7 text-gold" aria-hidden />
              <h3 className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-foreground">
                {step.title}
              </h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>

      <Reveal delay="0.2s" className="mt-14 text-center">
        <Link to="/book" className="btn-gold">
          Start Your Booking
        </Link>
      </Reveal>
    </section>
  );
}
