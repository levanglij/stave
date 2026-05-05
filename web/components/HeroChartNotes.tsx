// Hero illustration: a candlestick chart where each candle is also a music
// note on a five-line staff. The metaphor — a Bloomberg ticker drawn as a
// sheet of music. Pure inline SVG, no raster assets, themed to Stave's
// emerald palette so it lives behind/beside dark hero text without fighting
// it for attention.
//
// Layers, back to front:
//   1. Soft emerald glow (background warmth)
//   2. Five staff lines (faint green-tint) — also serve as gridlines
//   3. Treble clef at the left edge — desktop only
//   4. Candle wicks
//   5. Candle bodies
//   6. Note stems rising from each body top, joined by horizontal beams
//      (groups of 2 or 3) or capped with a quarter-note flag (standalone)
//   7. Trend line connecting the body centers, with a subtle drop-shadow
//      glow — reads as both chart trendline and melodic contour
//   8. Two-line end barline at the right — desktop only

const VIEW_W = 720;
const VIEW_H = 480;

// Vertical band the candle bodies live in (top → bottom of viewBox).
// Stems and beams extend above CHART_TOP; wicks dip below CHART_BOT.
const CHART_TOP = 100;
const CHART_BOT = 430;

// Five staff lines, equally spaced, centered on y=240 (chart middle).
// Tight 30px spacing so the lines read as a music staff first and a
// gridline reference second. Candles can extend above / below the staff
// — the same way notes use ledger lines outside the staff.
const STAFF_LINES = [180, 210, 240, 270, 300];

const STAFF_X1 = 20;
const STAFF_X2 = 690;

const COLOR = {
  green: { body: "#10b981", wick: "#34d399" },
  amber: { body: "#f59e0b", wick: "#fbbf24" },
  staff: "rgba(110, 231, 183, 0.12)",
  clef: "rgba(110, 231, 183, 0.32)",
  endbar: "rgba(110, 231, 183, 0.22)",
  trend: "rgba(52, 211, 153, 0.75)",
};

interface CandleSpec {
  x: number;
  yPct: number; // 0 = bottom of chart band, 100 = top
  bodyH: number; // pixels
  amber: boolean; // amber candle (vs green)
  beam: number | null; // beam group id, or null if standalone (gets a flag)
}

// Hand-tuned 16-candle series. Trends up-and-to-the-right with two visible
// pullbacks. Amber candles at indices 2, 6, 9, 12 — feels realistic for a
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
        <radialGradient id="hcnGlow" cx="0.65" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#10b981" stopOpacity="0.18" />
          <stop offset="1" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Layer 1 — emerald wash to lift the chart off the page bg */}
      <rect width={VIEW_W} height={VIEW_H} fill="url(#hcnGlow)" />

      {/* Layer 2 — staff lines (also chart gridlines) */}
      <g stroke={COLOR.staff} strokeWidth="1">
        {STAFF_LINES.map((y) => (
          <line key={y} x1={STAFF_X1} y1={y} x2={STAFF_X2} y2={y} />
        ))}
      </g>

      {/* Layer 3 — treble clef (desktop only) */}
      <g className="hidden md:inline">
        <TrebleClef />
      </g>

      {/* Layer 4 — wicks */}
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

      {/* Layer 5 — bodies */}
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

      {/* Layer 6a — stems (rise from body top up to beam line / flag pivot) */}
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

      {/* Layer 6b — beams (one rect per group, joining stem tops) */}
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

      {/* Layer 6c — flags (curved swoop on standalone quarter-note candles) */}
      <g>
        {CANDLES.filter((c) => c.beam == null).map((c) => {
          const sTop = stemTop(c);
          // Cubic-bezier flag: starts at stem top, swoops out to the right
          // and curls down — reads as a single eighth-note flag.
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

      {/* Layer 7 — trend line through body centers, with glow */}
      <polyline
        points={CANDLES.map((c) => `${c.x},${c.cy}`).join(" ")}
        fill="none"
        stroke={COLOR.trend}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.45))" }}
      />

      {/* Layer 8 — end barline (desktop only) */}
      <g
        className="hidden md:inline"
        stroke={COLOR.endbar}
        strokeWidth="1.5"
        strokeLinecap="square"
      >
        <line x1={STAFF_X2 - 4} y1={STAFF_LINES[0]} x2={STAFF_X2 - 4} y2={STAFF_LINES[STAFF_LINES.length - 1]} />
        <line x1={STAFF_X2 - 1} y1={STAFF_LINES[0]} x2={STAFF_X2 - 1} y2={STAFF_LINES[STAFF_LINES.length - 1]} />
      </g>
    </svg>
  );
}

/**
 * Stylized treble clef. Hand-authored vector — not musicologically exact,
 * but the silhouette (top loop, descending spine, bottom curl, terminal
 * dot) reads as a G clef in context. Sized so the glyph just clears the
 * top and bottom staff lines.
 */
function TrebleClef() {
  return (
    <g
      transform="translate(20, 156)"
      stroke={COLOR.clef}
      strokeWidth="2.6"
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
      <circle cx="50" cy="208" r="3.4" fill={COLOR.clef} stroke="none" />
    </g>
  );
}
