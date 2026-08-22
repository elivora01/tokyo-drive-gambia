import {
  Briefcase,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  ConciergeBell,
  Plane,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

/**
 * Services data layer — shaped like a future `services` table.
 */
export interface Service {
  id: string;
  slug: string;
  title: string;
  summary: string;
  details: string[];
  icon: LucideIcon;
}

export const SERVICES: Service[] = [
  {
    id: "s-daily",
    slug: "daily-rentals",
    title: "Daily Car Rental",
    summary:
      "Flexible day-by-day hire for meetings, errands, beach trips and special occasions.",
    details: [
      "Pickup and return at times that suit your day",
      "Clean, fuelled and inspected before every rental",
      "Full fleet available — economy to luxury",
    ],
    icon: CalendarDays,
  },
  {
    id: "s-weekly",
    slug: "weekly-rentals",
    title: "Weekly Car Rental",
    summary:
      "Better value for stays of a week or more — holidays, projects and family visits.",
    details: [
      "Reduced weekly rates across the fleet",
      "Swap vehicle mid-rental on request",
      "Priority support throughout your rental",
    ],
    icon: CalendarCheck,
  },
  {
    id: "s-long-term",
    slug: "long-term-rentals",
    title: "Long-Term Rental",
    summary:
      "Monthly arrangements for residents, organisations and extended assignments.",
    details: [
      "Tailored monthly pricing",
      "Scheduled maintenance handled by us",
      "Dedicated account contact",
    ],
    icon: CalendarClock,
  },
  {
    id: "s-airport",
    slug: "airport-transfers",
    title: "Airport Pickup & Drop-off",
    summary:
      "Seamless arrivals and departures at Banjul International Airport, day or night.",
    details: [
      "Flight-tracked pickup timing",
      "Meet & greet on arrival",
      "Direct transfer to your hotel or residence",
    ],
    icon: Plane,
  },
  {
    id: "s-chauffeur",
    slug: "chauffeur-service",
    title: "Chauffeur Service",
    summary:
      "A professional driver at the wheel so you can work, relax or host guests.",
    details: [
      "Experienced, discreet local drivers",
      "Hourly or full-day hire",
      "Ideal for executives, weddings and events",
    ],
    icon: UserCheck,
  },
  {
    id: "s-corporate",
    slug: "corporate-transportation",
    title: "Corporate Transportation",
    summary:
      "Reliable movement for teams, delegations and corporate guests across The Gambia.",
    details: [
      "Multi-vehicle coordination",
      "Monthly billing arrangements",
      "Consistent, professional presentation",
    ],
    icon: Briefcase,
  },
  {
    id: "s-concierge",
    slug: "concierge-service",
    title: "Concierge Assistance",
    summary:
      "Local knowledge on call — reservations, recommendations and trip planning.",
    details: [
      "Restaurant & hotel recommendations",
      "Itinerary suggestions across the country",
      "One point of contact for your whole trip",
    ],
    icon: ConciergeBell,
  },
];

export const getServiceBySlug = (slug: string) =>
  SERVICES.find((s) => s.slug === slug);
