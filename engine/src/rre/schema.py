"""Pydantic data contracts for the RRE pipeline."""

from __future__ import annotations

from typing import List, Literal, Optional

from pydantic import BaseModel, Field


Regime = Literal["new_release", "active_pop", "catalog", "evergreen"]
Rating = Literal["RRE-AAA", "RRE-AA", "RRE-A", "RRE-BBB", "RRE-BB", "RRE-B"]
DecayModel = Literal["exponential", "power_law"]


# -- Input ------------------------------------------------------------------


class MonthRow(BaseModel):
    month: str = Field(..., description="YYYY-MM")
    platform: str
    territory: str
    revenue_usd: float = Field(..., ge=0)


class CatalogMetadata(BaseModel):
    title: str
    artist: str
    genre: str
    catalog_age_months: int = Field(..., ge=0)
    artist_age_years: float = Field(..., ge=0)


class CatalogInput(BaseModel):
    catalog_id: str
    metadata: CatalogMetadata
    history: List[MonthRow]


# -- Output -----------------------------------------------------------------


class DecayParams(BaseModel):
    R0: float
    # Present depending on model:
    lam: Optional[float] = None  # exponential
    alpha: Optional[float] = None  # power law


class Forecast60mo(BaseModel):
    p10: List[float]
    p50: List[float]
    p90: List[float]


class FactorScores(BaseModel):
    stability: float
    concentration: float
    regime: float
    volatility: float
    lifecycle: float


class RatingOutput(BaseModel):
    catalog_id: str
    rating: Rating
    rating_confidence: float
    composite_score: float
    factors: FactorScores
    regime: Regime
    decay_model: DecayModel
    decay_params: DecayParams
    forecast_60mo: Forecast60mo
    var_95_60mo_usd: float
    cvar_95_60mo_usd: float
    hhi_platform: float
    hhi_territory: float
    anomaly_count: int
    ltv_recommended: float
    review_due: str  # YYYY-MM-DD, 12 months out
