import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology · RRE rating engine · Stave",
  description:
    "How the Royalty Risk Engine rates every catalog: a deterministic five-layer pipeline producing transparent, LTV-anchored credit ratings.",
};

interface Layer {
  n: string;
  title: string;
  summary: string;
  detail: string;
  outputs: string[];
}

const LAYERS: Layer[] = [
  {
    n: "L1",
    title: "Data normalization",
    summary:
      "Raw streaming and royalty data from many sources, sampled to one shape.",
    detail:
      "Monthly pivot per catalog, currency-normalized to USD via TTM average rates, platform-aligned to a common reporting period, and territory-tier-mapped (US/UK/CA/AU vs. Western Europe vs. LatAm/Asia/Other). Statement PDFs parsed to extract income type (mech / sync / perf / neighboring).",
    outputs: ["clean monthly USD time series", "platform & territory shares"],
  },
  {
    n: "L2",
    title: "Decay modeling",
    summary:
      "Each catalog is classified into a decay regime; the right model is fit and AIC-selected.",
    detail:
      "Four regimes — new release (< 24 mo), active pop (24-84 mo), catalog (84-240 mo), evergreen (> 240 mo). Two models in the demo build: exponential R(t) = R₀·e^(-λt) for active pop, power law R(t) = R₀·t^(-α) for catalog and evergreen. Production engine adds Bass diffusion (new releases) and Weibull survival (P10 floors).",
    outputs: ["fitted decay parameters", "60-month P10 / P50 / P90 forecast"],
  },
  {
    n: "L3",
    title: "Anomaly detection",
    summary:
      "Statistical detection on the time series, flagging events for review.",
    detail:
      "Rolling 12-month z-score over each catalog's monthly revenue; observations beyond ±2.5 standard deviations are tagged. Production engine layers PELT change-point detection and an LSTM autoencoder for multi-dimensional spikes. A gradient-boosted classifier ultimately tags each event as durable / temporary / structural-break.",
    outputs: ["per-catalog anomaly count", "event log with timestamps"],
  },
  {
    n: "L4",
    title: "Concentration & VaR",
    summary:
      "Portfolio-style risk on a single catalog: how diversified is the income, how bad can it get?",
    detail:
      "Herfindahl-Hirschman Index (HHI) over platform shares and territory shares — flags catalogs leaning on a single DSP or single market. Monte Carlo (1,000 sims in the demo, 10,000 in production) over fitted decay parameters yields VaR₉₅ and CVaR₉₅ of the 60-month total revenue. The CVaR floor is what underwrites the senior tranche.",
    outputs: ["HHI₍platform₎, HHI₍territory₎", "VaR₉₅, CVaR₉₅ in USD"],
  },
  {
    n: "L5",
    title: "Rating aggregation",
    summary:
      "Five weighted factors fold into a single 0-100 composite score that maps to a tier.",
    detail:
      "Composite = 0.30·F_stability + 0.20·F_concentration + 0.20·F_regime + 0.15·F_volatility + 0.15·F_lifecycle. The score lands the catalog in one of six tiers (RRE-AAA through RRE-B) and dictates the maximum senior-tranche LTV at issuance.",
    outputs: ["composite score 0-100", "RRE-AAA … RRE-B tier", "max senior LTV"],
  },
];

interface Factor {
  key: string;
  label: string;
  weight: number;
  color: string;
  rewards: string;
  penalizes: string;
}

const FACTORS: Factor[] = [
  {
    key: "stability",
    label: "Forecast stability",
    weight: 30,
    color: "#3B82F6",
    rewards: "Tight P10/P90 forecast bands",
    penalizes: "Wide uncertainty on the 12-month projection",
  },
  {
    key: "concentration",
    label: "Concentration (HHI)",
    weight: 20,
    color: "#8B5CF6",
    rewards: "Revenue spread across platforms & territories",
    penalizes: "Over-reliance on any one DSP or region",
  },
  {
    key: "regime",
    label: "Decay regime",
    weight: 20,
    color: "#10B981",
    rewards: "Long, stabilized revenue history",
    penalizes: "Unproven new releases with short track record",
  },
  {
    key: "volatility",
    label: "Historical volatility",
    weight: 15,
    color: "#F59E0B",
    rewards: "Smooth month-over-month royalty flows",
    penalizes: "Spiky, viral-driven revenue patterns",
  },
  {
    key: "lifecycle",
    label: "Artist & catalog age",
    weight: 15,
    color: "#EC4899",
    rewards: "Long catalog, established artist career",
    penalizes: "Brand-new IP with no long-run signal",
  },
];

interface Tier {
  tier: string;
  min: number;
  max: number;
  ltv: number;
  desc: string;
  color: string;
}

const TIERS: Tier[] = [
  { tier: "RRE-AAA", min: 90, max: 100, ltv: 0.8, color: "#34D399", desc: "Gold standard. Deep, diversified, evergreen catalog." },
  { tier: "RRE-AA", min: 80, max: 90, ltv: 0.7, color: "#22C55E", desc: "Institutional grade. Very stable income." },
  { tier: "RRE-A", min: 70, max: 80, ltv: 0.6, color: "#38BDF8", desc: "Investment grade. Mature catalog." },
  { tier: "RRE-BBB", min: 60, max: 70, ltv: 0.5, color: "#FBBF24", desc: "Acceptable. Mainstream active catalog." },
  { tier: "RRE-BB", min: 50, max: 60, ltv: 0.3, color: "#FB923C", desc: "Speculative. Growth-only financing." },
  { tier: "RRE-B", min: 0, max: 50, ltv: 0, color: "#F87171", desc: "Ineligible for senior tranches." },
];

