import { useCallback, useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { brandAssets } from "@/data/assets";
import { siteConfig } from "@/data/site";
import { SERVICES } from "@/data/services";
import { VEHICLE_CATEGORIES, categorySlug } from "@/data/vehicles";
import { cn } from "@/lib/utils";
import { useCurrency } from "./CurrencyProvider";
import { CURRENCY_OPTIONS } from "@/lib/currency";

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
  menuKey,
  label,
  openMenu,
  setOpenMenu,
  children,
}: {
  menuKey: string;
  label: string;
  openMenu: string | null;
  setOpenMenu: (open: string | null) => void;
  children: React.ReactNode;
}) {
  const open = openMenu === menuKey;
  return (
    <div
      className="relative"
      data-dropdown-menu={menuKey}
      onMouseEnter={() => setOpenMenu(menuKey)}
      onMouseLeave={() => setOpenMenu(null)}
      onFocusCapture={() => setOpenMenu(menuKey)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenMenu(null);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpenMenu(null);
      }}
    >
      <button
        type="button"
        className={cn(NAV_LINK, "flex items-center gap-1 py-2")}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpenMenu(open ? null : menuKey)}
      >
        {label}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-300",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      <div
        className={cn(
          "absolute left-1/2 top-full -translate-x-1/2 pt-2 transition-all duration-200",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
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
  // Which desktop dropdown is currently open. Controlled state replaces the
  // old CSS-only hover mechanism so item clicks, outside presses, Escape,
  // hover switching and route changes can all deterministically close it.
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeMenus = useCallback(() => setOpenMenu(null), []);
  const closeMobile = useCallback(() => setMenuOpen(false), []);
  const { currency, setCurrency } = useCurrency();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const solid = scrolled || pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Any route change (incl. browser back/forward) always leaves menus closed.
  useEffect(() => {
    setMenuOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Pressing anywhere outside an open desktop dropdown closes it.
  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (e: PointerEvent) => {
      if (e.target instanceof Element && e.target.closest("[data-dropdown-menu]")) return;
      setOpenMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [openMenu]);

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
          <Dropdown menuKey="fleet" label="Fleet" openMenu={openMenu} setOpenMenu={setOpenMenu}>
            {fleetItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                search={item.search}
                onClick={closeMenus}
                className={dropdownLinkCls}
                activeProps={{ className: cn(dropdownLinkCls, "text-gold") }}
                activeOptions={{ exact: item.label === "All Vehicles", includeSearch: item.label !== "All Vehicles" }}
              >
                {item.label}
              </Link>
            ))}
          </Dropdown>
          <Dropdown menuKey="services" label="Services" openMenu={openMenu} setOpenMenu={setOpenMenu}>
            {serviceItems.map((item) => (
              <Link key={item.label} to={item.to} hash={item.hash} onClick={closeMenus} className={dropdownLinkCls}>
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
          <select
            aria-label="Display currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="cursor-pointer appearance-none bg-transparent pr-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/75 transition-colors hover:text-gold focus:outline-none [&>option]:bg-night"
          >
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option.code} value={option.code}>
                {option.code}
              </option>
            ))}
          </select>
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
            <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Currency
              </span>
              <select
                aria-label="Display currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="cursor-pointer border border-border bg-night px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground focus:outline-none [&>option]:bg-night"
              >
                {CURRENCY_OPTIONS.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.code} — {option.name}
                  </option>
                ))}
              </select>
            </div>
            <MobileLink to="/" label="Home" onClick={closeMobile} />
            <p className="label-caps mt-8 mb-2">Fleet</p>
            <div className="grid grid-cols-2 gap-x-4">
              {fleetItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  search={item.search}
                  onClick={closeMobile}
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
                  onClick={closeMobile}
                  className="border-b border-border/60 py-3 text-sm text-foreground/80 transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <MobileLink to="/about" label="About" onClick={closeMobile} />
              <MobileLink to="/contact" label="Contact" onClick={closeMobile} />
            </div>
            <div className="mt-10 flex flex-col gap-3">
              <Link to="/book" onClick={closeMobile} className="btn-gold w-full">
                Book Now
              </Link>
              <a href={siteConfig.phoneHref} onClick={closeMobile} className="btn-outline w-full">
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

function MobileLink({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block py-2 font-display text-3xl text-foreground transition-colors hover:text-gold"
    >
      {label}
    </Link>
  );
}
