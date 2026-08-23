/**
 * Central asset registry.
 *
 * Every image used on the site is imported exactly once, here. Components
 * never import image files directly — they read from this registry. A future
 * Super Admin can swap any asset by replacing the file (or, later, a CDN
 * URL stored in the database) without touching a single component.
 *
 * Structure:
 *   brand/    logo, hero artwork
 *   vehicles/ fleet photography
 *   pages/    imagery for About / Services / Contact
 */
// Brand imagery ships as optimized WebP derivatives (encoded from the PNG
// masters with libwebp). The original .png files remain next to them as
// untouched backups and are intentionally not imported anywhere.
import logoImg from "@/assets/brand/logo.webp";
import heroArtworkImg from "@/assets/brand/hero-artwork.webp";
import heroCleanImg from "@/assets/brand/hero-clean.webp";

import porscheMacanImg from "@/assets/vehicles/porsche-macan.png";
import infinitiQx60Img from "@/assets/vehicles/infiniti-qx60.png";
import jaguarFpaceFrontImg from "@/assets/vehicles/jaguar-fpace-front.jpg";
import jaguarFpaceRearImg from "@/assets/vehicles/jaguar-fpace-rear.jpg";
import mercedesEClassImg from "@/assets/vehicles/mercedes-eclass.png";
import audiQ3Img from "@/assets/vehicles/audi-q3.png";

import toyotaCorollaImg from "@/assets/vehicles/toyota-corolla.jpg";
import toyotaCamryImg from "@/assets/vehicles/toyota-camry.jpg";
import toyotaLandCruiserImg from "@/assets/vehicles/toyota-landcruiser.jpg";
import mercedesSClassImg from "@/assets/vehicles/mercedes-sclass.jpg";

import storefrontImg from "@/assets/pages/storefront.png";
import premisesImg from "@/assets/pages/premises.png";
import showroomImg from "@/assets/pages/showroom.jpg";

export const brandAssets = {
  logo: logoImg,
  /** Original brand artwork with baked-in typography — used as a showcase banner. */
  heroArtwork: heroArtworkImg,
  /** Clean cinematic version of the artwork used as the homepage hero background. */
  heroBackground: heroCleanImg,
} as const;

export const vehicleAssets = {
  porscheMacan: porscheMacanImg,
  infinitiQx60: infinitiQx60Img,
  jaguarFpaceFront: jaguarFpaceFrontImg,
  jaguarFpaceRear: jaguarFpaceRearImg,
  mercedesEClass: mercedesEClassImg,
  audiQ3: audiQ3Img,
  toyotaCorolla: toyotaCorollaImg,
  toyotaCamry: toyotaCamryImg,
  toyotaLandCruiser: toyotaLandCruiserImg,
  mercedesSClass: mercedesSClassImg,
} as const;

export const pageAssets = {
  storefront: storefrontImg,
  premises: premisesImg,
  showroom: showroomImg,
} as const;
