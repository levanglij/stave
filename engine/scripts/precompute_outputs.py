"""Run the pipeline on every catalog in data/ and write JSON to outputs/."""

from __future__ import annotations

import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ENGINE = HERE.parent
sys.path.insert(0, str(ENGINE / "src"))

from rre.pipeline import run  # noqa: E402
from rre.schema import CatalogInput  # noqa: E402


def main() -> None:
    data_dir = ENGINE / "data"
    out_dir = ENGINE / "outputs"
    out_dir.mkdir(parents=True, exist_ok=True)

    summary_rows = []
    for path in sorted(data_dir.glob("catalog_*.json")):
        with path.open() as f:
            catalog = CatalogInput.model_validate(json.load(f))
        rating = run(catalog)
        out_path = out_dir / f"{catalog.catalog_id}.rating.json"
        with out_path.open("w") as f:
            f.write(rating.model_dump_json(indent=2))

        summary_rows.append(
            {
                "catalog_id": rating.catalog_id,
                "rating": rating.rating,
                "score": rating.composite_score,
                "confidence": rating.rating_confidence,
                "regime": rating.regime,
                "decay_model": rating.decay_model,
                "hhi_platform": rating.hhi_platform,
                "hhi_territory": rating.hhi_territory,
                "ltv": rating.ltv_recommended,
                "cvar_95_60mo_usd": rating.cvar_95_60mo_usd,
            }
        )

    summary_path = out_dir / "summary.json"
    with summary_path.open("w") as f:
        json.dump(summary_rows, f, indent=2)

    # Pretty stdout table
    header = (
        f"{'catalog_id':<22} {'rating':<8} {'score':>6} {'regime':<12} "
        f"{'decay':<12} {'HHI-p':>6} {'HHI-b':>6} {'LTV':>5}"
    )
    print(header)
    print("-" * len(header))
    for r in summary_rows:
        print(
            f"{r['catalog_id']:<22} {r['rating']:<8} {r['score']:>6.1f} "
            f"{r['regime']:<12} {r['decay_model']:<12} "
            f"{r['hhi_platform']:>6.3f} {r['hhi_territory']:>6.3f} "
            f"{r['ltv']:>5.2f}"
        )
    print()
    print(f"wrote {len(summary_rows)} rating files + summary.json to {out_dir}")


if __name__ == "__main__":
    main()
