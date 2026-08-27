import { getSettings } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/site/ContactForm";
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

  return (
    <div className="mx-auto max-w-[820px] px-5 py-16 lg:px-8">
      <header className="border-b-2 border-ink pb-8">
        <p className="kicker">Reach Us</p>
        <h1 className="headline mt-2 text-[2.4rem] sm:text-[3rem]">Contact Us</h1>
        <p className="dek mt-4">
          Whether you have a tip, a correction, or simply want to say something — we read every
          message.
        </p>
      </header>

      <div className="grid gap-10 py-12 sm:grid-cols-3">
        <div>
          <h2 className="section-title mb-3">Editorial</h2>
          <p className="font-serif text-[0.95rem] leading-relaxed text-ink-soft">
            For story tips, corrections, or press inquiries.
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="mt-3 inline-block font-sans text-[0.88rem] font-semibold text-accent no-underline hover:text-accent-hover"
          >
            {contactEmail}
          </a>
        </div>
        <div>
          <h2 className="section-title mb-3">Advertising</h2>
          <p className="font-serif text-[0.95rem] leading-relaxed text-ink-soft">
            Sponsorship, native features, and display placements.
          </p>
          <a
            href={`mailto:${advertiseEmail}`}
            className="mt-3 inline-block font-sans text-[0.88rem] font-semibold text-accent no-underline hover:text-accent-hover"
          >
            {advertiseEmail}
          </a>
        </div>
        <div>
          <h2 className="section-title mb-3">Headquarters</h2>
          <p className="font-serif text-[0.95rem] leading-relaxed text-ink-soft">
            {SITE.company}
          </p>
          <address className="mt-2 font-serif text-[0.88rem] not-italic leading-relaxed text-ink-soft">
            {SITE.address.street}<br />
            {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
          </address>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-2 inline-block font-sans text-[0.88rem] font-semibold text-accent no-underline hover:text-accent-hover"
          >
            {SITE.email}
          </a>
        </div>
      </div>

      <section className="border-t border-rule pt-10">
        <h2 className="section-title mb-6">Send us a message</h2>
        <ContactForm />
      </section>
    </div>
  );
}
