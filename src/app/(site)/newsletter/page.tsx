import { NewsletterForm } from "@/components/site/NewsletterForm";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "The PrimeCrest Briefing",
  description:
    "The PrimeCrest Briefing: the leaders, companies and decisions shaping global business, in one concise email each weekday morning.",
  path: "/newsletter",
});

const PROMISES = [
  {
    title: "Five minutes, every weekday",
    body: "The essential stories of the day with the context to understand them, not a list of links to work through.",
  },
  {
    title: "Written by editors",
    body: "Every edition is written by an editor who has read the source material. If it has not been verified, it is not sent.",
  },
  {
    title: "Your privacy, respected",
    body: "We never sell or share the list, and every email has a one-click unsubscribe.",
  },
];

export default function NewsletterPage() {
  return (
    <div>
      <header className="border-b border-ink">
        <div className="mx-auto max-w-[880px] px-4 pb-16 pt-16 text-center sm:px-6 lg:pt-24">
          <p className="label !tracking-[0.28em] text-ink">The PrimeCrest Briefing</p>
          <h1 className="display-caps mx-auto mt-5 max-w-3xl text-[2.6rem] sm:text-[3.6rem] lg:text-[4.2rem]">
            Global business, briefed before the markets open
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-[1.18rem] leading-relaxed text-ink-soft">
            One concise email each weekday morning: the leaders, companies and decisions shaping
            global business, selected and written by our editors.
          </p>
          <div className="mx-auto mt-10 max-w-md">
            <NewsletterForm />
          </div>
          <p className="mt-4 font-sans text-[0.78rem] text-muted">Free. Unsubscribe in one click.</p>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1320px] grid-cols-1 gap-6 px-4 py-16 sm:px-6 md:grid-cols-3">
        {PROMISES.map((item) => (
          <div key={item.title} className="border-t-2 border-ink pt-6">
            <h2 className="headline text-[1.2rem]">{item.title}</h2>
            <p className="mt-3 font-serif text-[0.98rem] leading-relaxed text-ink-soft">{item.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
