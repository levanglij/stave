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

// Each layer ships with the actual formula the engine evaluates,
// rendered inline as italic-variable HTML. This is intentionally
// dependency-free: KaTeX would add ~70 KB to this route for one
// page of math, and the formulas here are short enough that hand-
// authored markup reads cleanly. The formulae link to the same
// canonical page the rest of the site does — engine/FORMULAS.md.
const LAYERS: {
  n: string;
  title: string;
  body: string;
  formula: React.ReactNode;
}[] = [
  {
    n: "L1",
    title: "Data normalization",
    body: "Monthly USD, currency-aligned.",
    formula: (
      <>
        <i>x</i>
        <sub>
          <i>t</i>
        </sub>
        <sup>USD</sup> = <i>x</i>
        <sub>
          <i>t</i>
        </sub>{" "}
        · <i>r</i>
        <sub>
          <i>t</i>
        </sub>
      </>
    ),
  },
  {
    n: "L2",
    title: "Decay modeling",
    body: "Exponential or power-law fit, lower-residual wins.",
    formula: (
      <>
        <i>R</i>(<i>t</i>) = <i>R</i>
        <sub>0</sub> · <i>e</i>
        <sup>
          −λ<i>t</i>
        </sup>
        <span className="mx-2 text-zinc-600">|</span>
        <i>R</i>
        <sub>0</sub> · <i>t</i>
        <sup>−α</sup>
      </>
    ),
  },
  {
    n: "L3",
    title: "Anomaly detection",
    body: "Rolling z-score across the time series.",
    formula: (
      <>
        <i>z</i>
        <sub>
          <i>t</i>
        </sub>{" "}
        = (<i>x</i>
        <sub>
          <i>t</i>
        </sub>{" "}
        − μ
        <sub>
          <i>w</i>
        </sub>
        ) / σ
        <sub>
          <i>w</i>
        </sub>
      </>
    ),
  },
  {
    n: "L4",
    title: "Concentration & VaR",
    body: "HHI + 1k-iter Monte Carlo for 60-mo CVaR.",
    formula: (
      <>
        HHI = Σ <i>s</i>
        <sub>
          <i>i</i>
        </sub>
        <sup>2</sup>
        <span className="mx-2 text-zinc-600">|</span>
        CVaR
        <sub>95</sub> = E[<i>X</i> | <i>X</i> ≤ VaR
        <sub>95</sub>]
      </>
    ),
  },
  {
    n: "L5",
    title: "Grade aggregation",
    body: "Five factors → composite → tier.",
    formula: (
      <>
        composite = Σ <i>w</i>
        <sub>
          <i>i</i>
        </sub>{" "}
        · factor
        <sub>
          <i>i</i>
        </sub>
        <span className="mx-2 text-zinc-600">→</span>
        tier(composite)
      </>
    ),
  },
];

const TIERS = [
  { tier: "AAA", range: "90–100", ltv: "80%", color: "#34D399" },
  { tier: "AA", range: "80–90", ltv: "70%", color: "#22C55E" },
  { tier: "A", range: "70–80", ltv: "60%", color: "#38BDF8" },
  { tier: "BBB", range: "60–70", ltv: "50%", color: "#FBBF24" },
  { tier: "BB", range: "50–60", ltv: "30%", color: "#FB923C" },
  { tier: "B", range: "0–50", ltv: "0%", color: "#F87171" },
];

