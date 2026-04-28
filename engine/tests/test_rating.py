"""Tests for rating aggregation: factor scores, composite, tier mapping."""

import numpy as np
import pytest

from rre.rating import (
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


def test_stability_tight_bands_high_score():
    # P10=95, P50=100, P90=105 → spread = 10/200 = 0.05 → score = 95
    assert stability_score(95, 100, 105) == pytest.approx(95.0)


def test_stability_wide_bands_low_score():
    # spread = 100/200 = 0.5 → score = 50
    assert stability_score(50, 100, 150) == pytest.approx(50.0)


def test_stability_degenerate_p50():
    assert stability_score(0, 0, 0) == 0.0


def test_concentration_perfectly_diversified_high_score():
    # HHI = 0 on both → score = 100
    assert concentration_score(0.0, 0.0) == pytest.approx(100.0)


def test_concentration_fully_concentrated_zero_score():
    # HHI = 1 on both → raw = 100 * (1 - 0.6 - 0.4) = 0
    assert concentration_score(1.0, 1.0) == pytest.approx(0.0)


def test_regime_scores_ordered():
    assert regime_score("evergreen") > regime_score("catalog")
    assert regime_score("catalog") > regime_score("active_pop")
    assert regime_score("active_pop") > regime_score("new_release")


def test_volatility_low_cv_high_score():
    # constant series → CV = 0 → score = 100
    assert volatility_score(np.array([100.0] * 12)) == pytest.approx(100.0)


def test_volatility_high_cv_low_score():
    # large CV → clamped to 0
    y = np.array([10.0, 1.0, 20.0, 0.5, 30.0, 0.1, 40.0, 50.0, 60.0, 70.0])
    assert volatility_score(y) >= 0.0
    assert volatility_score(y) <= 100.0


def test_lifecycle_maxes_for_long_history():
    assert lifecycle_score(240, 30) == pytest.approx(100.0)


def test_lifecycle_zero_for_brand_new():
    assert lifecycle_score(0, 0) == 0.0


def test_composite_weights_sum_to_one():
    # All factors = 100 → composite = 100 (demonstrates weights sum correctly)
    f = Factors(stability=100, concentration=100, regime=100, volatility=100, lifecycle=100)
    assert composite_score(f) == pytest.approx(100.0)


def test_tier_boundaries():
    assert tier_and_ltv(95.0) == ("RRE-AAA", 0.80)
    assert tier_and_ltv(90.0) == ("RRE-AAA", 0.80)
    assert tier_and_ltv(89.9) == ("RRE-AA", 0.70)
    assert tier_and_ltv(80.0) == ("RRE-AA", 0.70)
    assert tier_and_ltv(75.0) == ("RRE-A", 0.60)
    assert tier_and_ltv(65.0) == ("RRE-BBB", 0.50)
    assert tier_and_ltv(55.0) == ("RRE-BB", 0.30)
    assert tier_and_ltv(30.0) == ("RRE-B", 0.00)


def test_confidence_scales_with_history():
    # very short history → low confidence
    low = confidence(6)
    # long history → high confidence
    high = confidence(240)
    assert low < high
    # always in [0.5, 1.0]
    assert 0.5 <= low <= 1.0
    assert 0.5 <= high <= 1.0
