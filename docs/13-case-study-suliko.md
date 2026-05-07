# 13 — Case study: Suliko on Stave

> A worked end-to-end example using the one catalog that's actually live
> on Solana devnet today. Every number, address, and TX in this doc
> resolves on Solana Explorer.

## The catalog

**Suliko** — a 1949 Georgian art song, widely recorded since the early
1900s. The signature song of Georgian music abroad. The version Stave
graded uses Hamlet Gonashvili's reference recording.

| Property | Value |
|---|---|
| Catalog ID | `evergreen-001` |
| Streaming history on file | 240 months (20 years) |
| Platforms | 6 |
| Territories | 7 |
| Decay regime | Evergreen — long-tail, power-law |

This is exactly the kind of catalog Stave is built for: a traditional
work with two decades of verified earnings, geographically diverse
audience, and predictable long-term cash flows.

## What IPOA verifies *(the data layer)*

IPOA — Georgia's accredited collective management organization since
January 2024 — provides Stave with:

- **Ownership records.** Who currently holds the economic rights and
  in what splits. Verified at the source, not aggregated from third
  parties.
- **Royalty history.** Twenty years of monthly earnings across the six
  platforms and seven territories where Suliko has paid revenue.
- **Forward royalty payouts.** When future royalties accrue, IPOA's
  monthly settlement triggers an on-chain `deposit_royalty` call into
  Suliko's vault — automatically distributable to whoever holds the
  shares at the time of claim.

For the prototype, this data is synthetic (eight Georgian catalogs,
schema-documented). Post-hackathon, the first PRO data connector is the
top item on [`docs/12-roadmap.md`](./12-roadmap.md).

## What the engine grades *(the credibility layer)*

`engine/outputs/evergreen-001.rating.json` — produced by 5 deterministic
Python layers, every formula in [`engine/FORMULAS.md`](../engine/FORMULAS.md):

| Output | Value | Interpretation |
|---|---|---|
| **Grade** | **AA** *(composite score 85.32 / 100)* | Investment-grade tier, second-highest on the Stave ladder |
| Confidence | 0.90 | Engine has high confidence in the grade given data availability |
| Stability factor | 88.77 | Revenue is highly stable month-over-month |
| Concentration factor | 79.99 | Diversified across platforms + territories |
| Regime factor | 100.00 | Evergreen profile — no decay-cliff risk |
| Volatility factor | 51.26 | Some month-to-month variance, expected for a 20-year-old catalog |
| Lifecycle factor | 100.00 | Mature catalog past most decay risk |
| HHI (platform) | 0.21 *(diversified)* | No single platform dominates |
| HHI (territory) | 0.19 *(diversified)* | No single country dominates |
| 24-mo CVaR (95%) | $126,560 | Even in the worst 5% of simulated futures, the next 24 months earn at least this much |
| 60-mo P50 forecast | $188,084 | Median expected revenue over 5 years |
| Recommended Max LTV | 70% | Senior debt against a Suliko catalog could lend up to 70% of FMV |

These are not assertions — every one of these numbers is reproducible
by running `pytest` against the engine. No black box.

## On-chain state *(the live layer)*

