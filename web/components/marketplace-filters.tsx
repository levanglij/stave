"use client";

import { useMemo, useState } from "react";
import type { Listing, RatingTier } from "@/lib/types";
import { ListingRow, ListingRowHeader } from "./listing-row";
import { getHeadlineStats } from "@/lib/headline-stats";

// Marketplace filter + sort + render. Server component fetches the
// listings; this client component owns interactive state. ListingRow
// itself is reused unchanged.
//
// Filter state model:
// - tiers: empty Set = "all tiers"; non-empty = explicit subset
// - genre: empty string = "all genres"
// - sort: one of fmv (default) / price / roi5

type SortKey = "fmv" | "price" | "roi5" | "grade";

const ALL_TIERS: RatingTier[] = ["AAA", "AA", "A", "BBB", "BB", "B"];

export function MarketplaceFilters({ listings }: { listings: Listing[] }) {
  const allGenres = useMemo(
    () => Array.from(new Set(listings.map((l) => l.genre))).sort(),
    [listings],
  );
  const [tiers, setTiers] = useState<Set<RatingTier>>(new Set());
  const [genre, setGenre] = useState<string>("");
  const [sort, setSort] = useState<SortKey>("fmv");

  const filtered = useMemo(() => {
    let out = listings;
    if (tiers.size > 0) {
      out = out.filter((l) => tiers.has(l.rating as RatingTier));
    }
    if (genre) {
      out = out.filter((l) => l.genre === genre);
    }
    return [...out].sort((a, b) => {
      const sa = getHeadlineStats(a);
      const sb = getHeadlineStats(b);
      if (sort === "fmv") return sb.fmv - sa.fmv;
      if (sort === "price") return b.price - a.price;
      if (sort === "roi5") return sb.roi5yr - sa.roi5yr;
      // Grade: highest composite_score first → highest tier first.
      if (sort === "grade") return b.composite_score - a.composite_score;
      return 0;
    });
  }, [listings, tiers, genre, sort]);

  const toggleTier = (t: RatingTier) => {
    const next = new Set(tiers);
    if (next.has(t)) {
      next.delete(t);
    } else {
      next.add(t);
    }
    setTiers(next);
  };

  const clearAll = () => {
    setTiers(new Set());
    setGenre("");
  };

  return (
    <>
      {/* Sticky filter / sort bar */}
      <div
        className="sticky top-14 z-10 -mx-6 px-6 py-3 bg-bg/85 backdrop-blur-md border-y border-border flex flex-wrap items-center gap-x-4 gap-y-3 mb-6"
        role="toolbar"
        aria-label="Filter and sort listings"
      >
        {/* Tier multi-select pills — single accent + descending opacity per
            Bundle A's grade-ladder treatment. Active = colored, inactive
            = neutral zinc. */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[10px] font-semibold tracking-[1.5px] uppercase text-muted mr-1.5">
            Grade
          </span>
          {ALL_TIERS.map((t, i) => {
            const active = tiers.has(t);
            const opacity = 1 - i * 0.13;
            return (
              <button
                key={t}
                onClick={() => toggleTier(t)}
                className="text-[11px] font-semibold tracking-wider rounded-full border px-2.5 py-1 tabular transition-colors"
                style={
                  active
                    ? {
                        color: `rgba(52, 211, 153, ${opacity})`,
                        borderColor: `rgba(52, 211, 153, ${opacity * 0.6})`,
                        backgroundColor: `rgba(16, 185, 129, ${opacity * 0.08})`,
                      }
                    : {
                        color: "rgb(161, 161, 170)",
                        borderColor: "rgb(63, 63, 70)",
                        backgroundColor: "transparent",
                      }
                }
                aria-pressed={active}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Genre dropdown — native <select>, keyboard-accessible */}
        <label className="inline-flex items-center gap-2 text-sm rounded-full border border-border bg-panel px-3 py-1.5 text-fg/85">
          <span className="text-[10px] font-semibold tracking-[1.5px] uppercase text-muted">
            Genre
          </span>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="bg-transparent outline-none text-sm pr-1"
          >
            <option value="">All</option>
            {allGenres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>

        {(tiers.size > 0 || genre) && (
          <button
            onClick={clearAll}
            className="text-xs text-zinc-500 hover:text-zinc-300 underline-offset-2 hover:underline"
          >
            Clear filters
          </button>
        )}

        <div className="flex-1" />

        {/* Sort — native <select> */}
        <label className="inline-flex items-center gap-2 text-sm rounded-full border border-border bg-panel px-3 py-1.5 text-fg/85">
          <span className="text-[10px] font-semibold tracking-[1.5px] uppercase text-muted">
            Sort
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-transparent outline-none text-sm pr-1"
          >
            <option value="grade">Grade</option>
            <option value="fmv">FMV</option>
            <option value="price">Price</option>
            <option value="roi5">5yr ROI</option>
          </select>
        </label>
      </div>

      {/* Listings table */}
      <div className="rounded-xl border border-border bg-panel overflow-hidden">
        <ListingRowHeader />
        {filtered.length > 0 ? (
          filtered.map((l) => (
            <ListingRow key={l.catalog_id} listing={l} />
          ))
        ) : (
          <div className="px-6 py-10 text-center text-sm text-muted">
            No catalogs match these filters.{" "}
            <button
              onClick={clearAll}
              className="text-accent-bright hover:underline"
            >
              Clear all
            </button>
            .
          </div>
        )}
      </div>

      {/* Result count line */}
      <div className="mt-3 text-[11px] text-muted/80 font-mono tabular">
        Showing {filtered.length} of {listings.length} catalogs
      </div>
    </>
  );
}
