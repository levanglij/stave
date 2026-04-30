import type { Rating, Listing } from "./types";
import { CATALOG_META } from "./catalog-meta";

// Pre-computed RRE ratings produced by the Python engine
// (engine/outputs/*.rating.json). Imported statically so they're
// bundled at build time — no network call, no API route.
import activePop from "@engine/outputs/active-pop-001.rating.json";
import activePop2 from "@engine/outputs/active-pop-002.rating.json";
import balanced from "@engine/outputs/balanced-001.rating.json";
import catalog from "@engine/outputs/catalog-001.rating.json";
import evergreen from "@engine/outputs/evergreen-001.rating.json";
import evergreen2 from "@engine/outputs/evergreen-002.rating.json";
import highHhi from "@engine/outputs/high-hhi-001.rating.json";
import newRelease from "@engine/outputs/new-release-001.rating.json";

export const RATINGS: Record<string, Rating> = {
  "active-pop-001": activePop as Rating,
  "active-pop-002": activePop2 as Rating,
  "balanced-001": balanced as Rating,
  "catalog-001": catalog as Rating,
  "evergreen-001": evergreen as Rating,
  "evergreen-002": evergreen2 as Rating,
  "high-hhi-001": highHhi as Rating,
  "new-release-001": newRelease as Rating,
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
