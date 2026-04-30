# 09 — Engine Roadmap

> Honest gap analysis between what the architecture (`docs/02-architecture.md`) describes and what is actually built today, plus a prioritized list of every missing sub-engine needed to evaluate IP for institutional investors.

## TL;DR

Roughly **8–12% of the full architecture is implemented** (was 5–8% pre-Day-3). That is consistent with the architecture's own phasing (§ 9 budgets 9 months for Phase 1 alone). The hackathon submission ships a credible MVP slice — full 5-instruction Anchor program, 15 passing tests, the demo-grade RRE engine, and a deployed institutional-style frontend — and this document tracks what closes the gap from MVP to a real institutional product.

## Effort sizing

T-shirt estimates assume one experienced engineer working full-time. Concurrency multiplies effort, not calendar.

| Size | Calendar effort |
|---|---|
| **S** | 1–3 days |
| **M** | 1–2 weeks |
| **L** | 3–6 weeks |
| **XL** | 2–4 months |
| **XXL** | 6+ months (often gated by external partnerships, not engineering) |

## Status by architecture section

| Architecture section | % built | Notes |
|---|---|---|
| § 3 GERA partnership | 0% | Partnership formalizing post-hackathon; no GERA API integration yet; structural/business item |
| § 4.1 PRO direct data feed | 0% | No adapter, no schedule, no schema mapping |
| § 4.2 Distributor API partnerships | 0% | No commercial deals; no integrations |
| § 4.3 Minting model (OAuth + statements + analytics) | 0% | All three sub-channels missing |
| § 5.1 Layer 1 normalization | 25% | Schema + monthly pivot only; FX, PDF parser, territory tiers, income-type tagging missing |
| § 5.2 Layer 2 decay | 35% | Exponential + power-law fit + AIC select; Bass, Weibull, SARIMA, modified-PL all missing |
| § 5.3 Layer 3 anomaly + classification | 10% | Rolling z-score only; PELT, LSTM, full classifier, all 6 external signals missing |
| § 5.4 Layer 4 concentration + VaR | 30% | HHI + 1K MC (parameter uncertainty only); 10K MC, stress scenarios, platform/viral/macro vectors missing |
| § 5.5 Layer 5 rating aggregation | 90% | Full 5-factor composite, tier mapping, LTV, confidence — fully implemented per FORMULAS.md |
| § 6 SRFP marketplace + tranches | 30% | Single-class on-chain MVP shipped: 5 Anchor instructions (`create_work`, `list_shares`, `buy_shares`, `deposit_royalty`, `claim_royalty`), 15/15 passing local tests, devnet deploy queued. Investor UI live at stave-five.vercel.app with 8 listings + 4 thematic indices + per-catalog returns calculator + real Phantom/Solflare wallet flow. Tranche structuring (senior/mezz/growth) and monthly distribution reporting still missing. |
| § 7 Institutional products | 0% | Funds, ABS, index, derivatives — explicit Phase 3–4 scope |
| § 8 Revenue model | 0% | No fees collected (no marketplace) |
| § 9 GTM Phase 1 targets | ~8% | Demo engine on synthetic data, 8 rated catalogs visible on the live frontend, on-chain MVP locally tested. Still missing: GERA integration, 50–100 catalog backtest, event classifier, ±15% MAE validation. |

## Missing engines by category (prioritized)

### Tier 1 — Critical path to rating any real catalog

These block the platform from issuing a rating that an institutional investor would accept.

