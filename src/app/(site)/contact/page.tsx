import { InquireForm } from "@/components/site/InquireForm";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Reach the PrimeCrest desk — editorial, corrections, partnerships, and press.",
  path: "/contact",
});

const DESKS = [
  { name: "Editorial", email: "desk@primecrest.com", note: "Tips, pitches, corrections." },
  { name: "Partnerships", email: "advertise@primecrest.com", note: "Advertising and sponsorship." },
  { name: "Press", email: "press@primecrest.com", note: "Interviews and media requests." },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 lg:px-8">
      <header className="border-b-2 border-ink py-16">
        <p className="kicker">Contact</p>
        <h1 className="headline mt-3 text-[2.6rem] sm:text-[3.4rem]">Write to the desk.</h1>
        <p className="dek mt-5 max-w-2xl">
          We read everything. Corrections are handled first, story tips are treated in
          confidence, and serious pitches get a serious reply.
        </p>
      </header>

      <div className="grid gap-14 py-14 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="space-y-8">
            {DESKS.map((desk) => (
              <div key={desk.name} className="border-b border-rule pb-6 last:border-b-0">
                <h2 className="font-sans text-[0.78rem] font-semibold uppercase tracking-[0.12em]">
                  {desk.name}
                </h2>
                <a
                  href={`mailto:${desk.email}`}
                  className="headline mt-1.5 block text-[1.25rem] no-underline hover:text-accent"
                >
                  {desk.email}
                </a>
                <p className="mt-1 font-sans text-[0.85rem] text-muted">{desk.note}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <InquireForm type="contact" />
        </div>
      </div>
    </div>
  );
}
