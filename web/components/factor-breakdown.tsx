import type { Factors } from "@/lib/types";

interface FactorRow {
  key: keyof Factors;
  label: string;
  weight: number;
  color: string;
}

const ROWS: FactorRow[] = [
  { key: "stability", label: "Forecast stability", weight: 30, color: "#3B82F6" },
  { key: "concentration", label: "Concentration (HHI)", weight: 20, color: "#8B5CF6" },
  { key: "regime", label: "Decay regime", weight: 20, color: "#10B981" },
  { key: "volatility", label: "Historical volatility", weight: 15, color: "#F59E0B" },
  { key: "lifecycle", label: "Artist & catalog age", weight: 15, color: "#EC4899" },
];

export function FactorBreakdown({ factors }: { factors: Factors }) {
  return (
    <div className="space-y-4">
      {ROWS.map((row) => {
        const value = factors[row.key];
        return (
          <div key={row.key}>
            <div className="flex justify-between text-xs mb-1.5">
              <div className="text-fg/80">
                {row.label}{" "}
                <span className="text-muted">· weight {row.weight}%</span>
              </div>
              <div className="font-semibold tabular text-fg">
                {value.toFixed(0)}
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-panel-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${value}%`, background: row.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
