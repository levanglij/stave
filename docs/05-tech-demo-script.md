# 05 — Tech Demo Script

> Target length: **2–3 minutes** per Solana Frontier Hackathon 2026 format. Audience: technical judges. Goal: prove the system works end-to-end on devnet, on-camera, and that the risk engine is real code not a slide.

## Pre-flight checklist (run before recording)

- [ ] Devnet up (`solana cluster-version -u devnet`)
- [ ] Artist wallet funded (≥ 2 SOL)
- [ ] Buyer wallet funded (≥ 1 SOL + USDC devnet)
- [ ] App running against deployed program ID
- [ ] `engine/outputs/*.rating.json` regenerated so ratings reflect current data
- [ ] Browser zoom 110% for legibility
- [ ] Explorer tab prewarmed to the program ID
- [ ] OBS scene: app + explorer + engine output split

## Act 1 — Create a work (30s)

1. Open app, connect artist wallet.
2. Go to `/create`. Upload cover + 30s audio preview. Title, artist, ISRC.
3. Total shares = 1,000; shares to list = 500; price per share = 0.1 USDC.
4. Submit. Mention: "one transaction mints the NFT, the Token-2022 share mint, and creates the listing."
5. Cut to explorer: IpWork PDA, Core NFT, Token-2022 share mint visible.

## Act 2 — Show the RRE rating (30s)

1. Back on the new work's detail page — the RRE badge appears: "RRE-AA · 70% LTV".
2. Expand to show the factor breakdown: stability 89, concentration 80, regime 100, volatility 51, lifecycle 100 → composite 85.
3. Cut briefly to the Python output in a terminal: `python -m rre.cli data/catalog_evergreen-001.json` producing the same JSON. "Same engine, same numbers, running right now."
4. Call out: "31 tests green, formulas published, open source."

## Act 3 — Buy shares (20s)

1. Switch to buyer wallet.
2. On the detail page, buy 50 shares at 0.1 USDC = 5 USDC.
3. Sign. Buyer wallet shows +50 share tokens.

## Act 4 — Deposit + claim (30s)

1. Back on the detail page, use the "Deposit royalty" demo control to deposit 10 USDC.
2. Explorer: RoyaltyVault `total_deposited` 0 → 10,000,000 (6-decimal USDC).
3. Go to `/portfolio`. Claim — buyer receives 0.5 USDC (5% × 10).
4. Explorer: ClaimRecord PDA created with correct checkpoint.

## Act 5 — Close (15s)

1. Return to landing page.
2. On-screen recap: program ID, GitHub URL, live app URL.
3. One-line: "On-chain fractionalization plus a standardized risk rating — that's the infrastructure."

## Contingency

If a transaction fails on camera: cut, retry off camera, re-record from the last clean checkpoint. Don't retry on camera.

## Delivery

Render to MP4, H.264, 1080p 60fps, ≤ 100 MB. Save to `submission/tech-demo.mp4`. Upload to YouTube as unlisted backup.
