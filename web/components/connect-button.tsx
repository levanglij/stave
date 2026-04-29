"use client";

import { useState } from "react";

// Mock connected wallet — used until NEXT_PUBLIC_PRIVY_APP_ID is set.
const MOCK_ADDR = "8x4d\u2026A1B2";

export function ConnectButton() {
  const [connected, setConnected] = useState(false);
  const hasPrivy = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

  if (connected) {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-md border border-border bg-panel px-2 py-1 text-[11px] font-mono tabular text-fg/90">
          {MOCK_ADDR}
        </span>
        <button
          onClick={() => setConnected(false)}
          className="text-[11px] text-muted hover:text-fg transition-colors"
          aria-label="Disconnect"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConnected(true)}
      className="rounded-lg bg-accent text-accent-ink font-semibold text-xs px-3 py-1.5 btn-glow"
      title={
        hasPrivy
          ? "Click to connect via Privy"
          : "Mock connect — set NEXT_PUBLIC_PRIVY_APP_ID for real auth"
      }
    >
      Connect
    </button>
  );
}
