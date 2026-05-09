"""Layer 4b - Mini Monte Carlo VaR (1,000 sims).

Draws the primary decay parameter from N(estimate, SE), integrates the
resulting forecast, and returns VaR and CVaR at the 95% confidence level.
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np

from .decay import DecayFit, FORECAST_HORIZON


N_SIMS = 1_000


@dataclass
class VarResult:
    var_95: float
    cvar_95: float


def simulate_var(fit: DecayFit, t0: int, seed: int = 42) -> VarResult:
    """Monte Carlo 60-month revenue total under parameter uncertainty."""
    rng = np.random.default_rng(seed)
    t_future = np.arange(t0, t0 + FORECAST_HORIZON, dtype=float)

    # SE is in raw units; clamp to a floor to avoid degenerate zero-variance draws
    if fit.model == "exponential":
        assert fit.lam is not None
        center = float(fit.lam)
        se = max(fit.param_se, abs(center) * 0.10, 1e-4)
        draws = rng.normal(loc=center, scale=se, size=N_SIMS)
        # clip to nonnegative decay rate
        draws = np.clip(draws, 0.0, None)
        # broadcast: (N_SIMS, horizon)
        paths = fit.R0 * np.exp(-draws[:, None] * t_future[None, :])
    else:
        assert fit.alpha is not None
        center = float(fit.alpha)
        se = max(fit.param_se, abs(center) * 0.10, 1e-4)
        draws = rng.normal(loc=center, scale=se, size=N_SIMS)
        draws = np.clip(draws, 0.0, None)
        paths = fit.R0 * np.power(t_future[None, :] + 1.0, -draws[:, None])

    totals = paths.sum(axis=1)
    var_95 = float(np.percentile(totals, 5))
    tail = totals[totals <= var_95]
    cvar_95 = float(tail.mean()) if tail.size > 0 else var_95
    return VarResult(var_95=var_95, cvar_95=cvar_95)
