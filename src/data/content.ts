import {
  Armchair,
  BadgeCheck,
  CalendarRange,
  Car,
  CalendarDays,
  HandCoins,
  Headset,
  MapPin,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

/**
 * Homepage / About content blocks — shaped like future CMS collections.
 */

export interface ValuePoint {
  title: string;
  text: string;
  icon: LucideIcon;
}

export const WHY_CHOOSE_US: ValuePoint[] = [
  {
    title: "Clean & Reliable Vehicles",
    text: "Every vehicle is cleaned, inspected and maintained before it reaches you — no surprises, just a car you can trust.",
    icon: BadgeCheck,
  },
  {
    title: "Affordable Luxury",
    text: "Premium vehicles at honest rates. Luxury made accessible, from economy runabouts to flagship SUVs.",
    icon: HandCoins,
  },
  {
    title: "Professional Customer Service",
    text: "A responsive local team available around the clock — before, during and after your rental.",
    icon: Headset,
  },
  {
    title: "Flexible Rental Options",
    text: "Daily, weekly and long-term rentals with pickup and return arranged around your schedule.",
    icon: CalendarRange,
  },
  {
    title: "Local Support",
    text: "Based in Banjul with genuine local knowledge — routes, destinations and help whenever you need it.",
    icon: MapPin,
  },
  {
    title: "Comfort & Convenience",
    text: "Air-conditioned, well-equipped vehicles and a booking process that takes minutes over WhatsApp.",
    icon: Armchair,
  },
];

export interface BookingStep {
  step: string;
  title: string;
  text: string;
  icon: LucideIcon;
}

export const BOOKING_STEPS: BookingStep[] = [
  {
    step: "01",
    title: "Choose Your Vehicle",
    text: "Browse the fleet and pick the car that fits your journey.",
    icon: Car,
  },
  {
    step: "02",
    title: "Choose Your Dates",
    text: "Select your pickup and return dates and tell us where to meet you.",
    icon: CalendarDays,
  },
  {
    step: "03",
    title: "Confirm Through WhatsApp",
    text: "Send your request in one tap — we confirm availability and details personally.",
    icon: MessageCircle,
  },
];

export const ABOUT_VALUES: string[] = [
  "Reliability — vehicles that start, run and arrive as promised",
  "Clean, maintained cars prepared for every single rental",
  "Comfort as standard, from seating to climate control",
  "Professional, courteous service at every interaction",
  "Customer satisfaction measured in returning clients",
  "Local knowledge that makes every journey smoother",
  "A convenient rental experience from first message to final drop-off",
];
