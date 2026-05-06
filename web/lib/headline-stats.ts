import type { Listing, RatingTier } from "./types";

// Industry-standard catalog valuation multiples (× annual royalty),
// scaled by Stave grade. Lower-risk catalogs trade at higher multiples
// because their cash flows are more predictable.
const VALUATION_MULTIPLE: Record<RatingTier, number> = {
  AAA: 30,
  AA: 25,
  A: 20,
  BBB: 15,
  BB: 10,
  B: 8,
};

export interface HeadlineStats {
  annualRoyalty: number; // first-year P50 sum, USD
  fmv: number; // fair-market value = annualRoyalty × tier multiple
  roi5yr: number; // total 60-month P50 / FMV (e.g. 0.282 = 28.2%)
  annualYield: number; // annualRoyalty / FMV (e.g. 0.04 = 4%)
  riskScore: number; // 0-100, higher = more risk (100 - composite_score)
}

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export function getHeadlineStats(listing: Listing): HeadlineStats {
  const annualRoyalty = sum(listing.forecast_60mo.p50.slice(0, 12));
  const total60mo = sum(listing.forecast_60mo.p50);
  const multiple = VALUATION_MULTIPLE[listing.rating] ?? 15;
  const fmv = annualRoyalty * multiple;
  return {
    annualRoyalty,
    fmv,
    roi5yr: total60mo / fmv,
    annualYield: annualRoyalty / fmv,
    riskScore: Math.round(100 - listing.composite_score),
  };
}

export interface ScenarioReturns {
  annual: number;
  yr5: number;
  yr10: number;
}

export interface ProjectedReturns {
  conservative: ScenarioReturns;
  base: ScenarioReturns;
  aggressive: ScenarioReturns;
}

// Project an investor's pro-rata royalty income at a given investment
// amount (USD), using P10/P50/P90 forecasts for low/mid/high cases.
// 10-year extrapolation: power-law catalog continues earning ~1.7×
// of 5-year total over years 6-10; exponential decay loses most of
// the income early so 10-year is only ~1.15× of 5-year.
export function projectReturns(
  listing: Listing,
  investment: number,
): ProjectedReturns {
  const { fmv } = getHeadlineStats(listing);
  const ownership = investment / fmv;
  const tenYearMult = listing.decay_model === "power_law" ? 1.7 : 1.15;

  const compute = (forecast: number[]): ScenarioReturns => ({
    annual: sum(forecast.slice(0, 12)) * ownership,
    yr5: sum(forecast) * ownership,
    yr10: sum(forecast) * ownership * tenYearMult,
  });

  return {
    conservative: compute(listing.forecast_60mo.p10),
    base: compute(listing.forecast_60mo.p50),
    aggressive: compute(listing.forecast_60mo.p90),
  };
}
