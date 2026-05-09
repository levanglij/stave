"""Layer 1 - data normalization.

Input is assumed pre-normalized to monthly USD per (platform, territory).
This module validates the schema and constructs numpy-friendly views.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List

import numpy as np
import pandas as pd

from .schema import CatalogInput


@dataclass
class NormalizedSeries:
    """Cleaned, normalized monthly revenue views."""

    catalog_id: str
    total: np.ndarray  # R(t), length T
    months: List[str]  # aligned YYYY-MM labels
    by_platform: Dict[str, np.ndarray]  # platform -> length-T array
    by_territory: Dict[str, np.ndarray]  # territory -> length-T array
    platform_totals: Dict[str, float]  # sum across time
    territory_totals: Dict[str, float]

    @property
    def n_months(self) -> int:
        return len(self.total)

    @property
    def total_revenue(self) -> float:
        return float(self.total.sum())


def normalize(catalog: CatalogInput) -> NormalizedSeries:
    """Validate + pivot a catalog's history into aligned monthly series."""
    if not catalog.history:
        raise ValueError(f"catalog {catalog.catalog_id} has empty history")

    df = pd.DataFrame([row.model_dump() for row in catalog.history])
    df["month"] = pd.to_datetime(df["month"], format="%Y-%m")
    df = df.sort_values("month")

    months_index = pd.date_range(
        start=df["month"].min(), end=df["month"].max(), freq="MS"
    )
    month_labels = [m.strftime("%Y-%m") for m in months_index]

    total = (
        df.groupby("month")["revenue_usd"]
        .sum()
        .reindex(months_index, fill_value=0.0)
        .to_numpy()
    )

    by_platform: Dict[str, np.ndarray] = {}
    for platform, sub in df.groupby("platform"):
        series = (
            sub.groupby("month")["revenue_usd"]
            .sum()
            .reindex(months_index, fill_value=0.0)
            .to_numpy()
        )
        by_platform[str(platform)] = series

    by_territory: Dict[str, np.ndarray] = {}
    for territory, sub in df.groupby("territory"):
        series = (
            sub.groupby("month")["revenue_usd"]
            .sum()
            .reindex(months_index, fill_value=0.0)
            .to_numpy()
        )
        by_territory[str(territory)] = series

    platform_totals = {k: float(v.sum()) for k, v in by_platform.items()}
    territory_totals = {k: float(v.sum()) for k, v in by_territory.items()}

    return NormalizedSeries(
        catalog_id=catalog.catalog_id,
        total=total,
        months=month_labels,
        by_platform=by_platform,
        by_territory=by_territory,
        platform_totals=platform_totals,
        territory_totals=territory_totals,
    )
