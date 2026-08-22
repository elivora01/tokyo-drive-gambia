/**
 * Central site configuration.
 *
 * Everything a future Super Admin should be able to edit without touching
 * components lives here (or in the sibling data modules). When Supabase is
 * introduced, these constants become rows in a `site_settings` table.
 */
export const siteConfig = {
  name: "Tokyo Rentals & Concierge",
  legalName: "Tokyo Rentals Gambia",
  tagline: "Drive With Confidence. Travel With Class.",
  shortDescription:
    "Luxury cars made affordable. Clean, reliable and stylish vehicles designed to deliver comfort, performance and confidence throughout The Gambia.",
  location: "Banjul, The Gambia",
  phoneDisplay: "+220 780 0015",
  phoneHref: "tel:+2207800015",
  /** Digits only, international format — used for every wa.me deep link. */
  whatsappNumber: "2207800015",
  hoursLabel: "Open 7 Days a Week",
  hoursDetail: "24/7 customer support — office visits by appointment",
  currency: "USD",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Banjul,+The+Gambia&z=13&output=embed",
  mapsLink: "https://www.google.com/maps?q=Banjul,+The+Gambia",
} as const;

export type SiteConfig = typeof siteConfig;
