import { RATINGS } from "./ratings";
import { CATALOG_META } from "./catalog-meta";
import type { RatingTier } from "./types";

// Each index unit is 100 notional shares, distributed across the
// component catalogs by weight (in percentage points, summing to 100).
// 1 unit of GHI = 45 shares Suliko + 35 shares Tbiliso + 20 shares
// Chito Gvrito.
export const INDEX_UNIT_SHARES = 100;

export interface IndexComponent {
  catalogId: string;
  weight: number; // 0-100, percentage points
}

export type IndexStatus = "example" | "draft";

export interface Index {
  ticker: string;
  name: string;
  tagline: string;
  description: string;
  accent: string; // hex color used for the ticker badge + composition stripes
  // Lifecycle gate. `example` = shown on the public /indices page as a
  // worked illustration. `draft` = kept in the data file so we have it
  // ready for launch, but not rendered to users yet.
  status: IndexStatus;
  components: IndexComponent[];
}

export const INDICES: Record<string, Index> = {
  GHI: {
    ticker: "GHI",
    name: "Georgian Heritage Index",
    tagline: "Old & classical Georgian songs - folk, traditional, retro",
    description:
      "Pre-1980s Georgian canon - evergreen folk and retro orchestral jazz. The lowest-risk, longest-cashflow basket on Stave.",
    accent: "#b45309",
    status: "example",
    components: [
      { catalogId: "evergreen-001", weight: 45 },
      { catalogId: "balanced-001", weight: 35 },
      { catalogId: "high-hhi-001", weight: 20 },
    ],
  },
  GMI: {
    ticker: "GMI",
    name: "Georgian Modern Index",
    tagline: "Contemporary Georgian - post-2000 pop & alt rock",
    description:
      "Post-2000 Georgian artists with shorter but livelier revenue curves. Higher growth potential, higher volatility.",
    accent: "#db2777",
    status: "example",
    components: [
      { catalogId: "active-pop-001", weight: 60 },
      { catalogId: "new-release-001", weight: 40 },
    ],
  },
};

// Score → tier mapping. Mirrors lib/format.ts TIER_COLOR; kept here
// because indices need to derive a tier from a weighted composite.
const TIER_THRESHOLDS: { tier: RatingTier; min: number; max: number }[] = [
  { tier: "AAA", min: 90, max: 100 },
  { tier: "AA", min: 80, max: 90 },
  { tier: "A", min: 70, max: 80 },
  { tier: "BBB", min: 60, max: 70 },
  { tier: "BB", min: 50, max: 60 },
  { tier: "B", min: 0, max: 50 },
];

function tierForScore(score: number): RatingTier {
  for (const t of TIER_THRESHOLDS) {
    if (score >= t.min && (score < t.max || t.max === 100)) return t.tier;
  }
  return "B";
}

export interface IndexMetrics {
  ticker: string;
  nav: number; // USD per unit
  composite: number; // 0-100, weighted
  ltv: number; // 0-1, weighted
  rating: RatingTier;
  confidence: number; // weighted average
  cvar95: number; // weighted, 60-month USD floor
}

// Derive index metrics from the underlying ratings + listing prices.
// This is the same shape as a single-catalog Listing's headline stats,
// but weighted across components.
export function getIndexMetrics(ticker: string): IndexMetrics {
  const ix = INDICES[ticker];
  let nav = 0;
  let composite = 0;
  let ltv = 0;
  let confidence = 0;
  let cvar95 = 0;

  for (const c of ix.components) {
    const r = RATINGS[c.catalogId];
    const meta = CATALOG_META[c.catalogId];
    const w = c.weight / 100;
    nav += c.weight * meta.price; // 1 unit = 100 shares; component contributes weight × price
    composite += w * r.composite_score;
    ltv += w * r.ltv_recommended;
    confidence += w * r.rating_confidence;
    cvar95 += w * r.cvar_95_60mo_usd;
  }

  return {
    ticker,
    nav,
    composite,
    ltv,
    rating: tierForScore(composite),
    confidence,
    cvar95,
  };
}

// Friendly array form for iteration in pages.
export function getAllIndices(): { index: Index; metrics: IndexMetrics }[] {
  return Object.values(INDICES).map((index) => ({
    index,
    metrics: getIndexMetrics(index.ticker),
  }));
}

// Only the indices we publish on the public /indices page (i.e. status
// === "example"). Everything else stays in the data file as drafts.
export function getExampleIndices(): { index: Index; metrics: IndexMetrics }[] {
  return getAllIndices().filter(({ index }) => index.status === "example");
}