export default function MethodologyPage() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-12 max-w-3xl">
          <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-3">
            Methodology
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-fg mb-5 text-balance">
            How RRE rates every catalog.
          </h1>
          <p className="text-muted text-base leading-relaxed">
            A deterministic five-layer pipeline that turns raw monthly royalty
            history into a transparent, LTV-anchored credit rating. Every
            number on a listing is traceable back to the formulas below — open
            source, reproducible from the same inputs every run.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted font-mono tabular">
            <span>5 layers</span>
            <span>·</span>
            <span>2 decay models</span>
            <span>·</span>
            <span>1,000 Monte Carlo sims per catalog</span>
            <span>·</span>
            <span>31 tests, all green</span>
          </div>
        </div>

        {/* Layers */}
        <section className="mb-16">
          <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-2">
            The pipeline
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-fg mb-6">
            Five layers, applied in sequence.
          </h2>

          <div className="space-y-4">
            {LAYERS.map((l, i) => (
              <div
                key={l.n}
                className="rounded-xl border border-border bg-panel p-5 grid md:grid-cols-[80px_1fr] gap-5"
              >
                <div>
                  <div className="text-[10px] tracking-[1.5px] uppercase text-muted">
                    Layer {i + 1}
                  </div>
                  <div className="text-2xl font-bold text-accent-bright tabular tracking-tighter mt-1">
                    {l.n}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-fg mb-1">
                    {l.title}
                  </h3>
                  <p className="text-sm text-fg/80 mb-3 leading-relaxed">
                    {l.summary}
                  </p>
                  <p className="text-sm text-muted mb-4 leading-relaxed">
                    {l.detail}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {l.outputs.map((o) => (
                      <span
                        key={o}
                        className="text-[11px] font-mono tabular text-fg/80 bg-panel-2 border border-border rounded-md px-2 py-1"
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Factor weights */}
        <section className="mb-16">
          <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-2">
            Factor weighting
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-fg mb-1">
            Five components, one composite.
          </h2>
          <p className="text-sm text-muted mb-6 max-w-2xl">
            Score = Σ wᵢ · Fᵢ. Each factor is normalized to 0-100 before
            weighting; the resulting composite is mapped to a tier in the
            ladder below.
          </p>

          {/* Stacked bar */}
          <div className="rounded-xl border border-border bg-panel p-5 mb-5">
            <div className="flex h-3 rounded-full overflow-hidden border border-border mb-4">
              {FACTORS.map((f) => (
                <div
                  key={f.key}
                  style={{ width: `${f.weight}%`, background: f.color }}
                  title={`${f.label}: ${f.weight}%`}
                />
              ))}
            </div>
            <div className="grid md:grid-cols-5 gap-3">
              {FACTORS.map((f) => (
                <div key={f.key}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ background: f.color }}
                    />
                    <span className="text-xs font-medium text-fg truncate">
                      {f.label}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-fg tabular tracking-tighter mb-2">
                    {f.weight}%
                  </div>
                  <div className="text-[11px] text-muted mb-1">
                    <span className="text-fg/80">Rewards:</span> {f.rewards}
                  </div>
                  <div className="text-[11px] text-muted">
                    <span className="text-fg/80">Penalizes:</span>{" "}
                    {f.penalizes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rating ladder */}
        <section className="mb-16">
          <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-2">
            Rating ladder
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-fg mb-1">
            Score → tier → LTV cap.
          </h2>
          <p className="text-sm text-muted mb-6 max-w-2xl">
            Higher composite score lands the catalog in a higher tier, which
            caps how much can be raised against it as a senior loan.
          </p>

          <div className="rounded-xl border border-border bg-panel overflow-hidden">
            <div className="grid grid-cols-[120px_140px_120px_1fr] gap-4 px-5 py-3 border-b border-border bg-panel-2/60 text-[10px] uppercase tracking-[1.2px] text-muted font-medium">
              <div>Tier</div>
              <div className="text-right">Score range</div>
              <div className="text-right">Max LTV</div>
              <div>Profile</div>
            </div>
            {TIERS.map((t) => (
              <div
                key={t.tier}
                className="grid grid-cols-[120px_140px_120px_1fr] gap-4 px-5 py-4 border-b border-border last:border-b-0 items-center"
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
                  {t.min}
                  <span className="text-muted">-</span>
                  {t.max}
                </div>
                <div
                  className="text-right font-semibold tabular text-sm"
                  style={{ color: t.color }}
                >
                  {(t.ltv * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-muted">{t.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Honest scope note */}
        <div className="rounded-xl border border-border bg-panel-2/40 p-5 text-sm text-muted leading-relaxed">
          <div className="text-[10px] tracking-[1.5px] uppercase text-muted mb-2 text-fg/80 font-semibold">
            What&rsquo;s real, what&rsquo;s roadmap
          </div>
          <p className="mb-2">
            <span className="text-fg/90">Built and shipped:</span> the
            5-layer pipeline above, AIC-selected exponential + power-law decay
            fits, rolling z-score anomaly flagging, HHI concentration, 1,000-iter
            Monte Carlo for VaR/CVaR, weighted composite with deterministic
            tier mapping. 31 passing tests in <span className="font-mono text-fg/70 tabular">engine/</span>.
          </p>
          <p>
            <span className="text-fg/90">Roadmap (post-hackathon):</span> Bass
            diffusion + Weibull survival (Tier 1), PELT change-point + LSTM
            autoencoder + gradient-boosted classifier with 6 external signals
            (Tier 2-3), 10,000-sim Monte Carlo with viral and macro vectors.
            Full gap analysis in{" "}
            <span className="font-mono text-fg/70 tabular">
              docs/08-engine-roadmap.md
            </span>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
