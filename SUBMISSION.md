# Stave - Solana Frontier Hackathon 2026 Submission

## What this is

**Stave is the marketplace for tokenized music royalties on Solana.** Every catalog is verified by the Intellectual Property Owners Association (IPOA), Georgia's official music rights organization. Catalogs are fractionalized into 1,000 on-chain shares, transparently graded, and settled with sub-cent fees. Investors browse, buy, and earn pro-rata royalty distributions on devnet today.

## The problem

The global music royalty market generates ~$30B/yr in recurring, contractually-defined cash flows growing at 9% CAGR. It looks like the kind of asset class institutional capital wants. But there is no Moody's, no Bloomberg, no MSCI. Catalogs change hands at arbitrary 10x–30x trailing-revenue multiples with no standardized adjustment for decay, concentration, or volatility. Pension funds and family offices either overpay, underpay, or stay out. The long tail of independent rights holders has no path to capital that doesn't dilute their catalog.

## The product

Stave is a **marketplace for tokenized music royalties on Solana**. The product is a live web app at [stave.cc](https://stave.cc) where investors browse eight Georgian catalogs, see a transparent grade and a returns calculator on each one, connect Phantom or Solflare, and submit real on-chain transactions on Solana devnet. The catalog data comes from IPOA. The math is open-source. The Anchor program (`stave`) for fractionalization and royalty distribution is deployed and live on devnet at [`EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q`](https://explorer.solana.com/address/EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q?cluster=devnet).

Underneath the marketplace, two layers do the work.

**The grading engine** turns verified royalty data into a transparent grade from AA to B via a five-layer quantitative pipeline (data normalization → decay modeling → anomaly detection → concentration & VaR → grade aggregation). Deterministic Python, 31 passing tests, formulas published in [`engine/FORMULAS.md`](./engine/FORMULAS.md). Eight synthetic Georgian catalogs are graded end-to-end and consumed by the live frontend.

**The on-chain fractionalization + distribution layer** is an Anchor program (`stave`) deployed to Solana devnet. All five MVP instructions are implemented, locally tested, and live on-chain: `create_work` mints a Token-2022 share supply against an IpWork PDA, `list_shares` locks supply in a Listing-PDA-authority vault, `buy_shares` atomically swaps payment for shares, `deposit_royalty` funds a RoyaltyVault PDA, and `claim_royalty` pays holders pro-rata via pull-based math with checkpoint accounting. 15 / 15 Anchor tests pass on a local validator.

The frontend (Next.js 14 + Tailwind + shadcn/ui + Recharts + `@solana/wallet-adapter`) ships eight catalogs spanning the full grade range, two live thematic indices with two more in preview, an interactive returns calculator per catalog, a music-player-styled waveform hero, and a tokenization flow that submits real devnet transactions via Phantom or Solflare. Every number on every page is traceable back to the open-source engine.

## Why Solana

Settlement economics. A royalty distribution to a fractional cap table of 1,000 holders at $0.50/holder is simply uneconomical on Ethereum L1 because gas alone consumes the payment. Solana's sub-cent fee floor makes per-month or per-quarter pro-rata distribution to thousands of fractional shareholders **the natural settlement layer for this asset class**. Token-2022 gives us standard-fungible shares that compose with DEXs, lending, and fund vehicles on day one. Metaplex Core keeps the work-NFT surface lean. The choice is technical, not promotional.

## The moat

Stave's data partner is the **Intellectual Property Owners Association (IPOA)**, Georgia's official music rights organization, with exclusive country-wide operation since January 2024. IPOA gives Stave direct access to verified royalty income data at the source. Not aggregated from third-party APIs, not self-reported by artists, not modelled from streaming counts. Every rating Stave issues on a Georgian catalogue can be cross-validated against IPOA's ledger before it goes live. No competitor starting from a pure technology position can replicate this access, and the model extends to other countries' rights organizations as Stave scales.

Next-phase regulatory work, including VASP registration with the National Bank of Georgia and a brokerage licence under the Law on Securities Market, is planned post-submission. See [docs/10-legal-roadmap.md](./docs/10-legal-roadmap.md) for the full picture.

## What's next (90 days post-submission)

- **First real PRO data connector** wired through the audit and cross-validation layer
- **First three institutional financings** with accredited family-office capital
- **Mainnet audit** of the Anchor program (Halborn or OtterSec)
- **Tranche structuring** (senior, mezzanine, growth class shares, sized by Monte Carlo CVaR)
- **Distributor partnerships** (DistroKid, TuneCore, CD Baby) for non-PRO catalog coverage

Year 1 target: $50M in rated catalog value, 10 closed financings, first portfolio fund product at $20M+ AUM.

## Team

**Levan Gvarishvili** · Founder. Quant trader with hands-on experience building systematic algorithmic crypto trading strategies. The same risk-modeling discipline that powers institutional crypto trading is what underpins Stave's deterministic rating engine for music royalty assets.

## Links

- **Live demo:** https://stave.cc
- **Pitch video** (≤2 min): _link inserted on submission day_
- **Tech demo video** (~2:30): _link inserted on submission day_
- **Methodology:** [engine/FORMULAS.md](./engine/FORMULAS.md)
- **Positioning** (Stave + IPOA, single source of truth): [docs/00-positioning.md](./docs/00-positioning.md)
- **Platform architecture (RRE/SRFP v2.0):** [docs/02-architecture.md](./docs/02-architecture.md)
- **Repo:** https://github.com/levanglij/stave
