"use client";

import { useState } from "react";
import type { Listing } from "@/lib/types";
import { compactUsd } from "@/lib/format";
import { projectReturns, type ScenarioReturns } from "@/lib/headline-stats";

const SLIDER_MIN = 1_000;
const SLIDER_MAX = 500_000;
const LN_MIN = Math.log(SLIDER_MIN);
const LN_RANGE = Math.log(SLIDER_MAX) - LN_MIN;
const DEFAULT_POS = (Math.log(10_000) - LN_MIN) / LN_RANGE; // $10K starting point

// Log-scale slider: map slider position [0..1] to investment in
// [SLIDER_MIN..SLIDER_MAX], then snap to a "nice" value at each tier.
function posToInvestment(pos: number): number {
  const raw = Math.exp(LN_MIN + pos * LN_RANGE);
  if (raw < 5_000) return Math.round(raw / 100) * 100;
  if (raw < 50_000) return Math.round(raw / 500) * 500;
  if (raw < 100_000) return Math.round(raw / 1_000) * 1_000;
  return Math.round(raw / 5_000) * 5_000;
}

export function ReturnsCalculator({ listing }: { listing: Listing }) {
  const [pos, setPos] = useState(DEFAULT_POS);
  const investment = posToInvestment(pos);
  const r = projectReturns(listing, investment);
  const fillPct = pos * 100;

  return (
    <div className="rounded-xl border border-border bg-panel p-5">
      <div className="text-[10px] tracking-[1.5px] uppercase text-muted mb-1">
        Returns Calculator
      </div>
      <div className="font-semibold text-fg mb-5">Project your income</div>

      {/* Slider */}
      <div className="text-xs flex justify-between mb-2">
        <span className="text-muted">Investment</span>
        <span className="font-mono tabular text-fg font-semibold">
          ${investment.toLocaleString()}
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="0.5"
        value={pos * 100}
        onChange={(e) => setPos(parseFloat(e.target.value) / 100)}
        className="stave-slider"
        style={{
          background: `linear-gradient(to right, var(--color-accent-bright) 0%, var(--color-accent) ${fillPct}%, var(--color-panel-2) ${fillPct}%, var(--color-panel-2) 100%)`,
        }}
        aria-label="Investment amount"
      />
      <div className="flex justify-between text-[10px] text-muted mb-5 mt-2 font-mono tabular">
        <span>${SLIDER_MIN / 1000}K</span>
        <span>${SLIDER_MAX / 1000}K</span>
      </div>

      <div className="border-t border-border pt-4">
        <div className="grid grid-cols-[1fr_60px_60px_60px] gap-3 text-[9px] tracking-[1.2px] uppercase text-muted mb-2">
          <div></div>
          <div className="text-right">Annual</div>
          <div className="text-right">5YR</div>
          <div className="text-right">10YR</div>
        </div>
        <Row label="Conservative" data={r.conservative} />
        <Row label="Base" data={r.base} highlight />
        <Row label="Aggressive" data={r.aggressive} />
      </div>

      <div className="mt-3 pt-3 border-t border-border text-[10px] text-muted leading-relaxed">
        Projections derived from the engine&rsquo;s P10 / P50 / P90 forecast.
        10-year extension assumes{" "}
        <span className="text-fg/80">
          {listing.decay_model === "power_law" ? "long-tail catalog" : "exponential decay"}
        </span>{" "}
        based on the fitted {listing.decay_model.replace(/_/g, " ")} model.
      </div>
    </div>
  );
}

function Row({
  label,
  data,
  highlight,
}: {
  label: string;
  data: ScenarioReturns;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        "grid grid-cols-[1fr_60px_60px_60px] gap-3 py-1.5 text-xs " +
        (highlight ? "text-accent-bright font-semibold" : "text-fg/85")
      }
    >
      <div className={highlight ? "" : "text-muted"}>{label}</div>
      <div className="text-right font-mono tabular">{compactUsd(data.annual)}</div>
      <div className="text-right font-mono tabular">{compactUsd(data.yr5)}</div>
      <div className="text-right font-mono tabular">{compactUsd(data.yr10)}</div>
    </div>
  );
}