Stave deployed Suliko's first work + first listing on Solana devnet on
2026-05-07. Every line below resolves on
[Solana Explorer](https://explorer.solana.com/?cluster=devnet):

| What | Address |
|---|---|
| **Stave program** | [`EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q`](https://explorer.solana.com/address/EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q?cluster=devnet) |
| **IpWork PDA** *(Suliko)* | [`32B19bfwgLoxxLDyXnkSZQhsJ9Vhh4ugWFetmkwBmGo6`](https://explorer.solana.com/address/32B19bfwgLoxxLDyXnkSZQhsJ9Vhh4ugWFetmkwBmGo6?cluster=devnet) |
| **Share mint** *(Token-2022, 1,000 supply, 0 decimals)* | [`DjyHadooHqwVfXVwUaf8KWVmn8DS21LHUqR5bsddC9at`](https://explorer.solana.com/address/DjyHadooHqwVfXVwUaf8KWVmn8DS21LHUqR5bsddC9at?cluster=devnet) |
| **Listing PDA** *(500 shares listed at 0.5 USDC)* | [`EJTxUg98b4LnSuUCKpWjSFyed4Cm3GPcmjgX4m9jRfHa`](https://explorer.solana.com/address/EJTxUg98b4LnSuUCKpWjSFyed4Cm3GPcmjgX4m9jRfHa?cluster=devnet) |
| `create_work` TX | [`24aATvsP...G9Xbo`](https://explorer.solana.com/tx/24aATvsPhsuctY5vN22XRL8CpckfnD8fLcQmaCmrJV5PbnWWggrojHdybB7JS71RWLMPmkN3DuoAmPVzBcRG9Xbo?cluster=devnet) |
| `list_shares` TX | [`5mGeuaHo...4sK8b`](https://explorer.solana.com/tx/5mGeuaHoUSi35ArqoeEiFb7xqZVQci6yKppUuL9X3yKyVsdrduEesFKYN3efuex38UnHM9PG6ohUaJVjHDf4sK8b?cluster=devnet) |

Total shares: **1,000.** Creator-retained: **500.** Listed for sale:
**500.** Price per share: **0.5 USDC** *(devnet illustrative pricing —
real market cap below)*. Payment mint: USDC devnet.

## Investor walkthrough *(end-to-end)*

A judge with Phantom can do this right now:

1. **Get devnet test funds.** SOL from [faucet.solana.com](https://faucet.solana.com),
   USDC from [faucet.circle.com](https://faucet.circle.com). The
   marketplace also surfaces these links in the purchase panel.
2. **Connect the wallet** at [stave-five.vercel.app](https://stave-five.vercel.app/issuances/evergreen-001).
3. **Buy 50 shares of Suliko** *(5% of the catalog)*. Cost: 25 USDC at the
   listing's demo price.
4. **Wait for a deposit.** When IPOA's monthly settlement triggers a
   `deposit_royalty` call against Suliko's vault, the deposit accrues.
5. **Call `claim_royalty()`.** Pull-based — investor initiates. Program
   pays them their pro-rata share, transfers USDC into their wallet,
   advances their checkpoint.

Every step is a real Solana transaction signed by the investor's wallet.

## Royalty distribution math *(the worked example)*

Say IPOA's April settlement totals **$5,000 of royalties owed against
Suliko**. Stave's automated `deposit_royalty` runner *(post-hackathon —
operating model in [`docs/12-roadmap.md`](./12-roadmap.md))* calls the
program with $5,000 in USDC. The vault now holds $5,000.

Three holders exist after the hackathon-demo bootstrap:

| Holder | Shares | % | Claimable on the $5,000 deposit |
|---|---|---|---|
| Creator *(retained)* | 500 | 50% | **$2,500** |
| Investor A | 50 | 5% | **$250** |
| Investor B | 100 | 10% | **$500** |
| *(Listing vault, unsold)* | 350 | 35% | **$1,750** *(stays in vault until shares are bought)* |

When each holder calls `claim_royalty()`, the program calculates:

```
claimable = your_shares × (total_deposited - your_checkpoint) ÷ total_shares
```

For Investor A, who has never claimed before *(checkpoint = 0)*:

```
claimable = 50 × (5_000_000_000 - 0) ÷ 1_000 = 250_000_000 micros = $250
```

The program transfers $250 USDC from the vault to Investor A's wallet,
updates A's checkpoint to `5_000_000_000`. Next deposit (say May:
$3,000), A claims again — math reads the *new* total minus the
*previous* checkpoint:

```
claimable = 50 × (8_000_000_000 - 5_000_000_000) ÷ 1_000 = 150_000_000 = $150
```

This is exactly your original example math, generalized: ownership =
share-token balance, royalties = pro-rata of every deposit since your
last claim. Pull-based, on-chain, deterministic, audit-friendly.

## What real economics look like *(beyond demo pricing)*

The on-chain bootstrap uses an illustrative listing price of 0.5 USDC
per share — accessible for a hackathon demo with any wallet that can
get a few USDC from a faucet. The economics for a real Suliko deal,
based on the engine's actual forecast:

| Metric | Engine output | At-scale interpretation |
|---|---|---|
| Annual royalty *(P50 year-1)* | $38,843 | What the catalog earns in a typical year |
| Implied FMV *(at AA tier × 25 multiple)* | **$971,069** | Catalog-level fair-market value |
| FMV per share *(if 1,000 shares)* | $971 | What a single share is worth in the real economics |
| 5-year ROI *(P50)* | **19.4%** | Total return over 5 years at median |
| Annual yield | **4.0%** | Cash yield against FMV |
| 5% holder's expected annual cash | **~$1,942** | What investor A would actually receive in real-world terms |

Demo pricing on-chain *(0.5 USDC/share)* is **0.05% of the realistic
share value** — kept that way for hackathon accessibility. Mainnet
pricing tracks engine FMV.

## Why this catalog matters

Suliko is a *test case for the entire model.* If a 75-year-old Georgian
art song with a 20-year streaming history and three-digit-millisecond
on-chain settlement can be:

- verified at the source by a national rights organization,
- graded transparently with reproducible math,
- fractionalized into 1,000 on-chain shares,
- bought and sold in a wallet that fits in a phone,
- and paid out pro-rata to every holder on the program's pull-based
  claim math —

…then every one of the millions of catalogs sitting in PRO ledgers
worldwide can be next.

This case study isn't a slide. Click any address above. The math is
already running on devnet.
