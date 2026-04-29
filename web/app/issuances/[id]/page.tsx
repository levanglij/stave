import type { Metadata } from "next";
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

export function generateMetadata({ params }: PageProps): Metadata {
  const listing = getListing(params.id);
  if (!listing) return { title: "Issuance not found · Stave" };
  return {
    title: `${listing.title} · ${listing.rating} · Stave`,
    description: `${listing.artist} — ${listing.genre} catalog rated ${listing.rating}. Composite ${listing.composite_score.toFixed(1)}/100, max LTV ${Math.round(listing.ltv_recommended * 100)}%.`,
  };
}

export default function IssuanceDetail({ params }: PageProps) {
  const listing = getListing(params.id);
  if (!listing) notFound();

  const tierColor = TIER_COLOR[listing.rating];

  return (
    <main className="min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg mb-6 transition-colors"
        >
          ← All issuances
        </Link>

        <div className="grid md:grid-cols-3 gap-6">
          {/* LEFT — cover + identity + summary */}
          <div className="md:col-span-1 space-y-4">
            <div
              className="aspect-square rounded-xl flex items-center justify-center text-3xl font-semibold text-white/95 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${listing.grad[0]}, ${listing.grad[1]})`,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
              }}
            >
              <span className="relative z-10 tracking-wider">
                {listing.initials}
              </span>
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

            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xl font-semibold leading-tight tracking-tight">
                  {listing.title}
                </div>
                <div className="text-muted text-sm">{listing.artist}</div>
                <div className="text-muted text-xs mt-1">
                  {listing.genre} · {regimeLabel(listing.regime)}
                </div>
              </div>
              <span
                className="font-semibold text-xs tracking-wider rounded-full border px-2.5 py-0.5 shrink-0 tabular"
                style={{ color: tierColor, borderColor: tierColor }}
              >
                {listing.rating}
              </span>
            </div>

            {/* Rating summary */}
            <Panel label="Rating Summary">
              <Kv label="Composite score" value={`${listing.composite_score.toFixed(1)} / 100`} />
              <Kv label="Confidence" value={pct(listing.rating_confidence, 0)} />
              <Kv label="Decay model" value={listing.decay_model.replace(/_/g, " ")} />
              <Kv label="Max LTV (senior)" value={pct(listing.ltv_recommended, 0)} highlight={tierColor} />
              <Kv label="Anomalies in history" value={String(listing.anomaly_count)} />
              <Kv label="Next review" value={listing.review_due} muted />
            </Panel>

            {/* Concentration */}
            <Panel label="Concentration (HHI)">
              <Kv
                label="Platform"
                value={listing.hhi_platform.toFixed(3)}
                tag={hhiTag(listing.hhi_platform)}
              />
              <Kv
                label="Territory"
                value={listing.hhi_territory.toFixed(3)}
                tag={hhiTag(listing.hhi_territory)}
              />
            </Panel>

            {/* Monte Carlo */}
            <Panel label="Monte Carlo (60-mo total)">
              <Kv label="VaR₉₅" value={usd(listing.var_95_60mo_usd, 0)} />
              <Kv
                label="CVaR₉₅ (senior floor)"
                value={usd(listing.cvar_95_60mo_usd, 0)}
                highlight={tierColor}
              />
            </Panel>
          </div>

          {/* RIGHT — factors + forecast + listing */}
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-xl border border-border bg-panel p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-[11px] tracking-[1.5px] uppercase text-muted">
                    Factor Breakdown
                  </div>
                  <div className="text-sm text-fg/80 mt-1">
                    Five components, weighted per{" "}
                    <code className="text-fg bg-panel-2 px-1 py-0.5 rounded text-[12px] font-mono">
                      engine/FORMULAS.md
                    </code>
                  </div>
                </div>
                <div className="text-sm text-muted">
                  Score{" "}
                  <span className="font-semibold text-fg tabular">
                    {listing.composite_score.toFixed(1)}
                  </span>
                </div>
              </div>
              <FactorBreakdown factors={listing.factors} />
            </div>

            <div className="rounded-xl border border-border bg-panel p-5">
              <div className="mb-3">
                <div className="text-[11px] tracking-[1.5px] uppercase text-muted">
                  60-month revenue forecast
                </div>
                <div className="text-sm text-fg/80 mt-1">
                  Monthly USD — P10 / P50 / P90 from the fitted{" "}
                  {listing.decay_model.replace(/_/g, " ")} model.
                </div>
              </div>
              <ForecastChart forecast={listing.forecast_60mo} />
            </div>

            {/* Listing terms */}
            <div className="rounded-xl border border-border bg-panel p-5">
              <div className="text-[11px] tracking-[1.5px] uppercase text-muted mb-4">
                Listing terms
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted text-xs">Price per share</div>
                  <div className="font-semibold text-2xl tabular mt-1 tracking-tight">
                    {usd(listing.price)}
                  </div>
                </div>
                <div>
                  <div className="text-muted text-xs">Total shares</div>
                  <div className="font-semibold text-2xl tabular mt-1 tracking-tight">
                    1,000
                  </div>
                </div>
                <div>
                  <div className="text-muted text-xs">Available</div>
                  <div className="font-semibold text-2xl tabular mt-1 tracking-tight">
                    500
                  </div>
                </div>
              </div>
              <button
                disabled
                className="btn-glow mt-5 w-full rounded-lg bg-accent text-accent-ink font-semibold text-sm py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Connect wallet to invest · live in D1.8
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Panel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-panel p-4">
      <div className="text-[11px] tracking-[1.5px] uppercase text-muted mb-3">
        {label}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
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
      <div className="text-muted text-xs">{label}</div>
      <div className="flex items-center gap-2">
        <div
          className="font-medium tabular"
          style={{ color: highlight ?? (muted ? "#94a3b8" : "#F8FAFC") }}
        >
          {value}
        </div>
        {tag && (
          <span className="text-[10px] uppercase tracking-wider rounded-full border border-border px-1.5 py-0.5 text-muted">
            {tag}
          </span>
        )}
      </div>
    </div>
  );
}
