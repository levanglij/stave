# RRE Engine - demo implementation

A lightweight Python implementation of the Royalty Risk Engine (see `docs/02-architecture.md` § 5 for the full vision). This is a **demo-grade** prototype built for the Solana Frontier Hackathon submission - enough to demonstrate the concept and produce real ratings on real-ish data, not a production forecasting product.

## What's implemented

| Layer | Production design (architecture doc) | This demo implements |
|---|---|---|
| L1 Normalization | FX, PDF parsing, platform reconciliation | Schema validation + monthly pivot |
| L2 Decay | Exponential, power-law, Bass, Weibull, SARIMA, AIC select | Exponential + power-law fit, AIC select, log-normal P10/P90 bands |
| L3 Anomaly | PELT, Z-score, LSTM autoencoder + XGBoost classifier | Z-score only (no classification) |
| L4 Concentration | HHI + 10K Monte Carlo + stress scenarios | HHI + 1K Monte Carlo (param uncertainty only) |
| L5 Rating | 5-factor composite, tier mapping, confidence | Same - fully implemented per FORMULAS.md |

See [`FORMULAS.md`](./FORMULAS.md) for the exact formulas used.

## Install

```bash
cd engine
pip install -r requirements.txt
```

(Requires Python 3.10+.)

## Run one rating

```bash
PYTHONPATH=src python3 -m rre.cli data/catalog_evergreen-001.json
```

Prints a JSON rating to stdout.

## Run the full demo

Generate the 5 synthetic catalogs and pre-compute their ratings:

```bash
python3 scripts/generate_catalogs.py
python3 scripts/precompute_outputs.py
```

Output (values will match these to a seed):

```
catalog_id             rating    score regime       decay         HHI-p  HHI-b   LTV
------------------------------------------------------------------------------------
active-pop-001         RRE-BBB    61.1 active_pop   exponential   0.380  0.282  0.50
balanced-001           RRE-BBB    68.8 catalog      power_law     0.262  0.227  0.50
evergreen-001          RRE-AA     85.3 evergreen    power_law     0.210  0.185  0.70
high-hhi-001           RRE-BB     55.1 active_pop   exponential   0.904  0.850  0.30
new-release-001        RRE-B      40.6 new_release  exponential   0.447  0.339  0.00
```

Per-catalog rating JSONs land in `outputs/<catalog_id>.rating.json`. The frontend reads these for the demo UI.

## Run tests

```bash
PYTHONPATH=src python3 -m pytest tests/ -v
```

31 tests cover HHI edge cases, decay fit parameter recovery, AIC model selection, factor scoring, tier boundaries, and end-to-end pipeline output invariants (P10 ≤ P50 ≤ P90, CVaR ≤ VaR, valid ratings).

## Repo layout

```
engine/
├── README.md               - this file
├── FORMULAS.md             - deterministic formula spec
├── requirements.txt
├── src/rre/
│   ├── schema.py           - pydantic data contracts
│   ├── normalize.py        - L1
│   ├── decay.py            - L2
│   ├── anomaly.py          - L3
│   ├── concentration.py    - L4a
│   ├── monte_carlo.py      - L4b
│   ├── rating.py           - L5
│   ├── pipeline.py         - end-to-end orchestration
│   └── cli.py              - python -m rre.cli <catalog.json>
├── scripts/
│   ├── generate_catalogs.py
│   └── precompute_outputs.py
├── data/                   - 5 synthetic catalogs
├── outputs/                - precomputed ratings JSON
└── tests/
```

## Data contract

Input catalog JSON:

```json
{
  "catalog_id": "evergreen-001",
  "metadata": {
    "title": "Midnight Theme",
    "artist": "Ava Lennox",
    "genre": "jazz",
    "catalog_age_months": 252,
    "artist_age_years": 35
  },
  "history": [
    { "month": "2006-04", "platform": "spotify", "territory": "US", "revenue_usd": 2201.18 },
    ...
  ]
}
```

Output: see `outputs/evergreen-001.rating.json` for a complete example.

## Honest limits

