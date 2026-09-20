/**
 * WIMA CAR — Car-rental digital transformation (Web Development · SEO · Local)
 *
 * Single source of truth for the /wima-car case-study page
 * (src/app/wima-car/page.tsx renders entirely from this file).
 *
 * Rules for this file:
 *   - No React / no JSX here: it stays framework-agnostic so the same objects
 *     can feed a report, a deck or a proposal. Icons are string keys that the
 *     page maps to lucide-react components.
 *   - Page copy is English (the portfolio is English); the on-site strings —
 *     French and Arabic search queries, French UI labels — are kept verbatim
 *     because they are the actual product surface and the actual search terms.
 *   - Every number published here comes from Google Search Console over a
 *     single fixed period (08 Aug → 14 Sep 2026). Nothing is extrapolated, and
 *     the Google Business Profile work is reported qualitatively on purpose:
 *     no Maps ranking or review metric is claimed without verified GBP data.
 */

/* ══════════════════════════════════════════════════════════════════════════
   SHARED TYPES
   ══════════════════════════════════════════════════════════════════════════ */

/** Icon keys — mapped to lucide-react components in src/app/wima-car/page.tsx. */
export type WimaIconKey =
  | "alert"
  | "platform"
  | "seo"
  | "results"
  | "footprint"
  | "gbp"
  | "brand"
  | "monitoring"
  | "stack"
  | "outcome"
  | "next"
  | "globe"
  | "code"
  | "camera"
  | "search"
  | "mapPin"
  | "chart"
  | "sparkles"
  | "check"
  | "car"
  | "language"
  | "link"
  | "layout"
  | "smartphone"
  | "pen"
  | "route"
  | "layers"
  | "rocket"
  | "target"
  | "gauge";

/** A labelled block of body copy (used by every section of the page). */
export interface WimaSectionLabels {
  /** Two-digit section number, e.g. "01". */
  index: string;
  /** Small red eyebrow, e.g. "The challenge". */
  eyebrow: string;
  /** Big white display heading, e.g. "Search visibility started with the technical foundation." */
  heading: string;
}

/* ══════════════════════════════════════════════════════════════════════════
   1. IDENTITY
   ══════════════════════════════════════════════════════════════════════════ */

export interface WimaIdentity {
  name: string;
  /** Wordmark split for the two-tone display heading. */
  wordmark: [string, string];
  tagline: string;
  heroLabel: string;
  heroDescription: string;
  category: string;
  client: string;
  /** The engagement, as it would appear on a proposal cover. */
  projectType: string;
  role: string;
  launchDate: string;
  launchDateShort: string;
  market: string;
  city: string;
  country: string;
  stack: string;
  /** The single sentence that sums the engagement up. */
  promise: string;
  /** Live site. WIMA CAR is a real, deployed client platform. */
  liveUrl: string;
}

export const wimaIdentity: WimaIdentity = {
  name: "WIMA CAR",
  wordmark: ["WIMA", "CAR"],
  tagline: "Car-rental digital transformation — web development, technical SEO & local search",
  heroLabel: "CASE STUDY · WEB DEVELOPMENT · SEO · LOCAL",
  heroDescription:
    "From a limited digital presence to a multilingual, search-ready car rental platform built for local acquisition.",
  category: "Web Development · Technical SEO · Local Search",
  client: "WIMA CAR — car rental, Rabat",
  projectType: "Digital transformation & organic acquisition build",
  role: "Full-Stack Development · Technical SEO · Local SEO · Google Business Profile · Content & Visual Direction · Analytics & Search Monitoring",
  launchDate: "08 August 2026",
  launchDateShort: "08.08.2026",
  market: "Rabat · Morocco",
  city: "Rabat",
  country: "Morocco",
  stack: "Next.js · React · TypeScript · Tailwind CSS",
  promise:
    "A production-ready multilingual foundation, a structured vehicle catalogue, and a measurable organic search footprint — delivered as one engagement, end to end.",
  liveUrl: "https://www.wimacar.com/",
};

