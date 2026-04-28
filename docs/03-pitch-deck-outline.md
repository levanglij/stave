# 03 — Pitch Deck Outline

> Slide-by-slide structure for the Stave pitch deck. Target length: 12 slides. Delivery: PDF in `submission/`. Frames both the shipped Solana MVP and the RRE/SRFP platform direction, because judges at Colosseum evaluate both product and business thesis.

## Slide 1 — Title
- Stave logo
- Tagline: "Pricing infrastructure for music royalty finance."
- Presenter name + "Solana Frontier Hackathon 2026"

## Slide 2 — The problem
- The global music royalty market is $30B/year but financing it is opaque and inefficient.
- Catalogs priced at bilateral multiples (10x–30x TTM revenue) with no standardized risk methodology.
- Artists wait months for royalties; fans have no way to participate in the upside.
- No Moody's, no Bloomberg, no MSCI for this asset class.

## Slide 3 — The insight
- Royalty streams are recurring cash flows with mathematically predictable decay.
- Credit markets solved this 60 years ago with standardized ratings + structured tranches.
- Music just needs the same infrastructure — built for the streaming era.

## Slide 4 — What Stave is
- Two layers:
  - **On-chain fractionalization layer** — artists mint royalty shares on Solana, fans and institutions buy them, everyone gets pro-rata payouts.
  - **Royalty Risk Engine (RRE)** — a standardized rating methodology that makes every catalog directly comparable.
- Think "Solana + Moody's for music."

## Slide 5 — Product demo (screenshot)
- Cover art of a listed work on the live app.
- **RRE-AA rating badge**, Share count, price, "Buy 10 shares" button.
- Call out: live on Solana devnet, rating computed from real (synthetic) catalog data.

## Slide 6 — How the risk engine works
- 5-layer quantitative pipeline (data norm → decay fit → anomaly detection → concentration + VaR → rating).
- Screenshot of `engine/outputs/summary.json`: 5 catalogs rated from RRE-AAA to RRE-B with LTV recommendations.
- "31 tests green, open source, formulas published in `engine/FORMULAS.md`."

## Slide 7 — How the on-chain layer works
- Simplified diagram: IpWork NFT → Token-2022 share mint → per-work royalty vault → pro-rata claim.
- Key building blocks: Metaplex Core, Token-2022, Anchor.

## Slide 8 — Why Solana
- Sub-cent fees make royalty micro-payouts viable (credit markets can't do this).
- Token-2022 shares are standard fungibles — DEX, lending, and fund composability from day one.
- Mature wallet UX for the non-crypto artist.

## Slide 9 — The moat: PRO ownership
- Ground-truth royalty data at the source, not aggregated from APIs.
- Cross-validates every submission during minting.
- Deepens with every additional PRO affiliation — can't be matched by pure tech competitors.

## Slide 10 — Market & GTM
- Phase 1: independent artists via Solana-native communities.
- Phase 2: indie labels + collectives using the SRFP marketplace.
- Phase 3: aggregator partnerships (distributors, publishers); first royalty portfolio fund.
- Phase 4: ABS, index, derivatives.

## Slide 11 — What's built (proof slide)
- Checkmarks, concrete:
  - Solana program deployed on devnet (program ID)
  - Frontend live at [URL]
  - 3+ demo works listed
  - Full create → list → buy → deposit → claim flow working end-to-end
  - RRE engine: 5-layer pipeline, 31 tests, 5 rated catalogs
- Links: GitHub, live URL, program ID, tech demo video.

## Slide 12 — Business model & ask
- Revenue: origination fees (1.5–3%), servicing (0.5–1% annual), analytics subscriptions, secondary market fees.
- Long-term: the infrastructure company that defines how music royalties are priced and financed.
- Ask: Colosseum accelerator, pilot catalogs from labels, conversations with institutional allocators.

## Design notes

- Color palette: TBD (two accents + neutrals). Keep high contrast for video compression.
- Font: system sans for readability on video compression.
- One idea per slide; every slide must survive a one-second glance.
- RRE rating letters and LTV numbers on every slide that shows a catalog — they're memorable and they're the whole thesis.
