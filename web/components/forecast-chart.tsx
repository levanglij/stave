"use client";

import {
  ResponsiveContainer,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
} from "recharts";
import type { Forecast } from "@/lib/types";

interface Props {
  forecast: Forecast;
}

export function ForecastChart({ forecast }: Props) {
  // Build a single data array indexed by month. Recharts doesn't draw
  // a band natively, so we convert (p10, p90) into (p10, p90 - p10)
  // and stack via Area: the bottom area is invisible, the top area
  // fills the band.
  const data = forecast.p50.map((p50, i) => ({
    month: i,
    p10: forecast.p10[i],
    p50,
    p90: forecast.p90[i],
    bandBottom: forecast.p10[i],
    bandHeight: forecast.p90[i] - forecast.p10[i],
  }));

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
        >
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#64748b"
            fontSize={11}
            tickFormatter={(m) => `t+${m}`}
            interval={5}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickFormatter={(v) =>
              "$" + Number(v).toLocaleString(undefined, { notation: "compact" })
            }
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
            width={56}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0E1424",
              borderColor: "#1E2638",
              borderRadius: 8,
              fontSize: 12,
              color: "#F8FAFC",
            }}
            labelFormatter={(m) => `Month t+${m}`}
            formatter={(value, name) => {
              if (name === "bandHeight" || name === "bandBottom") return null;
              const num = typeof value === "number" ? value : 0;
              return [
                "$" + Math.round(num).toLocaleString(),
                String(name).toUpperCase(),
              ];
            }}
          />
          {/* Invisible base of the band */}
          <Area
            type="monotone"
            dataKey="bandBottom"
            stackId="band"
            stroke="none"
            fill="transparent"
            isAnimationActive={false}
          />
          {/* The band itself — emerald, low opacity */}
          <Area
            type="monotone"
            dataKey="bandHeight"
            stackId="band"
            stroke="none"
            fill="#10B981"
            fillOpacity={0.12}
            isAnimationActive={false}
          />
          {/* P10 outline */}
          <Line
            type="monotone"
            dataKey="p10"
            stroke="#94A3B8"
            strokeWidth={1}
            strokeDasharray="3 3"
            dot={false}
            isAnimationActive={false}
          />
          {/* P50 — the headline forecast */}
          <Line
            type="monotone"
            dataKey="p50"
            stroke="#F8FAFC"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          {/* P90 outline */}
          <Line
            type="monotone"
            dataKey="p90"
            stroke="#94A3B8"
            strokeWidth={1}
            strokeDasharray="3 3"
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
