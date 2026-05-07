import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it works · Stave",
  description:
    "Stave in four steps: verify, grade, buy, earn. Plus the five-layer scoring methodology.",
};

const STEPS = [
  { n: "01", title: "IPOA verifies the catalog", body: "Ownership and royalty data, at the source." },
  { n: "02", title: "We grade the catalog", body: "Stave grade, AAA → B. Transparent." },
  { n: "03", title: "You buy fractional shares on Solana", body: "Phantom or Solflare. Sub-cent fees." },
  { n: "04", title: "Royalties pay out automatically", body: "Pull-based, pro-rata, on-chain." },
];

const LAYERS = [
  { n: "L1", title: "Data normalization", body: "Monthly USD, currency-aligned." },
  { n: "L2", title: "Decay modeling", body: "Exponential or power-law fit." },
  { n: "L3", title: "Anomaly detection", body: "Rolling z-score on the time series." },
  { n: "L4", title: "Concentration & VaR", body: "HHI + 1k-iter Monte Carlo." },
  { n: "L5", title: "Grade aggregation", body: "Five factors → composite → tier." },
];

const TIERS = [
  { tier: "AAA", range: "90–100", ltv: "80%", color: "#34D399" },
  { tier: "AA", range: "80–90", ltv: "70%", color: "#22C55E" },
  { tier: "A", range: "70–80", ltv: "60%", color: "#38BDF8" },
  { tier: "BBB", range: "60–70", ltv: "50%", color: "#FBBF24" },
  { tier: "BB", range: "50–60", ltv: "30%", color: "#FB923C" },
  { tier: "B", range: "0–50", ltv: "0%", color: "#F87171" },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">
        {/* Hero */}
        <section className="max-w-3xl">
          <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-3">
            How it works
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-fg text-balance">
            From a song to a share, in{" "}
            <span className="text-accent-bright">four steps.</span>
          </h1>
        </section>

        {/* TOC — sticky on desktop */}
        <nav
          className="hidden md:flex sticky top-14 z-10 -mx-6 px-6 py-3 -my-6 bg-bg/85 backdrop-blur-md border-y border-border items-center gap-1"
          aria-label="Page contents"
        >
          <span className="text-[10px] font-semibold tracking-[2px] uppercase text-muted mr-3">
            On this page
          </span>
          <a
            href="#process"
            className="text-sm text-fg/80 hover:text-accent-bright transition-colors px-3 py-1 rounded-md hover:bg-panel"
          >
            Four steps
          </a>
          <a
            href="#methodology"
            className="text-sm text-fg/80 hover:text-accent-bright transition-colors px-3 py-1 rounded-md hover:bg-panel"
          >
            Five-layer engine
          </a>
          <a
            href="#grade-ladder"
            className="text-sm text-fg/80 hover:text-accent-bright transition-colors px-3 py-1 rounded-md hover:bg-panel"
          >
            Grade ladder
          </a>
        </nav>

        {/* TOC — mobile, horizontal scroll, no sticky */}
        <nav
          className="md:hidden -mx-6 px-6 py-3 -my-6 border-y border-border overflow-x-auto whitespace-nowrap"
          aria-label="Page contents"
        >
          <a
            href="#process"
            className="text-xs text-fg/85 px-3 py-1.5 mr-1.5 rounded-md border border-border inline-block"
          >
            Four steps
          </a>
          <a
            href="#methodology"
            className="text-xs text-fg/85 px-3 py-1.5 mr-1.5 rounded-md border border-border inline-block"
          >
            Engine
          </a>
          <a
            href="#grade-ladder"
            className="text-xs text-fg/85 px-3 py-1.5 rounded-md border border-border inline-block"
          >
            Grade ladder
          </a>
        </nav>

        {/* 4 Steps — staggered fade-up */}
        <section id="process" className="scroll-mt-24">
          <div className="grid md:grid-cols-4 gap-4">
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                className="rounded-xl border border-border bg-panel p-5 fade-up"
                style={{ ["--delay" as string]: `${i * 0.1}s` }}
              >
                <div className="w-10 h-10 rounded-full border border-accent/40 bg-accent/5 flex items-center justify-center text-accent-bright text-sm font-bold tabular mb-4">
                  {s.n}
                </div>
                <div className="font-semibold text-fg mb-1.5">{s.title}</div>
                <p className="text-sm text-muted leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology — five layers */}
        <section id="methodology" className="scroll-mt-24">
          <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-3">
            Methodology
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-fg mb-2 text-balance">
            Five layers, one composite score.
          </h2>
          <p className="text-sm text-muted mb-6 max-w-xl">
            Open-source, deterministic, fully traceable. 31 passing tests in{" "}
            <code className="font-mono text-fg/80 bg-panel px-1.5 py-0.5 rounded text-[12px]">
              engine/
            </code>
            .
          </p>
          {/* TODO(stave): inline SVG diagram of the 5-layer pipeline data
              flow — Data normalization → Decay modeling → Anomaly detection
              → Concentration & VaR → Grade aggregation. Out of scope for
              the current sprint; left as a sized placeholder if/when
              commissioned. */}
          <div className="grid md:grid-cols-5 gap-3">
            {LAYERS.map((l, i) => (
              <div
                key={l.n}
                className="rounded-xl border border-border bg-panel p-4 fade-up"
                style={{ ["--delay" as string]: `${i * 0.08}s` }}
              >
                <div className="text-xl font-bold text-accent-bright tabular mb-2">
                  {l.n}
                </div>
                <div className="font-semibold text-fg text-sm mb-1">
                  {l.title}
                </div>
                <p className="text-xs text-muted leading-relaxed">{l.body}</p>
              </div>
            ))}
          </div>

          {/* Want the math? — single link to the open-source formula doc */}
          <div className="mt-8 rounded-xl border border-zinc-800 bg-panel/40 p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-fg mb-0.5">
                Want the math?
              </div>
              <div className="text-xs text-muted">
                Every formula behind the engine, open-source on GitHub.
              </div>
            </div>
            <a
              href="https://github.com/levanglij/stave/blob/main/engine/FORMULAS.md"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-accent-bright hover:text-emerald-300 font-medium inline-flex items-center gap-1 group"
            >
              Open FORMULAS.md
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </a>
          </div>
        </section>

        {/* Grade ladder */}
        <section id="grade-ladder" className="scroll-mt-24">
          <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-3">
            Grade ladder
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-fg mb-5">
            Score → tier → max LTV.
          </h2>
          {/* TODO(stave): inline SVG diagram of the score-to-tier-to-LTV
              mapping — score axis 0–100, tier bands AAA → B, LTV ramp
              80% → 0%. Out of scope for the current sprint. */}
          <div className="rounded-xl border border-border bg-panel overflow-hidden">
            <div className="grid grid-cols-3 gap-4 px-5 py-3 border-b border-border bg-panel-2/60 text-[10px] uppercase tracking-[1.2px] text-muted font-medium">
              <div>Tier</div>
              <div className="text-right">Score range</div>
              <div className="text-right">Max LTV</div>
            </div>
            {TIERS.map((t) => (
              <div
                key={t.tier}
                className="grid grid-cols-3 gap-4 px-5 py-3 border-b border-border last:border-b-0 items-center"
              >
                <div>
                  <span
                    className="font-semibold text-xs tracking-wider rounded-full border px-2.5 py-0.5 tabular inline-block"
                    style={{ color: t.color, borderColor: t.color }}
                  >
                    {t.tier}
                  </span>
                </div>
                <div className="text-right font-mono tabular text-sm text-fg">
                  {t.range}
                </div>
                <div
                  className="text-right font-semibold tabular text-sm"
                  style={{ color: t.color }}
                >
                  {t.ltv}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTAs */}
        <section className="rounded-2xl border border-border bg-panel px-6 py-8 md:py-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-fg mb-5">
            Ready?
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/marketplace"
              className="btn-glow rounded-lg bg-accent text-accent-ink font-semibold text-sm px-5 py-3"
            >
              Browse marketplace
            </Link>
            <Link
              href="/for-artists"
              className="rounded-lg border border-border bg-panel-2 text-fg font-medium text-sm px-5 py-3 hover:border-border-strong"
            >
              List your catalog
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
