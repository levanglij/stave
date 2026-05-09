"""Layer 2 - decay modeling.

Fits exponential and power-law models to the revenue series, picks the
better by AIC, and produces a 60-month forecast with P10/P50/P90 bounds.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import List, Literal, Optional

import numpy as np
from scipy.optimize import curve_fit


Regime = Literal["new_release", "active_pop", "catalog", "evergreen"]
DecayModelName = Literal["exponential", "power_law"]


FORECAST_HORIZON = 60  # months
P10_Z = 1.2816  # inverse normal at 0.9 → used for ±1.2816·σ log-normal band


def classify_regime(n_months: int) -> Regime:
    """Rule-based regime classification on history length."""
    if n_months < 24:
        return "new_release"
    if n_months < 84:
        return "active_pop"
    if n_months < 240:
        return "catalog"
    return "evergreen"


@dataclass
class DecayFit:
    model: DecayModelName
    R0: float
    # Present for exponential:
    lam: Optional[float]
    # Present for power law:
    alpha: Optional[float]
    aic: float
    sigma_log_residual: float  # std of log-residuals, used for confidence bands
    param_se: float  # std error of the primary decay parameter

    def predict(self, t_array: np.ndarray) -> np.ndarray:
        t = np.asarray(t_array, dtype=float)
        if self.model == "exponential":
            assert self.lam is not None
            return self.R0 * np.exp(-self.lam * t)
        assert self.alpha is not None
        return self.R0 * np.power(t + 1.0, -self.alpha)


def _exp_model(t, R0, lam):
    return R0 * np.exp(-lam * t)


def _power_model(t, R0, alpha):
    return R0 * np.power(t + 1.0, -alpha)


def _aic_gaussian(residuals: np.ndarray, k: int) -> float:
    """AIC under Gaussian residual likelihood."""
    n = len(residuals)
    if n == 0:
        return float("inf")
    sigma2 = float(np.mean(residuals ** 2))
    if sigma2 <= 0:
        sigma2 = 1e-12
    ln_L = -(n / 2.0) * np.log(2.0 * np.pi * sigma2) - (n / 2.0)
    return 2.0 * k - 2.0 * ln_L


def _fit_one(
    t: np.ndarray,
    y: np.ndarray,
    model_fn,
    p0,
    bounds,
    model_name: DecayModelName,
) -> Optional[DecayFit]:
    try:
        popt, pcov = curve_fit(model_fn, t, y, p0=p0, bounds=bounds, maxfev=5000)
    except (RuntimeError, ValueError):
        return None

    y_hat = model_fn(t, *popt)
    residuals = y - y_hat
    aic = _aic_gaussian(residuals, k=len(popt))

    # log-residual sigma for confidence bands (guard against zero/negative)
    eps = 1e-6
    y_safe = np.maximum(y, eps)
    y_hat_safe = np.maximum(y_hat, eps)
    log_resid = np.log(y_safe) - np.log(y_hat_safe)
    sigma_log = float(np.std(log_resid))

    R0 = float(popt[0])
    param_se = float(np.sqrt(np.diag(pcov))[1]) if pcov.shape[0] > 1 else 0.0

    if model_name == "exponential":
        return DecayFit(
            model="exponential",
            R0=R0,
            lam=float(popt[1]),
            alpha=None,
            aic=float(aic),
            sigma_log_residual=sigma_log,
            param_se=param_se,
        )
    return DecayFit(
        model="power_law",
        R0=R0,
        lam=None,
        alpha=float(popt[1]),
        aic=float(aic),
        sigma_log_residual=sigma_log,
        param_se=param_se,
    )


def fit_decay(total_series: np.ndarray) -> DecayFit:
    """Fit exponential + power law, return the one with lower AIC.

    Falls back gracefully: if both fail, returns a flat fit using mean.
    """
    y = np.asarray(total_series, dtype=float)
    if len(y) < 3:
        # degenerate; return exponential zero-decay at mean
        return DecayFit(
            model="exponential",
            R0=float(max(y.mean(), 1e-6)) if len(y) else 1.0,
            lam=0.0,
            alpha=None,
            aic=float("inf"),
            sigma_log_residual=0.3,
            param_se=0.0,
        )

    t = np.arange(len(y), dtype=float)
    y0 = float(max(y[0], 1e-6))

    fits: List[DecayFit] = []

    exp_fit = _fit_one(
        t,
        y,
        _exp_model,
        p0=[y0, 0.01],
        bounds=([1e-6, 0.0], [np.inf, 5.0]),
        model_name="exponential",
    )
    if exp_fit is not None:
        fits.append(exp_fit)

    power_fit = _fit_one(
        t,
        y,
        _power_model,
        p0=[y0, 0.5],
        bounds=([1e-6, 0.0], [np.inf, 5.0]),
        model_name="power_law",
    )
    if power_fit is not None:
        fits.append(power_fit)

    if not fits:
        return DecayFit(
            model="exponential",
            R0=float(max(y.mean(), 1e-6)),
            lam=0.0,
            alpha=None,
            aic=float("inf"),
            sigma_log_residual=0.3,
            param_se=0.0,
        )

    fits.sort(key=lambda f: f.aic)
    return fits[0]


def forecast(fit: DecayFit, t0: int, horizon: int = FORECAST_HORIZON) -> np.ndarray:
    """Forecast revenue for horizon months starting at month t0."""
    t_future = np.arange(t0, t0 + horizon, dtype=float)
    return fit.predict(t_future)


def confidence_bands(p50: np.ndarray, sigma_log: float) -> tuple[np.ndarray, np.ndarray]:
    """Log-normal confidence bands around P50 using residual sigma."""
    p10 = p50 * np.exp(-P10_Z * sigma_log)
    p90 = p50 * np.exp(+P10_Z * sigma_log)
    return p10, p90
