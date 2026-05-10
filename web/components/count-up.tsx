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
  end: number;
  duration?: number;
  format?: FormatKind;
  triggerOnViewport?: boolean;
}

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
