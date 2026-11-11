import { NewsletterForm } from "@/components/site/NewsletterForm";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "The Morning Letter",
  description:
    "One considered briefing from the PrimeCrest editors, weekday mornings. No aggregation, no filler.",
  path: "/newsletter",
});

const PROMISES = [
  {
    title: "Five minutes, honestly counted",
    body: "One story that matters, told properly, with the context to understand it — not forty links you'll never open.",
  },
  {
    title: "Written, not assembled",
    body: "Every edition is drafted by an editor who read the source material. If we haven't verified it, we don't send it.",
  },
  {
    title: "Your inbox is not inventory",
    body: "No list sales, no tracking pixels beyond an open count, and an unsubscribe that works the first time.",
  },
];

export default function NewsletterPage() {
  return (
    <div>
      <header className="border-b border-ink/10">
        <div className="mx-auto max-w-[880px] px-4 pb-16 pt-16 text-center sm:px-6 lg:pt-24">
          <p className="label text-accent">The Morning Letter</p>
          <h1 className="statement mx-auto mt-4 max-w-3xl text-[2.6rem] sm:text-[3.6rem] lg:text-[4.2rem]">
            The day&apos;s sharpest reading, <em>before the noise starts</em>
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-[1.18rem] leading-relaxed text-ink-soft">
            A considered briefing from our editors, weekday mornings at six. Free, brief, and
            written like we mean it.
          </p>
          <div className="mx-auto mt-10 max-w-md">
            <NewsletterForm />
          </div>
          <p className="mt-4 font-sans text-[0.78rem] text-muted">Free. Unsubscribe in one click.</p>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1320px] grid-cols-1 gap-6 px-4 py-16 sm:px-6 md:grid-cols-3">
        {PROMISES.map((item) => (
          <div key={item.title} className="card p-7">
            <h2 className="headline text-[1.2rem]">{item.title}</h2>
            <p className="mt-3 font-serif text-[0.98rem] leading-relaxed text-ink-soft">{item.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
