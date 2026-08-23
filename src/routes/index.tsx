import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { brandAssets } from "@/data/assets";
import { Hero } from "@/components/home/Hero";
import {
  BIRTHDAY_SEEN_KEY,
  BirthdaySurprise,
} from "@/components/home/BirthdaySurprise";
import { FeaturedFleet } from "@/components/sections/FeaturedFleet";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { BookingSteps } from "@/components/sections/BookingSteps";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { CtaSection } from "@/components/sections/CtaSection";

export const Route = createFileRoute("/")({
  // Birthday surprise entry points: `/?birthday=1` (one-time, production)
  // and `/?birthday-preview=1` (testing override). Absent → plain homepage.
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    birthday?: string | undefined;
    "birthday-preview"?: string | undefined;
  } => ({
    birthday:
      typeof search["birthday"] === "string" && search["birthday"] === "1"
        ? "1"
        : undefined,
    "birthday-preview":
      typeof search["birthday-preview"] === "string" &&
      search["birthday-preview"] === "1"
        ? "1"
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Luxury Car Rental The Gambia | Tokyo Rentals & Concierge" },
      {
        name: "description",
        content:
          "Tokyo Rentals & Concierge — luxury cars made affordable in Banjul, The Gambia. Clean, reliable vehicles, airport transfers, chauffeur service and 24/7 support. Book in minutes via WhatsApp.",
      },
      { property: "og:title", content: "Luxury Car Rental The Gambia | Tokyo Rentals & Concierge" },
      {
        property: "og:description",
        content:
          "Clean, reliable and stylish vehicles for your journey across The Gambia. Drive with confidence. Travel with class.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    // LCP priority: start downloading the hero artwork in parallel with
    // CSS/JS instead of after first paint, so the cinematic arrival
    // timeline and the image load no longer race. Same registry URL the
    // <img> renders — never a duplicated/hardcoded path.
    links: [
      {
        rel: "preload",
        href: brandAssets.heroBackground,
        as: "image",
        fetchPriority: "high",
      },
    ],
  }),
  component: HomePage,
});

type BirthdayGate = "checking" | "show" | "skip";

/**
 * Resolve the birthday gate after hydration (isomorphic layout effect →
 * no first-paint flash on clients, no SSR mismatch). Priority: preview
 * override → unseen production link → plain homepage.
 */
function useBirthdayGate(birthday: string | undefined, preview: string | undefined) {
  const [gate, setGate] = useState<BirthdayGate>("checking");

  useIsoLayoutEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(BIRTHDAY_SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (preview === "1") setGate("show");
    else if (birthday === "1" && !seen) setGate("show");
    else setGate("skip");
  }, [birthday, preview]);

  const reveal = useCallback(() => setGate("skip"), []);
  return { gate, reveal };
}

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function HomePage() {
  const { birthday, "birthday-preview": birthdayPreview } = Route.useSearch();
  const { gate, reveal } = useBirthdayGate(birthday, birthdayPreview);

  return (
    <>
      {gate === "show" && (
        <BirthdaySurprise preview={birthdayPreview === "1"} onReveal={reveal} />
      )}
      <Hero />
      <FeaturedFleet />
      <WhyChooseUs />
      <BookingSteps />
      <ServicesPreview />
      <AboutTeaser />
      <CtaSection />
    </>
  );
}
