"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

// Hackathon disclaimer strip mounted above the nav. Sticky-dismissed via
// localStorage so a returning visitor isn't nagged on every page load.
// Subtle amber tint — clearly visible but not alarmist; matches the
// "soon" / "in development" treatment used elsewhere on the site.
const DISMISS_KEY = "stave.disclaimer.dismissed";

export function DisclaimerBanner() {
  // Start hidden until we've checked localStorage on the client. This
  // avoids a flash of the banner before the dismiss-state hydrates.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(DISMISS_KEY) !== "1") {
        setVisible(true);
      }
    } catch {
      // localStorage may be unavailable (private mode, etc.) — show banner
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore — banner still hides for the rest of this session
    }
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Hackathon disclaimer"
      className="relative bg-amber-950/40 border-b border-amber-900/40 text-amber-200/90"
    >
      <div className="max-w-6xl mx-auto px-6 py-2 pr-12 text-center text-[11px] sm:text-xs leading-relaxed">
        <span className="font-semibold tracking-wide text-amber-300">
          Hackathon prototype
        </span>{" "}
        — Stave is a demo project and not a live financial product. Nothing
        on this site is investment advice.
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss disclaimer"
        className="absolute top-1/2 right-3 -translate-y-1/2 text-amber-300/70 hover:text-amber-200 transition-colors p-1"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
