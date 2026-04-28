"""Command-line entry point.

Usage:
    python -m rre.cli path/to/catalog.json
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from .pipeline import run
from .schema import CatalogInput


def main(argv: list[str] | None = None) -> int:
    argv = argv if argv is not None else sys.argv[1:]
    if len(argv) != 1:
        print("usage: python -m rre.cli <catalog.json>", file=sys.stderr)
        return 2

    path = Path(argv[0])
    if not path.exists():
        print(f"error: file not found: {path}", file=sys.stderr)
        return 1

    with path.open("r") as f:
        raw = json.load(f)

    catalog = CatalogInput.model_validate(raw)
    rating = run(catalog)
    print(rating.model_dump_json(indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
