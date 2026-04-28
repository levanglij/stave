# Stave — IP Ownership Marketplace & Royalty Shares on Solana

Fractionalize IP (music, art, any creative work) into tradable royalty shares. Artists mint works, sell a portion of the royalty stream, and shareholders collect pro-rata payouts as revenue is deposited.

The long-term platform vision — the Royalty Risk Engine (RRE) and Structured Royalty Financing Platform (SRFP) bringing institutional-grade pricing infrastructure to music royalty markets — is documented in [`docs/02-architecture.md`](./docs/02-architecture.md). The hackathon submission is a focused on-chain MVP that demonstrates the fractionalization and royalty-distribution layer end-to-end. Together, they frame IPOA's narrative: a shipping product today, a pricing infrastructure roadmap tomorrow.

## Target

**Solana Frontier Hackathon 2026** — submission deadline **May 11, 2026**. Competition window April 6 – May 11. Single open category; Grand Champion prize $30K, top 20 startups $10K each, accelerator pre-seed for winners.

## Status (as of 2026-04-22, ~3 weeks to submission)

| # | Deliverable | State | Where |
|---|---|---|---|
| 1 | Product name & 1-line description | Drafted | this file |
| 2 | Logo / key image | Not started | `assets/` (empty) |
| 3 | Team list + bios | Not started | `README.md` § Team |
| 4 | GitHub repo (judge-accessible) | Not initialized | — |
| 5 | **MVP — live deployed product** | **In progress** — Anchor scaffold + `create_work` + 3 tests written; build/deploy pending local toolchain | `program/`, `app/` (app empty) |
| 6 | Pitch video ≤ 3 min | Script updated for RRE + 3-min cap | `docs/04-pitch-video-script.md` |
| 7 | Tech demo video 2–3 min | Script tightened to 2:30, RRE beat added | `docs/05-tech-demo-script.md` |
| 8 | Pitch deck PDF | Outline updated for RRE + Frontier (12 slides) | `docs/03-pitch-deck-outline.md` |
| 9 | Monetization / GTM narrative | Drafted | `docs/06-gtm-monetization.md` |
| 10 | Traction evidence (Twitter/Telegram/waitlist) | Not started | — |
| — | **RRE risk engine (demo)** | **Shipped** — 31 tests green, 5 catalogs rated | [`engine/`](./engine/README.md) |
| — | **Anchor program — `create_work`** | **Code shipped, awaiting local `anchor build`/`anchor test`** | [`program/`](./program/README.md) |
| — | **Local HTML demo (internal walkthrough)** | **Shipped** — single-file, zero-install; buy/deposit/claim lifecycle simulated in browser | [`app/demo.html`](./app/demo.html) ([readme](./app/README.md)) |

Critical path: deploy `create_work` to localnet/devnet, then build the next four instructions per `docs/01-mvp-spec.md`. Frontend (`app/`) starts in parallel with `buy_shares`.

## Repo layout

```
IPOA/
├── README.md                  — you are here
├── CLAUDE.md                  — master prompt for Claude Code
├── .gitignore
├── docs/                      — project planning, specs, scripts
│   ├── 01-mvp-spec.md         — scoped hackathon deliverable
│   ├── 02-architecture.md     — RRE/SRFP platform architecture (full vision)
│   ├── 03-pitch-deck-outline.md
│   ├── 04-pitch-video-script.md
│   ├── 05-tech-demo-script.md
│   ├── 06-gtm-monetization.md
│   ├── 07-submission-checklist.md
│   └── 08-engine-roadmap.md   — gap vs. architecture, missing sub-engines, priorities
├── engine/                    — Python RRE risk engine (demo implementation)
│   ├── README.md
│   ├── FORMULAS.md
│   ├── src/rre/               — 5-layer pipeline
│   ├── data/                  — 5 synthetic catalogs
│   ├── outputs/               — pre-computed ratings JSON
│   └── tests/                 — 31 passing tests
├── program/                   — Anchor/Rust workspace
│   ├── Anchor.toml, Cargo.toml, package.json, tsconfig.json
│   ├── programs/ipoa/         — IpWork PDA + Token-2022 share mint + create_work
│   ├── tests/ipoa.ts          — 3 tests (happy path + 2 validation errors)
│   └── migrations/
├── app/                       — Next.js frontend (empty; build target)
├── assets/                    — logos, mockups, screenshots (empty)
└── submission/                — final deliverables: deck PDF, videos, etc. (empty)
```

## Quick links

- [MVP spec](./docs/01-mvp-spec.md) — on-chain data model, instructions, 3-week build plan
- [Architecture](./docs/02-architecture.md) — RRE/SRFP full platform vision (what the MVP grows into)
- [RRE engine](./engine/README.md) — demo Python implementation of the risk engine, with [formulas](./engine/FORMULAS.md)
- [Engine roadmap](./docs/08-engine-roadmap.md) — gap vs. architecture, prioritized list of missing sub-engines
- [Submission checklist](./docs/07-submission-checklist.md) — pre-submit punch list

## Tech stack (MVP)

- **Program**: Rust / Anchor / Solana
- **NFT**: Metaplex Core for the IP work NFT
- **Shares**: SPL Token-2022 fungible mint for fractional royalty shares
- **Payments**: USDC devnet (primary), wrapped SOL (stretch)
- **Storage**: Irys for cover art, audio, metadata JSON
- **Frontend**: Next.js, Tailwind, `@solana/wallet-adapter`, Anchor client
- **Hosting**: Vercel (frontend), Solana devnet (program)

## Team

TODO — add names, roles, one-line credentials for each member. Required for the deck and the pitch video opener.

## Getting started

### Prerequisites
- Rust + Anchor CLI
- Solana CLI (devnet keypair funded)
- Node 20+ / pnpm

### Program

```bash
cd program
anchor build
anchor test
anchor deploy --provider.cluster devnet
```

Pin the deployed program ID in `app/.env.example` after each deploy.

### App

```bash
cd app
pnpm install
pnpm dev
```

Set the program ID and network in `app/.env.local`.

## Known MVP behaviors

- If a holder transfers shares after a royalty deposit but before claiming, the unclaimed portion on those transferred shares is forfeited. This is accepted MVP behavior to keep on-chain math simple. See [MVP spec](./docs/01-mvp-spec.md).

## License

TBD (will be set before submission; likely MIT or Apache-2.0).