// Glossary — every Stave-specific or finance-specific term that
// appears anywhere in the UI, defined in plain English. Many
// hackathon judges aren't finance natives, so this section makes the
// methodology accessible without the reader having to leave the
// page. Ordered roughly: financial terms first (LTV, NAV, HHI,
// VaR/CVaR), then engine terms (regime, decay), then on-chain terms
// (PDA, Token-2022, USDC).
const GLOSSARY: { term: string; short: string; long: string }[] = [
  {
    term: "Composite score",
    short: "0–100 number that drives every grade.",
    long:
      "Weighted blend of five factors — stability, concentration, regime, volatility, and lifecycle. Each factor is itself 0–100. Higher composite = better grade. The mapping from score to letter tier (AAA → B) is a deterministic table; see the grade ladder above.",
  },
  {
    term: "LTV (Loan-to-Value)",
    short: "How much senior debt the grade implies a catalog can support.",
    long:
      "If a Stave-graded catalog were used as collateral, LTV is the share of FMV a senior lender could responsibly advance. AAA = 80%, B = 0%. The number is conservative on purpose — it's a planning ceiling, not a price.",
  },
  {
    term: "FMV / NAV",
    short: "Fair market value (per catalog) and net asset value (per index).",
    long:
      "FMV is what the catalog is worth, given its forecast cash flows discounted at a regime-appropriate rate. NAV per index unit = weighted-average FMV of the underlying catalogs, divided by index unit shares.",
  },
  {
    term: "HHI (Herfindahl-Hirschman Index)",
    short: "Concentration measure. Lower = more diversified.",
    long:
      "Sum of squared revenue shares across platforms (or territories). 0 = perfect diversification, 10,000 = one platform earns everything. Stave reports HHI per catalog; high HHI penalises the concentration factor in the composite.",
  },
  {
    term: "VaR / CVaR (95%, 60-mo)",
    short: "Tail-risk floors derived from the 1k-iteration Monte Carlo.",
    long:
      "VaR₉₅ is the 5th-percentile cumulative cash flow over the next 60 months — i.e., the floor we'd hit in a 1-in-20 bad scenario. CVaR₉₅ is the average of all outcomes worse than VaR₉₅ — a sharper measure of how bad the bad case actually gets. Both are quoted in USD on the catalog detail page.",
  },
  {
    term: "Regime",
    short: "Cash-flow shape: evergreen, catalog, active pop, or new release.",
    long:
      "The engine classifies each catalog into one of four regimes based on age, volatility, and momentum. Each regime has its own decay model and discount rate. Suliko (1899) is evergreen — flat, predictable; a 2024 release would be classified active pop or new release.",
  },
  {
    term: "Decay model",
    short: "How fast cash flows shrink: exponential or power-law.",
    long:
      "Exponential decay assumes a constant percentage drop month-over-month (typical for new releases). Power-law decay slows as the catalog ages (typical for evergreen). The engine fits both and picks the one with the lower residual error, then uses the fit to project the next 60 months.",
  },
  {
    term: "Token-2022 share mint",
    short: "Solana fungible token standard with extensions.",
    long:
      "Each Stave catalog mints exactly N shares (typically 1,000) on the Token-2022 program. Shares are 0-decimal, so 1 token = 1 share. Token-2022 supports built-in transfer hooks and metadata, which we'll use post-hackathon for compliance gates without bolting on a separate contract.",
  },
  {
    term: "PDA (Program Derived Address)",
    short: "Solana account whose key is deterministically derived, not a private key.",
    long:
      "A PDA has no signing private key — only the program that owns it can authorise actions on it. Stave uses three PDAs per catalog: IpWork (the catalog itself), Listing (the listing config + share-vault authority), and RoyaltyVault (the royalty-vault authority). PDAs guarantee the program is the sole intermediary on funds-holding accounts.",
  },
  {
    term: "USDC (devnet)",
    short: "The stablecoin the marketplace settles in.",
    long:
      "Buyers pay in USDC, royalty deposits are in USDC, claims pay out USDC. Devnet uses a faucet-able test mint at 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU; mainnet would use Circle's real USDC mint with no code changes beyond the program's payment_mint argument.",
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
          <a
            href="#glossary"
            className="text-sm text-fg/80 hover:text-accent-bright transition-colors px-3 py-1 rounded-md hover:bg-panel"
          >
            Glossary
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
            className="text-xs text-fg/85 px-3 py-1.5 mr-1.5 rounded-md border border-border inline-block"
          >
            Grade ladder
          </a>
          <a
            href="#glossary"
            className="text-xs text-fg/85 px-3 py-1.5 rounded-md border border-border inline-block"
          >
            Glossary
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
                className="rounded-xl border border-border bg-panel p-4 fade-up flex flex-col"
                style={{ ["--delay" as string]: `${i * 0.08}s` }}
              >
                <div className="text-xl font-bold text-accent-bright tabular mb-2">
                  {l.n}
                </div>
                <div className="font-semibold text-fg text-sm mb-1">
                  {l.title}
                </div>
                <p className="text-xs text-muted leading-relaxed mb-3">
                  {l.body}
                </p>
                {/* Inline formula — italic variables, real Σ / σ / λ /
                    sub-sup. Spacer pushes formulas to the bottom of
                    each card so heights align across the row. */}
                <div className="mt-auto pt-3 border-t border-border/60 text-[12px] text-emerald-300/90 font-mono leading-snug formula">
                  {l.formula}
                </div>
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

        {/* GLOSSARY — collapsible explainer for non-finance judges.
            Each entry uses native <details>/<summary> for free
            keyboard + screen-reader support. Closed by default;
            open one or all at once. */}
        <section id="glossary" className="scroll-mt-24">
          <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-3">
            Glossary
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-fg mb-2 text-balance">
            Every Stave term, in plain English.
          </h2>
          <p className="text-sm text-muted mb-6 max-w-xl">
            Click any row to expand. Built for judges who didn&rsquo;t come
            up through fixed income and don&rsquo;t want to leave the page
            to look up CVaR.
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
