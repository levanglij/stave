import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it works · Stave",
  description:
    "Stave in four steps: grade, verify, buy, earn. Plus the five-layer scoring methodology.",
};

const STEPS = [
  { n: "01", title: "We grade the catalog", body: "Stave grade, AAA → B." },
  { n: "02", title: "IPOA verifies the data", body: "Ownership and royalties, ground truth." },
  { n: "03", title: "You buy shares on Solana", body: "Phantom or Solflare. Sub-cent fees." },
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

        {/* 4 Steps — staggered fade-up */}
        <section>
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
        <section>
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
        </section>

        {/* Grade ladder */}
        <section>
          <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-3">
            Grade ladder
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-fg mb-5">
            Score → tier → max LTV.
          </h2>
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
