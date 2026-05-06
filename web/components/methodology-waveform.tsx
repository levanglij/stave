// Decorative audio-style waveform band — visual signal that the
// methodology section bridges "music" and "data". Pure inline SVG, themed
// to the emerald palette, no external assets, no library. The bar heights
// are pre-computed (rising-then-fading envelope so it reads as a real
// signal, not a random noise pattern).
//
// Used above the homepage methodology blockquote — sits as a quiet
// editorial accent, not a hero element.

const VIEW_W = 1200;
const VIEW_H = 80;
const BAR_COUNT = 96;
const BAR_W = 6;
const GAP = (VIEW_W - BAR_COUNT * BAR_W) / (BAR_COUNT - 1);

// Hand-shaped envelope: short ramp-in, sustain with detail, long fade-out.
// Each value is normalized 0..1; multiplied by VIEW_H * 0.85 (so the
// tallest bars don't kiss the top edge).
function envelope(): number[] {
  const out: number[] = [];
  for (let i = 0; i < BAR_COUNT; i++) {
    const t = i / (BAR_COUNT - 1);
    // Bell-ish curve with detail noise
    const ramp = Math.min(1, t * 4); // fast ramp-in
    const fade = Math.max(0, 1 - Math.max(0, (t - 0.55) * 1.6)); // slow fade-out
    const carrier = ramp * fade;
    // Layered sine "detail" so the bars don't look mechanically smooth
    const detail =
      0.22 * Math.sin(t * 38) +
      0.14 * Math.sin(t * 17 + 1.3) +
      0.08 * Math.sin(t * 71 + 0.4);
    const v = Math.max(0.06, Math.min(1, carrier * 0.92 + carrier * detail));
    out.push(v);
  }
  return out;
}

const HEIGHTS = envelope();

export function MethodologyWaveform() {
  return (
    <div
      className="w-full opacity-70"
      aria-hidden
      style={{ filter: "drop-shadow(0 0 18px rgba(16,185,129,0.18))" }}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mwBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#34d399" stopOpacity="0.9" />
            <stop offset="1" stopColor="#10b981" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        {HEIGHTS.map((v, i) => {
          const h = Math.max(2, v * VIEW_H * 0.85);
          const x = i * (BAR_W + GAP);
          const y = (VIEW_H - h) / 2;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={BAR_W}
              height={h}
              rx={1.5}
              fill="url(#mwBar)"
            />
          );
        })}
      </svg>
    </div>
  );
}
