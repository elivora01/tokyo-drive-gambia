import { siteConfig } from "@/data/site";

/**
 * WhatsApp deep-link helpers.
 *
 * The number lives exclusively in siteConfig.whatsappNumber — a future
 * Super Admin changes it in one place (or one settings row) and every CTA
 * on the site follows.
 */
export const waUrl = (message: string) =>
  `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const GENERAL_ENQUIRY_URL = waUrl(
  "TOKYO RENTALS & CONCIERGE\n\nHello! I would like to make an enquiry.",
);

export const vehicleEnquiryUrl = (vehicleName: string) =>
  waUrl(
    `TOKYO RENTALS & CONCIERGE\n\nHello! I'm interested in renting the ${vehicleName}. Please share availability and details.`,
  );

export const serviceEnquiryUrl = (serviceTitle: string) =>
  waUrl(
    `TOKYO RENTALS & CONCIERGE\n\nHello! I would like to ask about your ${serviceTitle}.`,
  );

export interface BookingDetails {
  vehicleName: string;
  pickupDate: string;
  returnDate: string;
  customerName: string;
  phone: string;
  email: string;
  message?: string | undefined;
  rentalDays?: number | undefined;
  estimatedTotal?: string | undefined;
  reference?: string | undefined;
  pickupLocation?: string | undefined;
  returnLocation?: string | undefined;
}

export const bookingMessage = (b: BookingDetails) =>
  [
    "TOKYO RENTALS & CONCIERGE",
    "NEW RENTAL BOOKING REQUEST",
    "",
    b.reference ? `Reference: ${b.reference}` : "",
    `Vehicle: ${b.vehicleName}`,
    `Pickup Date: ${b.pickupDate}`,
    `Return Date: ${b.returnDate}`,
    b.pickupLocation ? `Pickup Location: ${b.pickupLocation}` : "",
    b.returnLocation ? `Return Location: ${b.returnLocation}` : "",
    b.rentalDays ? `Rental Days: ${b.rentalDays}` : "",
    b.estimatedTotal ? `Estimated Total: ${b.estimatedTotal}` : "",
    `Customer Name: ${b.customerName}`,
    `Phone: ${b.phone}`,
    `Email: ${b.email}`,
    `Additional Request: ${b.message?.trim() || "—"}`,
  ]
    .filter((line) => line !== "")
    .join("\n");

export const bookingUrl = (b: BookingDetails) => waUrl(bookingMessage(b));

export const contactMessage = (input: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) =>
  [
    "TOKYO RENTALS & CONCIERGE",
    "NEW WEBSITE ENQUIRY",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.phone?.trim() ? `Phone: ${input.phone}` : "",
    "",
    input.message.trim(),
  ]
    .filter((line) => line !== "")
    .join("\n");
