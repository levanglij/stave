"""Layer 4a - Herfindahl-Hirschman concentration indices."""

from __future__ import annotations

from typing import Dict


def hhi(totals: Dict[str, float]) -> float:
    """Herfindahl-Hirschman Index - sum of squared revenue shares.

    Returns a value in [1/N, 1]. Lower = more diversified.
    Returns 0.0 for empty input (caller's responsibility to handle).
    """
    total = float(sum(totals.values()))
    if total <= 0:
        return 0.0
    shares = [v / total for v in totals.values()]
    return float(sum(s * s for s in shares))
