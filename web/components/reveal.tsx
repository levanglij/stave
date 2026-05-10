"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  delay?: number;
  threshold?: number;
  rootMarginBottom?: string;
  className?: string;
  children: React.ReactNode;
}

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
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