/**
 * WIMA CAR brand accent — the red from the client's own identity (#D71920).
 * Used for every highlight, border and CTA on the case-study page so the page
 * reads as the client's brand rather than the portfolio's terminal green.
 */
export const wimaAccent = {
  base: "#D71920",
  bright: "#FF3B41",
  glow: "rgba(215, 25, 32, 0.45)",
  soft: "rgba(215, 25, 32, 0.10)",
  border: "rgba(215, 25, 32, 0.30)",
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   2. ASSETS
   ══════════════════════════════════════════════════════════════════════════ */

export interface WimaAssets {
  /** 16:10 brand cover carrying the project's own data — also the project card. */
  cover: string;
  /** Localized homepage. */
  home: string;
  /** Crawlable fleet index. */
  fleet: string;
  /** Dedicated vehicle page. */
  vehicle: string;
  /** The reservation flow at 390px. */
  mobile: string;
}

export const wimaAssets: WimaAssets = {
  cover: "/projects/wima-car/cover.webp",
  home: "/projects/wima-car/home.webp",
  fleet: "/projects/wima-car/fleet.webp",
  vehicle: "/projects/wima-car/vehicle.webp",
  mobile: "/projects/wima-car/mobile.webp",
};

/**
 * Natural pixel ratio of every screen asset, so a capture is never cropped.
 *
 * These MUST be measured from the file on disk — a frame whose ratio differs
 * from its capture letterboxes it, which is what the `bg-*` backdrop then
 * paints as a coloured band. Current files:
 *
 *   cover    1586×992   dark capture   → dark backdrop
 *   home     1921×879   LIGHT capture  → `bg-white` backdrop
 *   fleet     555×867   LIGHT capture  → `bg-white` backdrop
 *   vehicle  1440×1040  dark capture   → dark backdrop
 *   mobile    900×1900  dark capture   → dark backdrop
 *
 * Note: `home`, `cover` and `fleet` were replaced with real captures from the
 * shipped site and no longer match the sizes `scripts/gen-wima-assets.py`
 * emits (`fleet` and `home` at 1920×1040, `cover` at 1600×1000). Re-running that
 * script overwrites them, so re-measure this table afterwards.
 */
export const wimaScreenRatio = {
  cover: 1586 / 992,
  home: 1921 / 879,
  fleet: 555 / 867,
  vehicle: 1440 / 1040,
  mobile: 900 / 1900,
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   3. COVER DATA — the numbers and facts printed on the cover
   ══════════════════════════════════════════════════════════════════════════ */

export interface WimaMetric {
  value: string;
  unit?: string;
  label: string;
  /** What the number actually is — keeps the headline honest. */
  note: string;
}

/**
 * Google Search Console, 08 Aug → 14 Sep 2026 — the initial period following
 * launch. Same property, same window, no filters mixed.
 */
export const wimaCoverMetrics: WimaMetric[] = [
  { value: "175", label: "Organic clicks", note: "Period total" },
  { value: "5,340", label: "Impressions", note: "Period total" },
  { value: "4.2", unit: "%", label: "Average CTR", note: "Period average" },
  { value: "51.6", label: "Average position", note: "Period average" },
];

export const wimaCoverFootnote =
  "Google Search Console · 08 Aug → 14 Sep 2026 · initial period following launch";

export interface WimaMetaItem {
  label: string;
  value: string;
}

/** The cover's fact block — role, launch, market, stack. */
export const wimaCoverMeta: WimaMetaItem[] = [
  { label: "Role", value: wimaIdentity.role },
  { label: "Launch", value: wimaIdentity.launchDate },
  { label: "Market", value: wimaIdentity.market },
  { label: "Stack", value: wimaIdentity.stack },
];

/** Delivered scope, as counts — the cover's second row of hard facts. */
export const wimaCoverFacts: WimaMetric[] = [
  { value: "190", label: "URLs submitted", note: "Sitemap" },
  { value: "34", label: "Vehicle pages", note: "Indexed" },
  { value: "5", label: "Languages", note: "FR AR EN ES IT" },
  { value: "11", label: "Deliverable areas", note: "Design → SEO → analytics" },
];

/* ══════════════════════════════════════════════════════════════════════════
   4. SECTION 01 — THE CHALLENGE
   ══════════════════════════════════════════════════════════════════════════ */

export const wimaChallengeSection: WimaSectionLabels = {
  index: "01",
  eyebrow: "The challenge",
  heading: "WIMA CAR needed more than a website.",
};

export const wimaChallengeLead =
  "The objective was to establish a credible digital presence for a local car-rental business while creating the technical foundations required for organic search visibility.";

export interface WimaNumberedItem {
  num: string;
  text: string;
}

/** Before launch — what had to be true on day one. */
export const wimaPriorities: WimaNumberedItem[] = [
  { num: "01", text: "Establish a professional digital presence" },
  { num: "02", text: "Make the fleet discoverable through search" },
  { num: "03", text: "Target local rental intent around Rabat" },
  { num: "04", text: "Create a multilingual structure for future growth" },
  {
    num: "05",
    text: "Connect the website with Google Business Profile and measurable search performance",
  },
];

export interface WimaRoleCard {
  num: string;
  area: string;
  title: string;
  detail: string;
  icon: WimaIconKey;
}

/** My role — end to end. Six areas, one person. */
export const wimaRoleCards: WimaRoleCard[] = [
  {
    num: "01",
    area: "Product & Web",
    title: "Platform",
    detail: "Next.js / React / responsive UI / deployment",
    icon: "code",
  },
  {
    num: "02",
    area: "Brand",
    title: "Identity",
    detail: "Logo direction / visual identity / website visual system",
    icon: "pen",
  },
  {
    num: "03",
    area: "Content",
    title: "Assets",
    detail: "Vehicle photography / image preparation / commercial presentation",
    icon: "camera",
  },
  {
    num: "04",
    area: "SEO",
    title: "Technical",
    detail: "Technical SEO / GSC / sitemap / indexing / internal linking",
    icon: "search",
  },
  {
    num: "05",
    area: "Local",
    title: "Search",
    detail: "Google Business Profile / local queries / location signals",
    icon: "mapPin",
  },
  {
    num: "06",
    area: "Monitoring",
    title: "Analytics",
    detail: "Search Console / indexing / queries / performance tracking",
    icon: "chart",
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   5. SECTION 02 — BUILDING THE PLATFORM
   ══════════════════════════════════════════════════════════════════════════ */

export const wimaPlatformSection: WimaSectionLabels = {
  index: "02",
  eyebrow: "Building the platform",
  heading: "A production-ready multilingual foundation",
};

export const wimaPlatformLead =
  "The platform was structured around crawlable routes, localized content and dedicated vehicle pages rather than a single brochure-style homepage.";

export interface WimaArchNode {
  key: string;
  value: string;
  sub: string;
  /** Highlighted node — the decision the whole build hinges on. */
  hot?: boolean;
}

/** The request path, from framework to acquisition. */
export const wimaArchitectureNodes: WimaArchNode[] = [
  { key: "Framework", value: "Next.js 16", sub: "16.2.12" },
  { key: "Routing", value: "App Router", sub: "route groups" },
  { key: "i18n", value: "Multilingual routing", sub: "FR · AR · EN · ES · IT", hot: true },
  { key: "Head", value: "SEO metadata", sub: "per route" },
  { key: "Discovery", value: "Dynamic sitemap", sub: "alternates" },
  { key: "Catalogue", value: "Vehicle pages", sub: "dedicated URLs" },
  { key: "Acquisition", value: "Local landing pages", sub: "Rabat intent" },
];

export interface WimaShot {
  /** The route this screen represents — printed in the browser chrome. */
  url: string;
  title: string;
  caption: string;
  image: string;
  ratio: number;
  /** Shown as a phone rather than a browser window. */
  mobile?: boolean;
  /**
   * The capture's own page background is light. The frame behind it must match
   * (`bg-white`) or the letterbox gap paints as a dark band.
   */
  light?: boolean;
}

/** The three shipped surfaces: fleet index, vehicle page, mobile flow. */
export const wimaPlatformShots: WimaShot[] = [
  {
    url: "/fr/vehicules",
    title: "Fleet index",
    caption: "Fleet index — crawlable vehicle listing",
    image: wimaAssets.fleet,
    ratio: wimaScreenRatio.fleet,
    light: true,
  },
  {
    url: "/fr/vehicules/[slug]",
    title: "Vehicle detail",
    caption: "Vehicle detail — dedicated indexed URL",
    image: wimaAssets.vehicle,
    ratio: wimaScreenRatio.vehicle,
  },
  {
    url: "mobile · 390px",
    title: "Mobile flow",
    caption: "Responsive architecture — mobile reservation flow",
    image: wimaAssets.mobile,
    ratio: wimaScreenRatio.mobile,
    mobile: true,
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   6. SECTION 03 — SEO, THE INFRASTRUCTURE
   ══════════════════════════════════════════════════════════════════════════ */

export const wimaSeoSection: WimaSectionLabels = {
  index: "03",
  eyebrow: "SEO — the infrastructure",
  heading: "Search visibility started with the technical foundation.",
};

export interface WimaPillar {
  label: string;
  items: string[];
  /** Rendered in red — used for the hreflang language chips. */
  accent?: boolean;
  note?: string;
}

export const wimaSeoPillars: WimaPillar[] = [
  {
    label: "Crawlability",
    items: ["XML sitemap", "structured URL hierarchy", "internal linking", "localized routes"],
  },
  {
    label: "Indexation",
    items: [
      "dedicated vehicle pages",
      "localized URLs",
      "crawlable content",
      "Search Console monitoring",
    ],
  },
  {
    label: "Structured data",
    items: ["business-oriented schema", "vehicle / service semantic signals"],
  },
  {
    label: "International SEO",
    items: ["FR", "AR", "EN", "ES", "IT"],
    accent: true,
    note: "hreflang alternates emitted for every route by the dynamic sitemap.",
  },
];

/** Indexation counts — what actually went into the index. */
export const wimaIndexationStats: WimaMetric[] = [
  { value: "190", label: "URLs submitted", note: "dynamic sitemap" },
  { value: "34", label: "Vehicle pages", note: "one URL each" },
  { value: "5", label: "Languages", note: "hreflang set" },
];

/**
 * Search Console performance, 08 Aug → 14 Sep 2026.
 * Weekly points; `impressions` sums to 5,340 and `clicks` sums to 175 — the
 * period totals published on the cover. The chart is labelled as a weekly
 * distribution for readability.
 */
export const wimaPerformanceChart = {
  labels: ["08 AUG", "15 AUG", "22 AUG", "29 AUG", "05 SEP", "14 SEP"],
  impressions: [120, 420, 780, 1080, 1320, 1620],
  clicks: [4, 12, 26, 38, 52, 43],
  launchLabel: "LAUNCH ▲ 08.08.2026",
  caption: "Search Console — clicks, impressions and top query families",
} as const;

/** The six query families that actually produced impressions. */
export interface WimaQuery {
  query: string;
  /** Relative share of the query's impressions, 0–100. */
  share: number;
  /** Arabic queries render right-to-left. */
  rtl?: boolean;
}

export const wimaTopQueries: WimaQuery[] = [
  { query: "location voiture rabat", share: 100 },
  { query: "location de voiture rabat", share: 82 },
  { query: "location voiture aéroport rabat", share: 64 },
  { query: "location voiture luxe maroc", share: 52 },
  { query: "كراء السيارات", share: 41, rtl: true },
  { query: "car rental rabat", share: 29 },
  { query: "alquiler de coches rabat", share: 18 },
];

/* ══════════════════════════════════════════════════════════════════════════
   7. SECTION 04 — RESULTS
   ══════════════════════════════════════════════════════════════════════════ */

export const wimaResultsSection: WimaSectionLabels = {
  index: "04",
  eyebrow: "Results",
  heading: "Search Console — initial organic growth",
};

export const wimaResultsLead =
  "08 Aug → 14 Sep 2026 · all metrics measured over the same period, same property, no filters mixed.";

export const wimaResultsNote =
  "Weekly distribution shown for readability — period totals are exact: 175 clicks / 5,340 impressions.";

export const wimaResultsCopy =
  "Organic visibility began increasing after the new platform went live, with search impressions expanding across local, transactional and multilingual queries.";

export interface WimaIntentFamily {
  label: string;
  primary: string;
  secondary: string;
  rtl?: boolean;
}

/** What changed, by intent family. */
export const wimaIntentFamilies: WimaIntentFamily[] = [
  { label: "Local intent", primary: "location voiture rabat", secondary: "location de voiture rabat" },
  {
    label: "Transactional",
    primary: "location voiture aéroport",
    secondary: "location voiture luxe",
  },
  {
    label: "Multilingual",
    primary: "كراء السيارات",
    secondary: "Arabic / English / Spanish / Italian variants",
    rtl: true,
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   8. SECTION 05 — THE SEARCH FOOTPRINT
   ══════════════════════════════════════════════════════════════════════════ */

export const wimaFootprintSection: WimaSectionLabels = {
  index: "05",
  eyebrow: "The search footprint",
  heading: "From pages to search intent.",
};

export const wimaFootprintLead =
  "The strategy was not built around a single keyword. The site was structured to capture multiple search intents across local, transactional and multilingual queries.";

export interface WimaIntentCard {
  label: string;
  query: string;
  rtl?: boolean;
}

export const wimaFootprintIntents: WimaIntentCard[] = [
  { label: "Local", query: "Location voiture Rabat" },
  { label: "Airport", query: "Location voiture aéroport Rabat" },
  { label: "Commercial", query: "Location voiture luxe" },
  { label: "Arabic", query: "كراء السيارات", rtl: true },
];

/* ══════════════════════════════════════════════════════════════════════════
   9. SECTION 06 — GOOGLE BUSINESS PROFILE
   ══════════════════════════════════════════════════════════════════════════ */

export const wimaGbpSection: WimaSectionLabels = {
  index: "06",
  eyebrow: "Local search beyond the website",
  heading: "Google Business Profile",
};

export const wimaGbpLead =
  "The website was only one part of the acquisition system. I also worked on the local search presence, including Google Business Profile positioning, visual assets and consistency between the business profile and the website.";

export interface WimaGbpCard {
  label: string;
  title: string;
  detail: string;
  chips: string[];
  icon: WimaIconKey;
}

export const wimaGbpCards: WimaGbpCard[] = [
  {
    label: "Profile",
    title: "Business information",
    detail: "Business information · categories · services",
    chips: ["Categories", "Services", "Hours"],
    icon: "gbp",
  },
  {
    label: "Visuals",
    title: "Image assets",
    detail: "Logo · vehicle photography · image assets",
    chips: ["Logo", "Fleet photos", "Cover"],
    icon: "camera",
  },
  {
    label: "Search",
    title: "Local surface",
    detail: "Local queries · Maps visibility · review ecosystem",
    chips: ["Maps", "Local queries", "Reviews"],
    icon: "mapPin",
  },
];

export const wimaGbpConsistency = {
  label: "Consistency",
  body: "Same brand name, same visual system, same commercial information across the website and the local profile — so the entity is unambiguous for both users and search engines.",
  disclaimer:
    "Reported qualitatively — no Maps ranking or review metrics are claimed without verified GBP data.",
};

/* ══════════════════════════════════════════════════════════════════════════
   10. SECTION 07 — VISUAL & BRAND SYSTEM  (the colour system)
   ══════════════════════════════════════════════════════════════════════════ */

export const wimaBrandSection: WimaSectionLabels = {
  index: "07",
  eyebrow: "Visual & brand system",
  heading: "The digital identity was built with the product.",
};

export const wimaBrandLead =
  "I handled the visual direction beyond the interface itself — from logo usage and vehicle imagery to the visual consistency used across the website and local search presence.";

export interface WimaBrandTile {
  label: string;
  detail: string;
  icon: WimaIconKey;
  /** The tile that carries the brand red. */
  accent?: boolean;
}

export const wimaBrandTiles: WimaBrandTile[] = [
  { label: "Logo", detail: "Wordmark, colour usage, clear space", icon: "brand", accent: true },
  { label: "Fleet photography", detail: "Exterior — 3/4 angle", icon: "camera" },
  { label: "Fleet photography", detail: "Interior — dashboard", icon: "camera" },
  { label: "Web UI", detail: "Layout, type scale, red accent", icon: "layout" },
  { label: "Fleet photography", detail: "Exterior — front", icon: "camera" },
  { label: "Fleet photography", detail: "Detail — wheels / trim", icon: "camera" },
  { label: "Local & social", detail: "Cover, posts, profile imagery", icon: "globe" },
  { label: "Vehicle card", detail: "Catalogue presentation standard", icon: "car" },
];

export interface WimaSwatch {
  name: string;
  hex: string;
  role: string;
  /** Dark swatches get a light label; light swatches get a dark one. */
  dark?: boolean;
}

/**
 * The brand colour system — the palette the client's identity is built on and
 * the one this case study is rendered with. Near-black canvas, one red, and a
 * strictly greyscale supporting ramp.
 */
export const wimaBrandPalette: WimaSwatch[] = [
  { name: "Canvas", hex: "#0A0A0B", role: "Page background", dark: true },
  { name: "Surface", hex: "#121316", role: "Cards & panels", dark: true },
  { name: "Hairline", hex: "#22242A", role: "Borders & dividers", dark: true },
  { name: "Muted", hex: "#8A9099", role: "Secondary copy", dark: true },
  { name: "Foreground", hex: "#F3F4F6", role: "Primary copy" },
  { name: "Brand red", hex: "#D71920", role: "Primary accent — wordmark, CTAs, data", dark: true },
  { name: "Signal red", hex: "#FF3B41", role: "Hover, emphasis, chart strokes", dark: true },
];

export interface WimaTypeToken {
  name: string;
  sample: string;
  stack: string;
}

/** Type scale used across the platform. */
export const wimaBrandType: WimaTypeToken[] = [
  { name: "Display", sample: "Location de voitures", stack: "Inter · 800 · tight tracking" },
  { name: "Body", sample: "Réservez votre véhicule en quelques minutes.", stack: "Inter · 400" },
  { name: "Technical", sample: "location voiture rabat", stack: "JetBrains Mono · 500" },
];

/* ══════════════════════════════════════════════════════════════════════════
   11. SECTION 08 — MEASUREMENT & SEARCH MONITORING
   ══════════════════════════════════════════════════════════════════════════ */

export const wimaMonitoringSection: WimaSectionLabels = {
  index: "08",
  eyebrow: "Measurement & search monitoring",
  heading: "What was tracked, and where.",
};

export interface WimaTool {
  label: string;
  title: string;
  detail: string;
  stack: string;
  icon: WimaIconKey;
}

export const wimaMonitoringTools: WimaTool[] = [
  {
    label: "Google",
    title: "Google Search Console",
    detail: "Indexation · Queries · Clicks · Impressions",
    stack: "PRIMARY SOURCE · 08 AUG → 14 SEP 2026",
    icon: "search",
  },
  {
    label: "Google",
    title: "Google Analytics",
    detail: "Acquisition · Engagement · Landing pages",
    stack: "SITE-LEVEL BEHAVIOUR",
    icon: "chart",
  },
  {
    label: "Tooling",
    title: "Semrush",
    detail: "Keyword visibility · Technical monitoring · Search opportunities",
    stack: "RESEARCH & AUDIT LAYER",
    icon: "gauge",
  },
];

export const wimaMonitoringNote =
  "Metrics published in this case study come from Google Search Console only, over a single fixed period.";

/* ══════════════════════════════════════════════════════════════════════════
   12. SECTION 09 — UNDER THE HOOD
   ══════════════════════════════════════════════════════════════════════════ */

export const wimaStackSection: WimaSectionLabels = {
  index: "09",
  eyebrow: "Under the hood",
  heading: "Technical details",
};

export const wimaTechStack: string[] = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind CSS 4",
  "App Router",
  "Responsive architecture",
  "Multilingual routing",
  "Dynamic sitemap",
  "Schema.org",
  "SEO metadata",
  "Google Search Console",
  "Google Business Profile",
];

/* ══════════════════════════════════════════════════════════════════════════
   13. SECTION 10 — OUTCOME
   ══════════════════════════════════════════════════════════════════════════ */

export const wimaOutcomeSection: WimaSectionLabels = {
  index: "10",
  eyebrow: "Outcome",
  heading: "What changed",
};

export interface WimaBeforeAfter {
  title: string;
  items: string[];
}

export const wimaBeforeAfter: { before: WimaBeforeAfter; after: WimaBeforeAfter } = {
  before: {
    title: "Before",
    items: [
      "Limited web presence",
      "No scalable SEO architecture",
      "Limited search footprint",
      "No dedicated vehicle landing pages",
    ],
  },
  after: {
    title: "After",
    items: [
      "Multilingual Next.js platform",
      "Structured vehicle catalogue",
      "Technical SEO foundation",
      "Local search strategy",
      "Measurable organic visibility",
    ],
  },
};

export interface WimaTimelineStep {
  label: string;
  /** The launch node is highlighted. */
  launch?: boolean;
}

export const wimaTimeline: WimaTimelineStep[] = [
  { label: "08 AUG 2026 — Website launch", launch: true },
  { label: "Crawl" },
  { label: "Indexation" },
  { label: "Search impressions" },
  { label: "Organic clicks" },
  { label: "Content expansion" },
];

/* ══════════════════════════════════════════════════════════════════════════
   14. SECTION 11 — NEXT PHASE
   ══════════════════════════════════════════════════════════════════════════ */

export const wimaNextSection: WimaSectionLabels = {
  index: "11",
  eyebrow: "Next phase",
  heading: "Where this goes next.",
};

export const wimaNextLead =
  "The next growth phase focuses on strengthening local authority, expanding high-intent landing pages and progressively covering nearby markets such as Salé, Témara, Casablanca and Kénitra.";

export interface WimaPhase {
  num: string;
  title: string;
  detail: string;
  icon: WimaIconKey;
}

export const wimaNextPhases: WimaPhase[] = [
  { num: "01", title: "Local authority", detail: "Reviews · citations · backlinks", icon: "target" },
  {
    num: "02",
    title: "Content expansion",
    detail: "Commercial + location-based landing pages",
    icon: "layers",
  },
  {
    num: "03",
    title: "Conversion",
    detail: "Reservation CTAs · WhatsApp journeys",
    icon: "sparkles",
  },
  {
    num: "04",
    title: "Geographic expansion",
    detail: "Rabat → Salé → Témara → Casablanca → Kénitra",
    icon: "rocket",
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   15. FOOTER
   ══════════════════════════════════════════════════════════════════════════ */

export const wimaFooter = {
  line: "WIMA CAR · CASE STUDY · 2026 · RABAT, MOROCCO",
  nav: [
    { label: "Results", href: "#wima-results" },
    { label: "Colour system", href: "#wima-brand" },
    { label: "Next phase", href: "#wima-next" },
  ],
  /** The call to action — this case study exists to win the next engagement. */
  cta: {
    heading: "Need the same for your business?",
    body: "Multilingual platform, technical SEO, local search presence and the measurement to prove it — delivered end to end, the way WIMA CAR was.",
    label: "Start a project",
  },
} as const;

/** Anchor ids used by the page's section navigation, in order. */
export const wimaSectionNav: { index: string; label: string; href: string }[] = [
  { index: "01", label: "Challenge", href: "#wima-challenge" },
  { index: "02", label: "Platform", href: "#wima-platform" },
  { index: "03", label: "SEO", href: "#wima-seo" },
  { index: "04", label: "Results", href: "#wima-results" },
  { index: "05", label: "Footprint", href: "#wima-footprint" },
  { index: "06", label: "Local", href: "#wima-gbp" },
  { index: "07", label: "Brand", href: "#wima-brand" },
  { index: "08", label: "Monitoring", href: "#wima-monitoring" },
  { index: "09", label: "Stack", href: "#wima-stack" },
  { index: "10", label: "Outcome", href: "#wima-outcome" },
  { index: "11", label: "Next", href: "#wima-next" },
];
