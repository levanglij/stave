# Tech demo script — Stave (2:30)

> Solana Frontier Hackathon 2026 · target length **2:30** · audience:
> technical judges. Goal: prove the system works end-to-end on devnet,
> the risk engine is real code not a slide, and the Anchor program is
> real Rust not a markdown promise.
>
> **Recording: pending.** Companion to the 3-minute pitch video.

## Pre-flight checklist (run before recording)

- [ ] `solana --version` resolves to 3.x
- [ ] `anchor --version` resolves to 0.31.1
- [ ] `python3 --version` resolves to 3.11+
- [ ] `cd engine && pytest` passes 31/31
- [ ] `cd program && anchor test` passes 15/15
- [ ] `cd web && pnpm dev` starts at localhost:3000 with no console errors
- [ ] Devnet RPC reachable: `solana cluster-version -u devnet`
- [ ] Phantom + Solflare extensions installed; one wallet has ≥0.1 SOL
      on devnet for the live tokenize TX
- [ ] Browser zoom ≥110% for legibility
- [ ] OBS scene template: terminal + browser side-by-side at 1080p/60fps

---

## 0:00–0:30 — Repo tour

> Quick repo tour. README at the root — elevator pitch, the *What's
> real vs. what's simulated* table, architecture diagram. *(Scroll to
> the table.)* Eleven rows. Real, synthetic, or planned — explicit on
> every layer. *(Click QUICKSTART.md.)* Five-minute fresh-laptop path
> through engine, program, and frontend. Three commands, three layers,
> five minutes.

## 0:30–1:00 — Engine

> *(Terminal: `cd engine && pytest`.)* Thirty-one tests pass in under
> a second. *(Open `outputs/evergreen-001.rating.json`.)* Output
> schema: grade tier, composite score, factor breakdown, decay model
> parameters, sixty-month forecast, CVaR floor. Five layers — data
> normalization, decay modeling with exponential and power-law fits,
> anomaly detection via rolling z-score, concentration and Monte Carlo
> VaR, and grade aggregation. Every formula in `FORMULAS.md`. Open
> source, deterministic, fully traceable.

## 1:00–1:40 — Anchor program

> *(Terminal: `cd ../program && anchor test`.)* Fifteen of fifteen.
> *(Open `programs/stave/src/lib.rs`.)* Five MVP instructions —
> `create_work` mints a Token-2022 share supply with the IpWork PDA
> as authority. `list_shares` locks supply in a Listing-PDA-authority
> vault. `buy_shares` atomically swaps payment for shares signed by
> the listing PDA. `deposit_royalty` funds the royalty vault.
> `claim_royalty` pays holders pro-rata via pull-based math with
> checkpoint accounting. *(Open `errors.rs`.)* Fourteen documented
> error variants. *(Open `instructions/buy_shares.rs`.)* BPF
> stack-frame safety with Box wrappers on heavy account types.
> Devnet deploy queued behind faucet funding — keypair pinned, ready
> to ship.

## 1:40–2:10 — Frontend on devnet

> *(Browser: stave.cc.)* Eight rated catalogs. Hero
> with candles-as-notes chart. IPOA partnership card.
> Open-methodology badge — every credibility signal in the README is
> also visible on the live URL. *(Click Tokenize.)* Phantom popup.
> Confirm. *(Cut to Solana Explorer.)* Real on-chain transaction.
> Today that's an SPL Memo TX — placeholder for the program calls
> once devnet deploy lands. Until then, the program is locally
> tested, end to end, fifteen out of fifteen.

## 2:10–2:30 — Roadmap

> Next ninety days. Devnet deploy this week, real program calls
> swapped in next. First PRO connector beyond Georgia in thirty days.
> Then Georgian VASP filing. Then mainnet audit. Roadmaps in
> `docs/08-engine-roadmap.md` and `docs/10-legal-roadmap.md`,
> primary-source cited. Thanks.

---

## What this video proves to a judge

- The engine is real code. Tests run, outputs are JSON, formulas are open.
- The Anchor program is real Rust. Tests pass on a real validator.
  Five instructions, fourteen errors, BPF-safe.
- The frontend is real Next.js. Real wallet adapter, real devnet
  signature, real explorer link.
- The honest framing in the README ("devnet deploy queued behind
  faucet funding") matches what the camera shows. No paper claims.
