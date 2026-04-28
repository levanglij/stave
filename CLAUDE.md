# Claude Code master prompt — Stave

You are helping build Stave for the **Solana Frontier Hackathon 2026** (submission deadline **May 11, 2026**). Read `docs/01-mvp-spec.md` for the scoped hackathon deliverable before writing any code. Read `docs/02-architecture.md` for the long-term platform vision (RRE/SRFP) — the MVP is a focused slice of that vision, not a replacement for it.

## Project summary

Artists mint an "IP Work" (Metaplex Core NFT) plus a fungible share mint (Token-2022) representing N royalty shares. They sell some shares through a marketplace listing. Revenue can be deposited into a per-work royalty vault; shareholders claim pro-rata payouts at will.

The hackathon MVP is the on-chain fractionalization and claim flow. The broader platform — Royalty Risk Engine and Structured Royalty Financing Platform, built on top of PRO data ownership — is the vision narrative we point at in the deck and pitch video but do not build in the hackathon window.

## Target hackathon

**Solana Frontier Hackathon 2026.** Single open category. Judges weight: solving a real problem for real users, ability to ship, Solana-native architecture choices, monetization and traction. The pitch video is the most important artifact.

## Required submission deliverables

1. Product name + short description
2. Logo / key image — `assets/`
3. Team list + bios — `README.md` and deck
4. GitHub repo (must be judge-accessible)
5. **MVP — live deployed product:** Anchor program on Solana devnet + Next.js frontend on Vercel, covering the full flow (create → list → buy → deposit → claim)
6. Pitch video, ≤ 3 minutes — team, problem, solution, target user
7. Technical demo video, 2–3 minutes — stack, architecture, Solana integration
8. Pitch deck PDF — `submission/`
9. Monetization + user acquisition narrative
10. Traction evidence — Twitter/Telegram activity, waitlist signups, user feedback

See `docs/07-submission-checklist.md` for the full pre-submit punch list.

## Current state (as of 2026-04-22)

- Docs: `01-mvp-spec`, `02-architecture`, `03-pitch-deck-outline` (RRE+Frontier-aware), `04-pitch-video-script` (3-min), `05-tech-demo-script` (2:30, RRE beat), `06-gtm-monetization`, `07-submission-checklist` (Frontier-specific), `08-engine-roadmap`. The earlier `00-project-brief` was deleted; its content is covered by `02` and `README.md`.
- `engine/` — RRE demo implementation shipped: 5-layer pipeline, 31 passing tests, 5 synthetic catalogs rated end-to-end.
- `program/` — Anchor scaffold + `create_work` instruction (Token-2022 share mint + IpWork PDA + initial supply) + 3 TypeScript tests. Awaiting local `anchor build`/`anchor test` since the sandbox lacks the Solana toolchain.
- `app/`, `assets/`, `submission/` — empty.
- No git history yet — repo not initialized or pushed.
- **Next on the build path:** verify `create_work` builds and tests pass locally; then Day-2 follow-up (Metaplex Core NFT CPI), then `list_shares` + `buy_shares` (Day 3-4).

## Repo layout

- `docs/` — specs, scripts, planning. Read these before coding.
- `engine/` — Python RRE demo. 5-layer risk engine. Has its own README and FORMULAS.md. Changes to the rating methodology update `engine/FORMULAS.md` in the same commit.
- `program/` — Anchor workspace. All on-chain logic lives here.
- `app/` — Next.js frontend. Talks to the program via Anchor client + `@solana/wallet-adapter`. Reads pre-computed ratings from `engine/outputs/*.rating.json` for the demo UI.
- `assets/` — static assets for deck/video/demo.
- `submission/` — final hackathon deliverables (videos, deck PDF).

## Ground rules

1. **Spec is the source of truth.** `docs/01-mvp-spec.md` defines the hackathon scope, data model, and instructions. Do not add features outside the MVP without asking.
2. **Architecture doc is the vision, not the build target.** `docs/02-architecture.md` describes the RRE/SRFP platform we grow into. Do not try to implement the Python risk engine or the tranche financing logic in the hackathon window.
3. **Keep royalty math simple.** The MVP accepts that shares transferred between deposit and claim forfeit the unclaimed portion on those shares. Do not try to solve snapshotting in MVP.
4. **Tests are non-negotiable.** Every instruction in the program needs an Anchor test. Day 7 is a full-flow integration test on localnet before devnet deploy.
5. **Devnet first.** All live demos target devnet. Pin the deployed program ID in `app/.env.example` after each deploy.
6. **Docs stay current.** When an instruction or PDA changes, update the relevant docs in the same commit.
7. **Build in public.** Every major milestone should land a tweet or Telegram post. Traction evidence is a judging criterion.

## Conventions

- Anchor program name: `stave`
- PDAs use byte-string seeds declared in spec: `b"work"`, `b"listing"`, `b"royalty"`, `b"claim"`
- Share mint: Token-2022, 0 decimals (shares are whole integers)
- Payment mint: USDC devnet (primary); wSOL is stretch
- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`)
- Frontend: TypeScript strict, Tailwind, minimal component libraries (shadcn/ui okay if needed)

## Build plan

See `docs/01-mvp-spec.md` § "Ordered Build Plan". The plan is compressed to 21 days given the Apr 20 start and May 11 deadline. Program first, then frontend, then submission polish. No slack for rework caused by silent scope creep.

## When in doubt

Ask. Every hour spent on the wrong thing is an hour not spent on the MVP.
