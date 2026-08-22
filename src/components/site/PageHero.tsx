import { brandAssets } from "@/data/assets";

interface PageHeroProps {
  label: string;
  title: string;
  copy?: string;
}

/** Consistent interior-page header band (sits below the fixed site header). */
export function PageHero({ label, title, copy }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-night pt-36 pb-16 md:pt-44 md:pb-20">
      <img
        src={brandAssets.heroBackground}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/85 to-night" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 page-hero-in">
        <p className="label-caps">{label}</p>
        <h1 className="mt-4 font-display text-5xl font-medium leading-[1.05] text-foreground md:text-6xl">
          {title}
        </h1>
        <span className="heading-rule mt-6" aria-hidden />
        {copy && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {copy}
          </p>
        )}
      </div>
    </section>
  );
}
