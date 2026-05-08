import type { Metadata } from "next";
import { getAllIndices, INDEX_UNIT_SHARES, type Index, type IndexMetrics } from "@/lib/indices";
import { CATALOG_META } from "@/lib/catalog-meta";
import { usd, pct, compactUsd, TIER_COLOR } from "@/lib/format";

export const metadata: Metadata = {
  title: "Indices · Stave",
  description:
    "Thematic baskets of Stave catalogs — Georgian Heritage, Modern, Blue Chip, and All-Catalog. Each index is a weighted basket; NAV, grade, and senior LTV are derived from the underlying Stave grades.",
};

export default function IndicesPage() {
  const items = getAllIndices();

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-3">
              Indices
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-fg mb-4 text-balance">
              Buy a curated basket,{" "}
              <span className="text-accent-bright">not a single song.</span>
            </h1>
            <p className="text-muted text-base leading-relaxed">
              Every index is a weighted basket of Stave listings. Its NAV,
              grade, and senior LTV are derived from the underlying Stave
              grades — no separate underwriting, full transparency.
            </p>
          </div>
          <div className="text-right text-xs text-muted space-y-1">
            <div className="font-mono tabular">
              {items.length} baskets · composed from 5 listings
            </div>
            <div className="font-mono tabular">
              1 unit = {INDEX_UNIT_SHARES} notional shares
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(({ index, metrics }) => (
            <IndexCard key={index.ticker} index={index} metrics={metrics} />
          ))}
        </div>
      </div>
    </main>
  );
}

function IndexCard({ index, metrics }: { index: Index; metrics: IndexMetrics }) {
  const tierColor = TIER_COLOR[metrics.rating];

  return (
    <div className="rounded-xl border border-border bg-panel p-5 transition-all duration-200 hover:border-emerald-900/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/20">
      {/* Header: ticker badge + name + rating */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="rounded-lg flex items-center justify-center font-semibold text-white text-[12px] tracking-wider shrink-0"
            style={{
              width: 44,
              height: 44,
              background: index.accent,
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
            }}
          >
            {index.ticker}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-fg truncate">{index.name}</div>
            <div className="text-xs text-muted truncate">{index.tagline}</div>
          </div>
        </div>
        <span
          className="font-semibold text-[10px] tracking-wider rounded-full border px-2 py-0.5 tabular shrink-0"
          style={{ color: tierColor, borderColor: tierColor }}
        >
          {metrics.rating}
        </span>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Stat label="NAV / unit" value={usd(metrics.nav)} />
        <Stat label="Composite" value={metrics.composite.toFixed(1)} />
        <Stat
          label="Max LTV"
          value={pct(metrics.ltv, 0)}
          color={tierColor}
        />
      </div>

      {/* Composition: stacked bar + legend */}
      <div>
        <div className="text-[10px] tracking-[1.5px] uppercase text-muted mb-2">
          Composition
        </div>
        <div className="flex h-2 rounded-full overflow-hidden border border-border mb-3">
          {index.components.map((c) => {
            const meta = CATALOG_META[c.catalogId];
            return (
              <div
                key={c.catalogId}
                style={{
                  width: `${c.weight}%`,
                  background: meta.grad[0],
                }}
                title={`${meta.title}: ${c.weight}%`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px]">
          {index.components.map((c) => {
            const meta = CATALOG_META[c.catalogId];
            return (
              <span
                key={c.catalogId}
                className="inline-flex items-center gap-1.5 text-muted"
              >
                <span
                  className="w-2 h-2 rounded-sm shrink-0"
                  style={{ background: meta.grad[0] }}
                />
                <span className="text-fg/85">{meta.title}</span>
                <span className="font-mono tabular text-muted">{c.weight}%</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* CVaR floor */}
      <div className="mt-5 pt-4 border-t border-border flex items-baseline justify-between text-xs">
        <span className="text-muted">CVaR₉₅ (24-mo floor, weighted)</span>
        <span className="font-mono tabular text-fg/90">
          {compactUsd(metrics.cvar95)}
        </span>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div>
      <div className="text-[10px] tracking-[1.5px] uppercase text-muted">
        {label}
      </div>
      <div
        className="text-lg font-semibold tabular tracking-tight mt-1"
        style={{ color: color ?? "var(--color-fg)" }}
      >
        {value}
      </div>
    </div>
  );
}
