import Link from "next/link";
import type { Listing } from "@/lib/types";
import { usd, pct, regimeLabel, TIER_COLOR } from "@/lib/format";

export function ListingCard({ listing }: { listing: Listing }) {
  const tierColor = TIER_COLOR[listing.rating];

  return (
    <Link
      href={`/issuances/${listing.catalog_id}`}
      className="group block rounded-xl border border-border bg-panel p-4 transition-all hover:border-border-strong hover:bg-panel-2 hover:-translate-y-0.5"
    >
      {/* Cover */}
      <div
        className="aspect-square w-full rounded-lg flex items-center justify-center text-2xl font-semibold text-white/95 mb-4 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${listing.grad[0]}, ${listing.grad[1]})`,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        <span className="relative z-10 tracking-wider">{listing.initials}</span>
        {/* subtle grain */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 30% 40%, white, transparent), radial-gradient(1px 1px at 70% 60%, white, transparent)",
            backgroundSize: "120px 120px",
          }}
        />
      </div>

      {/* Title row + rating badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold leading-tight truncate text-fg">
            {listing.title}
          </div>
          <div className="text-sm text-muted truncate">{listing.artist}</div>
        </div>
        <span
          className="font-semibold text-[10px] tracking-wider rounded-full border px-2 py-0.5 shrink-0 tabular"
          style={{ color: tierColor, borderColor: tierColor }}
        >
          {listing.rating}
        </span>
      </div>

      <div className="mt-3 text-xs text-muted">
        {listing.genre} · {regimeLabel(listing.regime)}
      </div>

      {/* Stat row */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="text-muted">Price</div>
          <div className="font-semibold tabular text-fg mt-0.5">
            {usd(listing.price)}
          </div>
        </div>
        <div>
          <div className="text-muted">Score</div>
          <div className="font-semibold tabular text-fg mt-0.5">
            {listing.composite_score.toFixed(1)}
          </div>
        </div>
        <div>
          <div className="text-muted">LTV</div>
          <div
            className="font-semibold tabular mt-0.5"
            style={{ color: tierColor }}
          >
            {pct(listing.ltv_recommended, 0)}
          </div>
        </div>
      </div>
    </Link>
  );
}
