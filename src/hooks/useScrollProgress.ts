import { useEffect, useRef, type RefObject } from "react";

export interface ScrollProgressOptions {
  /**
   * The tall "runway" element (e.g. a 260vh section) that defines the scroll
   * span. Progress is 0 while the runway top is below the viewport top and
   * reaches 1 exactly when its bottom meets the viewport bottom.
   */
  runwayRef: RefObject<HTMLElement | null>;
  /** Elements that receive the computed custom properties each frame. */
  targets: ReadonlyArray<RefObject<HTMLElement | null>>;
  /** Maps progress (0..1) + viewport height -> CSS custom property values. */
  compute: (progress: number, viewportHeight: number) => Record<string, string>;
  /**
   * When false (reduced-motion / static variants) the hook writes
   * `compute(1, vh)` once so consumers land on their completed state.
   */
  enabled?: boolean;
}

/** Clamp helper shared with choreography mappers. */
export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Remap p from [a,b] to [0,1] (unclamped input, clamped output). */
export function range(p: number, a: number, b: number): number {
  return clamp01((p - a) / (b - a));
}

/** Smooth 0->1 curve used for reveals. */
export function easeInOutCubic(t: number): number {
  const u = clamp01(t);
  return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
}

/** Decelerating 0->1 curve used for ignitions/settles. */
export function easeOutCubic(t: number): number {
  const u = clamp01(t);
  return 1 - Math.pow(1 - u, 3);
}

/**
 * Dependency-free scroll progress driver.
 *
 * - Passive scroll/resize listeners coalesced into one rAF write per frame.
 * - No React state: results are written straight to CSS custom properties,
 *   so scrolling never triggers a component render.
 * - Fully reversible: progress is a pure function of window.scrollY.
 */
export function useScrollProgress(options: ScrollProgressOptions): RefObject<number> {
  const { runwayRef, targets, compute, enabled = true } = options;
  const progressRef = useRef(0);
  const computeRef = useRef(compute);
  computeRef.current = compute;

  useEffect(() => {
    const runway = runwayRef.current;
    if (!runway || typeof window === "undefined") return;

    let rafId: number | null = null;
    let dirty = false;

    const write = () => {
      rafId = null;
      const vh = window.innerHeight;
      const values = computeRef.current(progressRef.current, vh);
      for (const t of targets) {
        const el = t.current;
        if (!el) continue;
        for (const [k, v] of Object.entries(values)) {
          el.style.setProperty(k, v);
        }
      }
    };

    const measure = () => {
      const vh = window.innerHeight;
      const rect = runway.getBoundingClientRect();
      const span = rect.height - vh;
      const raw = span > 0 ? -rect.top / span : 1;
      progressRef.current = clamp01(raw);
    };

    const schedule = () => {
      dirty = true;
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          if (dirty) measure();
          dirty = false;
          write();
        });
      }
    };

    if (!enabled) {
      // Static variant: pin the assembled/completed state.
      progressRef.current = 1;
      measure();
      progressRef.current = 1;
      write();
      const onResize = () => {
        progressRef.current = 1;
        write();
      };
      window.addEventListener("resize", onResize, { passive: true });
      return () => window.removeEventListener("resize", onResize);
    }

    measure();
    // Double rAF: run after first layout/paint so vars reflect real scroll.
    rafId = requestAnimationFrame(() => {
      write();
      rafId = requestAnimationFrame(write);
    });

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [runwayRef, targets, enabled]);

  return progressRef;
}