This engine is demo-grade. Known gaps versus the production architecture:

- **No PRO data.** The demo runs on synthetic catalogs. Wiring in real PRO data, distributor APIs, and OAuth streaming pulls is Phase 1 of the production roadmap (architecture doc § 9).
- **No event classifier.** Layer 3 detects anomalies but does not classify them as durable / temporary / structural-break. That requires labeled training data from the PRO catalog, which does not yet exist for model training.
- **Parameter-only Monte Carlo.** Production Monte Carlo varies platform shares, viral event probability, and macro streaming growth. The demo varies only the primary decay parameter.
- **No PELT, LSTM, SARIMA, Weibull.** These are named in the architecture doc and reserved for the production build. Confidence bands use a log-normal proxy for the Weibull survival bound.
- **No Bass diffusion fit for new releases.** New releases are classified correctly but fall back to exponential fit.

These gaps are intentional and the engine output JSON does not claim any of them.

## What's next - missing sub-engines

Full prioritized gap analysis lives in [`docs/08-engine-roadmap.md`](../docs/08-engine-roadmap.md). Summary of the sub-engines still to build, with architecture-doc reference and rough calendar effort for one full-time engineer (S = 1–3 days, M = 1–2 weeks, L = 3–6 weeks, XL = 2–4 months).

**Tier 1 - critical path to rating any real catalog**

| Engine | Arch ref | Effort |
|---|---|---|
| PRO data adapter | § 3, § 4.1 | XL |
| Cross-validation / audit engine | § 4.3 | M |
| Royalty statement PDF parser | § 4.3, § 5.1 | L |
| Spotify for Artists OAuth pull | § 4.3 | M |
| Apple Music for Artists OAuth pull | § 4.3 | M |
| Distributor API connectors (per partner) | § 4.2 | L |
| Tier 1/2/3 territory mapper | § 5.1 | S |
| FX conversion engine | § 5.1 | S |

**Tier 2 - required for forecasts to be defensible**

| Engine | Arch ref | Effort |
|---|---|---|
| Weibull survival model (proper P10 floor) | § 5.2 | M |
| SARIMA seasonality decomposer | § 5.2 | M |
| Bass diffusion fitter (new release) | § 5.2 | M |
| Modified power-law with floor (evergreen) | § 5.2 | S |
| PELT change-point detector | § 5.3 | M |
| IQR outlier detector | § 5.3 | S |
| LSTM autoencoder | § 5.3 | L |
| Full Monte Carlo (10K sims, multi-factor uncertainty) | § 5.4 | M |
| Stress scenario engine (Spotify exit / algo / reputational) | § 5.4 | S |

**Tier 3 - classifies events, not just detects them**

| Engine | Arch ref | Effort |
|---|---|---|
| Event classifier (XGBoost / LightGBM) | § 5.3 Stage 2 | M model + XL data |
| Labeled training data pipeline | § 5.3 Stage 2 | L |
| Sync placement detector | § 5.3 (92% signal) | L |
| Editorial playlist tracker | § 5.3 (88%) | M |
| Shazam volume monitor | § 5.3 (74%) | S |
| TikTok sound usage tracker | § 5.3 (61%) | M |
| Press / media NLP scanner | § 5.3 (52%) | M |
| Sentiment monitor (downside early-warning) | § 5.3 (34%) | M |

**Tier 4 - SRFP marketplace settlement**
Tranche structuring, cash flow waterfall, yield calculator, on-chain settlement program, investor portal, KYC/accreditation, re-rating triggers, investor reporting. See the roadmap doc for the full table.

**Tier 5 - long-horizon institutional products**
Portfolio funds, ABS, index, derivatives, insurance.

### If I had to pick four engines next

1. **PRO data adapter** - without it, every claim about ground truth is a slide.
2. **Cross-validation / audit + statement parser + one OAuth pull** - without these, no real catalog onboards.
3. **Event classifier with labeled training data** - ratings aren't trustworthy long-term until we can classify why a spike happened.
4. **Tranche structuring + cash flow waterfall** - ratings exist but no SRFP can settle a deal without these.
