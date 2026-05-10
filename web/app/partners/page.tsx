import type { Metadata } from "next";
import { Building2, Network, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Partners · Stave",
  description:
    "Stave's data partner is IPOA - Georgia's official music rights organization. Plus our distribution thesis: bringing graded tokenized royalties to regulated brokerage channels.",
};

export default function PartnersPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        {/* Hero */}
        <section className="max-w-3xl mb-16">
          <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-3">
            Partners
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-fg text-balance">
            Built on{" "}
            <span className="text-accent-bright">verified data.</span>
          </h1>
        </section>

        {/* SECTION 1 - Data partnerships (IPOA) */}
        <section>
          <div className="text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-3">
            Data partnerships
          </div>
          <div className="rounded-2xl border border-accent/40 bg-panel p-6 md:p-8 grid md:grid-cols-[1fr_280px] gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-fg mb-2">
                Intellectual Property Owners Association (IPOA)
              </h2>
              <p className="text-fg/80 leading-relaxed">
                Georgia&rsquo;s official music rights organization. Country-wide
                mandate to collect and distribute music royalties since
                January 2024. Our verified source of ownership and royalty
                data for every catalogue.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-panel-2 p-4 self-start">
              <Kv label="Founded" value="Jan 2024" />
              <Kv label="Repertoire" value="All economic rights" />
              <Kv label="Status" value="Working partnership" highlight />
              <Kv label="Website" value="ipoa.ge" link="https://ipoa.ge" />
            </div>
          </div>
        </section>

        {/* Divider between sections */}
        <div className="border-t border-border my-16 md:my-20" />

        {/* SECTION 2 - Distribution partnerships (in planning) */}
        <section className="space-y-16 md:space-y-20">
          {/* Header */}
          <div className="max-w-3xl">
            <div
              className="text-[11px] font-semibold tracking-[2px] uppercase mb-3"
              style={{ color: "#fbbf24" }}
            >
              Distribution · In planning
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-fg text-balance mb-5">
              Bringing graded royalties to regulated channels.
            </h2>
            <p className="text-muted text-base md:text-lg leading-relaxed max-w-[720px]">
              Stave&rsquo;s long-term distribution thesis is simple: tokenized
              royalty assets reach scale only when they&rsquo;re accessible
              through the same regulated channels investors already use.
              We&rsquo;re designing for integration with licensed Georgian
              brokerages first, with the wider Caucasus region and EU-licensed
              platforms to follow.
            </p>
          </div>

          {/* What we're building toward - three cards */}
          <div>
            <div className="text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-4">
              What we&rsquo;re building toward
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <PlanCard
                icon={<Building2 className="w-5 h-5" strokeWidth={1.75} />}
                title="Distribute through Georgian brokerages first."
                body="Georgia has a small but established capital markets ecosystem regulated by the National Bank of Georgia. Stave is built locally and intends to integrate with the country's licensed brokerage houses as the first distribution layer, so Georgian investors can access tokenized royalties through the platforms they already trust. Stave is the marketplace and rating engine; the brokerage is the customer-facing channel."
              />
              <PlanCard
                icon={<Network className="w-5 h-5" strokeWidth={1.75} />}
                title="API-first, brokerage-friendly."
                body="The marketplace exposes a clean read/write API for any partner platform. Brokerages can offer Stave-listed catalogs as a new asset class to their clients, white-label the marketplace experience, or co-design products that meet their compliance and reporting requirements."
              />
              <PlanCard
                icon={<Globe className="w-5 h-5" strokeWidth={1.75} />}
                title="Regional expansion follows."
                body="Once the Georgian distribution layer is operational, the same model extends naturally - Caucasus brokerages, EU-licensed wealth platforms, and any regulated venue interested in offering graded royalty exposure to its client base."
              />
            </div>
          </div>

          {/* What a partnership covers - numbered list */}
          <div className="max-w-[720px] mx-auto">
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-fg mb-7 text-balance">
              What a Stave brokerage partnership covers
            </h3>
            <ol className="space-y-7">
              <PartnershipPoint
                n={1}
                title="Listing access."
                body="The brokerage's clients can buy and sell tokenized catalog shares from within their existing brokerage UI, with Stave handling tokenization, grading, and on-chain settlement in the background."
              />
              <PartnershipPoint
                n={2}
                title="Methodology transparency."
                body="Every catalog comes with the full Stave grade breakdown - the same methodology that's open-sourced on GitHub. Brokerages can show clients exactly how each grade was derived."
              />
              <PartnershipPoint
                n={3}
                title="Custody and reporting."
                body="Stave works with the brokerage's existing custody and reporting infrastructure. Tokens can be held in a brokerage-managed wallet structure rather than requiring clients to self-custody."
              />
              <PartnershipPoint
                n={4}
                title="Co-designed products."
                body="For brokerages that want to go further, Stave can build custom indices, themed baskets, or fixed-income style products tailored to the brokerage's client base and risk appetite."
              />
            </ol>
          </div>

          {/* Closing strip */}
          <div className="max-w-[640px] mx-auto text-center">
            <h4 className="text-lg md:text-xl font-semibold tracking-tight text-fg mb-3 text-balance leading-snug">
              Brokerages, wealth platforms, and institutions interested in
              tokenized royalties:
            </h4>
            <p className="text-sm text-muted mb-7 leading-relaxed">
              Stave is open to early conversations. Conversations are
              confidential and non-binding.
            </p>
            <a
              href="mailto:stave111115@gmail.com"
              className="btn-glow rounded-lg bg-accent text-accent-ink font-semibold text-base px-7 py-3.5 inline-block"
            >
              Get in touch
            </a>
          </div>

          {/* Footer disclaimer */}
          <p className="text-xs text-muted/80 text-center max-w-[720px] mx-auto leading-relaxed">
            Stave is a devnet preview. Distribution partnerships are
            exploratory and not yet operational. Any future integration will
            be subject to applicable regulatory requirements in each
            jurisdiction.
          </p>
        </section>
      </div>
    </main>
  );
}

