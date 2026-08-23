import { createFileRoute } from "@tanstack/react-router";
import { brandAssets } from "@/data/assets";
import { Hero } from "@/components/home/Hero";
import { FeaturedFleet } from "@/components/sections/FeaturedFleet";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { BookingSteps } from "@/components/sections/BookingSteps";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { CtaSection } from "@/components/sections/CtaSection";

export const Route = createFileRoute("/")({
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

function HomePage() {
  return (
    <>
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
