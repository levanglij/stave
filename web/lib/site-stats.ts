// Aggregate stats computed once at build time from the listings dataset.
// Used by the homepage stats band so the numbers can never go stale
// relative to whatever the marketplace currently shows.

import { getAllListings } from "./ratings";
import { getHeadlineStats } from "./headline-stats";
import type { RatingTier } from "./types";

export interface SiteStats {
  catalogCount: number;
  tierCount: number;
  totalFmv: number;
  averageRating: RatingTier;
  averageScore: number;
  medianRoi5yr: number;
  minRoi5yr: number;
  maxRoi5yr: number;
}

const TIER_THRESHOLDS: { tier: RatingTier; min: number }[] = [
  { tier: "RRE-AAA", min: 90 },
  { tier: "RRE-AA", min: 80 },
  { tier: "RRE-A", min: 70 },
  { tier: "RRE-BBB", min: 60 },
  { tier: "RRE-BB", min: 50 },
  { tier: "RRE-B", min: 0 },
];

function tierForScore(score: number): RatingTier {
  for (const t of TIER_THRESHOLDS) {
    if (score >= t.min) return t.tier;
  }
  return "RRE-B";
}

function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function getSiteStats(): SiteStats {
  const listings = getAllListings();
  const enriched = listings.map((l) => ({
    listing: l,
    stats: getHeadlineStats(l),
  }));
  const totalFmv = enriched.reduce((s, e) => s + e.stats.fmv, 0);
  const fmvWeightedScore =
    enriched.reduce((s, e) => s + e.listing.composite_score * e.stats.fmv, 0) /
    totalFmv;
  const rois = enriched.map((e) => e.stats.roi5yr);
  const tiers = new Set(listings.map((l) => l.rating));

  return {
    catalogCount: listings.length,
    tierCount: tiers.size,
    totalFmv,
    averageScore: fmvWeightedScore,
    averageRating: tierForScore(fmvWeightedScore),
    medianRoi5yr: median(rois),
    minRoi5yr: Math.min(...rois),
    maxRoi5yr: Math.max(...rois),
  };
}
