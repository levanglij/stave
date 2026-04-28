"""Tests for HHI concentration calculations."""

import pytest

from rre.concentration import hhi


def test_hhi_perfect_concentration():
    # all revenue on one platform → HHI = 1.0
    assert hhi({"spotify": 100.0}) == pytest.approx(1.0)


def test_hhi_even_split_two_platforms():
    # 50/50 → HHI = 0.5² + 0.5² = 0.5
    assert hhi({"spotify": 50.0, "apple": 50.0}) == pytest.approx(0.5)


def test_hhi_even_split_four_platforms():
    # 25/25/25/25 → HHI = 4 × 0.25² = 0.25
    result = hhi({"a": 1, "b": 1, "c": 1, "d": 1})
    assert result == pytest.approx(0.25)


def test_hhi_empty_input_returns_zero():
    assert hhi({}) == 0.0


def test_hhi_zero_total_returns_zero():
    assert hhi({"a": 0.0, "b": 0.0}) == 0.0


def test_hhi_bounded():
    # for any positive input, HHI must be in (0, 1]
    totals = {"a": 70, "b": 20, "c": 10}
    h = hhi(totals)
    assert 0.0 < h <= 1.0
