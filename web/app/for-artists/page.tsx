import type { Metadata } from "next";
import Link from "next/link";
import { Banknote, ShieldCheck, LineChart } from "lucide-react";
import { ApplyTrigger } from "@/components/apply-trigger";

export const metadata: Metadata = {
  title: "For artists · Stave",
  description:
    "Turn your catalog into income without selling it. Stave tokenizes a fraction of your future royalties on Solana — you keep your masters, your rights, and your creative control.",
};

export default function ForArtistsPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20 space-y-20">
        {/* HERO */}
        <section className="max-w-3xl">
          <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-4">
            For artists
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-fg text-balance leading-[1.05]">
            Turn your catalog into income.{" "}
            <span className="text-accent-bright">
              Without selling it.
            </span>
          </h1>
          <p className="text-lg text-muted leading-relaxed mt-6 max-w-2xl">
            Stave lets you tokenize a share of your future royalties on Solana.
            Investors get fractional exposure to your work. You keep your
            masters, your rights, and your creative control — and you raise
            capital up front against income you&rsquo;d earn anyway.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <ApplyTrigger className="btn-glow rounded-lg bg-accent text-accent-ink font-semibold text-base px-6 py-3.5">
              Apply to tokenize
            </ApplyTrigger>
            <Link
              href="/how-it-works"
              className="text-base text-accent-bright hover:underline font-medium inline-flex items-center gap-1"
            >
              See how grading works <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="mt-7 text-xs text-muted font-mono tabular">
            Devnet preview · Onboarding new catalogs by application
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section>
          <div className="grid md:grid-cols-3 gap-4">
            <ValueCard
              icon={<Banknote className="w-5 h-5" strokeWidth={1.75} />}
              title="Capital up front"
              body="Sell a fraction of future royalties as on-chain tokens. Get paid today instead of waiting on streaming statements."
            />
            <ValueCard
              icon={<ShieldCheck className="w-5 h-5" strokeWidth={1.75} />}
              title="You keep ownership"
              body="You don't sell your masters or your publishing rights. You're selling a slice of the cash flow, not the underlying work."
            />
            <ValueCard
              icon={<LineChart className="w-5 h-5" strokeWidth={1.75} />}
              title="A real price for your catalog"
              body="Stave grades every catalog against the same scale used on the marketplace. You get a transparent, methodology-backed valuation — not a label's offer."
            />
          </div>
        </section>

        {/* HOW IT WORKS — three steps */}
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-fg mb-8 text-balance">
            How it works
          </h2>
          <ol className="space-y-7 max-w-3xl">
            <Step
              n={1}
              title="Apply."
              body="Send us a link to your catalog and a sense of what you're looking for. We'll respond within a week with a grade range and a tokenization plan."
            />
            <Step
              n={2}
              title="Get graded."
              body="Stave produces a grade using streaming history, concentration, and forward hazard. The full methodology is open-source — you see exactly how the number is computed."
            />
            <Step
              n={3}
              title="List on the marketplace."
              body="Your catalog gets fractionalized into 1,000 tokens and listed alongside other graded catalogs. Investors buy in. You receive the proceeds in USDC, on-chain."
            />
          </ol>
        </section>

        {/* CLOSING */}
        <section className="rounded-2xl border border-border bg-panel/70 px-6 py-12 md:py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-fg mb-6">
            Want to talk?
          </h2>
          <ApplyTrigger className="btn-glow rounded-lg bg-accent text-accent-ink font-semibold text-base px-7 py-3.5 inline-block">
            Apply to tokenize
          </ApplyTrigger>
          <p className="text-xs text-muted mt-5 max-w-md mx-auto leading-relaxed">
            We onboard a small number of catalogs per quarter to keep grades
            rigorous. No retail self-listing yet.
          </p>
        </section>
      </div>
    </main>
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
    <div className="rounded-xl border border-border bg-panel p-6 transition-all duration-200 hover:border-emerald-900/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/20">
      <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 text-accent-bright flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="text-lg font-semibold tracking-tight text-fg mb-2">
        {title}
      </div>
      <p className="text-sm text-muted leading-relaxed">{body}</p>
    </div>
  );
}

function Step({
  n,
  title,
  body,
}: {
  n: number;
  title: string;
  body: string;
}) {
  return (
    <li className="flex items-start gap-5">
      <span className="shrink-0 w-10 h-10 rounded-full border border-accent/40 bg-accent/5 text-accent-bright flex items-center justify-center text-base font-bold tabular">
        {n}
      </span>
      <div>
        <div className="text-lg font-semibold tracking-tight text-fg mb-1">
          {title}
        </div>
        <p className="text-sm md:text-base text-muted leading-relaxed">
          {body}
        </p>
      </div>
    </li>
  );
}
