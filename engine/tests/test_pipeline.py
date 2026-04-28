"""End-to-end pipeline tests on the 5 synthetic catalogs."""

import json
from pathlib import Path

import pytest

from rre.pipeline import run
from rre.schema import CatalogInput


DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def _load(name: str) -> CatalogInput:
    with (DATA_DIR / name).open() as f:
        return CatalogInput.model_validate(json.load(f))


def test_evergreen_rates_high_and_low_hhi():
    rating = run(_load("catalog_evergreen-001.json"))
    assert rating.regime == "evergreen"
    # Evergreen + diversified → should be investment-grade (A or better)
    assert rating.rating in {"RRE-AAA", "RRE-AA", "RRE-A"}
    # Platform HHI should be low thanks to 6-way split
    assert rating.hhi_platform < 0.30


def test_balanced_rates_investment_grade():
    rating = run(_load("catalog_balanced-001.json"))
    assert rating.regime == "catalog"
    assert rating.rating in {"RRE-AA", "RRE-A", "RRE-BBB"}
    assert rating.hhi_platform < 0.35


def test_active_pop_picks_exponential():
    rating = run(_load("catalog_active-pop-001.json"))
    assert rating.regime == "active_pop"
    # Series was generated as exponential → fit should pick exponential
    assert rating.decay_model == "exponential"


def test_new_release_has_low_confidence():
    rating = run(_load("catalog_new-release-001.json"))
    assert rating.regime == "new_release"
    # 18 months → confidence should be below 1.0
    assert rating.rating_confidence < 1.0


def test_high_hhi_gets_concentration_penalty():
    rating = run(_load("catalog_high-hhi-001.json"))
    # 95% Spotify, 92% US → HHI should be high on both axes
    assert rating.hhi_platform > 0.80
    assert rating.hhi_territory > 0.80
    # Concentration factor score should be low
    assert rating.factors.concentration < 30.0


def test_all_catalogs_produce_valid_output():
    for name in [
        "catalog_evergreen-001.json",
        "catalog_balanced-001.json",
        "catalog_active-pop-001.json",
        "catalog_new-release-001.json",
        "catalog_high-hhi-001.json",
    ]:
        rating = run(_load(name))
        # Schema invariants
        assert 0.0 <= rating.composite_score <= 100.0
        assert 0.5 <= rating.rating_confidence <= 1.0
        assert rating.ltv_recommended in {0.0, 0.30, 0.50, 0.60, 0.70, 0.80}
        assert len(rating.forecast_60mo.p50) == 60
        assert len(rating.forecast_60mo.p10) == 60
        assert len(rating.forecast_60mo.p90) == 60
        # P10 ≤ P50 ≤ P90 at each horizon
        for p10, p50, p90 in zip(
            rating.forecast_60mo.p10,
            rating.forecast_60mo.p50,
            rating.forecast_60mo.p90,
        ):
            assert p10 <= p50 <= p90
        # Monte Carlo VaR sanity
        assert rating.cvar_95_60mo_usd <= rating.var_95_60mo_usd
