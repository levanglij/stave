import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, PieChart, Cpu, CheckCircle2, BookOpen } from "lucide-react";
import { getListing } from "@/lib/ratings";
import { getSiteStats } from "@/lib/site-stats";
import { compactUsd, pct, TIER_COLOR } from "@/lib/format";
import { HeroChartNotes } from "@/components/HeroChartNotes";
import { MethodologyWaveform } from "@/components/methodology-waveform";
import { CopyableAddress } from "@/components/copyable-address";
import type { Listing } from "@/lib/types";
import { getHeadlineStats } from "@/lib/headline-stats";

const FEATURED_IDS = ["evergreen-001", "balanced-001", "new-release-001"];

// Grade ladder for the methodology section. Single accent color
// (emerald-400), opacity descending AAA → B. No traffic-light palette.
const GRADE_LADDER: { tier: string; opacity: number }[] = [
  { tier: "AAA", opacity: 1.0 },
  { tier: "AA", opacity: 0.86 },
  { tier: "A", opacity: 0.72 },
  { tier: "BBB", opacity: 0.58 },
  { tier: "BB", opacity: 0.46 },
  { tier: "B", opacity: 0.36 },
];

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
                Music royalties,{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  made investable.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted leading-relaxed mt-7 max-w-[580px]">
                Stave transforms verified music catalogs into investable
                royalty assets through transparent scoring, fractional
                ownership, and Solana-based settlement.
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

              {/* Credibility row — IPOA partner + open-methodology pill.
                  Sit side-by-side on desktop so the hero stack feels
                  tight; stack on mobile. Same outlined-pill family. */}
              <div className="mt-7 flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-3">
                <a
                  href="https://ipoa.ge"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors px-3.5 py-2.5 max-w-fit"
                >
                  {/* TODO(stave): replace with IPOA logo asset when received */}
                  <span className="inline-flex items-center justify-center text-[10px] font-bold tracking-[1px] tabular border border-zinc-700 rounded px-2 py-1 text-zinc-300">
                    IPOA
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                      Catalog data partner
                      <CheckCircle2
                        className="w-3 h-3 text-accent-bright"
                        strokeWidth={2.5}
                      />
                    </span>
                    <span className="text-[11px] text-zinc-500 mt-0.5">
                      Intellectual Property Owners Association — Georgia&rsquo;s
                      official music rights organization
                    </span>
                  </span>
                </a>

                <a
                  href="https://github.com/levanglij/stave/blob/main/engine/FORMULAS.md"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors px-3.5 py-2 max-w-fit"
                >
                  <BookOpen
                    className="w-3.5 h-3.5 text-zinc-300 shrink-0"
                    strokeWidth={1.75}
                  />
                  <span className="text-xs">
                    <span className="font-semibold text-zinc-200">
                      100% open methodology
                    </span>
                    <span className="text-zinc-500">
                      {" · "}formulas, code, and architecture public
                    </span>
                  </span>
                </a>
              </div>

              <div className="mt-5 text-xs text-muted font-mono tabular tracking-wide">
                Devnet preview
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
              label="catalogs scored"
            />
            <StatTile
              value={compactUsd(stats.totalFmv)}
              label="total tokenized FMV"
            />
            <StatTile
              value={stats.averageRating}
              label="average composite grade"
              valueColor={tierColor}
            />
            <StatTile
              value={pct(stats.medianRoi5yr, 1)}
              label="median 5yr ROI"
            />
          </div>
          <p className="mt-10 text-[11px] italic text-muted/80 text-center">
            Devnet figures. Past performance simulated, not actual.
          </p>
        </div>
      </section>

      {/* Stats → how-it-works transition */}
      <div className="bg-gradient-to-b from-black via-zinc-950/40 to-black h-[1px]" />

      {/* WARMTH BAND #1 — studio console. Sets a "music as craft"
          mood before the explanatory how-it-works section. */}
      <section className="relative overflow-hidden">
        <div className="relative w-full h-[260px] md:h-[340px]">
          <Image
            src="/images/studio-console.jpg"
            alt="Music studio mixing console with electric guitars on the wall, lit by warm tungsten light"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
            quality={85}
          />
          {/* Dark scrim — neutralizes the image's warm tones so it sits
              inside the dark+emerald palette without competing. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(5,8,22,0.78) 0%, rgba(5,8,22,0.45) 50%, rgba(5,8,22,0.65) 100%)",
            }}
          />
        </div>
      </section>

      {/* HOW IT WORKS — 3-step linear flow, the IA gap before the value props */}
      <section className="max-w-6xl mx-auto px-6 py-28 md:py-32">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div
            className="text-[11px] font-semibold tracking-[2px] uppercase mb-4"
            style={{ color: "#fbbf24" }}
          >
            How it works
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-fg tracking-[-0.02em] text-balance">
            From catalog to{" "}
            <span className="text-accent-bright">on-chain payouts.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Step
            n="01"
            title="We grade the catalog"
            body="Each music catalog is scored by our open-source rating engine using streaming history, revenue concentration, and tail-risk metrics. The output is a single grade from AA to B."
          />
          <Step
            n="02"
            title="You buy a fractional share"
            body="Every catalog is split into 1,000 fungible SPL tokens on Solana. Buy a 0.1% slice or the whole thing — no minimum check size beyond one token."
          />
          <Step
            n="03"
            title="Royalties settle on-chain"
            body="As the catalog earns from streaming, radio, and sync, distributions are paid programmatically to token holders. Every payout is traceable on-chain."
          />
        </div>
      </section>

      {/* How-it-works → value-cards transition */}
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
            title="Risk-graded catalogs"
            body="Every catalog gets a transparent grade from AA to B, derived from streaming hazard, revenue concentration (HHI), and 24-month tail-risk (CVaR). The full methodology is open-source on GitHub."
            href="/how-it-works"
          />
          <ValueCard
            icon={<PieChart className="w-5 h-5" strokeWidth={1.75} />}
            title="Own as little as 0.1%"
            body="Each listing is split into 1,000 fungible SPL tokens. Buy one token or the whole catalog — there's no minimum check size beyond a single share."
            href="/marketplace"
          />
          <ValueCard
            icon={<Cpu className="w-5 h-5" strokeWidth={1.75} />}
            title="Programmatic royalty payouts"
            body="Settlement runs on Solana. As the catalog earns, distributions are paid on-chain to every token holder, with full traceability per token."
            href="/how-it-works"
          />
        </div>
      </section>

      {/* Value-cards → featured transition */}
      <div className="bg-gradient-to-b from-black via-zinc-950/40 to-black h-[1px]" />

      {/* HACKATHON-HONEST CALLOUT — what's real, what's simulated. Sits
          above the featured-listings section so users see the line before
          they browse the synthetic catalogs. Same outlined-card pattern
          as the IPOA + open-methodology pills in the hero. */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-4">
        <div className="rounded-xl border border-zinc-800 bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 p-7">
          <div className="mb-5">
            <div className="text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-2">
              Hackathon-honest
            </div>
            <h3 className="text-lg font-semibold text-fg tracking-tight">
              What&rsquo;s real, what&rsquo;s simulated
            </h3>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed mb-6">
            Risk engine, on-chain program, royalty math:{" "}
            <span className="text-emerald-400 font-medium">real</span>.
            Catalog data:{" "}
            <span className="text-zinc-300">synthetic</span> for the
            prototype. We don&rsquo;t hide the line.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_2fr] gap-x-5 gap-y-2.5 text-xs">
            <RealRow
              label="Risk engine"
              state="real"
              detail="Python, 31 passing tests, deterministic"
            />
            <RealRow
              label="On-chain Anchor program"
              state="real"
              detail="15/15 tests pass, deployed to Solana devnet"
            />
            <RealRow
              label="Royalty distribution math"
              state="real"
              detail="Pull-based USDC, multi-deposit verified"
            />
            <RealRow
              label="Catalog data"
              state="synthetic"
              detail="8 Georgian catalogs, schema documented"
            />
          </div>

          {/* Click-to-verify on-chain — surfaces the deployed program +
              first bootstrapped Suliko listing as copyable addresses
              with Explorer links. The honesty card above SAYS it's real;
              this row PROVES it. */}
          <div className="mt-6 pt-5 border-t border-zinc-800/60">
            <div className="text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-3">
              Click to verify on-chain
            </div>
            <div className="space-y-2">
              <CopyableAddress
                label="Program"
                value="EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q"
              />
              <CopyableAddress
                label="Suliko"
                value="32B19bfwgLoxxLDyXnkSZQhsJ9Vhh4ugWFetmkwBmGo6"
              />
              <CopyableAddress
                label="Listing"
                value="EJTxUg98b4LnSuUCKpWjSFyed4Cm3GPcmjgX4m9jRfHa"
              />
              <CopyableAddress
                label="create_work"
                value="24aATvsPhsuctY5vN22XRL8CpckfnD8fLcQmaCmrJV5PbnWWggrojHdybB7JS71RWLMPmkN3DuoAmPVzBcRG9Xbo"
                type="tx"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WARMTH BAND — vinyl macro humanizes the underlying asset */}
      <section className="relative overflow-hidden">
        <div className="relative w-full h-[280px] md:h-[360px]">
          <Image
            src="/images/vinyl-macro.jpg"
            alt="Close-up of a vinyl record with blue and magenta light streaks across the grooves"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
            quality={85}
          />
          {/* Soft left-to-right dark scrim so the photo lives inside the
              dark+emerald palette and any overlaid text stays legible. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(5,8,22,0.85) 0%, rgba(5,8,22,0.45) 45%, rgba(5,8,22,0.6) 100%)",
            }}
          />
        </div>
      </section>

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

      {/* METHODOLOGY TEASER — editorial blockquote with sheet-music side image */}
      <section className="bg-gradient-to-b from-black via-zinc-950/30 to-black">
        <div className="max-w-5xl mx-auto px-6 py-32 md:py-36">
          {/* Section anchor — larger version of the hero open-methodology
              badge. Sets the tone for the methodology block before the
              eyebrow. Same outlined pill family as the IPOA element. */}
          <div className="text-center mb-12">
            <a
              href="https://github.com/levanglij/stave/blob/main/engine/FORMULAS.md"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors px-5 py-3"
            >
              <BookOpen
                className="w-4 h-4 text-zinc-300 shrink-0"
                strokeWidth={1.75}
              />
              <span className="text-sm">
                <span className="font-semibold text-zinc-200">
                  100% open methodology
                </span>
                <span className="text-zinc-500">
                  {" · "}formulas, code, and architecture public
                </span>
              </span>
            </a>
          </div>

          {/* Two-column on desktop: copy block on left, sheet-music side
              image on right. Stacks on mobile. */}
          <div className="grid md:grid-cols-[1fr_300px] gap-10 md:gap-14 items-center">
            <div>
              <div className="text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-8">
                Methodology
              </div>
              {/* Decorative emerald waveform band — bridges music + data */}
              <div className="mb-10">
                <MethodologyWaveform />
              </div>
              <blockquote className="border-l-2 border-emerald-900/70 pl-8">
                <p className="text-xl md:text-2xl font-light text-zinc-200 leading-relaxed text-balance">
                  Stave&rsquo;s scoring model is open. Stave grades combine
                  streaming hazard rates, catalog concentration (HHI), and
                  24-month conditional value-at-risk into a single letter
                  grade. The full formulae, code, and architecture are
                  public.
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

              {/* Grade ladder — single accent (emerald), opacity descending
                  AAA → B. Reads as a credibility ladder, not a heat map. */}
              <div className="mt-10 pl-8">
                <div className="text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-3">
                  Grade ladder
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {GRADE_LADDER.map(({ tier, opacity }) => (
                    <span
                      key={tier}
                      className="text-[11px] font-semibold tracking-wider rounded-full border px-2.5 py-1 tabular"
                      style={{
                        color: `rgba(52, 211, 153, ${opacity})`,
                        borderColor: `rgba(52, 211, 153, ${opacity * 0.55})`,
                      }}
                    >
                      {tier}
                    </span>
                  ))}
                  <span className="ml-2 text-[10px] text-zinc-500">
                    ←  best to most volatile  →
                  </span>
                </div>
              </div>
            </div>

            {/* Sheet-music macro — quiet editorial visual that ties the
                brand name (Stave = staff lines) to the scoring story.
                Square, bordered, slight desaturation via mix-blend so the
                paper warmth doesn't fight the dark+emerald palette. */}
            <div className="aspect-square w-full max-w-[300px] mx-auto md:mx-0 rounded-xl overflow-hidden border border-zinc-800/60 relative">
              <Image
                src="/images/sheet-music.jpg"
                alt="Close-up of a piano music score with handwritten annotations on the staff"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover"
                style={{ filter: "saturate(0.4) contrast(0.95)" }}
                quality={85}
                loading="lazy"
              />
              {/* Subtle inset to bed the image into the card */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 60px rgba(5,8,22,0.55)",
                }}
              />
            </div>
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
            See transparent scoring{" "}
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
  valueColor,
}: {
  value: string;
  label: string;
  valueColor?: string;
}) {
  return (
    <div className="px-6 py-6 first:pl-0 last:pr-0 md:px-8">
      <div
        className="text-6xl md:text-7xl font-light tabular tracking-[-0.02em] leading-none"
        style={{
          color: valueColor ?? "var(--color-fg)",
          fontFeatureSettings: '"tnum"',
        }}
      >
        {value}
      </div>
      <div className="text-[11px] text-muted mt-5 font-medium uppercase tracking-[1.5px]">
        {label}
      </div>
    </div>
  );
}

// Single row in the "What's real, what's simulated" callout. 3-column
// on desktop (label | state chip | detail), single-column on mobile.
function RealRow({
  label,
  state,
  detail,
}: {
  label: string;
  state: "real" | "synthetic";
  detail: string;
}) {
  return (
    <>
      <div className="text-zinc-400 sm:text-right pr-1">{label}</div>
      <div
        className={
          state === "real"
            ? "text-emerald-400 font-semibold"
            : "text-zinc-400 font-medium"
        }
      >
        {state === "real" ? "Real" : "Synthetic"}
      </div>
      <div className="text-zinc-500">{detail}</div>
    </>
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

// Numbered step block for the "How it works" section. Same gradient panel
// chrome as ValueCard so the page rhythm stays consistent, but no hover
// state and no link — these are explanatory, not navigational.
function Step({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800/50 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-10">
      <div className="w-12 h-12 rounded-full bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 flex items-center justify-center mb-6 text-base font-bold tabular">
        {n}
      </div>
      <div className="text-xl font-medium tracking-tight text-fg mb-3">
        {title}
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed">{body}</p>
    </div>
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
