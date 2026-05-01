# 04 — Pitch Video Script

> Target length: **≤ 3 minutes** per Solana Frontier Hackathon 2026 format (pitch video is the most important submission artifact — judges watch it first). Audience: Colosseum judges and a general technical audience. Tone: confident, concrete, no jargon in the first 15 seconds.

## Shot list / beats

### 0:00–0:12 — Hook
> "Every song you love is a cash flow. Today, pricing that cash flow is a bilateral handshake with no standards. Stave fixes that."

Visual: a familiar album cover, then cut to a stylized stream of royalty payments.

### 0:12–0:30 — The problem
The music royalty market is $30 billion a year. But it trades on opaque bilateral deals, multiples ranging from 10× to 30× with no standardized adjustment for decay, concentration, or volatility. No credit rating agency exists for this asset class.

Visual: split screen — a catalog seller waiting months, a fund buyer flying blind on data.

### 0:30–0:55 — The product (on-chain layer)
Stave lets an artist mint 1,000 royalty shares on Solana in one transaction, keep 500, and sell 500. Buyers get share tokens. When revenue comes in, the artist deposits it into the work's royalty vault, and every shareholder can claim pro-rata in real time.

Visual: screen recording of the live app — create flow, new listing appears, fan buys 50 shares, deposit + claim.

### 0:55–1:30 — The risk engine
Every work listed on Stave ships with an RRE rating — AAA through B — computed by a five-layer quantitative engine: data normalization, decay modeling with power-law and exponential fits, anomaly detection, concentration and VaR, and a standardized tier rollup. Same logic credit markets use, built for streaming data.

Visual: live rating appearing on the work's detail page. Cut to `engine/outputs/summary.json` with 5 catalogs spanning RRE-AAA to RRE-B. Cut to the composite score formula from `FORMULAS.md`.

### 1:30–2:00 — The moat
Stave is partnering with the Intellectual Property Owners Association — IPOA, Georgia's official music rights organization. That means every rating on Stave will be backed by verified income data at the source — not aggregated from third-party APIs. No pure-tech competitor can match this access, and the architecture extends to additional rights societies as we scale beyond Georgia.

Visual: diagram showing the PRO direct feed flowing into the cross-validation layer, reconciled against distributor and streaming data.

### 2:00–2:30 — Why Solana
Sub-cent transaction fees make royalty micro-payouts viable. Token-2022 shares are standard fungibles that plug into DEXs, lending protocols, and fund vehicles on day one. Metaplex Core keeps the NFT surface lean.

Visual: architecture diagram animating into place.

### 2:30–2:50 — What's built
Solana program deployed on devnet. Frontend live at [URL]. Three demo works running the full flow. Risk engine: 5-layer pipeline, 31 passing tests, 5 catalogs rated. All open source.

Visual: devnet explorer, then the deployed app, then a scroll through the GitHub repo.

### 2:50–3:00 — Close
> "Music royalties should flow at the speed of the internet, and price at the precision of credit markets. That's Stave."

Visual: logo card with URL, program ID, and GitHub.

## Production notes

- Record screen captures at 1920×1080, 60fps.
- VO first, then time visuals to VO — avoids awkward pauses.
- Background music: low, instrumental, non-copyright.
- Captions burned in for platforms that autoplay muted.
- Keep RRE rating letters visible on screen whenever a catalog appears — they're the thesis made concrete.

## Delivery

Render to MP4, H.264, ≤ 100 MB. Save to `submission/pitch-video.mp4`. Upload to YouTube as unlisted backup.
