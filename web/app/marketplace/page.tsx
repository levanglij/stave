import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getAllListings } from "@/lib/ratings";
import { ListingRow, ListingRowHeader } from "@/components/listing-row";

export const metadata: Metadata = {
  title: "Marketplace · Stave",
  description:
    "Eight graded, fractional music royalty catalogs. Each carries an open Stave grade and settles on Solana.",
};

const FILTERS = ["Grade", "Genre", "5yr ROI"];

export default function MarketplacePage() {
  const listings = getAllListings();

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Page header */}
        <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
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

        {/* Filter row — visual only in v1 */}
        <div
          className="flex flex-wrap items-center gap-2 mb-6"
          role="toolbar"
          aria-label="Filter listings"
        >
          {FILTERS.map((label) => (
            <FilterChip key={label} label={label} />
          ))}
          <div className="flex-1" />
          <FilterChip label="Sort: FMV" />
        </div>

        {/* Listings table */}
        <div className="rounded-xl border border-border bg-panel overflow-hidden">
          <ListingRowHeader />
          {listings.map((l) => (
            <ListingRow key={l.catalog_id} listing={l} />
          ))}
        </div>

        <div className="mt-4 text-[11px] text-muted font-mono tabular">
          Devnet preview · synthetic catalog data · prices indicative
        </div>
      </div>
    </main>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      className="inline-flex items-center gap-1.5 text-sm rounded-full border border-border bg-panel px-3.5 py-1.5 text-fg/85 hover:border-border-strong transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      aria-disabled
      title="Filtering ships in v2"
    >
      {label}
      <ChevronDown className="w-3.5 h-3.5 opacity-70" />
    </button>
  );
}
