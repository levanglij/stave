"""Generate 5 synthetic catalogs covering each regime.

Writes to engine/data/*.json. Deterministic (seeded RNG).
"""

from __future__ import annotations

import json
import random
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Dict, List, Tuple


DATA_DIR = Path(__file__).resolve().parent.parent / "data"


@dataclass
class CatalogSpec:
    catalog_id: str
    title: str
    artist: str
    genre: str
    catalog_age_months: int
    artist_age_years: float
    n_months: int
    # monthly total at month 0
    R0: float
    # shape: "exponential" or "power_law" or "flat" or "growth_then_decay"
    shape: str
    # key decay parameter
    lam_or_alpha: float
    # (platform, share), shares should sum to ~1.0
    platform_mix: List[Tuple[str, float]]
    territory_mix: List[Tuple[str, float]]
    noise_pct: float  # multiplicative noise stdev, e.g. 0.08 = 8%
    seed: int


def _months_back(n: int, end: date) -> List[str]:
    labels: List[str] = []
    y = end.year
    m = end.month
    for _ in range(n):
        labels.append(f"{y:04d}-{m:02d}")
        m -= 1
        if m == 0:
            m = 12
            y -= 1
    labels.reverse()
    return labels


def _shape_path(shape: str, R0: float, n: int, param: float) -> List[float]:
    import math

    if shape == "exponential":
        return [R0 * math.exp(-param * t) for t in range(n)]
    if shape == "power_law":
        return [R0 * ((t + 1) ** (-param)) for t in range(n)]
    if shape == "flat":
        return [R0 for _ in range(n)]
    if shape == "growth_then_decay":
        # S-curve-ish then gentle decay
        peak = n // 3
        out = []
        for t in range(n):
            if t <= peak:
                # logistic-ish growth up to R0
                out.append(R0 * (t + 1) / (peak + 1))
            else:
                out.append(R0 * math.exp(-0.03 * (t - peak)))
        return out
    raise ValueError(f"unknown shape: {shape}")


def _jitter(base: List[float], noise_pct: float, rng: random.Random) -> List[float]:
    return [max(0.0, x * (1.0 + rng.gauss(0.0, noise_pct))) for x in base]


def build(spec: CatalogSpec) -> Dict:
    rng = random.Random(spec.seed)
    end = date(2026, 3, 1)  # last full reporting month
    months = _months_back(spec.n_months, end)
    base_path = _shape_path(spec.shape, spec.R0, spec.n_months, spec.lam_or_alpha)
    total_path = _jitter(base_path, spec.noise_pct, rng)

    # Inject a mild Q4 seasonal bump so series looks real
    boosted: List[float] = []
    for i, v in enumerate(total_path):
        yyyymm = months[i]
        month_num = int(yyyymm.split("-")[1])
        if month_num in (11, 12):
            boosted.append(v * (1.0 + 0.12 + rng.gauss(0.0, 0.02)))
        elif month_num == 1:
            boosted.append(v * (1.0 - 0.06))
        else:
            boosted.append(v)
    total_path = boosted

    # Split each month across platforms and territories.
    # Simple Kronecker split: fraction_p * fraction_b * total.
    # Add small row-level randomness so HHI is preserved but rows vary.
    history = []
    for i, month in enumerate(months):
        remaining = total_path[i]
        for p, p_share in spec.platform_mix:
            for b, b_share in spec.territory_mix:
                rev = remaining * p_share * b_share * (
                    1.0 + rng.gauss(0.0, 0.02)
                )
                rev = max(0.0, rev)
                history.append(
                    {
                        "month": month,
                        "platform": p,
                        "territory": b,
                        "revenue_usd": round(rev, 2),
                    }
                )

    return {
        "catalog_id": spec.catalog_id,
        "metadata": {
            "title": spec.title,
            "artist": spec.artist,
            "genre": spec.genre,
            "catalog_age_months": spec.catalog_age_months,
            "artist_age_years": spec.artist_age_years,
        },
        "history": history,
    }


