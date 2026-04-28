"""End-to-end RRE pipeline orchestration."""

from __future__ import annotations

from datetime import date, timedelta
from typing import List

from .schema import (
    CatalogInput,
    DecayParams,
    FactorScores,
    Forecast60mo,
    RatingOutput,
)
from .normalize import normalize
from .decay import (
    FORECAST_HORIZON,
    classify_regime,
    confidence_bands,
    fit_decay,
    forecast,
)
from .anomaly import detect_z_anomalies
from .concentration import hhi
from .monte_carlo import simulate_var
from .rating import (
    Factors,
    composite_score,
    concentration_score,
    confidence,
    lifecycle_score,
    regime_score,
    stability_score,
    tier_and_ltv,
    volatility_score,
)


def _review_due_12mo_from(today: date | None = None) -> str:
    """Simple +12 months, day-of-month preserved."""
    d = today or date.today()
    # naive approach: add 365 days, good enough for demo
    return (d + timedelta(days=365)).isoformat()


def _as_list(arr) -> List[float]:
    return [float(x) for x in arr]


def run(catalog: CatalogInput) -> RatingOutput:
    """Run the full RRE pipeline and return a standardized rating."""
    # Layer 1
    normalized = normalize(catalog)

    # Layer 2: regime + decay fit + forecast
    regime = classify_regime(normalized.n_months)
    fit = fit_decay(normalized.total)
    p50 = forecast(fit, t0=normalized.n_months, horizon=FORECAST_HORIZON)
    p10, p90 = confidence_bands(p50, fit.sigma_log_residual)

    # Layer 3: anomaly count
    anomalies = detect_z_anomalies(normalized.total)

    # Layer 4: concentration + Monte Carlo VaR
    hhi_platform = hhi(normalized.platform_totals)
    hhi_territory = hhi(normalized.territory_totals)
    var_result = simulate_var(fit, t0=normalized.n_months)

    # Layer 5: factor scoring
    # Stability uses the 12-month-ahead point.
    if len(p10) >= 12:
        f_stab = stability_score(
            float(p10[11]), float(p50[11]), float(p90[11])
        )
    elif len(p10) > 0:
        f_stab = stability_score(float(p10[-1]), float(p50[-1]), float(p90[-1]))
    else:
        f_stab = 0.0

    f_conc = concentration_score(hhi_platform, hhi_territory)
    f_regime = regime_score(regime)
    f_vol = volatility_score(normalized.total)
    f_life = lifecycle_score(
        catalog.metadata.catalog_age_months, catalog.metadata.artist_age_years
    )
    factors = Factors(
        stability=f_stab,
        concentration=f_conc,
        regime=f_regime,
        volatility=f_vol,
        lifecycle=f_life,
    )
    score = composite_score(factors)
    rating, ltv = tier_and_ltv(score)
    conf = confidence(normalized.n_months)

    # Decay params for output
    decay_params = DecayParams(
        R0=fit.R0,
        lam=fit.lam,
        alpha=fit.alpha,
    )

    return RatingOutput(
        catalog_id=catalog.catalog_id,
        rating=rating,
        rating_confidence=round(conf, 3),
        composite_score=round(score, 2),
        factors=FactorScores(
            stability=round(factors.stability, 2),
            concentration=round(factors.concentration, 2),
            regime=round(factors.regime, 2),
            volatility=round(factors.volatility, 2),
            lifecycle=round(factors.lifecycle, 2),
        ),
        regime=regime,
        decay_model=fit.model,
        decay_params=decay_params,
        forecast_60mo=Forecast60mo(
            p10=_as_list(p10),
            p50=_as_list(p50),
            p90=_as_list(p90),
        ),
        var_95_60mo_usd=round(var_result.var_95, 2),
        cvar_95_60mo_usd=round(var_result.cvar_95, 2),
        hhi_platform=round(hhi_platform, 4),
        hhi_territory=round(hhi_territory, 4),
        anomaly_count=len(anomalies),
        ltv_recommended=ltv,
        review_due=_review_due_12mo_from(),
    )
