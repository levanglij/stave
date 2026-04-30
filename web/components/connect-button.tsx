"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export function ConnectButton() {
  const { publicKey, connected, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  if (connected && publicKey) {
    const addr = publicKey.toBase58();
    const short = `${addr.slice(0, 4)}…${addr.slice(-4)}`;
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-md border border-border bg-panel px-2 py-1 text-[11px] font-mono tabular text-fg/90">
          {short}
        </span>
        <button
          onClick={() => disconnect()}
          className="text-[11px] text-muted hover:text-fg transition-colors"
          aria-label="Disconnect wallet"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setVisible(true)}
      disabled={connecting}
      className="rounded-lg bg-accent text-accent-ink font-semibold text-xs px-3 py-1.5 btn-glow disabled:opacity-60"
    >
      {connecting ? "Connecting…" : "Connect"}
    </button>
  );
}
