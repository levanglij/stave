# QUICKSTART

> **For hackathon judges and engineers evaluating Stave on a fresh
> machine.** Five minutes from clone to working in all three layers
> (Python risk engine, Anchor program, Next.js frontend). If you hit
> trouble, the [README](./README.md) has the full reference.

## Skip-local path *(0 minutes)*

If you only want to look at the product, the live deploy is at
[stave.cc](https://stave.cc). All eight
catalogs and one example index render publicly. No auth, no install.

## Prerequisites *(60 seconds)*

| Tool | Version | Notes |
|---|---|---|
| Python | 3.11+ | risk engine + tests |
| Node | 20+ | frontend + Anchor TS tests |
| pnpm | 10+ | the repo's package manager |
| Rust | stable | Anchor program build |
| Solana CLI | 3.x | `solana --version` |
| Anchor | 0.31.1 | `avm install 0.31.1 && avm use 0.31.1` |

```bash
git clone https://github.com/levanglij/stave.git
cd stave
```

## 1. Risk engine *(60 seconds)*

```bash
cd engine
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pytest
```

**Expected output (last line):** `========== 31 passed in <1s ==========`

Inspect any pre-computed rating:

```bash
cat outputs/evergreen-001.rating.json | python3 -m json.tool | head -30
```

You should see a JSON object with a `rating` field (the Python engine
emits the legacy `RRE-XX` form; the web layer normalizes to bare letter
grades), `composite_score`, factor breakdown, decay model, and a
60-month forecast.

## 2. Anchor program *(2 minutes)*

```bash
cd ../program
pnpm install
anchor build
anchor test
```

**Expected output (last line):** `15 passing (Xs)` across 4 describe blocks
(`create_work`, `list_shares`, `buy_shares`, `deposit_royalty + claim_royalty`).

The local validator spins up automatically; no devnet account or SOL
needed for the tests.

> The program is live on Solana devnet at
> [`EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q`](https://explorer.solana.com/address/EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q?cluster=devnet)
> (pinned in `Anchor.toml` + `lib.rs:declare_id!`). To redeploy after a
> change: `anchor deploy --provider.cluster devnet` from a funded keypair.

## 3. Frontend *(60 seconds)*

```bash
cd ../web
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

**Expected:** the marketplace lists all eight catalogs, the hero shows the
candles-as-notes chart, and connecting Phantom or Solflare submits real
devnet SPL Memo transactions on the Tokenize and Buy buttons (placeholder
for the program calls until the deploy lands - see [README](./README.md)
"What's real vs. what's simulated").

## What success looks like

- `pytest` → 31/31 ✅
- `anchor test` → 15/15 ✅
- `pnpm dev` → marketplace + hero + wallet connect ✅

That's it. Three commands, three layers, five minutes.

For everything else - architecture, methodology, legal roadmap, Why
Solana, the full _What's real vs. what's simulated_ honesty table -
read the [README](./README.md).
