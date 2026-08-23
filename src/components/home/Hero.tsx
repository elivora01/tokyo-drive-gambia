import { useCallback, useEffect, useMemo, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarCheck, Car, Gem, Headset, MapPin } from "lucide-react";
import { brandAssets } from "@/data/assets";
import { siteConfig } from "@/data/site";
import { useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * Cinematic homepage hero.
 *
 * Layered automotive commercial visual flow:
 * 0–1s: Initial dark reveal
 * 1–2s: Vehicle artwork emerges with slow GPU camera push-in
 * 1.1–1.6s: Staggered masked headline word reveals (TOKYO, RENTALS, & Concierge)
 * 1.7–2.1s: Tagline, description, and luxury CTAs fade up
 * ~2.4–3.2s: Automotive gold light sweep & subtle light streaks
 * Ambient: Silky atmospheric particles + subtle desktop pointer parallax (disabled on touch/reduced-motion)
 *
 * Desktop scroll (Phase 2): the hero becomes a sticky stage inside a ~260vh
 * runway. Window scroll drives a `--p` CSS custom property from 0 to 1 via
 * useScrollProgress — pure CSS-variable writes, so scrolling never re-renders
 * React, and upward scroll reverses progress automatically. Mobile keeps the
 * static Phase 1 layout; reduced-motion pins the completed state.
 */
const PARTICLES = [
  {
    left: "12%",
    top: "30%",
    size: 3,
    px: "14px",
    py: "-30px",
    pd: "9s",
    pdel: "0.4s",
    po: 0.25,
    mobile: true,
  },
  {
    left: "22%",
    top: "62%",
    size: 2,
    px: "-10px",
    py: "-22px",
    pd: "11s",
    pdel: "1.2s",
    po: 0.3,
    mobile: true,
  },
  {
    left: "38%",
    top: "22%",
    size: 2,
    px: "12px",
    py: "-18px",
    pd: "8s",
    pdel: "2s",
    po: 0.2,
    mobile: true,
  },
  {
    left: "55%",
    top: "70%",
    size: 3,
    px: "-16px",
    py: "-26px",
    pd: "10s",
    pdel: "0.8s",
    po: 0.35,
    mobile: true,
  },
  {
    left: "68%",
    top: "28%",
    size: 2,
    px: "10px",
    py: "-34px",
    pd: "12s",
    pdel: "1.6s",
    po: 0.25,
    mobile: false,
  },
  {
    left: "80%",
    top: "55%",
    size: 3,
    px: "-12px",
    py: "-20px",
    pd: "9.5s",
    pdel: "0.2s",
    po: 0.3,
    mobile: false,
  },
  {
    left: "90%",
    top: "38%",
    size: 2,
    px: "16px",
    py: "-28px",
    pd: "10.5s",
    pdel: "2.4s",
    po: 0.2,
    mobile: false,
  },
  {
    left: "47%",
    top: "48%",
    size: 2,
    px: "-8px",
    py: "-16px",
    pd: "8.5s",
    pdel: "1s",
    po: 0.22,
    mobile: false,
  },
];

const HIGHLIGHTS = [
  { icon: Car, title: "Clean & Reliable", sub: "Vehicles" },
  { icon: Gem, title: "Luxury Cars", sub: "Affordable Rates" },
  { icon: Headset, title: "24/7 Customer", sub: "Support" },
  { icon: MapPin, title: "The Gambia", sub: "Coverage" },
];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const effectsRef = useRef<HTMLDivElement>(null);

  // Desktop scroll runway (~260vh) wrapping this sticky hero stage. Progress
  // is written straight to the `--p` custom property on the stage element —
  // no React state, so scrolling never triggers a re-render.
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageTargets = useMemo(() => [heroRef], []);
  const writeStageVars = useCallback(
    (progress: number): Record<string, string> => ({
      "--p": progress.toFixed(4),
    }),
    [],
  );
  // Matches the Tailwind `md:` breakpoint where the runway/sticky CSS applies;
  // reduced-motion (or mobile) keeps the hero fully static.
  const scrollEnabled =
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 768px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useScrollProgress({
    runwayRef,
    targets: stageTargets,
    compute: writeStageVars,
    enabled: scrollEnabled,
  });

  useEffect(() => {
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqPointer = window.matchMedia("(pointer: fine)");

    if (mqReduced.matches || !mqPointer.matches) return;

    let rafId: number | null = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const hero = heroRef.current;
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetX = Math.max(-1, Math.min(1, normX));
      targetY = Math.max(-1, Math.min(1, normY));
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      if (artworkRef.current) {
        artworkRef.current.style.transform = `translate3d(${currentX * -6}px, ${currentY * -4}px, 0)`;
      }
      if (effectsRef.current) {
        effectsRef.current.style.transform = `translate3d(${currentX * 4}px, ${currentY * 3}px, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("pointermove", handlePointerMove, { passive: true });
      hero.addEventListener("pointerleave", handlePointerLeave, { passive: true });
      rafId = requestAnimationFrame(animate);
    }

    return () => {
      if (hero) {
        hero.removeEventListener("pointermove", handlePointerMove);
        hero.removeEventListener("pointerleave", handlePointerLeave);
      }
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[94svh] items-end overflow-hidden bg-night"
      aria-label="Tokyo Rentals & Concierge — luxury car rental in The Gambia"
    >
      {/* Layer 0: Background artwork with camera push-in and drift */}
      <div ref={artworkRef} className="absolute inset-0 z-0 will-change-transform">
        <img
          src={brandAssets.heroBackground}
          alt="Orange Porsche Macan on a night road with the city skyline and golden light trails"
          className="hero-media h-full w-full object-cover object-[62%_center] md:object-center"
          fetchPriority="high"
          width={1536}
          height={1024}
        />
      </div>

      {/* Layer 1: Atmospheric readability gradients */}
      <div
        className="hero-shade-left absolute inset-0 z-10 bg-gradient-to-r from-night/92 via-night/35 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 z-10 h-2/5 bg-gradient-to-t from-background via-night/45 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-night/80 to-transparent"
        aria-hidden
      />

      {/* Layer 2: Gold lighting sweep, streaks & atmospheric particles */}
      <div
        ref={effectsRef}
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden will-change-transform"
        aria-hidden
      >
        {/* Soft light sweep */}
        <span
          className="hero-sweep absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-transparent via-gold-soft/20 to-transparent blur-2xl"
          style={{ ["--d" as string]: "2.7s" }}
        />

        {/* Automotive light streaks */}
        <span
          className="hero-streak absolute top-[32%] h-px w-1/3 bg-gradient-to-r from-transparent via-gold to-transparent blur-[1px]"
          style={{ animationDelay: "2.4s" }}
        />
        <span
          className="hero-streak absolute top-[56%] h-[2px] w-1/4 bg-gradient-to-r from-transparent via-gold-soft to-transparent blur-[1px]"
          style={{ animationDelay: "2.9s" }}
        />
        <span
          className="hero-streak absolute top-[74%] h-px w-1/3 bg-gradient-to-r from-transparent via-gold to-transparent blur-[2px]"
          style={{ animationDelay: "3.4s" }}
        />

        {/* Floating gold particles */}
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className={`hero-particle absolute rounded-full bg-gold-soft ${p.mobile ? "block" : "hidden sm:block"}`}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              ["--pin" as string]: p.pdel,
              ["--px" as string]: p.px,
              ["--py" as string]: p.py,
              ["--pd" as string]: p.pd,
              ["--pdel" as string]: p.pdel,
              ["--po" as string]: p.po,
            }}
          />
        ))}
      </div>

      {/* Layer 3: Typography & interactive content */}
      <div className="relative z-30 mx-auto w-full max-w-7xl px-5 pt-36 pb-16 md:pb-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="hero-fade label-caps" style={{ ["--d" as string]: "0.9s" }}>
            Luxury Car Rental — The Gambia
          </p>

          <h1 className="mt-4 font-display text-6xl font-medium uppercase leading-[0.92] tracking-wide text-foreground sm:text-7xl md:text-8xl">
            <span className="block overflow-hidden py-0.5">
              <span className="hero-word" style={{ ["--d" as string]: "1.1s" }}>
                Tokyo
              </span>
            </span>
            <span className="block overflow-hidden py-0.5">
              <span className="hero-word text-gold" style={{ ["--d" as string]: "1.3s" }}>
                Rentals
              </span>
            </span>
            <span className="mt-1 block overflow-hidden py-0.5">
              <span
                className="hero-word font-display text-3xl normal-case italic tracking-normal text-gold-soft md:text-4xl"
                style={{ ["--d" as string]: "1.5s" }}
              >
                &amp; Concierge
              </span>
            </span>
          </h1>

          <p
            className="hero-fade mt-6 text-lg font-medium text-foreground md:text-xl"
            style={{ ["--d" as string]: "1.75s" }}
          >
            {siteConfig.tagline}
          </p>

          <p
            className="hero-fade mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base"
            style={{ ["--d" as string]: "1.9s" }}
          >
            {siteConfig.shortDescription}
          </p>

          <div
            className="hero-fade mt-9 flex flex-col gap-3 sm:flex-row"
            style={{ ["--d" as string]: "2.05s" }}
          >
            <Link to="/book" className="btn-gold">
              <CalendarCheck className="size-4" aria-hidden />
              Book a Car
            </Link>
            <Link to="/fleet" className="btn-outline">
              <Car className="size-4" aria-hidden />
              Explore the Fleet
            </Link>
          </div>
        </div>

        {/* Highlights strip */}
        <div
          className="hero-fade mt-14 grid grid-cols-2 gap-px border border-border/70 bg-border/40 md:grid-cols-4"
          style={{ ["--d" as string]: "2.25s" }}
        >
          {HIGHLIGHTS.map((h) => (
            <div
              key={h.title}
              className="flex items-center gap-3 bg-night/75 px-4 py-4 backdrop-blur-sm"
            >
              <h.icon className="size-5 shrink-0 text-gold" aria-hidden />
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/85">
                {h.title}
                <span className="block text-muted-foreground">{h.sub}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Layer 4: Elegant gold scroll indicator */}
      <div
        className="hero-fade pointer-events-none absolute bottom-4 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-1.5 md:flex"
        style={{ ["--d" as string]: "2.4s" }}
        aria-hidden
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground/70">
          Scroll
        </span>
        <div className="relative h-7 w-px overflow-hidden bg-border/60">
          <span className="scroll-indicator-line absolute inset-0 bg-gold" />
        </div>
      </div>
    </section>
  );
}
