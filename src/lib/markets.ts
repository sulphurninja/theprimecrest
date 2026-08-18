/**
 * Market quotes for the ticker strip, via Yahoo Finance's public chart
 * endpoint. Cached for 5 minutes; falls back to recent static values if the
 * upstream is unreachable so the strip never renders empty.
 */

export type Quote = {
  symbol: string;
  label: string;
  price: number;
  change: number;
  changePct: number;
};

const SYMBOLS: Array<{ symbol: string; label: string }> = [
  { symbol: "^GSPC", label: "S&P 500" },
  { symbol: "^DJI", label: "Dow Jones" },
  { symbol: "^IXIC", label: "Nasdaq" },
  { symbol: "AAPL", label: "Apple" },
  { symbol: "MSFT", label: "Microsoft" },
  { symbol: "NVDA", label: "Nvidia" },
  { symbol: "TSLA", label: "Tesla" },
  { symbol: "BTC-USD", label: "Bitcoin" },
  { symbol: "GC=F", label: "Gold" },
  { symbol: "EURUSD=X", label: "EUR / USD" },
];

/** Plausible values used only when the live fetch fails. */
const FALLBACK: Quote[] = [
  { symbol: "^GSPC", label: "S&P 500", price: 6712.4, change: 23.1, changePct: 0.35 },
  { symbol: "^DJI", label: "Dow Jones", price: 47210.9, change: -102.4, changePct: -0.22 },
  { symbol: "^IXIC", label: "Nasdaq", price: 22841.7, change: 96.3, changePct: 0.42 },
  { symbol: "AAPL", label: "Apple", price: 310.03, change: 4.44, changePct: 1.45 },
  { symbol: "MSFT", label: "Microsoft", price: 512.6, change: 3.1, changePct: 0.61 },
  { symbol: "NVDA", label: "Nvidia", price: 231.4, change: -1.8, changePct: -0.77 },
  { symbol: "TSLA", label: "Tesla", price: 402.2, change: 6.9, changePct: 1.75 },
  { symbol: "BTC-USD", label: "Bitcoin", price: 118240, change: 1520, changePct: 1.3 },
  { symbol: "GC=F", label: "Gold", price: 3345.2, change: 12.4, changePct: 0.37 },
  { symbol: "EURUSD=X", label: "EUR / USD", price: 1.169, change: 0.002, changePct: 0.17 },
];

async function fetchQuote(symbol: string, label: string): Promise<Quote | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol,
  )}?interval=1d&range=1d`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(4000),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const meta = data?.chart?.result?.[0]?.meta;
  const price: number | undefined = meta?.regularMarketPrice;
  const prev: number | undefined = meta?.chartPreviousClose ?? meta?.previousClose;
  if (typeof price !== "number" || typeof prev !== "number" || prev === 0) return null;
  const change = price - prev;
  return {
    symbol,
    label,
    price,
    change,
    changePct: (change / prev) * 100,
  };
}

export async function getMarketQuotes(): Promise<Quote[]> {
  try {
    const results = await Promise.allSettled(
      SYMBOLS.map((s) => fetchQuote(s.symbol, s.label)),
    );
    const quotes = results
      .map((r) => (r.status === "fulfilled" ? r.value : null))
      .filter((q): q is Quote => q !== null);
    // If most symbols failed, the upstream is unhealthy — show fallback.
    return quotes.length >= 5 ? quotes : FALLBACK;
  } catch {
    return FALLBACK;
  }
}
