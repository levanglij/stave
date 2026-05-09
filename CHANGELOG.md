# Changelog

Release log for Stave, ordered newest-first. Format:
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) +
[Conventional Commits](https://www.conventionalcommits.org/).

The repo is built for the **Solana Frontier Hackathon 2026** (submission
May 11, 2026). Until the hackathon judging closes, all work is on
`main` and reflected here as it lands. SemVer kicks in post-mainnet.

---

## [Unreleased] · `main`

### Added - frontend polish & repo signals

- **Anchor program README polished** with a security-and-safety
  checklist, a PDA-hierarchy ASCII diagram, and a Verify-on-devnet
  table. (`program/README.md`)
- **CHANGELOG.md** - this file. Structured release log so judges and
  future contributors can scan velocity at a glance.
- **Inline math formulas on `/how-it-works`** - each of the 5 engine
  layers ships with the actual formula it evaluates, rendered as
  proper italic-variable HTML with sub/sup. No KaTeX dep - Cambria
  Math fallback fonts and a `.formula` CSS class keep the bundle
  flat.
- **Toast notification system** - custom 3 KB in-house implementation,
  themed to the dark + emerald palette. Wired into wallet
  connect/disconnect, copy-to-clipboard, tokenize, and buy events.
- **Marketplace sort by Grade** added alongside FMV / Price / 5yr ROI.

### Added - submission boost (May 8)

- **Live on-chain status strip** on catalog detail pages for any
  bootstrapped listing (Suliko today; Bicycles after the second
  bootstrap script runs). Reads the listing vault balance from devnet
  RPC every 30 seconds, falls back to seed values silently on RPC
  failure. (`web/components/onchain-status.tsx`,
  `web/lib/onchain-listings.ts`)
- **Loading skeletons** for `/marketplace`, `/indices`, and
  `/issuances/[id]` - structurally-correct shimmer that matches each
  page's layout, eliminating "pop" on route transitions.
- **Glossary** on `/how-it-works` - 10 terms (Composite score, LTV,
  FMV/NAV, HHI, VaR/CVaR, Regime, Decay model, Token-2022, PDA, USDC)
  with one-line summaries and expandable plain-English explanations.
- **Per-catalog OG cards** - sharing `/issuances/[id]` on X/LinkedIn
  now previews with that catalog's grade chip, gradient cover, and
  headline FMV / 5yr ROI / LTV. 8 distinct previews via Edge runtime.
- **`sitemap.xml` + `robots.txt`** - auto-discovered list of 14 routes
  (6 static + 8 catalogs), regenerated at build time.
- **Twitter Card meta** - `summary_large_image` so X renders the OG
  card full-width. Plus a `canonical` link to `stave.cc` to dedupe
  vs the Vercel preview URL.
- **2nd catalog bootstrap script**
  (`program/scripts/bootstrap-bicycles.ts`) - calls `create_work` +
  `list_shares` for active-pop-001 (Nine Million Bicycles, work_id=2)
  with a different price + float ratio than Suliko, proving the
  program supports varied configurations.
- **Engine output reproducibility note** - annotated snippet of
  `evergreen-001.rating.json` in the README so judges see the
  deterministic output structure without cloning.

### Added - homepage motion (May 8)

- **Scroll-triggered section reveals** via IntersectionObserver. Each
  below-fold section fades and translates in on first viewport entry.
  Honors `prefers-reduced-motion`.
- **Stat count-up animation** on the four homepage stats (catalogs,
  FMV, grade, ROI). Server-component-safe via named formatter
  strings.
- **Hero on-chain pulse ticker** - pulsing "Live · devnet" pill plus a
  marquee of recent program TXs. Seeded with the two real Suliko
  bootstrap signatures so first paint is verifiable; fetches
  `getSignaturesForAddress` on mount and replaces seed with live
  entries when devnet RPC responds.
- **Mobile hamburger nav** - collapses below `md` to a sliding sheet
  with all nav items, devnet pill, and wallet connect button. ESC,
  route change, or backdrop tap closes; body scroll locks while open.
- **Custom thin emerald scrollbar** + `scroll-behavior: smooth` for
  hash-link clicks. Both honor `prefers-reduced-motion`.
- **Hero rebalance** - grid moved from `[55fr_45fr]` to `[46fr_54fr]`
  at lg+, plus an emerald-aura backdrop behind the chart so the
  visual reads as a deliberate hero element, not a thumbnail.

### Changed

- **Canonical domain switched to `stave.cc`** across in-repo
  references (layout `metadataBase`, OG card footer, README,
  SUBMISSION, QUICKSTART, `submission/*`, `docs/*`). The legacy
  `stave-five.vercel.app` URL continues to resolve as a fallback;
  `docs/09-deployment.md` rewritten as a GoDaddy → Vercel DNS guide.

---

## [0.6.0] - May 7, 2026 · "Devnet bootstrap"

### Added

- **First on-chain work + listing bootstrapped on devnet** - Suliko
  (work_id=1, evergreen-001) created via `create_work` + 500 of 1000
  shares listed at 0.5 USDC via `list_shares`. Reproducible script at
  `program/scripts/bootstrap-suliko.ts`. Manifest at
  `program/bootstrap-output.json`.
- **Branded Open Graph card** for the homepage and `apple-icon.tsx`
  for iOS home-screen pinning.
- **404 / loading / error pages** - brand-consistent (emerald accent
  on dark) instead of Next.js defaults.
- **Copyable on-chain addresses** below the honesty callout - Program
  ID, Suliko PDA, Listing PDA, and `create_work` TX, each with
  one-click copy + Solana Explorer link.
- **GitHub Actions CI** - engine pytest, web build, program cargo
  check on every push. Status badge in README.

### Changed

- **Card hover treatment unified** across non-landing pages
  (marketplace, indices, partners, for-artists). Same border-shift +
  translate-y + shadow stack everywhere.
- **Pitch script** reframed IPOA-first; the wedge is the data partner,
  not the engine.

---

## [0.5.0] - May 5, 2026 · "Wallet integration"

### Added

- **Phantom + Solflare wallet adapter** via `@solana/wallet-adapter`,
  with Privy fallback to a mock connect for local dev.
- **Real devnet TXs from frontend** - Tokenize and Buy buttons fire
  SPL Memo transactions as a placeholder for the real
  `program.methods.{createWork, buyShares}().rpc()` calls (which land
  once the program is deployed; tracked as a follow-up).
- **Public roadmap** at `docs/12-roadmap.md`, **Suliko case study** at
  `docs/13-case-study-suliko.md`, **competitive landscape** at
  `docs/14-vs-competitors.md`.

---

## [0.4.0] - May 1, 2026 · "Anchor program complete"

### Added

- **All 5 MVP instructions implemented** in the Anchor program:
  `create_work`, `list_shares`, `buy_shares`, `deposit_royalty`,
  `claim_royalty`.
- **15 / 15 Anchor tests passing** on a local validator. Pull-based
  royalty math with checkpoint accounting verified across multi-
  deposit / multi-claim sequences.
- **Program ID pinned** at
  `EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q` in `Anchor.toml` and
  `programs/stave/src/lib.rs:declare_id!`.
- **IDL + TypeScript types** generated and mirrored at
  `web/lib/idl/{stave.json, stave.ts}` for the future on-chain client.

---

## [0.3.0] - April 24, 2026 · "Marketplace UI"

### Added

- **8 graded Georgian catalogs** in the marketplace (Suliko, Tbiliso,
  Khasanbegura, Iavnana, Bedi, Nine Million Bicycles, Chito Gvrito,
  Argasvene) with cover gradients, grade chips, and FMV / 5yr ROI
  stats.
- **4 thematic indices** (Heritage, Modern, Blue Chip, All-Catalog)
  with NAV per unit, composite grade, and senior LTV derived from
  underlying components.
- **Catalog detail pages** with music-player-styled waveform hero,
  purchase panel (+/− qty, live total, Buy button), 4 stat cards
  (FMV / 5YR ROI / Risk Score / Annual Royalty), interactive returns
  calculator, and full RRE breakdown.
- **`/how-it-works`** combining 4-step intro + 5-layer methodology +
  rating ladder.
- **`/partners`**, **`/for-artists`**, **`/tokenize`** routes.

---

## [0.2.0] - April 17, 2026 · "Risk engine v1"

### Added

- **Python RRE engine** in `engine/` - 5-layer pipeline (data
  normalization, decay modeling, anomaly detection, concentration &
  VaR, grade aggregation).
- **31 / 31 deterministic tests** under `engine/tests/`.
- **Open methodology document** at `engine/FORMULAS.md` - every
  formula behind the engine, citable.
- **8 catalog ratings JSONs** in `engine/outputs/`, regenerable from
  raw inputs via `python -m rre.cli rate <input>.json`.

---

## [0.1.0] - April 10, 2026 · "Repo skeleton"

### Added

- **Initial commit** - repo layout (`engine/`, `program/`, `web/`,
  `docs/`, `submission/`, `assets/logos/`).
- **Brand and palette locked** - Concept 01 logo (staff lines + rated
  note), dark + emerald palette, Inter / JetBrains Mono.
- **Core docs:** `01-mvp-spec.md`, `02-architecture.md`,
  `03-pitch-deck-outline.md`.