/* ----- helpers below ----- */

function Kv({
  label,
  value,
  link,
  highlight,
}: {
  label: string;
  value: string;
  link?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-baseline py-1.5 text-sm border-b border-border last:border-b-0">
      <span className="text-muted text-xs">{label}</span>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="text-accent-bright hover:underline font-medium tabular"
        >
          {value}
        </a>
      ) : (
        <span
          className={
            "font-medium tabular " +
            (highlight ? "text-accent-bright" : "text-fg")
          }
        >
          {value}
        </span>
      )}
    </div>
  );
}

// Lighter variant of the homepage ValueCard - softer border + half-opacity
// panel background, neutral icon chrome (no emerald accent). The amber
// "IN PLANNING" eyebrow is the only accent in this section per spec.
function PlanCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-panel/50 p-6 transition-all duration-200 hover:border-emerald-900/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/20">
      <div className="w-10 h-10 rounded-lg bg-panel-2/60 border border-border/60 text-fg/85 flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="text-base font-semibold tracking-tight text-fg mb-2 leading-snug">
        {title}
      </div>
      <p className="text-sm text-muted leading-relaxed">{body}</p>
    </div>
  );
}

function PartnershipPoint({
  n,
  title,
  body,
}: {
  n: number;
  title: string;
  body: string;
}) {
  return (
    <li className="flex items-start gap-4">
      <span className="shrink-0 w-9 h-9 rounded-full border border-border bg-panel flex items-center justify-center text-sm font-bold text-fg/85 tabular">
        {n}
      </span>
      <div>
        <div className="font-semibold text-fg mb-1.5">{title}</div>
        <p className="text-sm text-muted leading-relaxed">{body}</p>
      </div>
    </li>
  );
}
