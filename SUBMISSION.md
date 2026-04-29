# Stave — Solana Frontier Hackathon 2026 Submission

## What this is

**Stave is the rating-and-financing infrastructure for music royalty assets built on Solana, partnered with the Georgian Rightsholders' Association (GERA) for verified ground-truth royalty data.**

## The problem

The global music royalty market generates ~$30B/yr in recurring, contractually-defined cash flows growing at 9% CAGR. It looks like the kind of asset class institutional capital wants. But there is no Moody's, no Bloomberg, no MSCI. Catalogs change hands at arbitrary 10x–30x trailing-revenue multiples with no standardized adjustment for decay, concentration, or volatility. Pension funds and family offices either overpay, underpay, or stay out — and the long tail of independent rights holders has no path to capital that doesn't dilute their catalog.

## The product

Stave ships two layers:

**The Royalty Risk Engine (RRE)** — a five-layer quantitative pipeline (data normalization → decay modeling → anomaly detection → concentration & VaR → standardized rating) that turns verified royalty data into a transparent RRE-AAA through RRE-B rating. 31 passing tests, formulas published in [`engine/FORMULAS.md`](./engine/FORMULAS.md). Five synthetic Georgian catalogs are rated end-to-end and consumed by the live frontend.

**The on-chain fractionalization & distribution layer** — an Anchor program (`stave`) on Solana devnet. Artists mint a Token-2022 share supply against an `IpWork` PDA. Buyers acquire fractional shares with USDC. Royalties deposited to the work's vault are distributed pull-based, pro-rata, with sub-cent settlement.

The frontend (Next.js 14 + Tailwind + shadcn/ui) shows every Stave issuance with its full RRE rating breakdown — composite score, factor weights, P10/P50/P90 forecast, HHI concentration scores, Monte Carlo VaR/CVaR, recommended LTV. Every number is traceable back to the open-source engine.

## Why Solana

Settlement economics. A royalty distribution to a fractional cap table of 1,000 holders at $0.50/holder is simply uneconomical on Ethereum L1 — gas alone consumes the payment. Solana's sub-cent fee floor makes per-month or per-quarter pro-rata distribution to thousands of fractional shareholders **the natural settlement layer for this asset class**. Token-2022 gives us standard-fungible shares that compose with DEXs, lending, and fund vehicles on day one. Metaplex Core keeps the work-NFT surface lean. The choice is technical, not promotional.

## The moat

Stave's data moat is being secured through a partnership with the Georgian Rightsholders' Association (GERA) — Georgia's primary rights collection society. The partnership, formalizing in the post-hackathon roadmap, gives Stave direct, institutional-grade access to verified royalty income data at the source — not aggregated from third-party APIs, not self-reported by artists, not modeled from streaming counts. Once integrated, every rating Stave issues on a Georgian catalog can be cross-validated against GERA's primary ledger before it goes live. No competitor starting from a pure technology position can replicate this access, and the architecture extends naturally to additional rights societies as Stave scales beyond Georgia.

## What's next (90 days post-submission)

- **First real PRO data connector** wired through the audit and cross-validation layer
- **First three institutional financings** with accredited family-office capital
- **Mainnet audit** of the Anchor program (Halborn or OtterSec)
- **Tranche structuring** — senior/mezzanine/growth class shares, sized by Monte Carlo CVaR
- **Distributor partnerships** (DistroKid, TuneCore, CD Baby) for non-PRO catalog coverage

Year 1 target: $50M in rated catalog value, 10 closed financings, first portfolio fund product at $20M+ AUM.

## Team

_To be filled before submission. Founder names, roles, one-line credentials each — required for the deck and pitch video opener._

## Links

- **Live demo:** _set after first Vercel deploy_ — see [docs/09-deployment.md](./docs/09-deployment.md)
- **Pitch video** (≤3 min): _link inserted on submission day_
- **Tech demo video** (~2:30): _link inserted on submission day_
- **Pitch deck (PDF):** [submission/Stave-pitch-deck.pdf](./submission/) — exported from `Stave-pitch-deck.pptx`
- **Financial model:** [submission/Stave-financial-model.xlsx](./submission/Stave-financial-model.xlsx)
- **Methodology:** [engine/FORMULAS.md](./engine/FORMULAS.md)
- **Platform architecture (RRE/SRFP v2.0):** [docs/02-architecture.md](./docs/02-architecture.md)
- **Repo:** https://github.com/levanglij/stave
