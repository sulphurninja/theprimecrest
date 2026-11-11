import { getMarketQuotes, type Quote } from "@/lib/markets";

function formatPrice(q: Quote) {
  const digits = q.price < 10 ? 4 : 2;
  return q.price.toLocaleString("en-US", {
    minimumFractionDigits: digits > 2 ? 3 : 2,
    maximumFractionDigits: digits,
  });
}

function QuoteItem({ q }: { q: Quote }) {
  const up = q.change >= 0;
  const color = up ? "text-[#0f7a45]" : "text-accent";
  return (
    <span className="inline-flex items-baseline gap-2.5 whitespace-nowrap border-r border-ink/10 px-6">
      <span className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.12em] text-ink">
        {q.label}
      </span>
      <span className="font-sans text-[0.74rem] tabular-nums text-ink-soft">{formatPrice(q)}</span>
      <span className={`font-sans text-[0.72rem] font-semibold tabular-nums ${color}`}>
        <span className="mr-0.5 text-[0.6rem]" aria-hidden>
          {up ? "▲" : "▼"}
        </span>
        <span className="sr-only">{up ? "up" : "down"} </span>
        {Math.abs(q.changePct).toFixed(2)}%
      </span>
    </span>
  );
}

export async function MarketStrip() {
  const quotes = await getMarketQuotes();
  if (!quotes.length) return null;

  const row = (ariaHidden: boolean) => (
    <div className="marquee-row" aria-hidden={ariaHidden || undefined}>
      {quotes.map((q) => (
        <QuoteItem key={`${ariaHidden}-${q.symbol}`} q={q} />
      ))}
    </div>
  );

  return (
    <div
      className="marquee-mask relative overflow-hidden border-b border-ink/10 bg-paper"
      role="marquee"
      aria-label="Market prices"
    >
      <div className="marquee flex items-center py-2.5">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
