import { vehicleAssets } from "./assets";
import { siteConfig } from "./site";

/**
 * Fleet data layer.
 *
 * Plain typed structures today; deliberately shaped like the future
 * `vehicles` database table so swapping this module for a Supabase query
 * later requires no component changes.
 */
export type VehicleCategory =
  | "Economy"
  | "Sedan"
  | "SUV"
  | "Luxury"
  | "Premium"
  | "Executive"
  | "4x4 / Off-Road";

export const VEHICLE_CATEGORIES: VehicleCategory[] = [
  "Economy",
  "Sedan",
  "SUV",
  "Luxury",
  "Premium",
  "Executive",
  "4x4 / Off-Road",
];

export const categorySlug = (category: string) =>
  category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export type Availability = "available" | "unavailable";

export interface Vehicle {
  id: string;
  name: string;
  slug: string;
  category: VehicleCategory;
  description: string;
  pricePerDay: number;
  currency: string;
  availability: Availability;
  images: string[];
  thumbnail: string;
  seats: number;
  doors: number;
  transmission: "Automatic" | "Manual";
  fuel: "Petrol" | "Diesel" | "Hybrid";
  airConditioning: boolean;
  features: string[];
  featured: boolean;
}

const USD = siteConfig.currency;

export const VEHICLES: Vehicle[] = [
  {
    id: "v-macan",
    name: "Porsche Macan",
    slug: "porsche-macan",
    category: "Luxury",
    description:
      "Our signature luxury SUV. The Porsche Macan blends sports-car response with everyday comfort — a statement arrival for business trips, special occasions and exploring The Gambia in style.",
    pricePerDay: 180,
    currency: USD,
    availability: "available",
    images: [vehicleAssets.porscheMacan],
    thumbnail: vehicleAssets.porscheMacan,
    seats: 5,
    doors: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    airConditioning: true,
    features: [
      "Premium leather interior",
      "Sport steering wheel",
      "Bluetooth & smartphone audio",
      "Reverse camera",
      "Dual-zone climate control",
      "Alloy wheels",
    ],
    featured: true,
  },
  {
    id: "v-qx60",
    name: "Infiniti QX60",
    slug: "infiniti-qx60",
    category: "Premium",
    description:
      "A refined seven-seat premium SUV with a quiet, spacious cabin — ideal for families, delegations and long comfortable drives across the country.",
    pricePerDay: 160,
    currency: USD,
    availability: "available",
    images: [vehicleAssets.infinitiQx60],
    thumbnail: vehicleAssets.infinitiQx60,
    seats: 7,
    doors: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    airConditioning: true,
    features: [
      "7-seater comfort",
      "Tri-zone climate control",
      "Leather-appointed seats",
      "Bluetooth & USB audio",
      "Reverse camera",
      "Ample luggage space",
    ],
    featured: true,
  },
  {
    id: "v-fpace",
    name: "Jaguar F-PACE",
    slug: "jaguar-f-pace",
    category: "Luxury",
    description:
      "British luxury with athletic character. The F-PACE offers a commanding driving position, a crafted interior and effortless motorway cruising.",
    pricePerDay: 150,
    currency: USD,
    availability: "available",
    images: [vehicleAssets.jaguarFpaceFront, vehicleAssets.jaguarFpaceRear],
    thumbnail: vehicleAssets.jaguarFpaceFront,
    seats: 5,
    doors: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    airConditioning: true,
    features: [
      "Luxury interior trim",
      "Touchscreen infotainment",
      "Bluetooth connectivity",
      "Parking sensors",
      "Climate control",
      "Spacious boot",
    ],
    featured: true,
  },
  {
    id: "v-eclass",
    name: "Mercedes-Benz E-Class",
    slug: "mercedes-benz-e-class",
    category: "Executive",
    description:
      "The executive benchmark. Quiet, composed and immaculately finished — the E-Class is made for business travel, airport runs and formal occasions.",
    pricePerDay: 120,
    currency: USD,
    availability: "available",
    images: [vehicleAssets.mercedesEClass],
    thumbnail: vehicleAssets.mercedesEClass,
    seats: 5,
    doors: 4,
    transmission: "Automatic",
    fuel: "Petrol",
    airConditioning: true,
    features: [
      "Executive leather seating",
      "Premium sound system",
      "Bluetooth & smartphone audio",
      "Dual-zone climate control",
      "Rear passenger comfort",
      "Large boot",
    ],
    featured: false,
  },
  {
    id: "v-sclass",
    name: "Mercedes-Benz S-Class",
    slug: "mercedes-benz-s-class",
    category: "Executive",
    description:
      "The flagship. First-class rear comfort, a whisper-quiet ride and unmistakable presence for VIP movements, weddings and executive itineraries.",
    pricePerDay: 200,
    currency: USD,
    availability: "unavailable",
    images: [vehicleAssets.mercedesSClass],
    thumbnail: vehicleAssets.mercedesSClass,
    seats: 5,
    doors: 4,
    transmission: "Automatic",
    fuel: "Petrol",
    airConditioning: true,
    features: [
      "First-class rear cabin",
      "Premium leather throughout",
      "Ambient interior lighting",
      "Advanced climate control",
      "Chauffeur-ready",
      "Executive privacy",
    ],
    featured: false,
  },
  {
    id: "v-landcruiser",
    name: "Toyota Land Cruiser",
    slug: "toyota-land-cruiser",
    category: "4x4 / Off-Road",
    description:
      "Legendary go-anywhere capability with genuine comfort. The Land Cruiser handles upcountry roads, safaris and long-distance travel with total confidence.",
    pricePerDay: 140,
    currency: USD,
    availability: "available",
    images: [vehicleAssets.toyotaLandCruiser],
    thumbnail: vehicleAssets.toyotaLandCruiser,
    seats: 7,
    doors: 5,
    transmission: "Automatic",
    fuel: "Diesel",
    airConditioning: true,
    features: [
      "Full 4x4 capability",
      "7-seater configuration",
      "High ground clearance",
      "Powerful air conditioning",
      "Long-range comfort",
      "Generous luggage capacity",
    ],
    featured: false,
  },
  {
    id: "v-q3",
    name: "Audi Q3",
    slug: "audi-q3",
    category: "SUV",
    description:
      "A compact premium SUV that is easy to drive and park, with the refinement and build quality Audi is known for — perfect for town and coastal trips.",
    pricePerDay: 95,
    currency: USD,
    availability: "available",
    images: [vehicleAssets.audiQ3],
    thumbnail: vehicleAssets.audiQ3,
    seats: 5,
    doors: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    airConditioning: true,
    features: [
      "Premium compact SUV",
      "Touchscreen infotainment",
      "Bluetooth connectivity",
      "Climate control",
      "Parking sensors",
      "Comfortable ride",
    ],
    featured: false,
  },
  {
    id: "v-camry",
    name: "Toyota Camry",
    slug: "toyota-camry",
    category: "Sedan",
    description:
      "Smooth, quiet and dependable. The Camry is a comfortable midsize sedan for business days, family visits and relaxed long-distance driving.",
    pricePerDay: 85,
    currency: USD,
    availability: "available",
    images: [vehicleAssets.toyotaCamry],
    thumbnail: vehicleAssets.toyotaCamry,
    seats: 5,
    doors: 4,
    transmission: "Automatic",
    fuel: "Petrol",
    airConditioning: true,
    features: [
      "Smooth quiet ride",
      "Spacious interior",
      "Bluetooth audio",
      "Climate control",
      "Large boot",
      "Fuel efficient",
    ],
    featured: false,
  },
  {
    id: "v-corolla",
    name: "Toyota Corolla",
    slug: "toyota-corolla",
    category: "Economy",
    description:
      "Smart value without compromise. Clean, reliable and economical — the Corolla is the easy choice for everyday driving around Banjul and beyond.",
    pricePerDay: 55,
    currency: USD,
    availability: "available",
    images: [vehicleAssets.toyotaCorolla],
    thumbnail: vehicleAssets.toyotaCorolla,
    seats: 5,
    doors: 4,
    transmission: "Automatic",
    fuel: "Petrol",
    airConditioning: true,
    features: [
      "Excellent fuel economy",
      "Air conditioning",
      "Bluetooth audio",
      "Easy to drive",
      "Reliable & maintained",
      "Ideal for city trips",
    ],
    featured: false,
  },
];

export const getVehicleBySlug = (slug: string) =>
  VEHICLES.find((v) => v.slug === slug);

export const getFeaturedVehicles = () => VEHICLES.filter((v) => v.featured);

export const getRelatedVehicles = (vehicle: Vehicle, count = 3) =>
  VEHICLES.filter(
    (v) => v.slug !== vehicle.slug && v.category === vehicle.category,
  )
    .concat(VEHICLES.filter((v) => v.slug !== vehicle.slug))
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, count);

export const formatPrice = (vehicle: Pick<Vehicle, "pricePerDay">) =>
  `$${vehicle.pricePerDay}`;
