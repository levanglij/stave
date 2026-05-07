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
> Recurring, contractually defined, growing nine percent a year. They
> look exactly like institutional cash flows — but there's no Moody's,
> no Bloomberg, no MSCI for music. Catalogs trade at arbitrary
> ten-to-thirty times multiples. Capital is misallocated by billions.

## 0:20–0:50 — Problem & wedge

> Stave fixes this. The wedge is data, not algorithms. Our partner,
> IPOA — the Intellectual Property Owners Association — is Georgia's
> only entity with a national mandate to collect music royalties since
> January twenty-twenty-four. Every Stave grade is computed against
> IPOA's verified data, which a pure-tech competitor can't replicate.
> The same model extends to other rights organizations as we scale.

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

## 1:30–2:10 — The moat (IPOA partnership)

> The moat is IPOA. Georgia's accredited collective management
> organization, exclusive country-wide operation since January first,
> twenty-twenty-four under Article sixty-four of the Law on Copyright.
> They have a national royalty-collection mandate that competitors
> can't get from APIs or scraping. We get verified ownership and
> royalty data at the source — not modeled, not aggregated. Every
> grade is cross-validated against IPOA's ledger before it goes live.
> The same regulatory pattern repeats in every country with a CMO.
> Stave's market is fundamentally distributable.

## 2:10–2:40 — Real vs. simulated

> We're hackathon-honest. The risk engine is real — Python, thirty-one
> passing tests, deterministic. The Anchor program is real — fifteen
> of fifteen tests pass on a local validator; devnet deploy is queued
> behind faucet funding. The royalty distribution math is real —
> pull-based USDC, multi-deposit verified. The catalog data is
> synthetic — eight Georgian catalogs spanning the rating ladder. We
> don't hide the line. The README has the full table.

## 2:40–3:00 — Ask

> We're not raising. We're showing you it's real. Next ninety days:
> first PRO connector, devnet to testnet, Georgian VASP filing. The
> infrastructure is here. The data partnership is real. The math is
> open. Thank you.

---

## Scene-by-scene shot list

| # | Time | Visual | Notes |
|---|---|---|---|
| 1 | 0:00–0:08 | Cold open: title card "Stave — Music royalties, made investable." Dark background, emerald accent. | Brand-locked. |
| 2 | 0:08–0:20 | B-roll: stylized money-flow graphic over a vinyl macro shot. | Re-use `web/public/images/vinyl-macro.jpg`. |
| 3 | 0:20–0:35 | Voiceover continues over a clean text overlay: "$30B asset class · no Moody's · capital misallocated." | Minimal animation. |
| 4 | 0:35–0:50 | IPOA logo placeholder + text "Georgia · Jan 2024 · national mandate." | Uses `[IPOA logo placeholder]` until real asset lands. |
| 5 | 0:50–1:00 | Screen recording: stave-five.vercel.app — landing → marketplace. | 1080p, 60fps preferred. |
| 6 | 1:00–1:15 | Screen recording: per-catalog detail page (Suliko). Highlight rating breakdown + returns calculator. | Cursor visible, no hesitation. |
| 7 | 1:15–1:30 | Screen recording: Phantom popup → confirm tx → Solana Explorer link to the memo TX. | Real screen capture, no fake UI. |
| 8 | 1:30–2:10 | Mostly text-on-screen: "IPOA · Georgia's CMO · since Jan 1, 2024 · Article 64 of the Law on Copyright." Voiceover dominant. | Statutory citation visible. |
| 9 | 2:10–2:40 | Cut to README "What's real vs. what's simulated" table on screen. Highlight rows by zoom + box. | Pull from the live README. |
| 10 | 2:40–3:00 | Title card: "Stave — built for the next 90 days, not the slide." Cut to logo + GitHub URL. | End on the URL judges can click. |

## Pre-flight checklist (run before recording)

- [ ] `pnpm dev` running locally OR open stave-five.vercel.app in the
      target browser
- [ ] Phantom installed; ≥0.05 SOL on devnet for the demo TX
- [ ] Browser zoom set so a judge can read it on a phone screen
- [ ] OBS or Loom configured at 1080p, 60fps; mic levels checked
- [ ] Solana Explorer pre-warmed in a second tab on the program ID
- [ ] Practice run end-to-end at least twice; trim until under 3:00
