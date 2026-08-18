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
  const sign = up ? "+" : "−";
  const color = up ? "text-[#0d7a3f]" : "text-accent";
  return (
    <span className="inline-flex items-baseline gap-2 whitespace-nowrap px-5">
      <span className="font-sans text-[0.72rem] font-semibold text-ink">{q.label}</span>
      <span className="font-sans text-[0.72rem] tabular-nums text-ink-soft">
        {formatPrice(q)}
      </span>
      <span className={`font-sans text-[0.72rem] font-medium tabular-nums ${color}`}>
        {sign}
        {Math.abs(q.change).toLocaleString("en-US", { maximumFractionDigits: 2 })}
        {"  "}({sign}
        {Math.abs(q.changePct).toFixed(2)}%)
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
      className="marquee-mask relative overflow-hidden border-b border-rule bg-paper"
      role="marquee"
      aria-label="Market prices"
    >
      <div className="marquee flex items-center py-2">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
