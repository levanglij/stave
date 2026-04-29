import { getAllListings } from "@/lib/ratings";
import { ListingRow, ListingRowHeader } from "@/components/listing-row";

export default function Home() {
  const listings = getAllListings();

  return (
    <main className="min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
          <div>
            <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-3">
              Marketplace
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-fg text-balance">
              Rated, fractional,{" "}
              <span className="text-accent-bright">on Solana.</span>
            </h1>
          </div>
          <div className="text-right text-xs text-muted space-y-1">
            <div className="font-mono tabular">
              {listings.length} catalogs · synthetic
            </div>
            <div className="font-mono tabular">devnet · mock USDC</div>
          </div>
        </div>

        {/* List */}
        <div className="rounded-xl border border-border bg-panel overflow-hidden">
          <ListingRowHeader />
          {listings.map((l) => (
            <ListingRow key={l.catalog_id} listing={l} />
          ))}
        </div>
      </div>
    </main>
  );
}