SPECS: List[CatalogSpec] = [
    # 1. Evergreen — 20 years, heavy power-law tail, well-diversified
    CatalogSpec(
        catalog_id="evergreen-001",
        title="Midnight Theme",
        artist="Ava Lennox",
        genre="jazz",
        catalog_age_months=252,
        artist_age_years=35,
        n_months=240,
        R0=22000.0,
        shape="power_law",
        lam_or_alpha=0.35,
        platform_mix=[
            ("spotify", 0.30),
            ("apple_music", 0.22),
            ("youtube", 0.20),
            ("amazon", 0.15),
            ("tidal", 0.08),
            ("deezer", 0.05),
        ],
        territory_mix=[
            ("US", 0.32),
            ("UK", 0.14),
            ("DE", 0.10),
            ("FR", 0.09),
            ("JP", 0.10),
            ("BR", 0.08),
            ("OTHER", 0.17),
        ],
        noise_pct=0.07,
        seed=1,
    ),
    # 2. Balanced catalog — 8 years, mild power law, multi-platform
    CatalogSpec(
        catalog_id="balanced-001",
        title="Coastline Drive",
        artist="Marco Hartwell",
        genre="indie_rock",
        catalog_age_months=96,
        artist_age_years=14,
        n_months=96,
        R0=18000.0,
        shape="power_law",
        lam_or_alpha=0.55,
        platform_mix=[
            ("spotify", 0.40),
            ("apple_music", 0.22),
            ("youtube", 0.18),
            ("amazon", 0.12),
            ("tidal", 0.08),
        ],
        territory_mix=[
            ("US", 0.38),
            ("UK", 0.18),
            ("DE", 0.12),
            ("CA", 0.10),
            ("AU", 0.08),
            ("OTHER", 0.14),
        ],
        noise_pct=0.09,
        seed=2,
    ),
    # 3. Active pop — 48 months, exponential decay, decent mix
    CatalogSpec(
        catalog_id="active-pop-001",
        title="Brighter Ends",
        artist="Iris Kai",
        genre="pop",
        catalog_age_months=48,
        artist_age_years=6,
        n_months=48,
        R0=45000.0,
        shape="exponential",
        lam_or_alpha=0.045,
        platform_mix=[
            ("spotify", 0.55),
            ("apple_music", 0.22),
            ("youtube", 0.15),
            ("amazon", 0.08),
        ],
        territory_mix=[
            ("US", 0.45),
            ("UK", 0.18),
            ("DE", 0.12),
            ("MX", 0.10),
            ("OTHER", 0.15),
        ],
        noise_pct=0.12,
        seed=3,
    ),
    # 4. New release — 18 months, S-curve then gentle decay
    CatalogSpec(
        catalog_id="new-release-001",
        title="Reverie",
        artist="Nico Wren",
        genre="pop",
        catalog_age_months=18,
        artist_age_years=2,
        n_months=18,
        R0=9000.0,  # peak level
        shape="growth_then_decay",
        lam_or_alpha=0.0,  # unused
        platform_mix=[
            ("spotify", 0.62),
            ("apple_music", 0.22),
            ("youtube", 0.10),
            ("tidal", 0.06),
        ],
        territory_mix=[
            ("US", 0.50),
            ("UK", 0.22),
            ("DE", 0.12),
            ("OTHER", 0.16),
        ],
        noise_pct=0.20,
        seed=4,
    ),
    # 5. High HHI — 60 months, reasonable decay, but 95% on one platform in one territory
    CatalogSpec(
        catalog_id="high-hhi-001",
        title="South Line",
        artist="Quill Ray",
        genre="country",
        catalog_age_months=60,
        artist_age_years=8,
        n_months=60,
        R0=14000.0,
        shape="exponential",
        lam_or_alpha=0.025,
        platform_mix=[
            ("spotify", 0.95),
            ("apple_music", 0.04),
            ("youtube", 0.01),
        ],
        territory_mix=[
            ("US", 0.92),
            ("CA", 0.05),
            ("OTHER", 0.03),
        ],
        noise_pct=0.10,
        seed=5,
    ),
]


def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    for spec in SPECS:
        obj = build(spec)
        out = DATA_DIR / f"catalog_{spec.catalog_id}.json"
        with out.open("w") as f:
            json.dump(obj, f, indent=2)
        print(f"wrote {out} ({len(obj['history'])} rows)")


if __name__ == "__main__":
    main()
