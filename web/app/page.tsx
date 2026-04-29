import { getAllListings } from "@/lib/ratings";
import { ListingCard } from "@/components/listing-card";

export default function Home() {
  const listings = getAllListings();

  return (
    <main className="min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-3">
              Issuances
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-fg mb-4 text-balance">
              Rated, fractional,{" "}
              <span className="text-accent-bright">on Solana.</span>
            </h1>
            <p className="text-muted text-base leading-relaxed text-balance">
              Every issuance ships with a full RRE rating breakdown — composite
              score, factor weights, P10 / P50 / P90 forecast, HHI
              concentration, Monte&nbsp;Carlo CVaR. Every number is traceable
              to the open-source engine.
            </p>
          </div>
          <div className="text-right text-xs text-muted space-y-1">
            <div className="font-mono tabular">
              {listings.length} issuances · synthetic catalogs
            </div>
            <div className="font-mono tabular">devnet · mock USDC</div>
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
