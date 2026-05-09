# RRE Engine - Formulas (demo scope)

This is the deterministic spec the demo engine implements. It's a stripped-down version of `docs/02-architecture.md` § 5. Anything marked **demo-only** is a simplified substitute that gets the right shape of answer for demo purposes; production would use the full technique named in the architecture doc.

## Layer 1 - Normalization

Input is assumed pre-normalized to monthly USD per (platform, territory). The engine validates the schema and constructs:

- `R(t)` - total monthly revenue, `t = 0 .. T`
- `R_p(t)` - revenue by platform
- `R_b(t)` - revenue by territory

**Demo-only:** no FX conversion (input assumed USD), no PDF parsing.

## Layer 2 - Decay

### Regime classification (rule-based on history length T in months)

| History T (months) | Regime |
|---|---|
| T < 24 | `new_release` |
| 24 ≤ T < 84 | `active_pop` |
| 84 ≤ T < 240 | `catalog` |
| T ≥ 240 | `evergreen` |

### Candidate models fit via non-linear least squares

**Exponential decay**

    R(t) = R₀ · exp(−λ · t)

**Power law (Pareto)**

    R(t) = R₀ · (t + 1)^(−α)

(+1 shift avoids divide-by-zero at t=0.)

**Demo-only:** Bass diffusion for new releases is classified but not fit; we fall back to exponential with a small λ. SARIMA seasonality is skipped.

### Model selection by AIC

    AIC = 2k − 2 · ln(L)

where `k` = number of fit parameters (2 for both exponential and power law), `L` = likelihood under Gaussian residuals. Lower AIC wins. Likelihood form used:

    ln(L) = −(n/2) · ln(2π · σ̂²) − (n/2)

with σ̂² = mean squared residual.

### Forecast P50 over next 60 months

Apply the winning fitted model forward: `R̂(T+1) .. R̂(T+60)`.

### Confidence bounds P10 / P90 (demo-only Weibull substitute)

Let `σ_res` = std of log-residuals from the fit. Then:

    P10(t) = R̂(t) · exp(−1.2816 · σ_res)
    P90(t) = R̂(t) · exp(+1.2816 · σ_res)

(1.2816 = inverse normal at 0.9.) This is a log-normal proxy for the Weibull survival bound the full engine would produce. Acceptable for demo visuals.

## Layer 3 - Anomaly detection (demo-only: z-score only)

On a rolling 12-month window, for each month t:

    z(t) = (R(t) − μ_roll(t)) / σ_roll(t)

Flag month t as an anomaly if `|z(t)| > 2.5`. Demo outputs only the count and magnitude; classification (durable vs. ephemeral) is out of scope (no labeled data).

## Layer 4 - Concentration and VaR

### Herfindahl-Hirschman Index

    HHI_platform  = Σ_p (R_p / R_total)²
    HHI_territory = Σ_b (R_b / R_total)²

Both in [1/N, 1]; lower = more diversified.

### Mini Monte Carlo VaR (1,000 sims)

For each sim i ∈ [1, 1000]:

1. Draw `λ'` or `α'` from `N(λ̂, se)` (fitted param ± its SE; SE estimated from covariance of the fit)
2. Compute 60-month revenue path with this param
3. Sum to `V_i` = total 60-month revenue

Then:

    VaR_95  = percentile(V, 5)
    CVaR_95 = mean(V | V < VaR_95)

**Demo-only:** does not model platform-share uncertainty or viral event probability. Just parameter uncertainty.

## Layer 5 - Rating aggregation

### Factor scores (each 0–100)

**F_stability** - forecast tightness

    F_stab = 100 · (1 − min(1, (P90[12] − P10[12]) / (2 · P50[12])))

(Uses the 12-month-ahead point to normalize spread.)

**F_concentration**

    F_conc = 100 · (1 − 0.6 · HHI_platform − 0.4 · HHI_territory)
    (clamped to [0, 100])

**F_regime** - rewards stable regimes

| Regime | F_regime |
|---|---|
| evergreen | 100 |
| catalog | 80 |
| active_pop | 60 |
| new_release | 40 |

**F_volatility** - coefficient of variation on historical R(t)

    CV = σ(R) / μ(R)
    F_vol = 100 · max(0, 1 − min(CV, 1.0))

**F_lifecycle** - rewards long catalog + artist track record

    F_life = 100 · min(1, 0.5 · catalog_age_months/120 + 0.5 · artist_age_years/20)

### Composite score

    S = 0.30·F_stab + 0.20·F_conc + 0.20·F_regime + 0.15·F_vol + 0.15·F_life

### Rating tier mapping

| Score S | Rating | Max LTV (senior) |
|---|---|---|
| S ≥ 90 | RRE-AAA | 0.80 |
| 80 ≤ S < 90 | RRE-AA | 0.70 |
| 70 ≤ S < 80 | RRE-A | 0.60 |
| 60 ≤ S < 70 | RRE-BBB | 0.50 |
| 50 ≤ S < 60 | RRE-BB | 0.30 (growth only) |
| S < 50 | RRE-B | 0.00 (ineligible) |

### Rating confidence

    confidence = clamp(0.5, 1 − (24 / T), 1.0)

where T = history length in months. Shorter history → lower confidence.

### Review due

12 months from rating date (per architecture doc).
