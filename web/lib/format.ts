// Display helpers - keep numeric formatting consistent across cards,
// detail view, and any future surfaces.

export function usd(n: number, fractionDigits = 2): string {
  return (
    "$" +
    n.toLocaleString(undefined, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    })
  );
}

export function int(n: number): string {
  return Math.floor(n).toLocaleString();
}

// Compact dollar formatting: $1.4M, $24.8K, $850.
export function compactUsd(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e6) {
    return "$" + (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (abs >= 1e3) {
    return "$" + (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return "$" + n.toFixed(0);
}

export function pct(x: number, fractionDigits = 1): string {
  return (x * 100).toFixed(fractionDigits) + "%";
}

export function regimeLabel(regime: string): string {
  return regime.replace(/_/g, " ");
}

// HHI -> human-readable concentration tag.
export function hhiTag(h: number): "high" | "moderate" | "diversified" {
  if (h > 0.5) return "high";
  if (h >= 0.25) return "moderate";
  return "diversified";
}

// Tier color tokens - bright variants chosen for dark backgrounds.
// Reference: CLAUDE.md "Tier colors (rebalanced for dark bg)".
export const TIER_COLOR: Record<string, string> = {
  AAA: "#34D399", // emerald-400
  AA: "#22C55E", // green-500
  A: "#38BDF8", // sky-400
  BBB: "#FBBF24", // amber-400
  BB: "#FB923C", // orange-400
  B: "#F87171", // red-400
};
