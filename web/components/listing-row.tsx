import Link from "next/link";
import type { Listing } from "@/lib/types";
import { usd, pct, regimeLabel, TIER_COLOR } from "@/lib/format";

const COLS =
  "grid grid-cols-[56px_minmax(180px,1fr)_88px_84px_72px_84px_104px] gap-4 px-5 items-center";

export function ListingRowHeader() {
  return (
    <div
      className={`${COLS} py-3 border-b border-border bg-panel-2/60 text-[10px] uppercase tracking-[1.2px] text-muted font-medium`}
    >
      <div></div>
      <div>Catalog</div>
      <div className="text-right">Rating</div>
      <div className="text-right">Price</div>
      <div className="text-right">Score</div>
      <div className="text-right">Max LTV</div>
      <div className="text-right">Available</div>
    </div>
  );
}

export function ListingRow({ listing }: { listing: Listing }) {
  const tierColor = TIER_COLOR[listing.rating];

  return (
    <Link
      href={`/issuances/${listing.catalog_id}`}
      className={`${COLS} py-4 border-b border-border last:border-b-0 hover:bg-panel-2 transition-colors group`}
    >
      {/* Cover */}
      <div
        className="aspect-square w-10 rounded flex items-center justify-center text-[10px] font-semibold text-white/95 tracking-wider relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${listing.grad[0]}, ${listing.grad[1]})`,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        <span className="relative z-10">{listing.initials}</span>
      </div>

      {/* Title + subtitle */}
      <div className="min-w-0">
        <div className="font-semibold text-fg truncate group-hover:text-accent-bright transition-colors">
          {listing.title}
        </div>
        <div className="text-xs text-muted truncate mt-0.5">
          {listing.artist} · {listing.genre} · {regimeLabel(listing.regime)}
        </div>
      </div>

      {/* Rating */}
      <div className="text-right">
        <span
          className="font-semibold text-[10px] tracking-wider rounded-full border px-2 py-0.5 tabular inline-block"
          style={{ color: tierColor, borderColor: tierColor }}
        >
          {listing.rating}
        </span>
      </div>

      {/* Price */}
      <div className="text-right font-semibold tabular text-fg text-sm">
        {usd(listing.price)}
      </div>

      {/* Score */}
      <div className="text-right font-semibold tabular text-fg text-sm">
        {listing.composite_score.toFixed(1)}
      </div>

      {/* LTV */}
      <div
        className="text-right font-semibold tabular text-sm"
        style={{ color: tierColor }}
      >
        {pct(listing.ltv_recommended, 0)}
      </div>

      {/* Available */}
      <div className="text-right font-mono tabular text-xs text-muted">
        <span className="text-fg">500</span> / 1,000
      </div>
    </Link>
  );
}
