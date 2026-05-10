"use client";

import { useEffect, useState } from "react";

// Stylized "audio waveform" hero for the catalog detail page.
// Deterministic per catalog (same shape on every render); 140 bars
// rendered as SVG rects with a horizontal purple -> blue gradient.
// When the play button is toggled, bars pulse with staggered phase.

const N_BARS = 140;
const TOTAL_SECONDS = 222; // 3:42 mock track length

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
  const hue = 280 - t * 60; // 280 = purple, 220 = blue
  return `hsl(${hue}, 75%, 60%)`;
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = String(Math.floor(s) % 60).padStart(2, "0");
  return `${m}:${sec}`;
}

interface Props {
  catalogId: string;
  title: string;
  artist: string;
}

export function WaveformHero({ catalogId, title, artist }: Props) {
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(22);

  // Tick the playhead while playing. Mock - no real audio.
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setSeconds((s) => (s + 1) % TOTAL_SECONDS);
    }, 1000);
    return () => clearInterval(id);
  }, [playing]);

  // Build deterministic bar heights for this catalog.
  const rng = mulberry32(hashString(catalogId));
  const bars: number[] = [];
  for (let i = 0; i < N_BARS; i++) {
    const sine = (Math.sin(i * 0.18) + 1) * 0.22;
    const noise = rng() * 0.55;
    const h = Math.max(0.18, Math.min(1, sine + noise + 0.18));
    bars.push(h);
  }

  const progressPct = (seconds / TOTAL_SECONDS) * 100;

  return (
    <div
      className="rounded-xl overflow-hidden h-[300px] md:h-[340px] flex flex-col relative"
      style={{
        background:
          "linear-gradient(135deg, rgba(48,15,80,0.45) 0%, rgba(15,30,80,0.45) 60%, rgba(8,15,40,0.45) 100%)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Waveform bars fill remaining space */}
      <div className="flex-1 flex items-center px-6 py-4 min-h-0">
        <svg
          viewBox={`0 0 ${N_BARS * 4} 200`}
          className="w-full h-full"
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
                className="wave-bar"
                x={x}
                y={y}
                width={2.5}
                height={barHeight}
                rx={1}
                fill={colorAt(i / N_BARS)}
                style={{
                  animationPlayState: playing ? "running" : "paused",
                  animationDelay: `${(i % 13) * 0.07}s`,
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* Player controls. Tight on mobile: smaller play button, no
          fixed-width progress bar, tiny gaps. Roomier from sm: up. */}
      <div
        className="px-3 sm:px-5 py-3 flex items-center gap-2 sm:gap-4 border-t border-border/60"
        style={{ background: "rgba(5, 8, 22, 0.65)", backdropFilter: "blur(12px)" }}
      >
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-fg text-bg hover:scale-105 active:scale-95 transition-transform shrink-0 shadow-lg"
          aria-label={playing ? "Pause preview" : "Play preview"}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect x="2" y="1" width="3" height="12" rx="1" />
              <rect x="9" y="1" width="3" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M3 1.5L12 7L3 12.5Z" />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] tracking-[1.5px] uppercase text-muted">
            Now playing
          </div>
          <div className="text-sm text-fg font-medium truncate mt-0.5">
            {title}
            <span className="text-muted font-normal"> · {artist}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] font-mono tabular text-muted shrink-0">
          <span className="text-right">{fmtTime(seconds)}</span>
          {/* Hide the progress bar entirely on the smallest phones —
              the time labels alone communicate position. From sm: up
              the bar comes back. */}
          <div className="hidden sm:block w-16 md:w-28 h-1 rounded-full bg-panel-2 relative overflow-hidden">
            <div
              className="h-full bg-accent-bright transition-[width] duration-1000 ease-linear"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span>{fmtTime(TOTAL_SECONDS)}</span>
        </div>
      </div>
    </div>
  );
}
