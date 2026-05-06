import Link from "next/link";
import { BadgeCheck, PieChart, Cpu } from "lucide-react";
import { getListing } from "@/lib/ratings";
import { getSiteStats } from "@/lib/site-stats";
import { compactUsd, pct, TIER_COLOR } from "@/lib/format";
import { HeroChartNotes } from "@/components/HeroChartNotes";
import type { Listing } from "@/lib/types";
import { getHeadlineStats } from "@/lib/headline-stats";

const FEATURED_IDS = ["evergreen-001", "balanced-001", "new-release-001"];

export default function Home() {
  const stats = getSiteStats();
  const featured = FEATURED_IDS.map(getListing).filter(
    (l): l is NonNullable<typeof l> => l !== undefined,
  );
  const tierColor = TIER_COLOR[stats.averageRating];

  return (
    <main>
      {/* HERO — full institutional dominance */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center">
        <div className="relative w-full max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-[55fr_45fr] gap-10 lg:gap-14 items-center">
            {/* Left: copy */}
            <div>
              <h1 className="text-6xl sm:text-7xl md:text-7xl lg:text-8xl font-bold text-fg text-balance tracking-[-0.03em] leading-[0.95]">
                Rated music royalties.{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  On-chain.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted leading-relaxed mt-7 max-w-[580px]">
                Stave is the rating layer for music royalty assets. Every
                catalog is scored, fractionalized, and settled on Solana —
                with the methodology open-sourced.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center h-14 rounded-lg bg-accent text-accent-ink font-semibold text-base px-7 shadow-[0_0_40px_rgba(16,185,129,0.25)] hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] hover:bg-emerald-400 transition-all duration-200"
                >
                  Open marketplace
                </Link>
                <Link
                  href="/how-it-works"
                  className="text-base text-accent-bright font-medium hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5 group"
                >
                  Read the methodology
                  <span
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              </div>
              <div className="mt-8 text-xs text-muted font-mono tabular tracking-wide">
                Devnet preview · Data via Intellectual Property Owners
                Association (IPOA)
              </div>
            </div>

            {/* Right: candles-as-notes chart */}
            <div className="w-full">
              <HeroChartNotes />
            </div>
          </div>
        </div>
      </section>

      {/* Hero → stats transition */}
      <div
        className="border-t border-zinc-900"
        style={{ boxShadow: "0 -1px 8px rgba(16, 185, 129, 0.05)" }}
      />

      {/* STATS BAND — Bloomberg terminal energy */}
      <section className="bg-gradient-to-b from-zinc-950 to-black border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-zinc-800/80">
            <StatTile
              value={String(stats.catalogCount)}
              label="catalogs rated"
              footnote={`across ${stats.tierCount} risk tiers`}
              spark={[1, 2, 2, 3, 3, 4, 5]}
            />
            <StatTile
              value={compactUsd(stats.totalFmv)}
              label="total tokenized FMV"
              footnote="sum of listing FMVs"
              spark={[1, 1.4, 2.1, 2.6, 3.4, 4.5, 5]}
            />
            <StatTile
              value={stats.averageRating}
              label="average composite rating"
              footnote="weighted by FMV"
              valueColor={tierColor}
              spark={[3, 3.2, 3, 3.4, 3.8, 4, 4.2]}
            />
            <StatTile
              value={pct(stats.medianRoi5yr, 1)}
              label="median 5yr ROI base case"
              footnote={`range ${pct(stats.minRoi5yr, 1)} – ${pct(stats.maxRoi5yr, 1)}`}
              spark={[2, 3, 2.4, 4, 3.2, 4.8, 4]}
            />
          </div>
          <p className="mt-10 text-[11px] italic text-muted/80 text-center">
            Devnet figures. Past performance simulated, not actual.
          </p>
        </div>
      </section>

      {/* Stats → value-cards transition */}
      <div className="bg-gradient-to-b from-black via-zinc-950/40 to-black h-[1px]" />

      {/* VALUE PROPS — three properties, one thesis */}
      <section className="max-w-6xl mx-auto px-6 py-28 md:py-32">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div
            className="text-[11px] font-semibold tracking-[2px] uppercase mb-4"
            style={{ color: "#fbbf24" }}
          >
            Why Stave
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-fg tracking-[-0.02em] text-balance">
            Three properties.{" "}
            <span className="text-accent-bright">One thesis.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <ValueCard
            icon={<BadgeCheck className="w-5 h-5" strokeWidth={1.75} />}
            title="Rated"
            body="Every catalog carries an RRE credit-style rating from RRE-AA to RRE-B, derived from streaming hazard, HHI concentration, and 60-month CVaR. Same scale as a corporate bond — applied to royalties."
            href="/how-it-works"
          />
          <ValueCard
            icon={<PieChart className="w-5 h-5" strokeWidth={1.75} />}
            title="Fractional"
            body="Listings are split into 1,000 fungible SPL tokens. Buy a 0.1% slice or the whole catalog. No minimum check size beyond one token."
            href="/marketplace"
          />
          <ValueCard
            icon={<Cpu className="w-5 h-5" strokeWidth={1.75} />}
            title="On Solana"
            body="Settlement is on Solana mainnet (devnet today). Royalty distributions are programmatic, on-chain, and traceable per token."
            href="/how-it-works"
          />
        </div>
      </section>

      {/* Value-cards → featured transition */}
      <div className="bg-gradient-to-b from-black via-zinc-950/40 to-black h-[1px]" />

      {/* FEATURED LISTINGS — three card grid, premium hover */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-28">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-light tracking-[-0.02em] text-fg">
            Featured listings
          </h2>
          <Link
            href="/marketplace"
            className="text-sm text-accent-bright font-medium hover:text-emerald-300 transition-colors inline-flex items-center gap-1 group"
          >
            View all {stats.catalogCount}
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((l) => (
            <FeaturedListingCard key={l.catalog_id} listing={l} />
          ))}
        </div>
      </section>

      {/* METHODOLOGY TEASER — editorial blockquote */}
      <section className="bg-gradient-to-b from-black via-zinc-950/30 to-black">
        <div className="max-w-3xl mx-auto px-6 py-32 md:py-36">
          <div className="text-center text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-8">
            Methodology
          </div>
          <blockquote className="border-l-2 border-emerald-900/70 pl-8">
            <p className="text-xl md:text-2xl font-light text-zinc-200 leading-relaxed text-balance">
              Stave&rsquo;s rating model is open. RRE ratings combine streaming
              hazard rates, catalog concentration (HHI), and 60-month
              conditional value-at-risk into a single letter grade. The full
              formulae, code, and architecture are public.
            </p>
          </blockquote>
          <div className="mt-9 flex flex-wrap gap-2 pl-8">
            <ChipLink href="https://github.com/levanglij/stave/blob/main/engine/FORMULAS.md">
              Formulae →
            </ChipLink>
            <ChipLink href="https://github.com/levanglij/stave/blob/main/docs/02-architecture.md">
              Architecture →
            </ChipLink>
            <ChipLink href="https://github.com/levanglij/stave/blob/main/SUBMISSION.md">
              Submission →
            </ChipLink>
          </div>
        </div>
      </section>

      {/* Methodology → closing transition: emerald accent line */}
      <div
        className="h-px bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent"
      />

      {/* CLOSING CTA BAND — bookend to the hero */}
      <section
        className="relative overflow-hidden border-t border-zinc-900"
        style={{
          backgroundImage:
            "radial-gradient(60rem 30rem at 50% 50%, rgba(16, 185, 129, 0.10), transparent 60%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 py-32 md:py-40 text-center">
          <h2 className="text-5xl md:text-6xl font-light tracking-[-0.02em] text-fg mb-10 text-balance leading-[1.05]">
            See the rating layer{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              in action.
            </span>
          </h2>
          <Link
            href="/marketplace"
            className="inline-flex items-center justify-center h-14 rounded-lg bg-accent text-accent-ink font-semibold text-base px-8 shadow-[0_0_40px_rgba(16,185,129,0.25)] hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] hover:bg-emerald-400 transition-all duration-200"
          >
            Open marketplace
          </Link>
        </div>
      </section>
    </main>
  );
}

/* ----- helpers ----- */

function StatTile({
  value,
  label,
  footnote,
  valueColor,
  spark,
}: {
  value: string;
  label: string;
  footnote: string;
  valueColor?: string;
  spark: number[];
}) {
  return (
    <div className="px-6 py-6 first:pl-0 last:pr-0 md:px-8">
      <div
        className="text-5xl md:text-6xl font-light tabular tracking-[-0.02em] leading-none"
        style={{
          color: valueColor ?? "var(--color-fg)",
          fontFeatureSettings: '"tnum"',
        }}
      >
        {value}
      </div>
      <div className="text-xs text-muted mt-4 font-medium tracking-wide">
        {label}
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="text-[11px] text-muted/60 font-mono tabular">
          {footnote}
        </div>
        <MiniSparkline shape={spark} />
      </div>
    </div>
  );
}

// Tiny inline sparkline — pure SVG, no library. Shape is a normalized
// y-series that we map to a 40×12 box.
function MiniSparkline({ shape }: { shape: number[] }) {
  const W = 44;
  const H = 14;
  const max = Math.max(...shape);
  const min = Math.min(...shape);
  const span = max - min || 1;
  const points = shape
    .map((v, i) => {
      const x = (i / (shape.length - 1)) * W;
      const y = H - ((v - min) / span) * H;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="opacity-60 shrink-0"
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke="#34d399"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ValueCard({
  icon,
  title,
  body,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-zinc-800/50 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-10 transition-all duration-200 hover:border-emerald-900/40 hover:-translate-y-0.5"
    >
      <div className="w-12 h-12 rounded-full bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 flex items-center justify-center mb-6">
        {icon}
      </div>
      <div className="text-xl font-medium tracking-tight text-fg mb-3">
        {title}
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed">{body}</p>
      <div className="mt-8 text-xs text-zinc-600 group-hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
        Learn more
        <span
          aria-hidden
          className="transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </div>
    </Link>
  );
}

function FeaturedListingCard({ listing }: { listing: Listing }) {
  const tierColor = TIER_COLOR[listing.rating];
  const stats = getHeadlineStats(listing);
  return (
    <Link
      href={`/issuances/${listing.catalog_id}`}
      className="group block rounded-xl border border-zinc-800/50 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-6 transition-all duration-300 hover:border-emerald-900/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/30"
    >
      {/* Cover gradient */}
      <div
        className="aspect-square w-full rounded-lg mb-5 flex items-center justify-center text-2xl font-bold text-white/95 tracking-wider"
        style={{
          background: `linear-gradient(135deg, ${listing.grad[0]}, ${listing.grad[1]})`,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        {listing.initials}
      </div>

      {/* Title + artist */}
      <div className="flex items-start justify-between gap-3 mb-1">
        <div className="font-semibold text-fg group-hover:text-emerald-300 transition-colors truncate">
          {listing.title}
        </div>
        <span
          className="font-semibold text-[10px] tracking-wider rounded-full border px-2 py-0.5 tabular shrink-0"
          style={{ color: tierColor, borderColor: tierColor }}
        >
          {listing.rating}
        </span>
      </div>
      <div className="text-sm text-muted truncate">{listing.artist}</div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-zinc-800/60">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted mb-1">
            FMV
          </div>
          <div className="text-sm font-semibold tabular text-fg">
            {compactUsd(stats.fmv)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-muted mb-1">
            5yr ROI
          </div>
          <div className="text-sm font-semibold tabular text-accent-bright">
            {pct(stats.roi5yr, 1)}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ChipLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-block text-xs font-medium rounded-full border border-zinc-800 bg-transparent px-4 py-2 text-zinc-400 hover:text-emerald-300 hover:border-emerald-900/60 hover:bg-emerald-950/20 transition-all"
    >
      {children}
    </a>
  );
}
