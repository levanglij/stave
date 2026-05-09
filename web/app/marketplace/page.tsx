import type { Metadata } from "next";
import Link from "next/link";
import { getAllListings } from "@/lib/ratings";
import { getSiteStats } from "@/lib/site-stats";
import { MarketplaceFilters } from "@/components/marketplace-filters";

export const metadata: Metadata = {
  title: "Marketplace · Stave",
  description:
    "Eight graded, fractional music royalty catalogs. Each carries an open Stave grade and settles on Solana.",
};

export default function MarketplacePage() {
  const listings = getAllListings();
  const stats = getSiteStats();
  // Listings come back sorted high → low by composite_score, so the
  // first / last unique tiers in the array give the spanning range
  // for the summary line.
  const tiersInUse = Array.from(new Set(listings.map((l) => l.rating)));
  const tierSpan =
    tiersInUse.length > 1
      ? `${tiersInUse[0]} to ${tiersInUse[tiersInUse.length - 1]}`
      : tiersInUse[0];

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Page header */}
        <div className="flex items-end justify-between gap-6 flex-wrap mb-3">
          <div>
            <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-3">
              Marketplace
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-fg text-balance">
              {listings.length} graded catalogs.{" "}
              <span className="text-accent-bright">Synthetic.</span>
            </h1>
          </div>
          <Link
            href="/indices"
            className="text-sm text-accent-bright hover:underline font-medium"
          >
            View thematic indices →
          </Link>
        </div>

        {/* Single-line summary */}
        <div className="text-[11px] text-muted font-mono tabular tracking-wide mb-6">
          {listings.length} catalogs · spanning{" "}
          <span className="text-fg/90">{tierSpan}</span> · weighted avg{" "}
          <span className="text-fg/90">{stats.averageRating}</span>
        </div>

        {/* Filter + sort + listings - interactive */}
        <MarketplaceFilters listings={listings} />

        <div className="mt-4 text-[11px] text-muted font-mono tabular">
          Devnet preview · synthetic catalog data · prices indicative
        </div>
      </div>
    </main>
  );
}
