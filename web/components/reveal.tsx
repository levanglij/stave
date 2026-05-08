"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  /** Optional stagger delay in seconds. */
  delay?: number;
  /** Threshold for "in view" — fraction of element that must be visible. */
  threshold?: number;
  /** Pixels of negative root-margin from the bottom; reveal a bit before fully in view. */
  rootMarginBottom?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Wraps a section in a viewport-entry fade + slight slide-up. Uses
 * IntersectionObserver — animation triggers when the section enters
 * the viewport, not on initial page-load. Sections above the fold
 * (e.g., the hero) should NOT be wrapped in this; they'd start
 * invisible.
 *
 * Each instance is its own observer; cleaned up on unmount. The
 * wrapper renders a `display: contents`-equivalent — it doesn't
 * introduce its own box (so background gradients on the wrapped
 * <section> still flow edge-to-edge).
 */
export function Reveal({
  delay = 0,
  threshold = 0.15,
  rootMarginBottom = "-10%",
  className = "",
  children,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion — skip animation entirely.
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(el);
          }
        });
      },
      {
        threshold,
        rootMargin: `0px 0px ${rootMarginBottom} 0px`,
      },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMarginBottom]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
        // Avoid layout shifts: the wrapper takes its natural space
        // even before reveal — only the visual transform changes.
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