| Engine | Spec ref | Effort | Notes |
|---|---|---|---|
| **PRO data adapter** | § 3, § 4.1 | XL | The moat. Without this the "ground truth" claim collapses. Schema mapping, scheduled sync, change capture. |
| **Cross-validation / audit engine** | § 4.3 (Self-Policing) | M | Reconciles PRO ⇄ distributor ⇄ OAuth pull ⇄ statement; flags inconsistencies; gates ratings. |
| **Royalty statement PDF parser** | § 4.3, § 5.1 | L | Document intelligence: extracts revenue line items, classifies income type (mech / sync / perf / neighboring), reconciles to API. |
| **Spotify for Artists OAuth pull** | § 4.3 | M | Read-only OAuth flow, token refresh, data model. |
| **Apple Music for Artists OAuth pull** | § 4.3 | M | Same shape, different API. |
| **Distributor API connectors** (DistroKid, TuneCore, CD Baby, Amuse) | § 4.2 | L per partner | Each is a separate auth + schema + rate-limit story. Commercial deal precedes engineering. |
| **Tier 1/2/3 territory mapper** | § 5.1 | S | Country → bucket lookup; trivial code, but currently missing. |
| **FX conversion engine** | § 5.1 | S | TTM average rate per source currency → USD. ECB/IMF feed. |

### Tier 2 — Required for forecasts to be defensible

These elevate the demo-grade engine to something an underwriter would sign off on.

| Engine | Spec ref | Effort | Notes |
|---|---|---|---|
| **Weibull survival model** | § 5.2 | M | Proper P10 floor estimation that underwrites senior tranche. Demo currently uses a log-normal proxy. |
| **SARIMA seasonality decomposer** | § 5.2 | M | Strips Q4 / January / festival patterns; reapplies on forecasts. |
| **Bass diffusion fitter** (new release) | § 5.2 | M | S-curve adoption then decay; classified now but falls back to exponential. |
| **Modified power-law with floor** (evergreen) | § 5.2 | S | Asymptote-aware variant for 20+ yr catalogs. |
| **PELT change-point detector** | § 5.3 | M | `ruptures` lib; refits decay from new baseline on confirmed shifts. |
| **IQR outlier detector** | § 5.3 | S | Complements rolling z-score for short viral months. |
| **LSTM autoencoder** | § 5.3 | L | Multi-dimensional anomalies (e.g., Spotify down + YouTube up). Per-catalog training. |
| **Full Monte Carlo (10K sims)** | § 5.4 | M | Adds platform-share uncertainty, viral event probability, macro streaming growth scenarios. Currently demo runs 1K with parameter-only uncertainty. |
| **Stress scenario engine** | § 5.4 | S | Three named scenarios: Spotify exit, major DSP algo change, artist reputational event. Hardcoded severities. |

### Tier 3 — Required for events to be classified, not just detected

Layer 3 Stage 2 — the gradient boosted classifier and its 6 input signals. Without this, the engine flags "something happened" but cannot say whether it matters for the long-term forecast.

| Engine | Spec ref | Effort | Notes |
|---|---|---|---|
| **Event classifier (XGBoost / LightGBM)** | § 5.3 Stage 2 | M (model) + XL (data) | Model itself is small; the bottleneck is 500–1,000 labeled historical events from PRO data. |
| **Labeled training data pipeline** | § 5.3 Stage 2 | L | Mines PRO catalog history, tags durable / temporary / structural-break against realized 6-mo outcomes. |
| **Sync placement detector** | § 5.3 (sync signal, 92% reliable) | L | Confirmed sync placements (TV/film/ad). Sources: Tunefind, IMDB, OST databases, music supervisor partnerships. |
| **Editorial playlist tracker** | § 5.3 (playlist signal, 88%) | M | Spotify / Apple editorial adds & drops; algorithmic ripple monitoring. Chartmetric exposes most of this. |
| **Shazam volume monitor** | § 5.3 (74%) | S | Chartmetric / direct partnership. |
| **TikTok sound usage tracker** | § 5.3 (61%) | M | TikTok Creative Insights API + scraping; high noise. |
| **Press / media NLP scanner** | § 5.3 (52%) | M | News + entity recognition; corroborating signal only. |
| **Sentiment monitor** | § 5.3 (34%, downside early-warning) | M | News + Reddit + Twitter; entity-aware; 48–72h lead on reputational events. |

### Tier 4 — Required for the SRFP marketplace to actually settle deals

Without these, ratings exist but no capital can be raised against them.

