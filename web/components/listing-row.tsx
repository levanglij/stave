import Link from "next/link";
import type { Listing } from "@/lib/types";
import {
  usd,
  pct,
  compactUsd,
  regimeLabel,
  TIER_COLOR,
} from "@/lib/format";
import { getHeadlineStats } from "@/lib/headline-stats";

const COLS =
  "grid grid-cols-[56px_minmax(220px,1fr)_88px_72px_84px_84px_72px_104px] gap-4 px-5 items-center";

export function ListingRowHeader() {
  return (
    <div
      className={`${COLS} py-3 border-b border-border bg-panel-2/60 text-[10px] uppercase tracking-[1.2px] text-muted font-medium`}
    >
      <div></div>
      <div>Catalog</div>
      <div className="text-right">Rating</div>
      <div className="text-right">Price</div>
      <div className="text-right">FMV</div>
      <div className="text-right">Annual</div>
      <div className="text-right">5YR ROI</div>
      <div className="text-right">Available</div>
    </div>
  );
}

export function ListingRow({ listing }: { listing: Listing }) {
  const tierColor = TIER_COLOR[listing.rating];
  const stats = getHeadlineStats(listing);

  return (
    <Link
      href={`/issuances/${listing.catalog_id}`}
      className={`${COLS} py-5 border-b border-border last:border-b-0 hover:bg-panel-2 transition-colors group`}
    >
      {/* Cover */}
      <div
        className="aspect-square w-12 rounded-md flex items-center justify-center text-[10px] font-semibold text-white/95 tracking-wider relative overflow-hidden"
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
          {listing.artist}
        </div>
        <div className="text-[11px] text-muted/80 truncate mt-1 font-mono tabular">
          {listing.genre} · {regimeLabel(listing.regime)} ·{" "}
          {listing.composite_score.toFixed(1)} score
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

      {/* Price per share */}
      <div className="text-right font-semibold tabular text-fg text-sm">
        {usd(listing.price)}
      </div>

      {/* FMV */}
      <div className="text-right">
        <div className="font-semibold tabular text-fg text-sm">
          {compactUsd(stats.fmv)}
        </div>
        <div className="text-[10px] text-muted mt-0.5 font-mono tabular">
          fair value
        </div>
      </div>

      {/* Annual royalty */}
      <div className="text-right">
        <div className="font-semibold tabular text-fg text-sm">
          {compactUsd(stats.annualRoyalty)}
        </div>
        <div className="text-[10px] text-muted mt-0.5 font-mono tabular">
          /yr P50
        </div>
      </div>

      {/* 5YR ROI — emerald */}
      <div className="text-right">
        <div className="font-semibold tabular text-accent-bright text-sm">
          {pct(stats.roi5yr, 1)}
        </div>
        <div className="text-[10px] text-muted mt-0.5 font-mono tabular">
          5yr base
        </div>
      </div>

      {/* Available */}
      <div className="text-right font-mono tabular text-xs">
        <div>
          <span className="text-fg font-semibold">500</span>
          <span className="text-muted"> / 1,000</span>
        </div>
        <div className="text-[10px] text-muted mt-0.5">tokens</div>
      </div>
    </Link>
  );
}
