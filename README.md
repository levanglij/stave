<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/logos/stave-01-lines-on-dark.svg">
  <img src="./assets/logos/stave-01-lines-on-light.svg" alt="Stave" width="280">
</picture>

<br><br>

**Stave is the rating-and-financing infrastructure for music royalty assets built on Solana, partnered with the Georgian Rightsholders' Association (GERA) for verified ground-truth royalty data.**

<sub>Solana Frontier Hackathon 2026

</div>

---

## The wedge

Music royalties are a **$30B/yr asset class**. They're recurring, contractually defined, and growing at >9% CAGR. They look exactly like the kind of cash flow institutional capital wants except there's no Moody's, no Bloomberg, no MSCI. Catalogs trade at arbitrary 10x–30x multiples. Pension funds and family offices either overpay, underpay, or stay out. Capital is misallocated by billions.

**Stave fills the gap.** A standardized rating engine (RRE five-layer quantitative pipeline) produces transparent, comparable ratings. A fractional-share marketplace on Solana lets institutional and retail capital take exposure with sub-cent settlement on quarterly distributions. The platform doesn't compete with marketplaces and it's the infrastructure they sit on top of.

**The moat is data, not algorithms.** Stave's partnership with the Georgian Rightsholders' Association (GERA) — being formalized in the post-hackathon roadmap — gives the platform direct access to verified, ground-truth royalty income data at the source. GERA is Georgia's primary rights collection society; once integrated, every Stave rating on a Georgian catalog can be cross-validated against GERA's ledger before going live. No competitor starting from a pure technology position can replicate this access, and the model extends to additional rights societies as the platform scales beyond Georgia.

## What's real vs. what's simulated

Judges respect honesty. Here's the line:

| Layer                     | State          | Notes                                                                 |
|---------------------------|----------------|-----------------------------------------------------------------------|
| Risk engine (5 layers)    | **Real**       | Python, 31 passing tests, deterministic math; outputs JSON ratings.   |
| Catalog data              | **Synthetic**  | 8 Georgian catalogs spanning RRE-AA to RRE-B; schema-documented.      |
| PRO data integration      | Not built      | Roadmap: first PRO connector inside 90 days post-hackathon.           |
| On-chain Anchor program   | **Real (locally tested, devnet deploy queued)** | All 5 MVP instructions: `create_work`, `list_shares`, `buy_shares`, `deposit_royalty`, `claim_royalty`. 15/15 tests passing on a local validator; awaiting funded keypair for `anchor deploy`. |
| Royalty distribution math | **Real**       | Pull-based USDC claim per shareholder; checkpoint math verified across multi-deposit / multi-claim sequences. |
| Wallet integration        | **Real (live)** | Phantom + Solflare via `@solana/wallet-adapter` on stave-five.vercel.app. |
| On-chain TX from frontend | **Real (devnet)** | Tokenize and Buy buttons fire real devnet transactions today (SPL Memo); swap to program calls once deployed. |
| Marketplace UI            | **Real (live)** | 8 catalogs, 4 thematic indices, per-catalog detail with hero waveform + interactive returns calculator. |
| Tranches (senior/mezz/growth) | Not in v1   | Single-class shares only. Tranching on the roadmap slide.             |
| Mainnet / audit           | Not in scope   | Devnet prototype; "not production" stated explicitly.                 |
| KYC / accreditation       | Stubbed        | Privy auth + simulated accreditation checkbox.                        |

## Quick links

- 🔗 **Live demo:** [stave-five.vercel.app](https://stave-five.vercel.app) — Vercel-hosted, auto-deploys on every push to `main`
- 🎬 **Pitch video** (≤3 min): _to be recorded_
- 🛠 **Tech demo video** (~2:30): _to be recorded_
- 📑 **Pitch deck:** [submission/Stave-pitch-deck.pptx](./submission/Stave-pitch-deck.pptx) (PDF export drops post-finalization)
- 📊 **Financial model:** [submission/Stave-financial-model.xlsx](./submission/Stave-financial-model.xlsx)
- 🧮 **RRE methodology:** [engine/FORMULAS.md](./engine/FORMULAS.md)
- 🏛 **Platform vision:** [docs/02-architecture.md](./docs/02-architecture.md) (RRE/SRFP v2.0)
- 🗺 **Engine roadmap:** [docs/08-engine-roadmap.md](./docs/08-engine-roadmap.md)
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

Five-layer engine, transparent rating, on-chain settlement. See [docs/02-architecture.md](./docs/02-architecture.md) for the full platform vision.

## Stack

- **Risk engine:** Python 3.11, NumPy, SciPy, pandas (`engine/`)
- **On-chain:** Rust, Anchor 0.31, Token-2022, Metaplex Core (`program/`)
- **Frontend:** Next.js 14 App Router, TypeScript strict, Tailwind, shadcn/ui, Recharts (`web/`)
- **Auth:** Privy (env-gated; falls back to mock connect)
- **Hosting:** Vercel (frontend), Solana devnet (program)
- **Domain:** `stave.app` planned; `*.vercel.app` until then

## Team

_To be filled before submission. Required: founder names, roles, one-line credentials each._

## Known MVP behaviors

- Holders who transfer shares between a deposit and claim forfeit the unclaimed portion on those transferred shares. This is accepted MVP behavior to keep on-chain math simple. See [docs/01-mvp-spec.md](./docs/01-mvp-spec.md).
- Devnet only. The Anchor program is not audited and is not intended for mainnet use.
- Synthetic catalog data. Real PRO integration is the first item on the post-hackathon roadmap.

## License

TBD before submission (likely MIT).
