<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/logos/stave-01-lines-on-dark.svg">
  <img src="./assets/logos/stave-01-lines-on-light.svg" alt="Stave" width="280">
</picture>

<br><br>

**Stave is the marketplace for tokenized music royalties on Solana.** Every catalog is verified by the Intellectual Property Owners Association (IPOA) — Georgia's official music rights organization — fractionalized into 1,000 on-chain shares, transparently graded, and settled with sub-cent fees. Investors browse, buy, and earn pro-rata royalty distributions on devnet today.

<sub>Solana Frontier Hackathon 2026

</div>

---

## Verify Stave is real *(60 seconds, 3 clicks)*

Not a slide deck. Real code on a real chain.

1. **[Open the Stave program on Solana Explorer (devnet)](https://explorer.solana.com/address/EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q?cluster=devnet)** — confirm the program account exists, owned by BPF Loader, ~430KB of Rust deployed.
2. **[Open the `create_work` transaction](https://explorer.solana.com/tx/24aATvsPhsuctY5vN22XRL8CpckfnD8fLcQmaCmrJV5PbnWWggrojHdybB7JS71RWLMPmkN3DuoAmPVzBcRG9Xbo?cluster=devnet)** — the first Stave catalog (Suliko) was minted on-chain by this real TX, with a Token-2022 share supply created and listed.
3. **[Open the live URL](https://stave-five.vercel.app)**, connect Phantom on devnet, browse to a catalog, click Buy. Real wallet. Real signature. Real devnet TX.

> **New here?** Read [QUICKSTART.md](./QUICKSTART.md) for a 5-minute
> fresh-laptop walk-through of all three layers (engine, program, frontend).

## The wedge

Music royalties are a **$30B/yr asset class**. They're recurring, contractually defined, and growing at >9% CAGR. They look exactly like the kind of cash flow institutional capital wants except there's no Moody's, no Bloomberg, no MSCI. Catalogs trade at arbitrary 10x–30x multiples. Pension funds and family offices either overpay, underpay, or stay out. Capital is misallocated by billions.

**Stave fills the gap.** A fractional-share marketplace on Solana where every listing is verified at the source by IPOA, transparently graded by an open-source rating engine, and settled with sub-cent fees on quarterly royalty distributions. Investors get an actually-tradable view of the asset class. The grading engine is a feature that makes the marketplace credible — not the product.

**The moat is data, not algorithms.** Stave's partner IPOA is Georgia's official music rights organization — the only entity with the country-wide mandate to collect and distribute music royalties since January 2024. Every Stave rating uses IPOA's verified ownership and royalty data, which a pure-tech competitor cannot replicate. The same model extends to other countries' rights organizations as Stave scales.

## What's real vs. what's simulated

Judges respect honesty. Here's the line:

| Layer                     | State          | Notes                                                                 |
|---------------------------|----------------|-----------------------------------------------------------------------|
| Risk engine (5 layers)    | **Real**       | Python, 31 passing tests, deterministic math; outputs JSON ratings.   |
| Catalog data              | **Synthetic**  | 8 Georgian catalogs spanning RRE-AA to RRE-B; schema-documented.      |
| PRO data integration      | Not built      | Roadmap: first PRO connector inside 90 days post-hackathon.           |
| On-chain Anchor program   | **Real (deployed to Solana devnet)** | All 5 MVP instructions: `create_work`, `list_shares`, `buy_shares`, `deposit_royalty`, `claim_royalty`. 15/15 tests passing on a local validator. Live on devnet at program ID [`EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q`](https://explorer.solana.com/address/EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q?cluster=devnet). |
| Royalty distribution math | **Real**       | Pull-based USDC claim per shareholder; checkpoint math verified across multi-deposit / multi-claim sequences. |
| Wallet integration        | **Real (live)** | Phantom + Solflare via `@solana/wallet-adapter` on stave-five.vercel.app. |
| On-chain TX from frontend | **Real (devnet)** | Tokenize and Buy buttons fire real devnet transactions today (SPL Memo); swap to program calls once deployed. |
| Marketplace UI            | **Real (live)** | 8 catalogs, 4 thematic indices, per-catalog detail with hero waveform + interactive returns calculator. |
| Tranches (senior/mezz/growth) | Not in v1   | Single-class shares only. Tranching on the roadmap slide.             |
| Mainnet / audit           | Not in scope   | Devnet prototype; "not production" stated explicitly.                 |
| KYC / accreditation       | Stubbed        | Privy auth + simulated accreditation checkbox.                        |

## What's running on devnet right now

Don't take our word for it — every claim below resolves on Solana
Explorer:

| What | Address / TX | Click |
|---|---|---|
| **Stave program** | `EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q` | [Open in Explorer](https://explorer.solana.com/address/EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q?cluster=devnet) |
| **First on-chain work** *(Suliko / `evergreen-001`)* | IpWork PDA `32B19bfwgLoxxLDyXnkSZQhsJ9Vhh4ugWFetmkwBmGo6` | [Open](https://explorer.solana.com/address/32B19bfwgLoxxLDyXnkSZQhsJ9Vhh4ugWFetmkwBmGo6?cluster=devnet) |
| **Share mint** *(Token-2022, 1,000 supply, 0 decimals)* | `DjyHadooHqwVfXVwUaf8KWVmn8DS21LHUqR5bsddC9at` | [Open](https://explorer.solana.com/address/DjyHadooHqwVfXVwUaf8KWVmn8DS21LHUqR5bsddC9at?cluster=devnet) |
| **First on-chain listing** *(500 shares at 0.5 USDC each)* | Listing PDA `EJTxUg98b4LnSuUCKpWjSFyed4Cm3GPcmjgX4m9jRfHa` | [Open](https://explorer.solana.com/address/EJTxUg98b4LnSuUCKpWjSFyed4Cm3GPcmjgX4m9jRfHa?cluster=devnet) |
| **`create_work` transaction** | `24aATvsP...G9Xbo` | [Open TX](https://explorer.solana.com/tx/24aATvsPhsuctY5vN22XRL8CpckfnD8fLcQmaCmrJV5PbnWWggrojHdybB7JS71RWLMPmkN3DuoAmPVzBcRG9Xbo?cluster=devnet) |
| **`list_shares` transaction** | `5mGeuaHo...4sK8b` | [Open TX](https://explorer.solana.com/tx/5mGeuaHoUSi35ArqoeEiFb7xqZVQci6yKppUuL9X3yKyVsdrduEesFKYN3efuex38UnHM9PG6ohUaJVjHDf4sK8b?cluster=devnet) |

The bootstrap script that produced these is at [`program/scripts/bootstrap-suliko.ts`](./program/scripts/bootstrap-suliko.ts); the JSON manifest of all addresses is at [`program/bootstrap-output.json`](./program/bootstrap-output.json).

## Quick links

- 🔗 **Live demo:** [stave-five.vercel.app](https://stave-five.vercel.app) — Vercel-hosted, auto-deploys on every push to `main`
- 🎬 **Pitch video** (≤3 min): [submission/pitch-script.md](./submission/pitch-script.md) — _recording: pending_
- 🛠 **Tech demo video** (~2:30): [submission/tech-demo-script.md](./submission/tech-demo-script.md) — _recording: pending_
- 📦 **Submission package:** [submission/README.md](./submission/README.md) — index of every asset a judge needs
- 📑 **Pitch deck:** [submission/Stave-pitch-deck.pptx](./submission/Stave-pitch-deck.pptx) (PDF export drops post-finalization)
- 📊 **Financial model:** [submission/Stave-financial-model.xlsx](./submission/Stave-financial-model.xlsx)
- 🧮 **RRE methodology:** [engine/FORMULAS.md](./engine/FORMULAS.md)
- 🏛 **Platform vision:** [docs/02-architecture.md](./docs/02-architecture.md) (RRE/SRFP v2.0)
- 🗺 **Engine roadmap:** [docs/08-engine-roadmap.md](./docs/08-engine-roadmap.md)
- ⚖️ **Legal roadmap:** [docs/10-legal-roadmap.md](./docs/10-legal-roadmap.md) — three-pillar regulatory + corporate-legal roadmap (CMO partnership, brokerage / VASP licensing path, custody architecture). Primary-source cited.
- 🛣️ **Product roadmap:** [docs/12-roadmap.md](./docs/12-roadmap.md) — what ships in Q3 / Q4 / 2027 / 2028+
- 🎼 **Suliko case study:** [docs/13-case-study-suliko.md](./docs/13-case-study-suliko.md) — end-to-end walkthrough of the one catalog that's live on devnet right now
- 🥇 **Vs. competitors:** [docs/14-vs-competitors.md](./docs/14-vs-competitors.md) — Bolero / SongVest / ANote and where Stave's moat sits
- 📨 **Submission narrative:** [SUBMISSION.md](./SUBMISSION.md)

## Run it yourself

### The risk engine (60 seconds)

```bash
cd engine
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pytest                                      # 31 tests
python -m rre.cli rate data/catalog_balanced-001.json
```

Or just inspect the pre-computed ratings:

```bash
cat engine/outputs/evergreen-001.rating.json | python3 -m json.tool
```

### The Anchor program

```bash
cd program
pnpm install                                # installs TS test deps
anchor build                                # ~40 sec; 254 KB BPF + IDL + TS types
anchor test                                 # spins up local validator; 15/15 passing
anchor deploy --provider.cluster devnet     # devnet keypair must be funded
```

The program ID is already wired (`EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q`) in both `Anchor.toml` and `programs/stave/src/lib.rs:declare_id!`. After deploy, the IDL at `target/idl/stave.json` is mirrored into `web/lib/idl/` for the frontend client.

### The frontend

Lives at `web/` (Next.js 14 + Tailwind + shadcn/ui + Recharts + `@solana/wallet-adapter`):

```bash
cd web
pnpm install
pnpm dev                                    # http://localhost:3000
```

Live deploy auto-runs on every push to `main`: https://stave-five.vercel.app

## Architecture, in one diagram

```
                                                              ┌──────────────┐
   PRO data feeds ──┐                                         │  Investors   │
                    │                                         │              │
   DSP API pulls ───┼──► Audit & cross-validate ──► RRE ──►   │  Browse      │
                    │   (5-layer risk engine)         JSON    │  + buy       │
   Statement upload ┘                                         │  fractional  │
                                                  │           │  shares      │
                                                  ▼           └──────┬───────┘
                                          ┌────────────────┐         │
                                          │  Stave Anchor  │  ◄──────┘
                                          │  program       │     USDC ──► royalty vault
                                          │  on Solana     │     ──► pro-rata claim
                                          └────────────────┘
```

Marketplace front, transparent grading inside, on-chain settlement underneath. See [docs/02-architecture.md](./docs/02-architecture.md) for the full platform vision.

## Why Solana for royalty distributions

Settlement economics are why this asset class belongs on Solana, not because chain choice is fashionable. The numbers below turn quarterly distributions to thousands of fractional holders from "theoretically possible" into "actually deployable":

| Property | Solana | Ethereum L1 | Source |
|---|---|---|---|
| Per-tx cost (typical) | ≈ $0.00025 (5,000 lamports per signature at SOL ≈ $50) <!-- TODO: verify SOL price assumption at submission --> | $2–15 for an ERC-20 transfer at 30 gwei (≈ 50k gas × 30 gwei × $2,000 ETH) <!-- TODO: verify ETH gas + price at submission --> | [Solana docs — fees](https://docs.solana.com/transaction_fees) · [ERC-20 transfer gas](https://etherscan.io) |
| Time to finality | ≈ 400 ms optimistic confirmation; ≈ 12.8 s super-majority finalized | ≈ 12.8 minutes (2 epochs × 32 slots × 12 s, post-Merge) | [Solana validator docs](https://docs.solana.com/cluster/overview) · [Ethereum.org — finality](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/) |
| Sustained throughput | 2,000–3,000 TPS in production workloads (theoretical max ≈ 65,000) | 15–30 TPS | Solana Labs benchmarks · [Ethereum.org](https://ethereum.org) |
| Native fungible token primitive | SPL Token-2022 — no contract deploy, transfer-hook + extensions built in | ERC-20 — deploy a Solidity contract per token, audit each | [spl.solana.com](https://spl.solana.com/token-2022) · [EIP-20](https://eips.ethereum.org/EIPS/eip-20) |

A pro-rata distribution to 1,000 holders at $0.50 / holder is gas-positive on Solana (≈ $0.25 in fees, ≈ 0.05% overhead) and gas-negative on Ethereum L1 (≈ $2,000+ in fees, exceeding the payment). For an asset class whose unit economics are "many small holders, recurring small payments," this isn't a preference — it's the difference between a real product and a slide.

## Stack

- **Risk engine:** Python 3.11, NumPy, SciPy, pandas (`engine/`)
- **On-chain:** Rust, Anchor 0.31, Token-2022, Metaplex Core (`program/`)
- **Frontend:** Next.js 14 App Router, TypeScript strict, Tailwind, shadcn/ui, Recharts (`web/`)
- **Auth:** Privy (env-gated; falls back to mock connect)
- **Hosting:** Vercel (frontend), Solana devnet (program)
- **Domain:** `stave.app` planned; `*.vercel.app` until then

## Code quality & safety

Every box below is **verifiable in the repo today**. Anything unchecked is a planned addition with a date.

### On-chain (`program/`)

- [x] **All 5 instructions implemented and locally tested** — `create_work`, `list_shares`, `buy_shares`, `deposit_royalty`, `claim_royalty`. 15/15 Anchor tests passing on a local validator (`cd program && anchor test`).
- [x] **Pull-based royalty math with checkpoint accounting** — verified across multi-deposit / multi-claim sequences. See `programs/stave/src/instructions/claim_royalty.rs`.
- [x] **PDA-only authority on funds-holding accounts** — Listing PDA authority on the share vault, RoyaltyVault PDA authority on the royalty token vault. Once locked, only `buy_shares` / `claim_royalty` can move funds out.
- [x] **BPF stack-frame safety** — heavy `InterfaceAccount<TokenAccount>` fields in `BuyShares`, `DepositRoyalty`, `ClaimRoyalty` boxed to stay under the 4 KB BPF stack limit.
- [x] **No unbounded supply** — Token-2022 share mint authority is the IpWork PDA; supply is set at `create_work` and cannot inflate.
- [x] **14 error variants documented** in `programs/stave/src/errors.rs` with explicit `#[msg(...)]` strings.
- [x] **Devnet deploy** — live on Solana devnet at [`EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q`](https://explorer.solana.com/address/EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q?cluster=devnet); program ID pinned in `Anchor.toml` + `lib.rs:declare_id!`. Frontend wire-up to real `program.methods` calls is the next post-deploy task.
- [ ] **Mainnet audit (Halborn or OtterSec)** — planned post-hackathon.

### Off-chain (`engine/` and `web/`)

- [x] **Engine: 31/31 deterministic tests passing** — `cd engine && pytest`. No randomness in production code paths.
- [x] **Engine: open methodology** — every formula in [`engine/FORMULAS.md`](./engine/FORMULAS.md), every output JSON reproducible from the same inputs.
- [x] **Frontend: TypeScript strict mode** — `web/tsconfig.json` sets `"strict": true`.
- [x] **Frontend: no committed secrets** — `web/.env.example` documents every env var; `.env.local` is gitignored.
- [x] **Wallet adapter: Phantom + Solflare** via `@solana/wallet-adapter`. Devnet by default.
- [ ] **Engine: ruff + mypy in CI** — planned post-submission.
- [ ] **Frontend: explicit `@typescript-eslint/no-explicit-any` lint rule** — strict mode catches most cases today; this rule is a planned tightening.
- [ ] **GitHub Actions CI** — planned post-submission.

## Team

_To be filled before submission. Required: founder names, roles, one-line credentials each._

## Regulatory roadmap

**Data partner.** Stave is partnered with the **Intellectual Property Owners Association (IPOA)** — Georgia's official music rights organization since January 2024. IPOA is our source of verified ownership and royalty data for every catalogue we list.

**Planned next steps:**

- **VASP registration with the National Bank of Georgia** — required for a Solana-based marketplace operating in Georgia.
- **Brokerage license under the Law on Securities Market** — required because a fractional royalty token counts as a security under Georgian law.
- **AML / KYC programme** under the Financial Monitoring Service of Georgia.

Background, fees, timelines, and primary-source citations in [docs/10-legal-roadmap.md](./docs/10-legal-roadmap.md).

## Known MVP behaviors

- Holders who transfer shares between a deposit and claim forfeit the unclaimed portion on those transferred shares. This is accepted MVP behavior to keep on-chain math simple. See [docs/01-mvp-spec.md](./docs/01-mvp-spec.md).
- Devnet only. The Anchor program is not audited and is not intended for mainnet use.
- Synthetic catalog data. Real PRO integration is the first item on the post-hackathon roadmap.

## License

MIT — see [LICENSE](./LICENSE).
