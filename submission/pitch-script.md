# Pitch script — Stave (3:00)

> Solana Frontier Hackathon 2026 · target length **3:00** · ~450 spoken
> words at ~150 wpm · audience: Colosseum judges + a general technical
> audience. Tone: confident, concrete, no jargon in the first 15 seconds.
>
> **Recording: pending.** This is the script. The video drops on
> submission day.

---

## 0:00–0:20 — Hook

> Music royalties are a thirty-billion-dollar-a-year asset class.
> Recurring, contractually defined. No Moody's, no Bloomberg, no
> liquidity. Stave fixes that — and we have something nobody else does.
> Our partner IPOA — the Intellectual Property Owners Association —
> has Georgia's exclusive nationwide royalty-collection mandate since
> January twenty-twenty-four. That data access is the moat. No
> pure-tech competitor can replicate it.

## 0:20–0:50 — Problem & wedge

> Today, music royalty catalogs change hands in opaque bilateral deals
> at arbitrary ten-to-thirty-times multiples. Pension funds and family
> offices either overpay, underpay, or stay out. Capital is
> misallocated by billions. Stave is a marketplace on Solana where
> every catalog is verified at the source by IPOA, transparently
> graded by an open-source rating engine, fractionalized into a
> thousand on-chain shares, and settled with sub-cent fees. The same
> model extends to every country with a national rights organization.

## 0:50–1:30 — Demo (live URL walkthrough)

> Here's what it looks like.
>
> *(Open marketplace.)* Eight Georgian catalogs, each with a Stave
> grade from AA to B — derived transparently from streaming hazard,
> revenue concentration, and twenty-four-month tail risk.
>
> *(Click Suliko.)* Per-catalog detail: rating breakdown, returns
> calculator, factor-by-factor explanation. Methodology open-source —
> every formula on GitHub.
>
> *(Click buy.)* An investor picks a slice — point one percent or the
> whole catalog — and the wallet signs a real devnet transaction in
> Phantom. *(Show TX.)* When royalties come in, holders claim pro-rata,
> on-chain, sub-cent fees.

## 1:30–2:10 — The moat, in depth

> Going back to IPOA: Article sixty-four of the Law on Copyright and
> Related Rights gave them exclusive country-wide operation as of
> January first, twenty-twenty-four. That's a statutory mandate — not
> a commercial deal a competitor can outbid. They have ownership and
> royalty data at the source. Every grade we issue is cross-validated
> against IPOA's ledger before it goes live. SACEM in France. GEMA in
> Germany. ASCAP and BMI in the US. JASRAC in Japan. Every country
> with a national rights organization is a Stave deployment waiting
> to happen. The moat compounds with each CMO partnership added.

## 2:10–2:40 — Real vs. simulated

> We're hackathon-honest. The Anchor program is real — fifteen of
> fifteen tests pass, deployed live on Solana devnet, program ID
> Ec-J-D-Yr-1y. The first work and the first listing are already
> on-chain — Suliko, the first Georgian catalog, was bootstrapped
> with real `create_work` and `list_shares` transactions. The risk
> engine is real — Python, thirty-one passing tests, deterministic.
> The royalty distribution math is real — pull-based USDC, checkpoint
> accounting, multi-deposit verified. The catalog data is synthetic —
> eight Georgian catalogs spanning the grade ladder. We don't hide
> the line. The README has the full table.

## 2:40–3:00 — Ask

> We're not raising. We're showing you it's real. Next ninety days:
> first PRO connector, devnet to testnet, Georgian VASP filing. The
> infrastructure is here. The data partnership is real. The math is
> open. Thank you.

---

## Scene-by-scene shot list

| # | Time | Visual | Notes |
|---|---|---|---|
| 1 | 0:00–0:05 | Cold open: title card "Stave — Music royalties, made investable." Dark background, emerald accent. | Brand-locked. |
| 2 | 0:05–0:12 | Quick cut: $30B / 9% CAGR overlay text + vinyl macro b-roll. | Re-use `web/public/images/vinyl-macro.jpg`. |
| 3 | 0:12–0:20 | **IPOA logo placeholder + text "Georgia · Jan 2024 · exclusive national mandate."** | The hook lands here. Uses `[IPOA logo placeholder]` until real asset is dropped in. |
| 4 | 0:20–0:50 | Marketplace UI b-roll while the wedge voiceover plays. Highlight: 8 catalogs visible, IPOA partnership card on hero. | Re-use stave.cc footage. |
| 5 | 0:50–1:00 | Screen recording: stave.cc — landing → marketplace. | 1080p, 60fps preferred. |
| 6 | 1:00–1:15 | Screen recording: per-catalog detail page (Suliko). Highlight rating breakdown + returns calculator. | Cursor visible, no hesitation. |
| 7 | 1:15–1:30 | Screen recording: Phantom popup → confirm tx → Solana Explorer link to the memo TX. | Real screen capture, no fake UI. |
| 8 | 1:30–2:10 | Title cards: "Article 64 · Jan 1, 2024 · Georgia." Then map of Europe with country-CMO highlights — France (SACEM), Germany (GEMA), USA (ASCAP/BMI), Japan (JASRAC). The "Stave deployment-per-country" idea visualized. | Statutory citation visible. Map can be a simple SVG with dots. |
| 9 | 2:10–2:40 | Cut to README "What's real vs. what's simulated" table on screen. Highlight Anchor program row → cut to Solana Explorer showing the deployed program account + the bootstrap `create_work` TX. | Pull from the live README. Real Explorer screenshot, not mocked. |
| 10 | 2:40–3:00 | Title card: "Stave — built for the next 90 days, not the slide." Cut to logo + GitHub URL. | End on the URL judges can click. |

## Pre-flight checklist (run before recording)

- [ ] `pnpm dev` running locally OR open stave.cc in the
      target browser
- [ ] Phantom installed; ≥0.05 SOL on devnet for the demo TX
- [ ] Browser zoom set so a judge can read it on a phone screen
- [ ] OBS or Loom configured at 1080p, 60fps; mic levels checked
- [ ] Solana Explorer pre-warmed in a second tab on the program ID
- [ ] Practice run end-to-end at least twice; trim until under 3:00
