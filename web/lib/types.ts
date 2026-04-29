// Shape of engine/outputs/*.rating.json — produced by the Python RRE
// pipeline. Treat this as the public contract between engine and web.
export interface Factors {
  stability: number;
  concentration: number;
  regime: number;
  volatility: number;
  lifecycle: number;
}

export interface DecayParams {
  R0: number;
  lam: number | null;
  alpha: number | null;
}

export interface Forecast {
  p10: number[];
  p50: number[];
  p90: number[];
}

export type Regime = "evergreen" | "catalog" | "active_pop" | "new_release";
export type DecayModel = "exponential" | "power_law";
export type RatingTier =
  | "RRE-AAA"
  | "RRE-AA"
  | "RRE-A"
  | "RRE-BBB"
  | "RRE-BB"
  | "RRE-B";

export interface Rating {
  catalog_id: string;
  rating: RatingTier;
  rating_confidence: number;
  composite_score: number;
  factors: Factors;
  regime: Regime;
  decay_model: DecayModel;
  decay_params: DecayParams;
  forecast_60mo: Forecast;
  var_95_60mo_usd: number;
  cvar_95_60mo_usd: number;
  hhi_platform: number;
  hhi_territory: number;
  anomaly_count: number;
  ltv_recommended: number;
  review_due: string; // ISO date — next scheduled re-rating
}

// Catalog presentation metadata — title, artist, gradient, etc.
// Lives alongside the rating but is curated by hand (not produced by
// the engine). Mirrors the META object from app/demo.html.
export interface CatalogMeta {
  title: string;
  artist: string;
  genre: string;
  initials: string;
  grad: [string, string];
  price: number; // USDC per share
  catalog_age_months: number;
  artist_age_years: number;
  history_months: number;
  platforms: number;
  territories: number;
  rows: number;
}

// Combined view for UI consumption — every property the cards / detail
// page might want. RRE data merged with curated metadata.
export type Listing = Rating & CatalogMeta;
