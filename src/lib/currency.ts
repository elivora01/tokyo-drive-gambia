import { siteConfig } from "@/data/site";

/**
 * Currency system.
 *
 * - Vehicle prices in the data layer are canonical and stay untouched; they
 *   are expressed in BASE_CURRENCY (USD, matching siteConfig.currency).
 * - Display currency is auto-detected from the visitor's IP (country →
 *   currency), defaulting to GMD for Gambian visitors AND for any
 *   detection/API failure, per product spec.
 * - Exchange rates are fetched live from keyless public endpoints (with a
 *   short-lived localStorage cache). No static/hard-coded rates exist here:
 *   if every source fails, the site keeps showing canonical base prices
 *   instead of inventing conversions.
 */

export const BASE_CURRENCY: string = siteConfig.currency;

export interface CurrencyOption {
  code: string;
  name: string;
}

/** Manually selectable + auto-detector-supported currencies. */
export const CURRENCY_OPTIONS: readonly CurrencyOption[] = [
  { code: "GMD", name: "Gambian Dalasi" },
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "XOF", name: "CFA Franc (West)" },
];

const CURRENCY_STORAGE_KEY = "trc.currency";
const RATES_STORAGE_KEY = "trc.rates.v1";
const RATES_TTL_MS = 12 * 60 * 60 * 1000;

/** ISO-3166 alpha-2 → preferred display currency (unlisted countries → GMD). */
const COUNTRY_TO_CURRENCY: Readonly<Record<string, string>> = {
  GM: "GMD",
  US: "USD",
  GB: "GBP",
  // Eurozone
  AT: "EUR", BE: "EUR", HR: "EUR", CY: "EUR", EE: "EUR", FI: "EUR",
  FR: "EUR", DE: "EUR", GR: "EUR", IE: "EUR", IT: "EUR", LV: "EUR",
  LT: "EUR", LU: "EUR", MT: "EUR", NL: "EUR", PT: "EUR", SK: "EUR",
  SI: "EUR", ES: "EUR",
  // CFA franc (West African) monetary zone
  SN: "XOF", CI: "XOF", ML: "XOF", BF: "XOF", BJ: "XOF", TG: "XOF",
  NE: "XOF", GW: "XOF",
};

export function isValidCurrency(code: string): boolean {
  return CURRENCY_OPTIONS.some((o) => o.code === code);
}

export function currencyForCountry(countryCode: string | null | undefined): string {
  if (!countryCode) return "GMD";
  return COUNTRY_TO_CURRENCY[countryCode.toUpperCase()] ?? "GMD";
}

/* ------------------------------------------------------------------ */
/* Storage helpers (guarded — private-mode Safari throws on access).   */
/* ------------------------------------------------------------------ */

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export function loadStoredCurrency(): string | null {
  const stored = safeGet(CURRENCY_STORAGE_KEY);
  return stored && isValidCurrency(stored) ? stored : null;
}

export function storeCurrency(code: string): void {
  safeSet(CURRENCY_STORAGE_KEY, code);
}

interface CachedRates {
  rates: Record<string, number>;
  fetchedAt: number;
}

/** Previously fetched live rates, if present and still within TTL. */
export function loadCachedRates(): Record<string, number> | null {
  const raw = safeGet(RATES_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CachedRates;
    if (
      typeof parsed?.fetchedAt !== "number" ||
      Date.now() - parsed.fetchedAt > RATES_TTL_MS ||
      typeof parsed?.rates !== "object" ||
      parsed.rates === null
    ) {
      return null;
    }
    return parsed.rates;
  } catch {
    return null;
  }
}

export function saveRates(rates: Record<string, number>): void {
  const payload: CachedRates = { rates, fetchedAt: Date.now() };
  safeSet(RATES_STORAGE_KEY, JSON.stringify(payload));
}

/* ------------------------------------------------------------------ */
/* Network — keyless public endpoints with hard timeouts.              */
/* ------------------------------------------------------------------ */

async function fetchJson(url: string, timeoutMs = 6000): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Keep only the currencies this site actually renders; USD pinned to 1. */
function sanitizeRates(raw: Record<string, unknown>): Record<string, number> | null {
  const out: Record<string, number> = { [BASE_CURRENCY]: 1 };
  for (const option of CURRENCY_OPTIONS) {
    if (option.code === BASE_CURRENCY) continue;
    const value = raw[option.code];
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      out[option.code] = value;
    }
  }
  return Object.keys(out).length >= 2 ? out : null;
}

/**
 * Live USD-based rates for every supported currency, or null when every
 * source fails (callers then keep displaying canonical base prices).
 */
export async function fetchRates(): Promise<Record<string, number> | null> {
  const sources: Array<() => Promise<Record<string, unknown>>> = [
    async () => {
      const json = (await fetchJson("https://open.er-api.com/v6/latest/USD")) as {
        result?: string;
        rates?: Record<string, unknown>;
      };
      if (json.result !== "success" || !json.rates) throw new Error("bad payload");
      return json.rates;
    },
    async () => {
      const json = (await fetchJson(
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
      )) as { usd?: Record<string, unknown> };
      if (!json.usd) throw new Error("bad payload");
      return json.usd;
    },
  ];
  for (const source of sources) {
    try {
      const sanitized = sanitizeRates(await source());
      if (sanitized) return sanitized;
    } catch {
      /* try next source */
    }
  }
  return null;
}

/** Visitor country via IP, or null when detection fails. */
export async function detectCountry(): Promise<string | null> {
  const sources: Array<() => Promise<string | null>> = [
    async () => {
      const json = (await fetchJson("https://get.geojs.io/v1/ip/country.json")) as {
        country?: unknown;
      };
      return typeof json.country === "string" ? json.country : null;
    },
    async () => {
      const json = (await fetchJson("https://ipwho.is/")) as {
        success?: boolean;
        country_code?: unknown;
      };
      return json.success === true && typeof json.country_code === "string"
        ? json.country_code
        : null;
    },
  ];
  for (const source of sources) {
    try {
      const country = await source();
      if (country) return country;
    } catch {
      /* try next source */
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

/**
 * Format an amount expressed in the canonical base currency for display.
 * Converts through the provided live rates; when rates are unavailable the
 * canonical base price is shown unchanged rather than a fabricated figure.
 */
export function formatMoney(
  amountInBase: number,
  currency: string,
  rates: Readonly<Record<string, number>> | null,
): string {
  const rate =
    currency === BASE_CURRENCY ? 1 : rates ? rates[currency] : undefined;
  const convertible = typeof rate === "number" && Number.isFinite(rate) && rate > 0;
  const effectiveCurrency = convertible ? currency : BASE_CURRENCY;
  const value = convertible ? amountInBase * (rate as number) : amountInBase;
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: effectiveCurrency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${effectiveCurrency === BASE_CURRENCY ? "$" : `${effectiveCurrency} `}${Math.round(value).toLocaleString("en-US")}`;
  }
}