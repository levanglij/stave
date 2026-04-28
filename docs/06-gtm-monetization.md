# 06 — Go-to-Market & Monetization

## Target users by phase

### Phase 1 — Solana-native indie musicians
- Channel: Solana-native artist communities (Audius-adjacent creators, Solana ecosystem Discords, crypto-curious artist collectives on Twitter/X).
- Hook: upfront capital with no middleman, no label deal, no dilution.
- Acquisition cost: low — community-led, word of mouth, a handful of high-visibility launches.

### Phase 2 — Small labels and collectives
- Channel: direct outreach to indie labels already experimenting with Web3.
- Hook: treat entire catalogs as a portfolio of tokenized rights.
- Harder sell — requires legal comfort and a track record.

### Phase 3 — Aggregators and distributors
- Channel: B2B. Stream-of-revenue feeds from DistroKid-like distributors directly deposit into royalty vaults.
- Hook: automated, transparent payout rails.

## Monetization

### MVP: no fees
Keep the demo clean. Do not introduce fees in the hackathon build; it adds surface area and complicates the math on screen.

### Post-MVP fee options

1. **Primary sale fee**: 1–2% of share sale proceeds, skimmed on `buy_shares`. Predictable, aligned with volume.
2. **Claim fee**: 0.5% of claimed royalty, skimmed on `claim_royalty`. Predictable, scales with revenue, but adds a cost users feel every time they claim — bad psychology.
3. **Listing fee (flat)**: small flat SOL fee to create a listing. Spam protection more than revenue.

**Recommended mix**: primary sale fee (1.5%) + flat listing fee (0.05 SOL). Skip the claim fee.

### Protocol treasury
Fees route to a multisig-controlled treasury PDA. Post-MVP: governance decides allocation (grants, audits, buybacks).

## Unit economics (back-of-envelope)

Assumptions:
- Average work raises $500 in primary sale (5,000 shares × $0.10).
- 1.5% primary fee = $7.50 per work.
- Average work generates $200 in royalties year 1 — zero additional protocol revenue under recommended fee mix.

To reach $100k ARR at these assumptions: ~13,000 primary sales. That's demanding but achievable if aggregator deals land in phase 3.

**Sensitivity**: raising primary fee to 3% halves the sales needed but risks pricing out small works. 1.5% is a defensible starting point.

## Moat and defensibility

- **Liquidity network effects** — more listings attract more buyers, and vice versa.
- **Integrations** — being the default share primitive for royalty participation (Token-2022 with known extensions) makes Stave shares easy to plug into DEXs, lending, prediction markets.
- **Brand trust** — being early with a clean, transparent model while competitors are mired in legal theater.

## Regulatory stance

Tokenized royalty participation is almost certainly a security in the US and most jurisdictions. MVP is a technical demo, not a live financial product. Any real-world launch requires:
- Legal wrapper per work (SPV / tokenized contract rights)
- Regulated venue for US persons, or explicit geofencing
- KYC where required

The MVP pitch should be honest about this: it's a payments + ownership rails play, and the legal wrapper is part of the Phase 2/3 roadmap.
