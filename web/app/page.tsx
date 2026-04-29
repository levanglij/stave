import { getAllListings } from "@/lib/ratings";
import { ListingCard } from "@/components/listing-card";

export default function Home() {
  const listings = getAllListings();

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
          <div>
            <div className="text-[11px] font-semibold tracking-[2px] uppercase text-neutral-500 mb-2">
              Issuances
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Rated, fractional, on Solana.
            </h1>
            <p className="text-neutral-400 mt-2 text-sm max-w-2xl">
              Every issuance ships with a full RRE rating breakdown — composite
              score, factor weights, P10 / P50 / P90 forecast, HHI
              concentration, Monte&nbsp;Carlo CVaR. Every number is traceable
              to the open-source engine.
            </p>
          </div>
          <div className="text-right text-xs text-neutral-500">
            <div>{listings.length} issuances · synthetic catalogs</div>
            <div>devnet · mock USDC</div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((l) => (
            <ListingCard key={l.catalog_id} listing={l} />
          ))}
        </div>
      </div>
    </main>
  );
}
