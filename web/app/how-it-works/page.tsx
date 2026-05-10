import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it works · Stave",
  description:
    "Stave in four steps: verify, grade, buy, earn. Plus the five-layer scoring methodology.",
};

const STEPS = [
  {
    n: "01",
    title: "IPOA verifies the catalog",
    body: "Georgia's official rights organization shares verified ownership and royalty data with Stave.",
  },
  {
    n: "02",
    title: "Stave grades the catalog",
    body: "An open-source engine produces a grade from AAA to B from that data.",
  },
  {
    n: "03",
    title: "You buy fractional shares",
    body: "Each catalog is split into 1,000 Solana shares; buy as little as one with USDC or SOL.",
  },
  {
    n: "04",
    title: "Royalties pay out on-chain",
    body: "When royalties arrive, holders claim pro-rata in USDC straight from the on-chain vault.",
  },
];

const LAYERS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "L1",
    title: "Data normalization",
    body: "Monthly USD, currency-aligned.",
  },
  {
    n: "L2",
    title: "Decay modeling",
    body: "Exponential or power-law fit, lower-residual wins.",
  },
  {
    n: "L3",
    title: "Anomaly detection",
    body: "Rolling z-score across the time series.",
  },
  {
    n: "L4",
    title: "Concentration & VaR",
    body: "HHI + 1k-iter Monte Carlo for 60-mo CVaR.",
  },
  {
    n: "L5",
    title: "Grade aggregation",
    body: "Five factors → composite → tier.",
  },
];

