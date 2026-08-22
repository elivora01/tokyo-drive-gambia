import { WHY_CHOOSE_US } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";

export function WhyChooseUs() {
  return (
    <section className="border-y border-border bg-night" aria-labelledby="why-us">
      <div className="mx-auto max-w-7xl px-5 py-20 md:py-28 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="label-caps">Why Choose Us</p>
          <h2
            id="why-us"
            className="mt-3 font-display text-4xl font-medium text-foreground md:text-5xl"
          >
            The Tokyo Standard
          </h2>
          <span className="heading-rule mt-5" aria-hidden />
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
            Every rental is prepared and supported to the same standard —
            whether you take the Corolla for a day or the Macan for a month.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px border border-border bg-border/50 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE_US.map((item, i) => (
            <Reveal
              key={item.title}
              delay={`${i * 0.08}s`}
              className="group bg-night p-7 transition-colors duration-300 hover:bg-charcoal"
            >
              <item.icon
                className="size-6 text-gold transition-transform duration-300 group-hover:-translate-y-0.5"
                aria-hidden
              />
              <h3 className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
