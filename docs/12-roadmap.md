# 12 - Roadmap

> Public roadmap. Honest about what's built today vs. what's planned.
> The further out a milestone is, the softer the commitment. Updated
> 2026-05-11.

## Where we are today *(May 2026, hackathon submission)*

- **Anchor program live on Solana devnet** at [`EcJDYr1y6...`](https://explorer.solana.com/address/EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q?cluster=devnet) - 5 instructions (`create_work`, `list_shares`, `buy_shares`, `deposit_royalty`, `claim_royalty`), 15 / 15 tests passing
- **First on-chain work + listing bootstrapped** - Suliko (catalog `evergreen-001`), 1,000 shares, 500 listed at 0.5 USDC each, verifiable on Explorer
- **Live frontend at [stave.cc](https://stave.cc)** - 8 graded Georgian catalogs, 2 thematic indices, working wallet adapter, real on-chain TXs
- **Risk engine** - Python, deterministic, 31 / 31 tests, every formula in [`engine/FORMULAS.md`](../engine/FORMULAS.md)
- **IPOA partnership** - working partnership; covers ownership and royalty data for the Georgian repertoire
- **MIT licensed** - every layer open-source

## Next 6 months *(post-hackathon)*

The focus is real data and real on-chain calls. No expansion yet.

| Milestone | What it means |
|---|---|
| **First IPOA data feed wired to the engine** | Replace synthetic test data with real Georgian catalog records from IPOA. Every grade computed from real ownership and revenue history. |
| **Frontend program method swap** | `tokenize-form.tsx` and `purchase-panel.tsx` call real `program.methods.{createWork, buyShares}().rpc()` instead of the current Memo placeholder. |
| **Bootstrap script for the full Georgian repertoire** | One-shot deploy of every IPOA-administered catalog Stave has rights to list, on devnet. |
| **Audit conversation opened** | Initial scoping with one of Halborn / OtterSec / Neodyme. Not a contract yet. Audit budget depends on funding. |

## 2027 *(Georgian operations)*

Pace assumes funding lands and regulatory work moves at a normal rate.

| Milestone | What it means |
|---|---|
| **Mainnet audit + remediation** | Once scoped and budgeted, complete one full audit cycle and fix critical / high findings. |
| **Mainnet deploy on Solana** | Anchor program ships to mainnet-beta after the audit lands. |
| **VASP registration with the National Bank of Georgia** | Filed and in progress. Approval timelines are set by the regulator, not by us. |
| **Brokerage partnership conversations** | Stave integrates *with* existing licensed Georgian brokerages rather than seeking its own brokerage license. Smaller regulatory surface, faster route to investors. |
| **First real financings** | A small number of accredited Georgian investors deployed against rated catalogs. Targeting single digits, not double digits, for the first cohort. |

## Beyond 2027 *(if the Georgian model proves out)*

Everything in this section is conditional on the prior phases working.

- **Second-country CMO partnership.** Likely candidates include Armenia (NCIPA), Azerbaijan (Azerbaijan Authors' Society), or one of the wider Caucasus / regional CMOs. We won't push into a new country until the Georgian operation is stable.
- **Tranche structuring (senior / growth).** Per-catalog senior and growth share classes for capital that wants different risk profiles. Sized via Monte Carlo CVaR. Built only when there's demand from real investors.
- **EU-licensed wealth platform partnerships.** Distribution via licensed brokerages in EU jurisdictions where Stave's token classification is workable.
- **Cross-asset comparison tools.** Stave grades benchmarked against corporate-bond credit ratings, CLO tranches, REIT yields.

## What we will NOT do

- **Issue our own token / governance token.** Stave shares are per-catalog claims on royalty cash flow and don't carry voting rights over the platform. We are not a DAO.
- **Custody users' SOL or USDC.** Settlement is non-custodial; funds flow wallet-to-wallet via the Anchor program.
- **Operate as an exchange.** The marketplace is a primary issuance + claim layer. Secondary trading happens on DEXs and brokerages.
- **Seek a brokerage license ourselves.** Stave is the marketplace and rating engine. Distribution runs through partner brokerages already licensed in their jurisdictions.

## Honest framing

Everything in "Where we are today" is real and verifiable, code commit by code commit. Everything in "Next 6 months" is the natural near-term work after the hackathon. Everything in "2027" depends on funding, audit budget, regulatory pace, and partnership conversations going well. Everything in "Beyond 2027" is intentionally a sketch, not a commitment. We'd rather under-promise here and ship.
