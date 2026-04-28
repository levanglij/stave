"""Layer 3 (demo scope) — rolling z-score anomaly detection.

No PELT, no LSTM, no classification. Demo outputs just a count + magnitudes.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import List

import numpy as np


WINDOW = 12  # months
Z_THRESHOLD = 2.5


@dataclass
class Anomaly:
    month_index: int
    z_score: float
    magnitude_usd: float
    direction: str  # "up" or "down"


def detect_z_anomalies(series: np.ndarray) -> List[Anomaly]:
    """Rolling z-score anomaly detection on a monthly revenue series."""
    y = np.asarray(series, dtype=float)
    anomalies: List[Anomaly] = []
    if len(y) < WINDOW + 2:
        return anomalies

    for t in range(WINDOW, len(y)):
        window = y[t - WINDOW : t]
        mu = float(window.mean())
        sigma = float(window.std(ddof=0))
        if sigma < 1e-9:
            continue
        z = (float(y[t]) - mu) / sigma
        if abs(z) > Z_THRESHOLD:
            anomalies.append(
                Anomaly(
                    month_index=t,
                    z_score=float(z),
                    magnitude_usd=float(y[t] - mu),
                    direction="up" if z > 0 else "down",
                )
            )
    return anomalies
