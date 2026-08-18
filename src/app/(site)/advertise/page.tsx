import { InquireForm } from "@/components/site/InquireForm";
import { AD_SLOTS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Advertise with PrimeCrest",
  description:
    "Reach executives, investors, and decision-makers through reserved placements, sponsorships, and native features in PrimeCrest.",
  path: "/advertise",
});

const AUDIENCE = [
  { figure: "68%", label: "of readers hold director-level roles or above" },
  { figure: "11 min", label: "average time spent per feature story" },
  { figure: "42", label: "countries in our monthly readership" },
  { figure: "1", label: "morning letter, read before the markets open" },
];

const OFFERINGS = [
  {
    title: "Reserved display",
    body: "Fixed placements across the homepage, section fronts, and long-form features. One advertiser per slot, per period — your brand never rotates in a lottery.",
  },
  {
    title: "Issue sponsorship",
    body: "Put your name beside a full edition: masthead credit, the cover story rail, and the week's Morning Letter. Exclusive, dated, and archived permanently.",
  },
  {
    title: "Native features",
    body: "Commissioned essays and interviews produced with our editors, marked clearly as sponsored, and written to the same standard as everything else we run.",
  },
];

export default function AdvertisePage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 lg:px-8">
      <header className="border-b-2 border-ink py-16">
        <p className="kicker">Advertising & Partnerships</p>
        <h1 className="headline mt-3 max-w-3xl text-[2.6rem] sm:text-[3.6rem]">
          Advertising, set with the same care as the journalism.
        </h1>
        <p className="dek mt-6 max-w-2xl text-[1.2rem]">
          PrimeCrest is read slowly and deliberately, by people who decide things. We keep
          inventory scarce, placements fixed, and sponsors named — because attention earned
          honestly is worth more.
        </p>
      </header>

      <section className="grid gap-px border-b border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
        {AUDIENCE.map((item) => (
          <div key={item.label} className="bg-paper px-6 py-10">
            <p className="headline text-[2.6rem] text-accent">{item.figure}</p>
            <p className="mt-2 font-sans text-[0.85rem] leading-relaxed text-ink-soft">
              {item.label}
            </p>
          </div>
        ))}
      </section>

      <section className="border-b border-rule py-14">
        <h2 className="section-title mb-10 text-[0.9rem]">What we offer</h2>
        <div className="grid gap-10 md:grid-cols-3">
          {OFFERINGS.map((item, i) => (
            <div key={item.title}>
              <p className="headline text-[2rem] text-muted">0{i + 1}</p>
              <h3 className="headline mt-2 text-[1.4rem]">{item.title}</h3>
              <p className="mt-3 font-serif text-[0.97rem] leading-relaxed text-ink-soft">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-rule py-14">
        <h2 className="section-title mb-4 text-[0.9rem]">Placements & inventory</h2>
        <p className="mb-10 max-w-2xl font-serif text-ink-soft">
          Every slot is fixed, measured, and sold directly. No programmatic exchanges, no
          third-party trackers, no surprises next to your brand.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-ink">
                <th className="py-3 pr-6 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.1em]">
                  Placement
                </th>
                <th className="py-3 pr-6 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.1em]">
                  Position
                </th>
                <th className="py-3 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.1em]">
                  Format
                </th>
              </tr>
            </thead>
            <tbody>
              {AD_SLOTS.map((slot) => (
                <tr key={slot.key} className="border-b border-rule">
                  <td className="py-4 pr-6 font-serif font-medium">{slot.name}</td>
                  <td className="py-4 pr-6 font-sans text-[0.88rem] text-ink-soft">
                    {slot.placement}
                  </td>
                  <td className="py-4 font-sans text-[0.88rem] tabular-nums text-muted">
                    {slot.width} × {slot.height}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-12 py-14 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h2 className="headline text-[1.9rem]">Start the conversation.</h2>
          <p className="mt-4 font-serif leading-relaxed text-ink-soft">
            Tell us about your brand and what you want the right readers to know. Our
            partnerships desk replies to every serious inquiry within two business days.
          </p>
        </div>
        <div className="lg:col-span-3">
          <InquireForm type="advertise" />
        </div>
      </section>
    </div>
  );
}
