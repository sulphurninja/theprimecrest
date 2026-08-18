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
    <div className="mx-auto max-w-[880px] px-5 lg:px-8">
      <header className="py-20 text-center">
        <p className="kicker">The Morning Letter</p>
        <h1 className="headline mx-auto mt-4 max-w-2xl text-[2.6rem] sm:text-[3.6rem]">
          The day&apos;s sharpest reading, before the noise starts.
        </h1>
        <p className="dek mx-auto mt-6 max-w-xl text-[1.2rem]">
          A considered briefing from our editors, weekday mornings at six. Free, brief, and
          written like we mean it.
        </p>
        <div className="mx-auto mt-10 max-w-md">
          <NewsletterForm />
        </div>
      </header>

      <section className="grid gap-10 border-t border-rule py-14 md:grid-cols-3">
        {PROMISES.map((item) => (
          <div key={item.title}>
            <h2 className="headline text-[1.3rem]">{item.title}</h2>
            <p className="mt-3 font-serif text-[0.95rem] leading-relaxed text-ink-soft">
              {item.body}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
