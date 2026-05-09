// Hero illustration: a candlestick chart where each candle is also a music
// note on a five-line staff. The metaphor - a Bloomberg ticker drawn as a
// sheet of music. Pure inline SVG, no raster assets, themed to Stave's
// emerald palette so it lives behind/beside dark hero text without fighting
// it for attention.
//
// Layers, back to front:
//   1. Radial emerald glow backdrop (deep wash, gives the chart a center)
//   2. Five staff lines with varied opacities (5/8/12/8/5%) for aerial perspective
//   3. Treble clef at the left edge, larger + softly glowing - desktop only
//   4. Faint secondary trend line in the background ("historical" decoration)
//   5. Floating numerical annotations (Grade AA, +12.4%, $971K) - tiny mono,
//      very dim. Easter eggs that signal data density.
//   6. Candle wicks
//   7. Candle bodies
//   8. Note stems rising from each body top, joined by horizontal beams
//      (groups of 2 or 3) or capped with a quarter-note flag (standalone)
//   9. Trend line connecting the body centers, with a stronger drop-shadow
//      glow - reads as both chart trendline and melodic contour
//  10. Two-line end barline at the right - desktop only

const VIEW_W = 720;
const VIEW_H = 480;

// Vertical band the candle bodies live in (top → bottom of viewBox).
// Stems and beams extend above CHART_TOP; wicks dip below CHART_BOT.
const CHART_TOP = 100;
const CHART_BOT = 430;

// Five staff lines with hand-tuned opacities. Outer lines are dimmer, inner
// lines brighter - gives the staff aerial perspective so it stops reading
// as a uniform grid.
const STAFF_LINES: { y: number; opacity: number }[] = [
  { y: 180, opacity: 0.05 },
  { y: 210, opacity: 0.08 },
  { y: 240, opacity: 0.12 },
  { y: 270, opacity: 0.08 },
  { y: 300, opacity: 0.05 },
];

const STAFF_X1 = 20;
const STAFF_X2 = 690;

const COLOR = {
  green: { body: "#10b981", wick: "#34d399" },
  amber: { body: "#f59e0b", wick: "#fbbf24" },
  staffStroke: "rgba(110, 231, 183, 1)", // multiplied by per-line opacity
  clef: "rgba(110, 231, 183, 0.36)",
  endbar: "rgba(110, 231, 183, 0.22)",
  trend: "rgba(52, 211, 153, 0.78)",
  trendSecondary: "rgba(52, 211, 153, 0.22)",
  annotation: "rgba(110, 231, 183, 0.42)",
};

interface CandleSpec {
  x: number;
  yPct: number; // 0 = bottom of chart band, 100 = top
  bodyH: number; // pixels
  amber: boolean; // amber candle (vs green)
  beam: number | null; // beam group id, or null if standalone (gets a flag)
}

// Hand-tuned 16-candle series. Trends up-and-to-the-right with two visible
// pullbacks. Amber candles at indices 2, 6, 9, 12 - feels realistic for a
// real chart, and adds beat-by-beat color variety. Beam groups are sized 2
// or 3 to read as eighth/sixteenth notes; standalone candles render with a
// quarter-note flag instead.
const RAW: CandleSpec[] = [
  { x: 110, yPct: 20, bodyH: 50, amber: false, beam: 1 },
  { x: 147, yPct: 28, bodyH: 45, amber: false, beam: 1 },
  { x: 184, yPct: 24, bodyH: 40, amber: true, beam: null },
  { x: 221, yPct: 35, bodyH: 50, amber: false, beam: 2 },
  { x: 258, yPct: 32, bodyH: 45, amber: false, beam: 2 },
  { x: 295, yPct: 42, bodyH: 55, amber: false, beam: 2 },
  { x: 332, yPct: 38, bodyH: 50, amber: true, beam: null },
  { x: 369, yPct: 50, bodyH: 50, amber: false, beam: 3 },
  { x: 406, yPct: 45, bodyH: 45, amber: false, beam: 3 },
  { x: 443, yPct: 58, bodyH: 55, amber: true, beam: null },
  { x: 480, yPct: 54, bodyH: 50, amber: false, beam: 4 },
  { x: 517, yPct: 65, bodyH: 60, amber: false, beam: 4 },
  { x: 554, yPct: 60, bodyH: 50, amber: true, beam: 4 },
  { x: 591, yPct: 72, bodyH: 55, amber: false, beam: null },
  { x: 628, yPct: 78, bodyH: 60, amber: false, beam: 5 },
  { x: 665, yPct: 85, bodyH: 65, amber: false, beam: 5 },
];

