import type { Metadata } from "next";
import { getAllIndices, INDEX_UNIT_SHARES, type Index, type IndexMetrics } from "@/lib/indices";
import { CATALOG_META } from "@/lib/catalog-meta";
import { usd, TIER_COLOR } from "@/lib/format";

export const metadata: Metadata = {
  title: "Indices · Stave",
  description:
    "Thematic baskets of Stave catalogs. Two live indices today: Georgian Heritage and Georgian Modern. Two more coming.",
};

export default function IndicesPage() {
  const all = getAllIndices();
  const live = all.filter(({ index }) => index.status === "example");
  const upcoming = all.filter(({ index }) => index.status !== "example");

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
          </div>
          <div className="text-right text-xs text-muted space-y-1">
            <div className="font-mono tabular">
              {live.length} live · {upcoming.length} upcoming
            </div>
            <div className="font-mono tabular">
              1 unit = {INDEX_UNIT_SHARES} notional shares
            </div>
          </div>
        </div>

        {/* Live indices */}
        <div className="grid md:grid-cols-2 gap-4">
          {live.map(({ index, metrics }) => (
            <IndexCard key={index.ticker} index={index} metrics={metrics} />
          ))}
        </div>

        {/* Upcoming indices: blurred under construction effect.
            Same card layout, just visually muted with a "Coming soon"
            overlay so visitors can see what's planned without thinking
            it's live. */}
        {upcoming.length > 0 && (
          <>
            <div className="mt-14 mb-6 flex items-center gap-3">
              <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted">
                Coming soon
              </div>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {upcoming.map(({ index, metrics }) => (
                <IndexCard
                  key={index.ticker}
                  index={index}
                  metrics={metrics}
                  comingSoon
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function IndexCard({
  index,
  metrics,
  comingSoon = false,
}: {
  index: Index;
  metrics: IndexMetrics;
  comingSoon?: boolean;
}) {
  const tierColor = TIER_COLOR[metrics.rating];

  if (comingSoon) {
    return (
      <div className="relative rounded-xl border border-border bg-panel overflow-hidden">
        {/* Blurred + dimmed card body */}
        <div
          className="p-5 select-none pointer-events-none"
          style={{ filter: "blur(3px)", opacity: 0.5 }}
          aria-hidden
        >
          <CardBody index={index} metrics={metrics} tierColor={tierColor} />
        </div>
        {/* "Coming soon" overlay badge */}
        <div className="absolute inset-0 flex items-center justify-center bg-bg/30 backdrop-blur-[2px]">
          <div className="rounded-full border border-zinc-700 bg-zinc-900/95 px-4 py-1.5 text-[10px] font-semibold tracking-[2px] uppercase text-zinc-300">
            Coming soon
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-panel p-5 transition-all duration-200 hover:border-emerald-900/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/20">
      <CardBody index={index} metrics={metrics} tierColor={tierColor} />
    </div>
  );
}

// Shared card body: header (ticker badge + name + rating chip), stat
// row (NAV per unit + Score), and composition (stacked bar + legend).
// Used by both the live IndexCard and the blurred coming-soon variant.
function CardBody({
  index,
  metrics,
  tierColor,
}: {
  index: Index;
  metrics: IndexMetrics;
  tierColor: string;
}) {
  return (
    <>
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
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Stat label="NAV / unit" value={usd(metrics.nav)} />
        <Stat label="Score" value={metrics.composite.toFixed(1)} color={tierColor} />
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
    </>
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