// Glossary kept tight: only the terms a first-time reader actually
// needs to understand the rest of the page. More technical terms
// (HHI, VaR/CVaR, PDA, Token-2022, decay models) are documented in
// engine/FORMULAS.md and the program README for anyone who wants
// the deep version.
const GLOSSARY: { term: string; short: string; long: string }[] = [
  {
    term: "Composite score",
    short: "0–100 number that drives every grade.",
    long:
      "Weighted blend of five factors that come out of the rating engine. Higher score = better grade. The mapping from score to letter tier (AAA → B) is a deterministic table.",
  },
  {
    term: "FMV / NAV",
    short: "Fair market value (per catalog) and net asset value (per index).",
    long:
      "FMV is what a catalog is worth, given its forecast cash flows. NAV is the same idea applied to an index, computed as the weighted-average FMV of the underlying catalogs divided by the index unit size.",
  },
  {
    term: "USDC",
    short: "The stablecoin the marketplace settles in.",
    long:
      "Buyers pay in USDC, royalty deposits arrive in USDC, claims pay out USDC. Today on devnet uses a faucet-able test mint; mainnet would use Circle's real USDC.",
  },
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

        {/* TOC - sticky on desktop */}
        <nav
          className="hidden md:flex sticky top-14 z-10 -mx-6 px-6 py-3 -my-6 bg-bg/85 backdrop-blur-md border-y border-border items-center gap-1"
          aria-label="Page contents"
        >
          <span className="text-[10px] font-semibold tracking-[2px] uppercase text-muted mr-3">
            On this page
          </span>
          <a
            href="#partnership"
            className="text-sm text-fg/80 hover:text-accent-bright transition-colors px-3 py-1 rounded-md hover:bg-panel"
          >
            Partnership
          </a>
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
            href="#glossary"
            className="text-sm text-fg/80 hover:text-accent-bright transition-colors px-3 py-1 rounded-md hover:bg-panel"
          >
            Glossary
          </a>
        </nav>

        {/* TOC - mobile, horizontal scroll, no sticky */}
        <nav
          className="md:hidden -mx-6 px-6 py-3 -my-6 border-y border-border overflow-x-auto whitespace-nowrap"
          aria-label="Page contents"
        >
          <a
            href="#partnership"
            className="text-xs text-fg/85 px-3 py-1.5 mr-1.5 rounded-md border border-border inline-block"
          >
            Partnership
          </a>
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
            href="#glossary"
            className="text-xs text-fg/85 px-3 py-1.5 rounded-md border border-border inline-block"
          >
            Glossary
          </a>
        </nav>

        {/* IPOA + Stave partnership: who does what.
            Two-column layout makes the off-chain / on-chain split
            literally visible. Sits above the 4-step grid so a reader
            understands the partnership before walking through the
            investor journey. */}
        <section id="partnership" className="scroll-mt-24">
          <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-3">
            Partnership
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-fg mb-2 text-balance">
            IPOA owns the data.{" "}
            <span className="text-accent-bright">Stave puts it on Solana.</span>
          </h2>
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-stretch">
            {/* IPOA column - off-chain, traditional */}
            <div className="rounded-xl border border-border bg-panel p-5">
              <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-muted mb-3">
                Off-chain · IPOA
              </div>
              <div className="font-semibold text-fg mb-3 text-base">
                Traditional rights organisation
              </div>
              <ul className="space-y-2 text-sm text-muted leading-relaxed">
                <li className="flex items-start gap-2">
                  <span aria-hidden className="text-accent-bright mt-1 shrink-0">·</span>
                  <span>Government mandate across Georgia</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden className="text-accent-bright mt-1 shrink-0">·</span>
                  <span>Collects streaming, mechanical, performance and broadcast royalties</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden className="text-accent-bright mt-1 shrink-0">·</span>
                  <span>Pays artists and rightsholders directly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden className="text-accent-bright mt-1 shrink-0">·</span>
                  <span>Shares verified data with Stave</span>
                </li>
              </ul>
            </div>

            {/* Bridge arrow - vertical on mobile, horizontal on desktop */}
            <div className="flex md:flex-col items-center justify-center text-zinc-600 px-2">
              <span className="text-[10px] uppercase tracking-[1.5px] mb-2 hidden md:block">
                Data + payments
              </span>
              <span aria-hidden className="text-2xl md:hidden">↓</span>
              <span aria-hidden className="text-2xl hidden md:block">→</span>
              <span className="text-[10px] uppercase tracking-[1.5px] mt-2 hidden md:block">
                bridge
              </span>
            </div>

            {/* Stave column - on-chain, Solana */}
            <div className="rounded-xl border border-emerald-900/40 bg-gradient-to-b from-emerald-950/20 to-zinc-950/40 p-5">
              <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-emerald-400 mb-3">
                On-chain · Stave
              </div>
              <div className="font-semibold text-fg mb-3 text-base">
                Solana-native marketplace
              </div>
              <ul className="space-y-2 text-sm text-muted leading-relaxed">
                <li className="flex items-start gap-2">
                  <span aria-hidden className="text-accent-bright mt-1 shrink-0">·</span>
                  <span>Turns IPOA data into a score</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden className="text-accent-bright mt-1 shrink-0">·</span>
                  <span>Splits each catalog into on-chain shares</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden className="text-accent-bright mt-1 shrink-0">·</span>
                  <span>Investors buy and sell with USDC, any Solana wallet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden className="text-accent-bright mt-1 shrink-0">·</span>
                  <span>Distributes royalty payouts on-chain, pro-rata</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-[11px] text-muted/80 mt-4 italic">
            The full canonical partnership flow is documented in{" "}
            <a
              href="https://github.com/levanglij/stave/blob/main/docs/00-positioning.md"
              target="_blank"
              rel="noreferrer"
              className="text-accent-bright/80 hover:text-accent-bright hover:underline"
            >
              docs/00-positioning.md
            </a>
            .
          </p>
        </section>

        {/* 4 Steps - staggered fade-up */}
        <section id="process" className="scroll-mt-24">
          <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-3">
            The investor journey
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-fg mb-6 text-balance">
            From a song to a share, in four steps.
          </h2>
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

        {/* Methodology - five layers */}
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
          {/* TODO: pipeline diagram */}
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
                <p className="text-xs text-muted leading-relaxed">
                  {l.body}
                </p>
              </div>
            ))}
          </div>

          {/* Want the math? - single link to the open-source formula doc */}
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

        {/* GLOSSARY - collapsible explainer for non-finance judges.
            Each entry uses native <details>/<summary> for free
            keyboard + screen-reader support. Closed by default;
            open one or all at once. */}
        <section id="glossary" className="scroll-mt-24">
          <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-3">
            Glossary
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-fg mb-2 text-balance">
            The terms that matter.
          </h2>
          <p className="text-sm text-muted mb-6 max-w-xl">
            Click any row to expand. The deeper technical glossary lives in{" "}
            <a
              href="https://github.com/levanglij/stave/blob/main/engine/FORMULAS.md"
              target="_blank"
              rel="noreferrer"
              className="text-accent-bright hover:underline"
            >
              engine/FORMULAS.md
            </a>
            .
          </p>
          <div className="rounded-xl border border-border bg-panel overflow-hidden divide-y divide-border">
            {GLOSSARY.map((g) => (
              <details
                key={g.term}
                className="group [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="cursor-pointer list-none px-5 py-4 flex items-start justify-between gap-4 hover:bg-panel-2/40 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-fg text-sm md:text-base">
                      {g.term}
                    </div>
                    <div className="text-xs md:text-sm text-muted mt-0.5">
                      {g.short}
                    </div>
                  </div>
                  <span
                    aria-hidden
                    className="shrink-0 mt-1 text-muted group-open:rotate-180 transition-transform duration-200"
                  >
                    ▾
                  </span>
                </summary>
                <div className="px-5 pb-5 pt-1 text-sm text-fg/80 leading-relaxed max-w-3xl">
                  {g.long}
                </div>
              </details>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-muted">
            Want the actual math?{" "}
            <a
              href="https://github.com/levanglij/stave/blob/main/engine/FORMULAS.md"
              target="_blank"
              rel="noreferrer"
              className="text-accent-bright hover:text-emerald-300 transition-colors"
            >
              FORMULAS.md →
            </a>
          </p>
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
