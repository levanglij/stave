import type { Listing } from "@/lib/types";
import { compactUsd } from "@/lib/format";
import { projectReturns, type ScenarioReturns } from "@/lib/headline-stats";

const INVESTMENT = 10_000;
const SLIDER_MIN = 1_000;
const SLIDER_MAX = 500_000;

function sliderPosition(value: number): number {
  // Log-ish position so the $10K default sits ~25% across the bar.
  const t =
    (Math.log10(value) - Math.log10(SLIDER_MIN)) /
    (Math.log10(SLIDER_MAX) - Math.log10(SLIDER_MIN));
  return Math.max(0, Math.min(1, t));
}

export function ReturnsCalculator({ listing }: { listing: Listing }) {
  const r = projectReturns(listing, INVESTMENT);

  return (
    <div className="rounded-xl border border-border bg-panel p-5">
      <div className="text-[10px] tracking-[1.5px] uppercase text-muted mb-1">
        Returns Calculator
      </div>
      <div className="font-semibold text-fg mb-5">Project your income</div>

      {/* Investment static for now; slider visual only */}
      <div className="text-xs flex justify-between mb-2">
        <span className="text-muted">Investment</span>
        <span className="font-mono tabular text-fg font-semibold">
          ${INVESTMENT.toLocaleString()}
        </span>
      </div>
      <div className="relative h-1.5 rounded-full bg-panel-2 overflow-hidden mb-1.5">
        <div
          className="h-full rounded-full bg-accent-bright"
          style={{ width: `${sliderPosition(INVESTMENT) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted mb-5 font-mono tabular">
        <span>${SLIDER_MIN / 1000}K</span>
        <span>${SLIDER_MAX / 1000}K</span>
      </div>

      <div className="border-t border-border pt-4">
        <div className="grid grid-cols-[1fr_56px_56px_56px] gap-3 text-[9px] tracking-[1.2px] uppercase text-muted mb-2">
          <div></div>
          <div className="text-right">Annual</div>
          <div className="text-right">5YR</div>
          <div className="text-right">10YR</div>
        </div>
        <Row label="Conservative" data={r.conservative} />
        <Row label="Base" data={r.base} highlight />
        <Row label="Aggressive" data={r.aggressive} />
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
        "grid grid-cols-[1fr_56px_56px_56px] gap-3 py-1.5 text-xs " +
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
