import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: string;
  scale?: boolean;
  as?: "div" | "section" | "article" | "li";
}

export function Reveal({
  children,
  className,
  delay = "0s",
  scale = false,
  as: Component = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Component
      // @ts-expect-error dynamic component ref
      ref={ref}
      className={cn(
        "reveal",
        scale && "reveal-scale",
        isVisible && "is-visible",
        className,
      )}
      style={{ ["--rd" as string]: delay }}
    >
      {children}
    </Component>
  );
}
