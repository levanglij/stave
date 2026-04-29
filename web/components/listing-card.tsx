import Link from "next/link";
import type { Listing } from "@/lib/types";
import { usd, pct, regimeLabel, TIER_COLOR } from "@/lib/format";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/issuances/${listing.catalog_id}`}
      className="group block rounded-xl border border-neutral-800 bg-neutral-950 p-4 transition-all hover:border-neutral-700 hover:bg-neutral-900"
    >
      {/* Cover */}
      <div
        className="aspect-square w-full rounded-lg flex items-center justify-center text-2xl font-semibold text-white/90 mb-4"
        style={{
          background: `linear-gradient(135deg, ${listing.grad[0]}, ${listing.grad[1]})`,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        {listing.initials}
      </div>

      {/* Title row + rating badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold leading-tight truncate text-neutral-50">
            {listing.title}
          </div>
          <div className="text-sm text-neutral-400 truncate">
            {listing.artist}
          </div>
        </div>
        <span
          className="font-semibold text-[10px] tracking-wider rounded-full border px-2 py-0.5"
          style={{
            color: TIER_COLOR[listing.rating],
            borderColor: TIER_COLOR[listing.rating],
          }}
        >
          {listing.rating}
        </span>
      </div>

      <div className="mt-3 text-xs text-neutral-500">
        {listing.genre} · {regimeLabel(listing.regime)}
      </div>

      {/* Stat row */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="text-neutral-500">Price</div>
          <div className="font-semibold tabular-nums text-neutral-50">
            {usd(listing.price)}
          </div>
        </div>
        <div>
          <div className="text-neutral-500">Score</div>
          <div className="font-semibold tabular-nums text-neutral-50">
            {listing.composite_score.toFixed(1)}
          </div>
        </div>
        <div>
          <div className="text-neutral-500">LTV</div>
          <div
            className="font-semibold tabular-nums"
            style={{ color: TIER_COLOR[listing.rating] }}
          >
            {pct(listing.ltv_recommended, 0)}
          </div>
        </div>
      </div>
    </Link>
  );
}
