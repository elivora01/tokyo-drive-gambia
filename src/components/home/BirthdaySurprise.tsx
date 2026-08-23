import { useCallback, useEffect, useRef, useState } from "react";
import { brandAssets } from "@/data/assets";
import { cn } from "@/lib/utils";

/**
 * One-time birthday surprise gate.
 *
 * Shown only from the homepage entry point when `?birthday=1` is present and
 * the visitor has not opened it before (localStorage flag), or always in
 * `?birthday-preview=1` mode. Preview never persists the flag so the real
 * one-time behaviour stays intact while testing. All styling lives in the
 * isolated `.birthday-*` namespace — nothing here touches the cinematic hero.
 */
export const BIRTHDAY_SEEN_KEY = "tokyo-drive-birthday-seen";

/** Deterministic particle field (fixed values → no SSR/client mismatch). */
const PARTICLES: ReadonlyArray<{
  left: string;
  top: string;
  size: number;
  delay: string;
  dur: string;
  x: string;
  y: string;
  op: number;
}> = [
  { left: "7%", top: "24%", size: 2, delay: "0.4s", dur: "10s", x: "12px", y: "-30px", op: 0.5 },
  { left: "16%", top: "68%", size: 3, delay: "1.6s", dur: "12s", x: "-10px", y: "-36px", op: 0.42 },
  { left: "27%", top: "14%", size: 2, delay: "2.8s", dur: "9s", x: "16px", y: "-24px", op: 0.38 },
  { left: "38%", top: "82%", size: 2, delay: "0.9s", dur: "11s", x: "10px", y: "-28px", op: 0.45 },
  { left: "49%", top: "9%", size: 3, delay: "3.4s", dur: "13s", x: "-14px", y: "-32px", op: 0.4 },
  { left: "58%", top: "74%", size: 2, delay: "2.1s", dur: "10.5s", x: "12px", y: "-26px", op: 0.48 },
  { left: "69%", top: "18%", size: 2, delay: "1.2s", dur: "9.5s", x: "-12px", y: "-34px", op: 0.44 },
  { left: "79%", top: "64%", size: 3, delay: "4.1s", dur: "12.5s", x: "14px", y: "-30px", op: 0.36 },
  { left: "88%", top: "32%", size: 2, delay: "0.2s", dur: "11.5s", x: "-16px", y: "-28px", op: 0.5 },
  { left: "94%", top: "52%", size: 2, delay: "3.0s", dur: "10s", x: "10px", y: "-24px", op: 0.34 },
  { left: "33%", top: "44%", size: 2, delay: "4.6s", dur: "12s", x: "-8px", y: "-22px", op: 0.3 },
  { left: "63%", top: "38%", size: 2, delay: "5.2s", dur: "9s", x: "9px", y: "-26px", op: 0.32 },
];

/** Paragraph flow — the sender's words, only broken for readability. */
const PARAGRAPHS: ReadonlyArray<{
  text: string;
  delay: string;
  tone: "soft" | "highlight" | "muted";
}> = [
  {
    text: "Hi Awa i have nothing very special to give for your birthday so i decided to do this hope you like it,",
    delay: "0.7s",
    tone: "soft",
  },
  {
    text: "thank you for being a friend even if we don't talk much but there are things that are left unsaid,",
    delay: "0.95s",
    tone: "soft",
  },
  {
    text: "so today i want to wish you a beautiful birthday to you and Zini.",
    delay: "1.2s",
    tone: "soft",
  },
  { text: "Happy birthday to you girls.", delay: "1.5s", tone: "highlight" },
  {
    text: "pls open your surprise and let me know if you like it so i can finish it.",
    delay: "1.85s",
    tone: "muted",
  },
];

interface BirthdaySurpriseProps {
  /** Fired once the cinematic exit has finished; parent unmounts the gate. */
  onReveal: () => void;
  /** `?birthday-preview=1` — always renders, never writes the seen-flag. */
  preview?: boolean;
}

export function BirthdaySurprise({ onReveal, preview = false }: BirthdaySurpriseProps) {
  const [leaving, setLeaving] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<number | null>(null);

  const openSurprise = useCallback(() => {
    if (leaving) return;
    if (!preview) {
      try {
        window.localStorage.setItem(BIRTHDAY_SEEN_KEY, "1");
      } catch {
        /* private mode — experience simply replays next visit */
      }
    }
    setLeaving(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timerRef.current = window.setTimeout(onReveal, reduced ? 400 : 980);
  }, [leaving, onReveal, preview]);

  // Mount-only: lock background scrolling and hand focus to the CTA.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ctaRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Escape opens the surprise too (keyboard parity with the button).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") openSurprise();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [openSurprise]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="birthday-title"
      className={cn("birthday-overlay", leaving && "is-leaving")}
    >
      {/* Ambient lighting layers */}
      <div className="birthday-glow birthday-glow-a" aria-hidden />
      <div className="birthday-glow birthday-glow-b" aria-hidden />
      {PARTICLES.map((particle, index) => (
        <span
          key={index}
          aria-hidden
          className="birthday-particle"
          style={
            {
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              "--pd-delay": particle.delay,
              "--pd-dur": particle.dur,
              "--pd-x": particle.x,
              "--pd-y": particle.y,
              "--pd-op": String(particle.op),
            } as React.CSSProperties
          }
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center px-5 py-12 text-center">
        <img
          src={brandAssets.logo}
          alt=""
          width={78}
          height={52}
          loading="eager"
          className="birthday-reveal h-11 w-auto opacity-90"
          style={{ "--bd-delay": "0.1s" } as React.CSSProperties}
        />
        <p
          className="birthday-reveal label-caps mt-9"
          style={{ "--bd-delay": "0.4s" } as React.CSSProperties}
        >
          Tokyo Rentals &amp; Concierge
        </p>
        <h1
          id="birthday-title"
          className="birthday-heading mt-5 font-display text-5xl font-medium leading-[1.03] text-foreground sm:text-6xl md:text-7xl"
        >
          Happy Birthday
        </h1>

        <div className="mt-10 space-y-5">
          {PARAGRAPHS.map((paragraph) =>
            paragraph.tone === "highlight" ? (
              <p
                key={paragraph.delay}
                className="birthday-highlight birthday-reveal font-display text-2xl italic leading-snug sm:text-3xl md:text-4xl"
                style={{ "--bd-delay": paragraph.delay } as React.CSSProperties}
              >
                {paragraph.text}
              </p>
            ) : (
              <p
                key={paragraph.delay}
                className={cn(
                  "birthday-reveal",
                  paragraph.tone === "muted"
                    ? "text-sm leading-relaxed text-muted-foreground sm:text-base"
                    : "text-[15px] leading-relaxed text-foreground/85 sm:text-base",
                )}
                style={{ "--bd-delay": paragraph.delay } as React.CSSProperties}
              >
                {paragraph.text}
              </p>
            ),
          )}
        </div>

        <button
          ref={ctaRef}
          type="button"
          onClick={openSurprise}
          className="birthday-cta birthday-reveal btn-gold mt-12 px-9 py-4 text-sm tracking-wide"
          style={{ "--bd-delay": "2.2s" } as React.CSSProperties}
        >
          Open Your Surprise
        </button>
      </div>
    </div>
  );
}