| Engine | Spec ref | Effort | Notes |
|---|---|---|---|
| **Tranche structuring engine** | § 6.1 | M | Takes RRE rating + CVaR + P50 → senior/mezz/growth cap table with sizes and yield bands. |
| **Cash flow waterfall engine** | § 6.1 | M | Priority-of-payment logic when royalties hit the vault: senior first to hurdle, then mezz, then growth. On-chain or off-chain depending on settlement design. |
| **Yield / coupon calculator** | § 6.1 | S | Per-tranche target return given catalog risk + market reference rates. |
| **On-chain settlement program** | § 6.1, § 6.3 | L | Solana program (separate from MVP fractionalization) that holds the vault and routes distributions per the waterfall. |
| **Investor portal (browse + filter + invest)** | § 6.2 | L | Frontend over the SRFP. Filters by rating tier, regime, HHI, geography. |
| **Re-rating trigger engine** | § 5.5, § 6.3 | S | 12-month auto-review + event-driven on Layer 3 detection. |
| **Investor reporting engine** | § 6.3 | M | Monthly distribution reports, quarterly portfolio summaries, alert emails on re-rating. |
| **KYC / accreditation / jurisdiction routing** | implicit, § 12 regulatory | L | Onfido or similar; required before raising any capital. |

### Tier 5 — Long-horizon institutional product engines

Not on the critical path until a primary market is established.

| Engine | Spec ref | Effort | Notes |
|---|---|---|---|
| **Portfolio construction engine** | § 7.1 | M | For Royalty Portfolio Funds: target HHI < 0.15, genre correlation matrix, blended P10 floor. |
| **ABS structuring engine** | § 7.2 | XL | SPV cash flow modeling, bond sizing, surveillance reporting. Done in partnership with a bank. |
| **Index calculation engine** | § 7.3 | L | Music Royalty Income Index by tier / genre / lifecycle. |
| **Derivative pricing engine** | § 7.4 | XL | Royalty floor option, platform-concentration swap. Requires deep liquidity that doesn't yet exist. |
| **Insurance underwriting engine** | § 7.4 | XL | Revenue floor coverage products. Regulator-gated. |

## Phase alignment

Mapping the missing engines to the architecture's GTM phases (§ 9):

### Phase 1 — Risk Engine Development (architecture: months 1–9)
**Goal:** ±15% MAE forecast accuracy at 12 months on 50–100 backtested catalogs.
**Engines required from above:** all of Tier 1, all of Tier 2, all of Tier 3, plus the backtest harness.

### Phase 2 — Controlled Financing Launch (months 10–18)
**Goal:** First 5–10 structured financings with accredited investors; 2+ distributor partnerships live.
**Engines required:** all of Tier 4. KYC/accreditation engine is a hard gate.

### Phase 3 — Institutional Partnerships (months 19–30)
**Goal:** $100M+ financed, first portfolio fund at $20M+ AUM.
**Engines required:** Portfolio construction engine (Tier 5).

### Phase 4 — Structured Products & Market Infrastructure (months 31+)
**Engines required:** ABS structuring, index, derivatives, insurance — remaining Tier 5.

## What the hackathon submission actually claims

To avoid overclaim risk in pitch and deck:

- **Demo-grade RRE prototype** is honest. We have something real.
- **"Risk engine prototype"** is honest framing. **"RRE production engine"** is not.
- The five-layer architecture is described in `docs/02-architecture.md`. The pitch deck references it as the platform direction.
- The GERA partnership is the moat narrative. It is correctly framed as the moat — the data integration itself is Phase 1 work, not built.
- The Solana MVP demonstrates the on-chain fractionalization and royalty distribution layer that the SRFP marketplace will sit on top of.

## Critical-path summary

If you had to pick four engines that unlock the most value next:

1. **PRO data adapter** — without it, every claim about ground truth is a slide.
2. **Cross-validation / audit engine + statement parser + at least one OAuth pull** — without these, no real catalog can be onboarded.
3. **Event classifier (with labeled training data)** — without it, ratings can't be trusted long-term because the engine can't say which spikes matter.
4. **Tranche structuring + cash flow waterfall** — without these, ratings exist but no SRFP marketplace can actually settle a deal.

Everything else accelerates accuracy or unlocks adjacent products. These four are what gates the platform from "concept demo" to "raises real capital."
