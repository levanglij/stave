"""Layer 5 - rating aggregation.

Produces five factor scores, a composite, a rating tier, and an LTV.
Weights and thresholds are locked in FORMULAS.md.
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np

from .schema import Rating, Regime


# Weights per FORMULAS.md / architecture doc § 5.5
W_STABILITY = 0.30
W_CONCENTRATION = 0.20
W_REGIME = 0.20
W_VOLATILITY = 0.15
W_LIFECYCLE = 0.15


# Tier thresholds → (rating, max LTV)
_TIER_TABLE = [
    (90.0, "RRE-AAA", 0.80),
    (80.0, "RRE-AA", 0.70),
    (70.0, "RRE-A", 0.60),
    (60.0, "RRE-BBB", 0.50),
    (50.0, "RRE-BB", 0.30),
    (0.0, "RRE-B", 0.00),
]


REGIME_SCORES = {
    "evergreen": 100.0,
    "catalog": 80.0,
    "active_pop": 60.0,
    "new_release": 40.0,
}


@dataclass
class Factors:
    stability: float
    concentration: float
    regime: float
    volatility: float
    lifecycle: float


def _clamp(x: float, lo: float = 0.0, hi: float = 100.0) -> float:
    return float(max(lo, min(hi, x)))


def stability_score(p10_12: float, p50_12: float, p90_12: float) -> float:
    """Tighter P10/P90 spread around P50 → higher score."""
    if p50_12 <= 0:
        return 0.0
    spread = (p90_12 - p10_12) / (2.0 * p50_12)
    return _clamp(100.0 * (1.0 - min(1.0, spread)))


def concentration_score(hhi_platform: float, hhi_territory: float) -> float:
    raw = 100.0 * (1.0 - 0.6 * hhi_platform - 0.4 * hhi_territory)
    return _clamp(raw)


def regime_score(regime: Regime) -> float:
    return REGIME_SCORES.get(regime, 50.0)


def volatility_score(series: np.ndarray) -> float:
    y = np.asarray(series, dtype=float)
    mu = float(y.mean())
    if mu <= 0:
        return 0.0
    cv = float(y.std(ddof=0) / mu)
    return _clamp(100.0 * max(0.0, 1.0 - min(cv, 1.0)))


def lifecycle_score(catalog_age_months: float, artist_age_years: float) -> float:
    raw = 100.0 * min(
        1.0,
        0.5 * (catalog_age_months / 120.0) + 0.5 * (artist_age_years / 20.0),
    )
    return _clamp(raw)


def composite_score(f: Factors) -> float:
    return (
        W_STABILITY * f.stability
        + W_CONCENTRATION * f.concentration
        + W_REGIME * f.regime
        + W_VOLATILITY * f.volatility
        + W_LIFECYCLE * f.lifecycle
    )


def tier_and_ltv(score: float) -> tuple[Rating, float]:
    """Map composite score to rating tier and recommended senior LTV."""
    for threshold, rating, ltv in _TIER_TABLE:
        if score >= threshold:
            return rating, ltv  # type: ignore[return-value]
    return "RRE-B", 0.0


def confidence(history_months: int) -> float:
    """Rating confidence in [0.5, 1.0], scaled by history length."""
    if history_months <= 0:
        return 0.5
    return float(max(0.5, min(1.0, 1.0 - (24.0 / max(history_months, 1)))))
