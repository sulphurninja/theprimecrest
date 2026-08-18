import Link from "next/link";
import { dbConnect } from "@/lib/db";
import { Article, AdCampaign, Inquiry, Subscriber, Media } from "@/models";
import { getSession } from "@/lib/auth";
import { serialize, formatDate } from "@/lib/utils";
import { StatusPill } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getSession();
  await dbConnect();

  const [
    published,
    drafts,
    subscribers,
    newInquiries,
    activeCampaigns,
    mediaCount,
    recent,
    campaigns,
  ] = await Promise.all([
    Article.countDocuments({ status: "published" }),
    Article.countDocuments({ status: "draft" }),
    Subscriber.countDocuments({ status: "active" }),
    Inquiry.countDocuments({ status: "new" }),
    AdCampaign.countDocuments({ active: true }),
    Media.countDocuments(),
    Article.find().sort({ updatedAt: -1 }).limit(8).populate("category", "name").lean(),
    AdCampaign.find({ active: true }).sort({ impressions: -1 }).limit(5).lean(),
  ]);

  const recentArticles = serialize(recent) as Array<{
    _id: string;
    title: string;
    status: string;
    updatedAt: string;
    category?: { name: string };
  }>;
  const topCampaigns = serialize(campaigns) as Array<{
    _id: string;
    name: string;
    slotKey: string;
    impressions: number;
    clicks: number;
  }>;

  const stats = [
    { label: "Published stories", value: published, href: "/admin/articles" },
    { label: "Drafts in progress", value: drafts, href: "/admin/articles?status=draft" },
    { label: "Newsletter subscribers", value: subscribers, href: "/admin/audience" },
    { label: "New inquiries", value: newInquiries, href: "/admin/audience" },
    { label: "Active ad campaigns", value: activeCampaigns, href: "/admin/ads" },
    { label: "Media assets", value: mediaCount, href: "/admin/media" },
  ];

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="headline text-[1.9rem]">
            {session?.name ? `Good day, ${session.name.split(" ")[0]}.` : "The Newsroom"}
          </h1>
          <p className="mt-1 font-sans text-[0.875rem] text-muted">
            Here&apos;s where the journal stands.
          </p>
        </div>
        <Link href="/admin/articles/new" className="btn-primary">
          Write a story
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="border border-rule bg-white p-5 no-underline transition-colors hover:border-ink"
          >
            <p className="headline text-[2.1rem] tabular-nums">{s.value}</p>
            <p className="mt-1 font-sans text-[0.78rem] text-muted">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <section className="border border-rule bg-white xl:col-span-2">
          <header className="flex items-center justify-between border-b border-rule px-5 py-3.5">
            <h2 className="font-sans text-[0.8rem] font-semibold uppercase tracking-[0.08em]">
              Recently touched
            </h2>
            <Link
              href="/admin/articles"
              className="font-sans text-[0.78rem] text-muted no-underline hover:text-ink"
            >
              All articles →
            </Link>
          </header>
          <ul className="divide-y divide-rule">
            {recentArticles.map((a) => (
              <li key={a._id}>
                <Link
                  href={`/admin/articles/${a._id}`}
                  className="flex items-center justify-between gap-4 px-5 py-3.5 no-underline transition-colors hover:bg-paper-2"
                >
                  <div className="min-w-0">
                    <p className="truncate font-serif font-medium">{a.title}</p>
                    <p className="mt-0.5 font-sans text-[0.75rem] text-muted">
                      {a.category?.name || "Uncategorised"} · {formatDate(a.updatedAt)}
                    </p>
                  </div>
                  <StatusPill status={a.status} />
                </Link>
              </li>
            ))}
            {recentArticles.length === 0 ? (
              <li className="px-5 py-10 text-center font-sans text-[0.85rem] text-muted">
                No articles yet. Write the first one.
              </li>
            ) : null}
          </ul>
        </section>

        <section className="border border-rule bg-white">
          <header className="border-b border-rule px-5 py-3.5">
            <h2 className="font-sans text-[0.8rem] font-semibold uppercase tracking-[0.08em]">
              Campaign performance
            </h2>
          </header>
          <ul className="divide-y divide-rule">
            {topCampaigns.map((c) => (
              <li key={c._id} className="px-5 py-3.5">
                <p className="font-sans text-[0.875rem] font-medium">{c.name}</p>
                <p className="mt-0.5 font-sans text-[0.75rem] text-muted">
                  {c.slotKey} · {c.impressions.toLocaleString()} impressions ·{" "}
                  {c.clicks.toLocaleString()} clicks
                  {c.impressions > 0
                    ? ` · ${((c.clicks / c.impressions) * 100).toFixed(1)}% CTR`
                    : ""}
                </p>
              </li>
            ))}
            {topCampaigns.length === 0 ? (
              <li className="px-5 py-10 text-center font-sans text-[0.85rem] text-muted">
                No active campaigns. Reserved slots show house ads.
              </li>
            ) : null}
          </ul>
        </section>
      </div>
    </div>
  );
}
