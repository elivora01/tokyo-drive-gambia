import { Link } from "@tanstack/react-router";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { brandAssets } from "@/data/assets";
import { siteConfig } from "@/data/site";
import { SERVICES } from "@/data/services";
import { GENERAL_ENQUIRY_URL } from "@/lib/whatsapp";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-night">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div>
          <img
            src={brandAssets.logo}
            alt="Tokyo Rentals & Concierge logo"
            className="h-16 w-auto"
            loading="lazy"
            width={96}
            height={64}
          />
          <p className="mt-5 font-display text-lg italic text-gold-soft">
            {siteConfig.tagline}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Luxury cars made affordable — clean, reliable and stylish vehicles
            for your journey across The Gambia.
          </p>
        </div>

        {/* Quick links */}
        <nav aria-label="Footer">
          <p className="label-caps mb-5">Quick Links</p>
          <ul className="space-y-3 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/fleet", label: "Fleet" },
              { to: "/services", label: "Services" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
              { to: "/book", label: "Book Now" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-foreground/70 transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Services */}
        <nav aria-label="Services">
          <p className="label-caps mb-5">Services</p>
          <ul className="space-y-3 text-sm">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <Link
                  to="/services"
                  hash={s.slug}
                  className="text-foreground/70 transition-colors hover:text-gold"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <p className="label-caps mb-5">Contact</p>
          <ul className="space-y-4 text-sm text-foreground/70">
            <li>
              <a
                href={siteConfig.phoneHref}
                className="flex items-start gap-3 transition-colors hover:text-gold"
              >
                <Phone className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                {siteConfig.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={GENERAL_ENQUIRY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 transition-colors hover:text-gold"
              >
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                WhatsApp {siteConfig.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              {siteConfig.location}
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              <span>
                {siteConfig.hoursLabel}
                <span className="block text-xs text-muted-foreground">
                  {siteConfig.hoursDetail}
                </span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-muted-foreground sm:flex-row lg:px-8">
          <p>
            © {year} {siteConfig.name} — {siteConfig.location}
          </p>
          <p className="tracking-[0.25em] uppercase">
            Luxury · Comfort · Style
          </p>
        </div>
      </div>
    </footer>
  );
}
