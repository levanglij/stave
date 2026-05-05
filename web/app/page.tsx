import Link from "next/link";
import { BadgeCheck, PieChart, Cpu } from "lucide-react";
import { getListing } from "@/lib/ratings";
import { getSiteStats } from "@/lib/site-stats";
import { compactUsd, pct, TIER_COLOR } from "@/lib/format";
import { ListingRow, ListingRowHeader } from "@/components/listing-row";
import { HeroChartNotes } from "@/components/HeroChartNotes";

const FEATURED_IDS = ["evergreen-001", "balanced-001", "new-release-001"];

export default function Home() {
  const stats = getSiteStats();
  const featured = FEATURED_IDS.map(getListing).filter(
    (l): l is NonNullable<typeof l> => l !== undefined,
  );
  const tierColor = TIER_COLOR[stats.averageRating];

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 lg:py-32">
          <div className="grid md:grid-cols-[55fr_45fr] gap-10 lg:gap-14 items-center">
            {/* Left: copy */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-fg text-balance leading-[1.02]">
                Rated music royalties.{" "}
                <span className="text-accent-bright">On-chain.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted leading-relaxed mt-6 max-w-xl">
                Stave is the rating layer for music royalty assets. Every
                catalog is scored, fractionalized, and settled on Solana —
                with the methodology open-sourced.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Link
                  href="/marketplace"
                  className="btn-glow rounded-lg bg-accent text-accent-ink font-semibold text-base px-6 py-3.5"
                >
                  Open marketplace
                </Link>
                <Link
                  href="/how-it-works"
                  className="text-base text-accent-bright hover:underline font-medium inline-flex items-center gap-1"
                >
                  Read the methodology <span aria-hidden>→</span>
                </Link>
              </div>
              <div className="mt-7 text-xs text-muted font-mono tabular">
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

      {/* STATS BAND */}
      <section className="border-y border-border bg-panel/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-7">
            <StatTile
              value={String(stats.catalogCount)}
              label="catalogs rated"
              footnote={`across ${stats.tierCount} risk tiers`}
            />
            <StatTile
              value={compactUsd(stats.totalFmv)}
              label="total tokenized FMV"
              footnote="sum of listing FMVs"
            />
            <StatTile
              value={stats.averageRating}
              label="average composite rating"
              footnote="weighted by FMV"
              valueColor={tierColor}
            />
            <StatTile
              value={pct(stats.medianRoi5yr, 1)}
              label="median 5yr ROI base case"
              footnote={`range ${pct(stats.minRoi5yr, 1)} – ${pct(stats.maxRoi5yr, 1)}`}
            />
          </div>
          <div className="mt-7 text-[11px] text-muted font-mono tabular">
            Devnet figures. Past performance simulated, not actual.
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-24">
        <div className="grid md:grid-cols-3 gap-4">
          <ValueCard
            icon={<BadgeCheck className="w-5 h-5" strokeWidth={1.75} />}
            title="Rated"
            body="Every catalog carries an RRE credit-style rating from RRE-AA to RRE-B, derived from streaming hazard, HHI concentration, and 60-month CVaR. Same scale as a corporate bond — applied to royalties."
          />
          <ValueCard
            icon={<PieChart className="w-5 h-5" strokeWidth={1.75} />}
            title="Fractional"
            body="Listings are split into 1,000 fungible SPL tokens. Buy a 0.1% slice or the whole catalog. No minimum check size beyond one token."
          />
          <ValueCard
            icon={<Cpu className="w-5 h-5" strokeWidth={1.75} />}
            title="On Solana"
            body="Settlement is on Solana mainnet (devnet today). Royalty distributions are programmatic, on-chain, and traceable per token."
          />
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-fg">
            Featured listings
          </h2>
          <Link
            href="/marketplace"
            className="text-sm text-accent-bright hover:underline font-medium"
          >
            View all {stats.catalogCount} →
          </Link>
        </div>
        <div className="rounded-xl border border-border bg-panel overflow-hidden">
          <ListingRowHeader />
          {featured.map((l) => (
            <ListingRow key={l.catalog_id} listing={l} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/marketplace"
            className="inline-block rounded-lg border border-border bg-panel-2 text-fg font-medium text-sm px-5 py-2.5 hover:border-border-strong"
          >
            View all {stats.catalogCount} listings →
          </Link>
        </div>
      </section>

      {/* METHODOLOGY TEASER */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-4">
          Methodology
        </div>
        <p className="text-fg/85 text-base md:text-lg leading-relaxed">
          Stave&rsquo;s rating model is open. RRE ratings combine streaming
          hazard rates, catalog concentration (HHI), and 60-month conditional
          value-at-risk into a single letter grade. The full formulae, code,
          and architecture are public.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
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
      </section>

      {/* CLOSING CTA BAND */}
      <section className="border-t border-border bg-panel/70">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-fg mb-7 text-balance">
            See the rating layer{" "}
            <span className="text-accent-bright">in action.</span>
          </h2>
          <Link
            href="/marketplace"
            className="btn-glow rounded-lg bg-accent text-accent-ink font-semibold text-base px-7 py-3.5 inline-block"
          >
            Open marketplace
          </Link>
        </div>
      </section>
    </main>
  );
}

function StatTile({
  value,
  label,
  footnote,
  valueColor,
}: {
  value: string;
  label: string;
  footnote: string;
  valueColor?: string;
}) {
  return (
    <div>
      <div
        className="text-3xl md:text-4xl font-bold tabular tracking-tight"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </div>
      <div className="text-xs text-muted mt-1.5 font-medium">{label}</div>
      <div className="text-[11px] text-muted/70 mt-0.5 font-mono tabular">
        {footnote}
      </div>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-panel p-6 transition-colors hover:border-border-strong">
      <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 text-accent-bright flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="text-xl font-semibold tracking-tight text-fg mb-2">
        {title}
      </div>
      <p className="text-sm text-muted leading-relaxed">{body}</p>
    </div>
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
      className="inline-block text-sm rounded-full border border-border bg-panel px-4 py-1.5 text-fg/85 hover:text-accent-bright hover:border-border-strong transition-colors"
    >
      {children}
    </a>
  );
}
