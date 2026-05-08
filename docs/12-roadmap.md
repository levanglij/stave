# 12 — Roadmap

> Public roadmap — what ships when. Honest about what's built today vs.
> what's planned. Updated 2026-05-07.

## Where we are today *(May 2026, hackathon submission)*

- **Anchor program live on Solana devnet** at [`EcJDYr1y6...`](https://explorer.solana.com/address/EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q?cluster=devnet) — 5 instructions (`create_work`, `list_shares`, `buy_shares`, `deposit_royalty`, `claim_royalty`), 15 / 15 tests passing
- **First on-chain work + listing bootstrapped** — Suliko (catalog `evergreen-001`), 1,000 shares, 500 listed at 0.5 USDC each — verifiable on Explorer
- **Live frontend at [stave.cc](https://stave.cc)** — 8 graded Georgian catalogs, 4 thematic indices, working wallet adapter, real on-chain TXs
- **Risk engine** — Python, deterministic, 31 / 31 tests, every formula in [`engine/FORMULAS.md`](../engine/FORMULAS.md)
- **IPOA partnership** — verified data partner; agreement covers ownership + royalty data for the Georgian repertoire
- **MIT licensed** — every layer open-source

## Q3 2026 *(July – September) — first real data + audit*

| Milestone | What it means |
|---|---|
| **First PRO data connector** | Real IPOA ledger feed wired to the engine. Synthetic catalog data retired. Every grade computed from real ownership + revenue records. |
| **Mainnet audit kicked off** | Engagement with one of Halborn / OtterSec / Neodyme. Audit scope: all 5 instructions + token + claim math. |
| **Frontend `program.methods` swap** | `tokenize-form.tsx` and `purchase-panel.tsx` call real `program.methods.{createWork, buyShares}().rpc()` instead of the current Memo-TX placeholder. Adds `@coral-xyz/anchor` client. |
| **`per-share-accumulator` math** | Refactor `claim_royalty` so holders who transfer between deposits don't forfeit. Synthetix-style index pattern. |
| **Bootstrap script for all 8 catalogs** | One-shot deploy of the full Georgian repertoire on-chain. |

## Q4 2026 *(October – December) — secondary market + testnet*

| Milestone | What it means |
|---|---|
| **Secondary market** | Holders re-list their shares to new buyers. New `list_secondary` instruction or DEX integration (Jupiter / Phoenix). |
| **Devnet → Solana testnet** | Final shake-out before mainnet. Larger batch tests on real RPC infrastructure. |
| **Royalty-payout cron** | Stave operates an automated `deposit_royalty` runner — IPOA's monthly settlement triggers an on-chain deposit per work. |
| **Audit findings remediated** | Implementation of all critical / high audit findings. Re-audit. |

## 2027 H1 *(January – June) — Georgian mainnet launch*

| Milestone | What it means |
|---|---|
| **Mainnet deploy** | Anchor program ships to Solana mainnet-beta. Same program ID. |
| **VASP registration with the National Bank of Georgia** | Required for a Solana-based marketplace operating in Georgia. Detail in [`docs/10-legal-roadmap.md`](./10-legal-roadmap.md). |
| **Brokerage license under the Law on Securities Market** | Required because a fractional royalty token counts as a security under Georgian law. |
| **AML / KYC programme** | Under the Financial Monitoring Service of Georgia. Privy stub replaced with a real KYC vendor. |
| **First 10 closed financings** | Family-office and accredited-investor capital deployed against rated Georgian catalogs. |

## 2027 H2 *(July – December) — second country + tranche structure*

| Milestone | What it means |
|---|---|
| **Second-country CMO partnership signed** | The IPOA model extends. Likely candidates: Armenia (NCIPA), Azerbaijan (Azerbaijan Authors' Society), Turkey (MESAM / MSG), or one of the Caucasus regional CMOs. |
| **Tranche structuring** | Senior / mezzanine / growth class shares per catalog. Senior gets first dollar of royalties (lowest yield, lowest risk); growth gets the long-tail upside (highest variance). Sized via Monte Carlo CVaR per tier. |
| **Sygnum (or analog) custody integration** | Institutional-grade custody for fund-vehicle holdings. Token-2022 transfer-hook for whitelist enforcement at custody level. |
| **First portfolio-fund product** | A Stave-managed fund vehicle pooling 20+ catalogs into a single LP-friendly product. |

## 2028+ *(long horizon) — pan-European*

| Milestone | What it means |
|---|---|
| **EU-licensed wealth platform partnerships** | Distribution via licensed brokerages in EU jurisdictions where Stave's tokenized-securities classification is workable. |
| **Distributor partnerships** | DistroKid, TuneCore, CD Baby — for non-PRO catalog coverage (independent artists outside CMO mandate). |
| **Cross-asset comparison tools** | Stave grade compared against corporate-bond credit ratings, CLO tranches, REIT yields — for institutional capital that allocates across asset classes. |

## What we will NOT do

- **Issue our own token / governance token.** Stave shares are per-catalog, redeem against royalty cash flows, and don't carry voting rights over the platform. We are not a DAO.
- **Custody users' SOL or USDC.** Settlement is non-custodial — funds flow wallet-to-wallet via the Anchor program. Stave has no master wallet for user funds.
- **Operate as an exchange.** The marketplace is a primary-issuance + claim layer. Secondary trading happens on DEXs / brokerages.

## Honest framing

This roadmap is what we *plan* to build. Everything before "Q3 2026" is real and verifiable today — every claim has a code commit, a test, or a Solana Explorer link behind it. Everything after Q3 2026 is a plan with dependencies on funding, partnerships, audits, and regulatory work that takes time. Treat the post-hackathon items as "what we'll be working on," not "what's already done."