function centerY(yPct: number): number {
  return CHART_BOT - (yPct / 100) * (CHART_BOT - CHART_TOP);
}

interface ComputedCandle extends CandleSpec {
  cy: number;
  bodyTop: number;
  bodyBot: number;
  wickTop: number;
  wickBot: number;
  body: string;
  wickColor: string;
}

const CANDLES: ComputedCandle[] = RAW.map((c) => {
  const cy = centerY(c.yPct);
  const halfBody = c.bodyH / 2;
  const palette = c.amber ? COLOR.amber : COLOR.green;
  return {
    ...c,
    cy,
    bodyTop: cy - halfBody,
    bodyBot: cy + halfBody,
    wickTop: cy - halfBody - 14,
    wickBot: cy + halfBody + 14,
    body: palette.body,
    wickColor: palette.wick,
  };
});

// For each beam group, the beam y is the highest body-top in the group
// minus a fixed clearance (so all stems land at the same horizontal beam).
const BEAM_CLEARANCE = 34;
const BEAM_Y: Record<number, number> = {};
for (const c of CANDLES) {
  if (c.beam == null) continue;
  const candidate = c.bodyTop - BEAM_CLEARANCE;
  if (BEAM_Y[c.beam] === undefined || candidate < BEAM_Y[c.beam]) {
    BEAM_Y[c.beam] = candidate;
  }
}

// Group candles by beam id for rendering the beam rectangles.
const BEAMS: { id: number; minX: number; maxX: number; color: string }[] = [];
{
  const byBeam: Record<number, ComputedCandle[]> = {};
  for (const c of CANDLES) {
    if (c.beam == null) continue;
    (byBeam[c.beam] ||= []).push(c);
  }
  for (const [k, members] of Object.entries(byBeam)) {
    const id = Number(k);
    const greens = members.filter((m) => !m.amber).length;
    BEAMS.push({
      id,
      minX: Math.min(...members.map((m) => m.x)),
      maxX: Math.max(...members.map((m) => m.x)),
      // Beam takes the dominant color of its group.
      color: greens >= members.length / 2 ? COLOR.green.body : COLOR.amber.body,
    });
  }
}

function stemTop(c: ComputedCandle): number {
  return c.beam == null ? c.bodyTop - 42 : BEAM_Y[c.beam];
}

// Floating annotations - anchored to specific candles, offset to sit in
// negative space so they decorate without colliding with the chart shapes.
// Numbers are illustrative; chosen to feel like real instrument-level data
// the way a Bloomberg overlay would label trades on a chart.
const ANNOTATIONS = [
  { x: 312, y: 250, text: "+12.4%" },
  { x: 540, y: 165, text: "$971K" },
  { x: 645, y: 155, text: "Grade AA" },
];

