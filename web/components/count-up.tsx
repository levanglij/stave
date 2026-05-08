"use client";

import { useEffect, useRef, useState } from "react";
import { compactUsd, pct } from "@/lib/format";

type FormatKind = "int" | "compact-usd" | "pct1";

const FORMATTERS: Record<FormatKind, (v: number) => string> = {
  int: (v) => String(Math.round(v)),
  "compact-usd": (v) => compactUsd(v),
  pct1: (v) => pct(v, 1),
};

interface CountUpProps {
  /** Final numeric value to count to. */
  end: number;
  /** Animation duration in ms. Defaults to 1.4 seconds. */
  duration?: number;
  /** Named formatter for the live value — see FORMATTERS for options. */
  format?: FormatKind;
  /** When true (default), counter starts on first viewport entry. */
  triggerOnViewport?: boolean;
}

/**
 * Animates a numeric counter from 0 to `end` using requestAnimationFrame.
 *
 * Defaults to triggering on first viewport entry; pass
 * `triggerOnViewport={false}` to start immediately on mount.
 *
 * Server components can't pass function props to client components,
 * so the formatter is named instead of inlined — pick one of "int",
 * "compact-usd", or "pct1".
 *
 * Respects prefers-reduced-motion — renders the final value with no
 * animation if the user has it set.
 */
export function CountUp({
  end,
  duration = 1400,
  format = "int",
  triggerOnViewport = true,
}: CountUpProps) {
  const formatter = FORMATTERS[format];
  const [value, setValue] = useState(triggerOnViewport ? 0 : end);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(end);
      return;
    }

    const animate = () => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // Ease-out cubic — fast in, soft to settle.
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(end * eased);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!triggerOnViewport) {
      animate();
      return;
    }

    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate();
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration, triggerOnViewport]);

  return <span ref={ref}>{formatter(value)}</span>;
}
