"""Tests for decay fitting and regime classification."""

import numpy as np
import pytest

from rre.decay import (
    classify_regime,
    confidence_bands,
    fit_decay,
    forecast,
)


def test_regime_classification():
    assert classify_regime(12) == "new_release"
    assert classify_regime(23) == "new_release"
    assert classify_regime(24) == "active_pop"
    assert classify_regime(50) == "active_pop"
    assert classify_regime(84) == "catalog"
    assert classify_regime(150) == "catalog"
    assert classify_regime(240) == "evergreen"
    assert classify_regime(300) == "evergreen"


def test_exponential_fit_recovers_lambda():
    # Generate noiseless exponential series with known lambda
    lam_true = 0.04
    R0_true = 10_000.0
    t = np.arange(60, dtype=float)
    y = R0_true * np.exp(-lam_true * t)

    fit = fit_decay(y)
    # On clean exponential data, exponential should beat power law by AIC
    assert fit.model == "exponential"
    assert fit.lam == pytest.approx(lam_true, rel=0.05)
    assert fit.R0 == pytest.approx(R0_true, rel=0.05)


def test_power_law_fit_recovers_alpha():
    alpha_true = 0.6
    R0_true = 20_000.0
    t = np.arange(120, dtype=float)
    y = R0_true * np.power(t + 1.0, -alpha_true)

    fit = fit_decay(y)
    assert fit.model == "power_law"
    assert fit.alpha == pytest.approx(alpha_true, rel=0.05)
    assert fit.R0 == pytest.approx(R0_true, rel=0.05)


def test_aic_selects_power_law_on_heavy_tail():
    """Power-law data with long tail should not be won by exponential."""
    alpha_true = 0.4
    R0_true = 15_000.0
    t = np.arange(180, dtype=float)
    y = R0_true * np.power(t + 1.0, -alpha_true)

    fit = fit_decay(y)
    assert fit.model == "power_law"


def test_forecast_length_and_monotonicity():
    t = np.arange(36, dtype=float)
    y = 10_000 * np.exp(-0.03 * t)
    fit = fit_decay(y)
    fc = forecast(fit, t0=36, horizon=60)
    assert len(fc) == 60
    # exponential decay → monotonic down
    assert np.all(np.diff(fc) < 0)


def test_confidence_bands_sandwich_p50():
    p50 = np.array([1000.0, 900.0, 810.0])
    p10, p90 = confidence_bands(p50, sigma_log=0.2)
    assert np.all(p10 < p50)
    assert np.all(p50 < p90)
    # symmetric on log scale → p10 * p90 ≈ p50²
    assert np.allclose(p10 * p90, p50 ** 2, rtol=1e-6)
