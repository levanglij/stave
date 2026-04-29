import Link from "next/link";
import { notFound } from "next/navigation";
import { getListing, RATINGS } from "@/lib/ratings";
import { usd, pct, regimeLabel, hhiTag, TIER_COLOR } from "@/lib/format";
import { FactorBreakdown } from "@/components/factor-breakdown";
import { ForecastChart } from "@/components/forecast-chart";

// Pre-render all 5 detail pages at build time.
export function generateStaticParams() {
  return Object.keys(RATINGS).map((id) => ({ id }));
}

interface PageProps {
  params: { id: string };
}

export default function IssuanceDetail({ params }: PageProps) {
  const listing = getListing(params.id);
  if (!listing) notFound();

  const tierColor = TIER_COLOR[listing.rating];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-200 mb-6"
        >
          ← All issuances
        </Link>

        <div className="grid md:grid-cols-3 gap-6">
          {/* LEFT — cover + identity + summary */}
          <div className="md:col-span-1 space-y-4">
            <div
              className="aspect-square rounded-xl flex items-center justify-center text-3xl font-semibold text-white/95"
              style={{
                background: `linear-gradient(135deg, ${listing.grad[0]}, ${listing.grad[1]})`,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
              }}
            >
              {listing.initials}
            </div>

            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xl font-semibold leading-tight">
                  {listing.title}
                </div>
                <div className="text-neutral-400 text-sm">
                  {listing.artist}
                </div>
                <div className="text-neutral-500 text-xs mt-1">
                  {listing.genre} · {regimeLabel(listing.regime)}
                </div>
              </div>
              <span
                className="font-semibold text-xs tracking-wider rounded-full border px-2.5 py-0.5"
                style={{ color: tierColor, borderColor: tierColor }}
              >
                {listing.rating}
              </span>
            </div>

            {/* Rating summary */}
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4">
              <div className="text-[11px] tracking-wider uppercase text-neutral-500 mb-3">
                Rating Summary
              </div>
              <Kv label="Composite score" value={`${listing.composite_score.toFixed(1)} / 100`} />
              <Kv label="Confidence" value={pct(listing.rating_confidence, 0)} />
              <Kv label="Decay model" value={listing.decay_model.replace(/_/g, " ")} />
              <Kv label="Max LTV (senior)" value={pct(listing.ltv_recommended, 0)} highlight={tierColor} />
              <Kv label="Anomalies in history" value={String(listing.anomaly_count)} />
              <Kv label="Next review" value={listing.review_due} muted />
            </div>

            {/* Concentration */}
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4">
              <div className="text-[11px] tracking-wider uppercase text-neutral-500 mb-3">
                Concentration (HHI)
              </div>
              <Kv
                label="Platform"
                value={`${listing.hhi_platform.toFixed(3)}`}
                tag={hhiTag(listing.hhi_platform)}
              />
              <Kv
                label="Territory"
                value={`${listing.hhi_territory.toFixed(3)}`}
                tag={hhiTag(listing.hhi_territory)}
              />
            </div>

            {/* Monte Carlo */}
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4">
              <div className="text-[11px] tracking-wider uppercase text-neutral-500 mb-3">
                Monte Carlo (60-mo total)
              </div>
              <Kv label="VaR₉₅" value={usd(listing.var_95_60mo_usd, 0)} />
              <Kv label="CVaR₉₅ (senior floor)" value={usd(listing.cvar_95_60mo_usd, 0)} highlight={tierColor} />
            </div>
          </div>

          {/* RIGHT — factors + forecast */}
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[11px] tracking-wider uppercase text-neutral-500">
                    Factor Breakdown
                  </div>
                  <div className="text-sm text-neutral-300 mt-0.5">
                    Five components, weighted per{" "}
                    <code className="text-neutral-200 bg-neutral-900 px-1 py-0.5 rounded text-[12px]">
                      engine/FORMULAS.md
                    </code>
                    .
                  </div>
                </div>
                <div className="text-sm text-neutral-300">
                  Score{" "}
                  <span className="font-semibold text-neutral-50 tabular-nums">
                    {listing.composite_score.toFixed(1)}
                  </span>
                </div>
              </div>
              <FactorBreakdown factors={listing.factors} />
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
              <div className="mb-3">
                <div className="text-[11px] tracking-wider uppercase text-neutral-500">
                  60-month revenue forecast
                </div>
                <div className="text-sm text-neutral-300 mt-0.5">
                  Monthly USD — P10 / P50 / P90 from the fitted{" "}
                  {listing.decay_model.replace(/_/g, " ")} model.
                </div>
              </div>
              <ForecastChart forecast={listing.forecast_60mo} />
            </div>

            {/* Listing terms */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
              <div className="text-[11px] tracking-wider uppercase text-neutral-500 mb-4">
                Listing terms
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-neutral-500 text-xs">Price per share</div>
                  <div className="font-semibold text-xl tabular-nums mt-1">
                    {usd(listing.price)}
                  </div>
                </div>
                <div>
                  <div className="text-neutral-500 text-xs">Total shares</div>
                  <div className="font-semibold text-xl tabular-nums mt-1">
                    1,000
                  </div>
                </div>
                <div>
                  <div className="text-neutral-500 text-xs">Available</div>
                  <div className="font-semibold text-xl tabular-nums mt-1">
                    500
                  </div>
                </div>
              </div>
              <button
                disabled
                className="mt-5 w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-emerald-950 font-semibold text-sm py-3 transition-colors"
              >
                Buy shares · wallet connect coming in D1.8
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

interface KvProps {
  label: string;
  value: string;
  tag?: string;
  highlight?: string;
  muted?: boolean;
}

function Kv({ label, value, tag, highlight, muted }: KvProps) {
  return (
    <div className="flex justify-between items-center py-1 text-sm">
      <div className="text-neutral-400 text-xs">{label}</div>
      <div className="flex items-center gap-2">
        <div
          className="font-medium tabular-nums"
          style={{ color: highlight ?? (muted ? "#94a3b8" : "#F8FAFC") }}
        >
          {value}
        </div>
        {tag && (
          <span className="text-[10px] uppercase tracking-wider rounded-full border border-neutral-700 px-1.5 py-0.5 text-neutral-400">
            {tag}
          </span>
        )}
      </div>
    </div>
  );
}
