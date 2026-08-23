import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BASE_CURRENCY,
  currencyForCountry,
  detectCountry,
  fetchRates,
  formatMoney,
  loadCachedRates,
  loadStoredCurrency,
  isValidCurrency,
  storeCurrency,
} from "@/lib/currency";

/**
 * App-wide display-currency context.
 *
 * Renders start on the canonical base currency (no render blocking), then an
 * effect applies, in priority order: a stored manual override → IP-detected
 * country → GMD default. Live rates hydrate from cache first, then refresh
 * in the background; failed fetches simply keep base prices on screen.
 */

interface CurrencyContextValue {
  /** Active display currency (ISO 4217 code). */
  currency: string;
  /** Format an amount expressed in the canonical base currency. */
  format: (amountInBase: number) => string;
  /** Manual override from the header selector; persists across sessions. */
  setCurrency: (code: string) => void;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<string>(BASE_CURRENCY);
  const [rates, setRates] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Hydrate cached rates synchronously so returning visitors convert
    // immediately, then refresh in the background.
    const cached = loadCachedRates();
    if (cached) setRates(cached);
    void fetchRates().then((fresh) => {
      if (!cancelled && fresh) setRates(fresh);
    });

    // Manual override wins; otherwise detect; otherwise GMD.
    const stored = loadStoredCurrency();
    if (stored) {
      setCurrencyState(stored);
    } else {
      detectCountry()
        .then((country) => {
          if (!cancelled) setCurrencyState(currencyForCountry(country));
        })
        .catch(() => {
          if (!cancelled) setCurrencyState("GMD");
        });
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = useCallback((code: string) => {
    if (!isValidCurrency(code)) return;
    setCurrencyState(code);
    storeCurrency(code);
  }, []);

  const format = useCallback(
    (amountInBase: number) => formatMoney(amountInBase, currency, rates),
    [currency, rates],
  );

  const value = useMemo(
    () => ({ currency, format, setCurrency }),
    [currency, format, setCurrency],
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}