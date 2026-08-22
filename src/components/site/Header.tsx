import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { brandAssets } from "@/data/assets";
import { siteConfig } from "@/data/site";
import { SERVICES } from "@/data/services";
import { VEHICLE_CATEGORIES, categorySlug } from "@/data/vehicles";
import { cn } from "@/lib/utils";

const NAV_LINK =
  "text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/75 transition-colors hover:text-gold";

const fleetItems = [
  { label: "All Vehicles", to: "/fleet" as const, search: {} },
  ...VEHICLE_CATEGORIES.map((c) => ({
    label: c,
    to: "/fleet" as const,
    search: { category: categorySlug(c) },
  })),
];

const serviceItems = SERVICES.map((s) => ({
  label: s.title,
  to: "/services" as const,
  hash: s.slug,
}));

function Dropdown({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        className={cn(NAV_LINK, "flex items-center gap-1 py-2")}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown
          className="size-3.5 transition-transform duration-300 group-hover:rotate-180"
          aria-hidden
        />
      </button>
      <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className="w-60 border border-border bg-night py-2 shadow-2xl shadow-black/60">
          {children}
        </div>
      </div>
    </div>
  );
}

const dropdownLinkCls =
  "block px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:bg-charcoal hover:text-gold";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const solid = scrolled || pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid
          ? "border-b border-border bg-night/92 backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-night/80 to-transparent",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <Link to="/" aria-label="Tokyo Rentals & Concierge — home" className="shrink-0">
          <img
            src={brandAssets.logo}
            alt="Tokyo Rentals & Concierge logo"
            className="h-11 w-auto md:h-[3.25rem]"
            width={78}
            height={52}
          />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          <Link to="/" className={NAV_LINK} activeProps={{ className: cn(NAV_LINK, "text-gold") }} activeOptions={{ exact: true }}>
            Home
          </Link>
          <Dropdown label="Fleet">
            {fleetItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                search={item.search}
                className={dropdownLinkCls}
                activeProps={{ className: cn(dropdownLinkCls, "text-gold") }}
                activeOptions={{ exact: item.label === "All Vehicles", includeSearch: item.label !== "All Vehicles" }}
              >
                {item.label}
              </Link>
            ))}
          </Dropdown>
          <Dropdown label="Services">
            {serviceItems.map((item) => (
              <Link key={item.label} to={item.to} hash={item.hash} className={dropdownLinkCls}>
                {item.label}
              </Link>
            ))}
          </Dropdown>
          <Link to="/about" className={NAV_LINK} activeProps={{ className: cn(NAV_LINK, "text-gold") }}>
            About
          </Link>
          <Link to="/contact" className={NAV_LINK} activeProps={{ className: cn(NAV_LINK, "text-gold") }}>
            Contact
          </Link>
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href={siteConfig.phoneHref}
            className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-foreground/75 transition-colors hover:text-gold"
          >
            <Phone className="size-3.5 text-gold" aria-hidden />
            {siteConfig.phoneDisplay}
          </a>
          <Link to="/book" className="btn-gold !px-5 !py-2.5 text-[11px]">
            Book Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="flex size-11 items-center justify-center text-foreground lg:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="fixed inset-0 top-[4.5rem] z-50 overflow-y-auto border-t border-border bg-night lg:hidden">
          <nav aria-label="Mobile" className="mx-auto max-w-7xl px-6 py-8">
            <MobileLink to="/" label="Home" />
            <p className="label-caps mt-8 mb-2">Fleet</p>
            <div className="grid grid-cols-2 gap-x-4">
              {fleetItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  search={item.search}
                  className="border-b border-border/60 py-3 text-sm text-foreground/80 transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="label-caps mt-8 mb-2">Services</p>
            <div className="grid grid-cols-1 gap-x-4">
              {serviceItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  hash={item.hash}
                  className="border-b border-border/60 py-3 text-sm text-foreground/80 transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <MobileLink to="/about" label="About" />
              <MobileLink to="/contact" label="Contact" />
            </div>
            <div className="mt-10 flex flex-col gap-3">
              <Link to="/book" className="btn-gold w-full">
                Book Now
              </Link>
              <a href={siteConfig.phoneHref} className="btn-outline w-full">
                <Phone className="size-4" aria-hidden />
                Call {siteConfig.phoneDisplay}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function MobileLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="block py-2 font-display text-3xl text-foreground transition-colors hover:text-gold"
    >
      {label}
    </Link>
  );
}
