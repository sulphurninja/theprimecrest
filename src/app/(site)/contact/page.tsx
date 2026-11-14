import { getSettings } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/site/ContactForm";
import { PageHero } from "@/components/site/PageHero";
import { SITE } from "@/lib/constants";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Contact Us",
  description: "Get in touch with the PrimeCrest editorial team.",
  path: "/contact",
});

export default async function ContactPage() {
  const settings = await getSettings().catch(() => null);
  const contactEmail = settings?.contactEmail || "desk@primecrest.com";
  const advertiseEmail = settings?.advertiseEmail || "advertise@primecrest.com";

  const desks = [
    { label: "Editorial", body: "Story tips, corrections, and press inquiries.", email: contactEmail },
    { label: "Advertising", body: "Sponsorships, native features, and display placements.", email: advertiseEmail },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Reach us"
        title="Contact Us"
        dek="Story tips, corrections, partnership enquiries or a letter to the editors: every message is read, and we reply within two working days."
      />

      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:gap-16">
        <aside className="space-y-8 lg:col-span-4">
          {desks.map((desk) => (
            <div key={desk.label} className="border-b border-ink/10 pb-8">
              <p className="label text-accent">{desk.label}</p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{desk.body}</p>
              <a
                href={`mailto:${desk.email}`}
                className="mt-2 inline-block font-sans text-[1rem] font-semibold text-ink no-underline hover:text-accent"
              >
                {desk.email}
              </a>
            </div>
          ))}
          <div>
            <p className="label text-accent">Headquarters</p>
            <p className="mt-2 font-sans text-[1rem] font-semibold text-ink">{SITE.company}</p>
            <address className="mt-1 text-[0.95rem] not-italic leading-relaxed text-ink-soft">
              {SITE.address.street}
              <br />
              {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
            </address>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-2 inline-block font-sans text-[0.95rem] font-semibold text-ink no-underline hover:text-accent"
            >
              {SITE.email}
            </a>
          </div>
        </aside>

        <section className="card p-6 sm:p-10 lg:col-span-8">
          <h2 className="statement text-[1.6rem]">Send us a message</h2>
          <p className="mt-2 mb-8 text-[0.95rem] text-ink-soft">We usually reply within two working days.</p>
          <ContactForm />
        </section>
      </div>
    </div>
  );
}