export function HeroChartNotes() {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      role="img"
      aria-label="Stylized candlestick chart drawn as music notes on a five-line staff. The candles trend upward."
    >
      <defs>
        {/* Deeper, more focused emerald glow - gives the chart a clear
            visual center rather than ambient haze. */}
        <radialGradient id="hcnGlow" cx="0.7" cy="0.5" r="0.55">
          <stop offset="0" stopColor="#10b981" stopOpacity="0.22" />
          <stop offset="0.55" stopColor="#10b981" stopOpacity="0.06" />
          <stop offset="1" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
        {/* Subtle filter for the trend line - strong glow without blowing
            out the silhouette of the candles behind it. */}
        <filter id="hcnTrendGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="hcnClefGlow" x="-30%" y="-10%" width="160%" height="120%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Layer 1 - radial emerald wash */}
      <rect width={VIEW_W} height={VIEW_H} fill="url(#hcnGlow)" />

      {/* Layer 2 - staff lines with varied opacities (aerial perspective) */}
      <g stroke={COLOR.staffStroke} strokeWidth="1">
        {STAFF_LINES.map(({ y, opacity }) => (
          <line
            key={y}
            x1={STAFF_X1}
            y1={y}
            x2={STAFF_X2}
            y2={y}
            opacity={opacity}
          />
        ))}
      </g>

      {/* Layer 3 - treble clef (desktop only), now with a soft glow */}
      <g className="hidden md:inline" filter="url(#hcnClefGlow)">
        <TrebleClef />
      </g>

      {/* Layer 4 - secondary trend line, dimmer and offset down. Reads as
          "historical" trace; pure decoration. */}
      <polyline
        points={CANDLES.map((c) => `${c.x},${c.cy + 22}`).join(" ")}
        fill="none"
        stroke={COLOR.trendSecondary}
        strokeWidth="1.3"
        strokeDasharray="3 4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Layer 5 - floating numerical annotations (very dim, tiny mono) */}
      <g
        className="hidden md:inline"
        fill={COLOR.annotation}
        fontFamily='ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace'
        fontSize="9"
        fontWeight="500"
      >
        {ANNOTATIONS.map((a) => (
          <text key={a.text} x={a.x} y={a.y} letterSpacing="0.5">
            {a.text}
          </text>
        ))}
      </g>

      {/* Layer 6 - wicks */}
      <g>
        {CANDLES.map((c) => (
          <line
            key={`wick-${c.x}`}
            x1={c.x}
            y1={c.wickTop}
            x2={c.x}
            y2={c.wickBot}
            stroke={c.wickColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.9"
          />
        ))}
      </g>

      {/* Layer 7 - bodies */}
      <g>
        {CANDLES.map((c) => (
          <rect
            key={`body-${c.x}`}
            x={c.x - 12}
            y={c.bodyTop}
            width={24}
            height={c.bodyH}
            fill={c.body}
            fillOpacity="0.85"
            stroke={c.body}
            strokeWidth="1.5"
          />
        ))}
      </g>

      {/* Layer 8a - stems */}
      <g>
        {CANDLES.map((c) => (
          <line
            key={`stem-${c.x}`}
            x1={c.x}
            y1={c.bodyTop}
            x2={c.x}
            y2={stemTop(c)}
            stroke={c.body}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* Layer 8b - beams */}
      <g>
        {BEAMS.map((b) => (
          <rect
            key={`beam-${b.id}`}
            x={b.minX - 1.5}
            y={BEAM_Y[b.id] - 2}
            width={b.maxX - b.minX + 3}
            height={4}
            fill={b.color}
            rx={1}
          />
        ))}
      </g>

      {/* Layer 8c - flags (standalone quarter-note candles) */}
      <g>
        {CANDLES.filter((c) => c.beam == null).map((c) => {
          const sTop = stemTop(c);
          return (
            <path
              key={`flag-${c.x}`}
              d={`M ${c.x} ${sTop} c 11 3 16 12 7 24`}
              stroke={c.body}
              strokeWidth="2.6"
              fill="none"
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* Layer 9 - trend line through body centers, stronger glow */}
      <polyline
        points={CANDLES.map((c) => `${c.x},${c.cy}`).join(" ")}
        fill="none"
        stroke={COLOR.trend}
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#hcnTrendGlow)"
        style={{ filter: "drop-shadow(0 0 16px rgba(16, 185, 129, 0.5))" }}
      />

      {/* Layer 10 - end barline (desktop only) */}
      <g
        className="hidden md:inline"
        stroke={COLOR.endbar}
        strokeWidth="1.5"
        strokeLinecap="square"
      >
        <line
          x1={STAFF_X2 - 4}
          y1={STAFF_LINES[0].y}
          x2={STAFF_X2 - 4}
          y2={STAFF_LINES[STAFF_LINES.length - 1].y}
        />
        <line
          x1={STAFF_X2 - 1}
          y1={STAFF_LINES[0].y}
          x2={STAFF_X2 - 1}
          y2={STAFF_LINES[STAFF_LINES.length - 1].y}
        />
      </g>
    </svg>
  );
}

/**
 * Stylized treble clef. Hand-authored vector - not musicologically exact,
 * but the silhouette (top loop, descending spine, bottom curl, terminal
 * dot) reads as a G clef in context. Slightly bolder strokes than the v1
 * so it holds its own beside the candle-notes.
 */
function TrebleClef() {
  return (
    <g
      transform="translate(20, 156)"
      stroke={COLOR.clef}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Top loop curling around what would be the G-line */}
      <path
        d="M 32 70
           C 30 50 18 42 10 50
           C 2 60 8 78 24 80
           C 50 80 62 60 62 36
           C 62 14 46 0 30 8
           C 18 14 18 30 30 36"
      />
      {/* Spine descending through the staff */}
      <path
        d="M 30 8
           C 38 70 42 100 38 130
           C 35 158 16 165 16 184
           C 16 202 32 208 46 202
           C 60 196 60 180 50 174
           C 40 168 26 174 26 184"
      />
      {/* Terminal dot */}
      <circle cx="50" cy="208" r="3.6" fill={COLOR.clef} stroke="none" />
    </g>
  );
}
