import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListing, RATINGS } from "@/lib/ratings";
import { getHeadlineStats } from "@/lib/headline-stats";
import {
  usd,
  pct,
  compactUsd,
  regimeLabel,
  hhiTag,
  TIER_COLOR,
} from "@/lib/format";
import { FactorBreakdown } from "@/components/factor-breakdown";
import { ForecastChart } from "@/components/forecast-chart";
import { WaveformHero } from "@/components/waveform-hero";
import { PurchasePanel } from "@/components/purchase-panel";
import { ReturnsCalculator } from "@/components/returns-calculator";

// Pre-render all 5 detail pages at build time.
export function generateStaticParams() {
  return Object.keys(RATINGS).map((id) => ({ id }));
}

interface PageProps {
  params: { id: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const listing = getListing(params.id);
  if (!listing) return { title: "Catalog not found · Stave" };
  return {
    title: `${listing.title} · ${listing.rating} · Stave`,
    description: listing.description,
  };
}

const TABS = [
  "Overview",
  "Financials",
  "Rights Structure",
  "Streaming Data",
  "Documents",
  "Activity",
];

// Deterministic mock listing meta — views, watching, listed-days-ago.
function getPageMeta(catalogId: string) {
  let h = 2166136261;
  for (let i = 0; i < catalogId.length; i++) {
    h = Math.imul(h ^ catalogId.charCodeAt(i), 16777619) >>> 0;
  }
  return {
    views: 4_000 + (h % 8_000),
    watching: 200 + ((h >> 7) % 800),
    listedDaysAgo: 2 + ((h >> 13) % 28),
  };
}

export default function CatalogDetail({ params }: PageProps) {
  const listing = getListing(params.id);
  if (!listing) notFound();

  const tierColor = TIER_COLOR[listing.rating];
  const stats = getHeadlineStats(listing);
  const pageMeta = getPageMeta(listing.catalog_id);
  const isTrending = listing.composite_score >= 70;

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg mb-6 transition-colors"
        >
          ← Marketplace
        </Link>

        {/* Tags + Watch/Share */}
        <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
          <div className="flex flex-wrap items-center gap-2">
            <Tag color="amber">FRACTIONAL</Tag>
            <Tag color="emerald" dot>
              CLEAN
            </Tag>
            <Tag color="purple">{regimeLabel(listing.regime).toUpperCase()}</Tag>
            {isTrending && <Tag color="orange">🔥 TRENDING</Tag>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="text-xs border border-border rounded-md px-3 py-1.5 text-fg hover:bg-panel-2 transition-colors">
              ☆ Watch
            </button>
            <button className="text-xs border border-border rounded-md px-3 py-1.5 text-fg hover:bg-panel-2 transition-colors">
              ↗ Share
            </button>
          </div>
        </div>

        {/* Title + subtitle + stats */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-fg mb-2">
          {listing.title}
        </h1>
        <p className="text-fg/70 text-base mb-3">
          {listing.artist} · {listing.genre}
        </p>
        <div className="text-xs text-muted font-mono tabular mb-8">
          {pageMeta.views.toLocaleString()} views · {pageMeta.watching} watching ·
          Listed {pageMeta.listedDaysAgo}d ago
        </div>

        <div className="border-t border-border mb-8"></div>

        {/* HERO: waveform (left, 2/3) + purchase panel (right, 1/3) */}
        <div className="grid md:grid-cols-3 gap-6 mb-2">
          <div className="md:col-span-2">
            <WaveformHero
              catalogId={listing.catalog_id}
              title={listing.title}
              artist={listing.artist}
            />
          </div>
          <div>
            <PurchasePanel listing={listing} />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mt-8 mb-6 flex gap-1 overflow-x-auto">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              disabled={i !== 0}
              className={
                "px-4 py-2.5 text-sm border-b-2 -mb-px whitespace-nowrap transition-colors " +
                (i === 0
                  ? "border-accent-bright text-fg font-medium"
                  : "border-transparent text-muted/60 cursor-not-allowed")
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 4-stat row + Returns Calculator */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="FMV" value={compactUsd(stats.fmv)} icon="✦" />
              <StatCard
                label="5YR Base ROI"
                value={pct(stats.roi5yr, 1)}
                highlight
              />
              <StatCard label="Risk Score" value={`${stats.riskScore}/100`} />
              <StatCard
                label="Annual Royalty"
                value={compactUsd(stats.annualRoyalty)}
              />
            </div>

            {/* About this catalog */}
            <div className="rounded-xl border border-border bg-panel p-5">
              <div className="font-semibold text-fg mb-3 text-base">
                About this catalog
              </div>
              <p className="text-sm text-fg/80 leading-relaxed">
                {listing.description}
              </p>
            </div>
          </div>

          <div>
            <ReturnsCalculator listing={listing} />
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-border my-12"></div>

        {/* RRE Engine details */}
        <div className="mb-6">
          <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-2">
            RRE Rating Breakdown
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-fg mb-1">
            How this catalog scored
          </h2>
          <p className="text-sm text-muted">
            Five-layer pipeline: data normalization, decay modeling, anomaly
            detection, concentration risk, rating aggregation. Source:{" "}
            <code className="text-fg bg-panel px-1.5 py-0.5 rounded text-xs font-mono">
              engine/FORMULAS.md
            </code>
            .
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Factor breakdown */}
          <div className="md:col-span-2 rounded-xl border border-border bg-panel p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="text-[11px] tracking-[1.5px] uppercase text-muted">
                Factor Breakdown
              </div>
              <div className="text-sm text-muted">
                Score{" "}
                <span className="font-semibold text-fg tabular">
                  {listing.composite_score.toFixed(1)} / 100
                </span>
              </div>
            </div>
            <FactorBreakdown factors={listing.factors} />
          </div>

          {/* Sidebar: rating summary, HHI, MC */}
          <div className="space-y-4">
            <Panel label="Rating Summary">
              <Kv
                label="Composite score"
                value={`${listing.composite_score.toFixed(1)} / 100`}
              />
              <Kv label="Confidence" value={pct(listing.rating_confidence, 0)} />
              <Kv
                label="Decay model"
                value={listing.decay_model.replace(/_/g, " ")}
              />
              <Kv
                label="Max LTV"
                value={pct(listing.ltv_recommended, 0)}
                highlight={tierColor}
              />
              <Kv label="Anomalies" value={String(listing.anomaly_count)} />
              <Kv label="Next review" value={listing.review_due} muted />
            </Panel>
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
            <Panel label="Monte Carlo (60-mo)">
              <Kv label="VaR₉₅" value={usd(listing.var_95_60mo_usd, 0)} />
              <Kv
                label="CVaR₉₅"
                value={usd(listing.cvar_95_60mo_usd, 0)}
                highlight={tierColor}
              />
            </Panel>
          </div>
        </div>

        {/* Forecast chart full width */}
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
      </div>
    </main>
  );
}

// -- Inline helper components --

interface TagProps {
  children: React.ReactNode;
  color: "amber" | "emerald" | "purple" | "orange";
  dot?: boolean;
}

function Tag({ children, color, dot }: TagProps) {
  const colors = {
    amber: { bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.45)", text: "#FBBF24" },
    emerald: { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.45)", text: "#10B981" },
    purple: { bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.45)", text: "#A855F7" },
    orange: { bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.45)", text: "#F97316" },
  }[color];

  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] tracking-wider font-semibold rounded-full border px-2.5 py-1"
      style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: colors.text }}
        />
      )}
      {children}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  icon?: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-panel p-4">
      <div className="text-[10px] tracking-[1.5px] uppercase text-muted flex items-center gap-1.5 mb-2">
        {icon && <span className="text-accent-bright">{icon}</span>}
        {label}
      </div>
      <div
        className={
          "text-2xl font-bold tabular tracking-tight " +
          (highlight ? "text-accent-bright" : "text-fg")
        }
      >
        {value}
      </div>
    </div>
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
      <div className="text-[10px] tracking-[1.5px] uppercase text-muted mb-3">
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
