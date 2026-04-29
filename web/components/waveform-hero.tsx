// Stylized "audio waveform" hero for the catalog detail page.
// Deterministic per catalog (same shape on every render); 140 bars
// rendered as SVG rects with a horizontal purple -> blue gradient.

const N_BARS = 140;

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function colorAt(t: number): string {
  // t in [0, 1]: 0 = purple, 1 = blue
  const hue = 280 - t * 60;
  return `hsl(${hue}, 75%, 60%)`;
}

export function WaveformHero({ catalogId }: { catalogId: string }) {
  const rng = mulberry32(hashString(catalogId));
  const bars: number[] = [];
  for (let i = 0; i < N_BARS; i++) {
    const sine = (Math.sin(i * 0.18) + 1) * 0.22;
    const noise = rng() * 0.55;
    const h = Math.max(0.18, Math.min(1, sine + noise + 0.18));
    bars.push(h);
  }

  return (
    <div
      className="rounded-xl overflow-hidden h-[280px] md:h-[320px] flex items-center justify-center relative"
      style={{
        background:
          "linear-gradient(135deg, rgba(48,15,80,0.45) 0%, rgba(15,30,80,0.45) 60%, rgba(8,15,40,0.45) 100%)",
        border: "1px solid var(--color-border)",
      }}
    >
      <svg
        viewBox={`0 0 ${N_BARS * 4} 200`}
        className="w-full h-full px-6"
        preserveAspectRatio="none"
        aria-hidden
      >
        {bars.map((h, i) => {
          const x = i * 4 + 1;
          const barHeight = h * 180;
          const y = 100 - barHeight / 2;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={2.5}
              height={barHeight}
              rx={1}
              fill={colorAt(i / N_BARS)}
            />
          );
        })}
      </svg>
    </div>
  );
}
