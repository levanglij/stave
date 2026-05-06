import type { Rating, RatingTier, Listing } from "./types";
import { CATALOG_META } from "./catalog-meta";

// Pre-computed grades produced by the Python engine
// (engine/outputs/*.rating.json). Imported statically so they're
// bundled at build time — no network call, no API route.
//
// The engine still emits legacy "RRE-XX" tier strings on the rating
// field. We normalize that prefix off at load time so all UI sees the
// bare letter form ("AA", "BBB", etc.). One canonical place to strip;
// nothing downstream needs to know about the legacy format.
import activePop from "@engine/outputs/active-pop-001.rating.json";
import activePop2 from "@engine/outputs/active-pop-002.rating.json";
import balanced from "@engine/outputs/balanced-001.rating.json";
import catalog from "@engine/outputs/catalog-001.rating.json";
import evergreen from "@engine/outputs/evergreen-001.rating.json";
import evergreen2 from "@engine/outputs/evergreen-002.rating.json";
import highHhi from "@engine/outputs/high-hhi-001.rating.json";
import newRelease from "@engine/outputs/new-release-001.rating.json";

function normalizeRating(raw: unknown): Rating {
  const r = raw as Rating & { rating: string };
  return {
    ...r,
    rating: r.rating.replace(/^RRE-/, "") as RatingTier,
  };
}

export const RATINGS: Record<string, Rating> = {
  "active-pop-001": normalizeRating(activePop),
  "active-pop-002": normalizeRating(activePop2),
  "balanced-001": normalizeRating(balanced),
  "catalog-001": normalizeRating(catalog),
  "evergreen-001": normalizeRating(evergreen),
  "evergreen-002": normalizeRating(evergreen2),
  "high-hhi-001": normalizeRating(highHhi),
  "new-release-001": normalizeRating(newRelease),
};

export function getListing(catalogId: string): Listing | undefined {
  const rating = RATINGS[catalogId];
  const meta = CATALOG_META[catalogId];
  if (!rating || !meta) return undefined;
  return { ...rating, ...meta };
}

// Sorted by composite score descending — the natural order for
// presenting a marketplace of issuances.
export function getAllListings(): Listing[] {
  return Object.keys(RATINGS)
    .map(getListing)
    .filter((l): l is Listing => l !== undefined)
    .sort((a, b) => b.composite_score - a.composite_score);
}
