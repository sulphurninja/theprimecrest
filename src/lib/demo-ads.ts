/**
 * Local demo advertising. When DEMO_ADS=1 (set only in a local .env.local),
 * slots show one of these mock creatives instead of their live campaign.
 * Zaptick keeps its placements, except the homepage slots listed in
 * OVERRIDE_ZAPTICK. Nothing is written to the
 * database, and production never sets DEMO_ADS, so these never go live.
 * The logo files live in public/demo-ads/, which is git-ignored.
 */

type Brand = {
  name: string;
  url: string;
  background: string;
  color: string;
  muted: string;
  /** Logo markup at a given height in pixels. */
  logo: (height: number) => string;
  tagline: string;
  cta: string;
  ctaBackground: string;
  ctaColor: string;
};

const BRANDS: Record<"apple" | "coke" | "starbucks", Brand> = {
  apple: {
    name: "Apple",
    url: "https://www.apple.com",
    background: "#000000",
    color: "#f5f5f7",
    muted: "#a1a1a6",
    logo: (h) => `<img src="/demo-ads/apple.svg" alt="Apple" style="display:block;height:${h}px;width:auto;flex-shrink:0">`,
    tagline: "Designed to do more. Built for what’s next.",
    cta: "Learn more",
    ctaBackground: "#0071e3",
    ctaColor: "#ffffff",
  },
  coke: {
    name: "Coca-Cola",
    url: "https://www.coca-cola.com",
    background: "#e41c23",
    color: "#ffffff",
    muted: "rgba(255,255,255,0.85)",
    logo: (h) => `<img src="/demo-ads/coca-cola.svg" alt="Coca-Cola" style="display:block;height:${h}px;width:auto;flex-shrink:0;filter:brightness(0) invert(1)">`,
    tagline: "Real Magic. Share a Coke this season.",
    cta: "Find yours",
    ctaBackground: "#ffffff",
    ctaColor: "#e41c23",
  },
  starbucks: {
    name: "Starbucks",
    url: "https://www.starbucks.com",
    background: "#ffffff",
    color: "#1e3932",
    muted: "#1e3932",
    logo: (h) => `<img src="/demo-ads/starbucks.svg" alt="Starbucks" style="display:block;height:${h}px;width:auto;flex-shrink:0">`,
    tagline: "Holiday favourites are back. Order ahead on the app.",
    cta: "Order now",
    ctaBackground: "#00704a",
    ctaColor: "#ffffff",
  },
};

/** Which brand runs in which slot. */
const SLOT_BRAND: Record<string, keyof typeof BRANDS> = {
  "header-leaderboard": "apple",
  "homepage-mid": "starbucks",
  "homepage-mpu": "apple",
  "article-inline": "coke",
  "article-sidebar": "apple",
  "category-top": "starbucks",
  "footer-strip": "coke",
};

const FONT = "font-family:'Helvetica Neue',Arial,sans-serif";

/** Logo heights (px) in a banner and in a box, tuned per mark's proportions. */
const LOGO_SIZE: Record<string, { banner: number; box: number }> = {
  Apple: { banner: 34, box: 64 },
  "Coca-Cola": { banner: 38, box: 64 },
  Starbucks: { banner: 62, box: 110 },
};

function button(b: Brand) {
  return `<span style="${FONT};display:inline-block;flex-shrink:0;padding:10px 20px;border-radius:999px;background:${b.ctaBackground};color:${b.ctaColor};font-size:13px;font-weight:700">${b.cta}</span>`;
}

function banner(b: Brand, height: number) {
  return `<a href="${b.url}" target="_blank" rel="noopener sponsored" style="display:flex;align-items:center;gap:24px;height:${height}px;padding:0 28px;background:${b.background};color:${b.color};text-decoration:none">
  ${b.logo(LOGO_SIZE[b.name].banner)}
  <span style="${FONT};flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:15px;color:${b.muted}">${b.tagline}</span>
  ${button(b)}
</a>`;
}

function box(b: Brand, height: number) {
  return `<a href="${b.url}" target="_blank" rel="noopener sponsored" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;height:${height}px;padding:28px;background:${b.background};color:${b.color};text-align:center;text-decoration:none">
  ${b.logo(LOGO_SIZE[b.name].box)}
  <span style="${FONT};font-size:16px;line-height:1.45;color:${b.muted};max-width:240px">${b.tagline}</span>
  ${button(b)}
</a>`;
}

/**
 * Homepage slots the demo takes over even from Zaptick, so Zaptick keeps a
 * single homepage placement (the leaderboard).
 */
const OVERRIDE_ZAPTICK = new Set(["homepage-mpu", "footer-strip"]);

/** Whether demo mode should replace this slot's live campaign. */
export function demoReplaces(slotKey: string, campaign: { sponsorName?: string; name?: string } | null) {
  const zaptick = /zaptick/i.test(`${campaign?.sponsorName} ${campaign?.name}`);
  return !zaptick || OVERRIDE_ZAPTICK.has(slotKey);
}

export function demoAdsEnabled() {
  return process.env.DEMO_ADS === "1";
}

/** A campaign-shaped mock creative for a slot, or null for unknown slots. */
export function demoCampaign(slotKey: string, size: { width: number; height: number }) {
  const brand = BRANDS[SLOT_BRAND[slotKey]];
  if (!brand) return null;
  const isBox = size.width <= 336;
  return {
    _id: `demo-${slotKey}`,
    name: `${brand.name} (demo)`,
    slotKey,
    type: "html" as const,
    html: isBox ? box(brand, size.height) : banner(brand, size.height),
    clickUrl: brand.url,
    sponsorName: brand.name,
  };
}
