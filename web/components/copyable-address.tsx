"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "./toast";

// Truncates a Solana address (or TX signature) to first-6 + last-4
// for display, while keeping the full string for copy.
function truncate(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

interface CopyableAddressProps {
  /** The full address or TX signature. */
  value: string;
  /** Optional label rendered to the left, e.g. "Program" or "Suliko". */
  label?: string;
  /** Solana Explorer cluster - defaults to devnet. */
  cluster?: "devnet" | "testnet" | "mainnet-beta";
  /** Whether `value` is a TX signature (vs. a program / account address). */
  type?: "address" | "tx";
}

/**
 * Mono-font pill with truncated address, click-to-copy, and a link
 * to the matching Solana Explorer page. Used wherever the live UI
 * surfaces an on-chain identifier judges might want to verify.
 */
export function CopyableAddress({
  value,
  label,
  cluster = "devnet",
  type = "address",
}: CopyableAddressProps) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(
        type === "tx" ? "TX signature copied" : "Address copied",
        truncate(value),
      );
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // Sandboxed environments can block writeText. Surface the error
      // so the judge knows why nothing happened, then offer the
      // explorer link as a fallback path.
      toast.error("Couldn't copy", "Right-click the pill to copy manually.");
    }
  };

  const explorerUrl =
    type === "tx"
      ? `https://explorer.solana.com/tx/${value}?cluster=${cluster}`
      : `https://explorer.solana.com/address/${value}?cluster=${cluster}`;

  return (
    <div className="flex items-center gap-2 text-xs">
      {label && (
        <span className="text-muted shrink-0 w-20 text-right">{label}</span>
      )}
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? "Copied" : `Copy ${value}`}
        className="font-mono tabular text-zinc-300 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-100 transition-colors rounded-md px-2.5 py-1 inline-flex items-center gap-2"
      >
        <span>{truncate(value)}</span>
        {copied ? (
          <Check className="w-3 h-3 text-emerald-400" strokeWidth={2.5} />
        ) : (
          <Copy className="w-3 h-3 text-zinc-500" strokeWidth={2} />
        )}
      </button>
      <a
        href={explorerUrl}
        target="_blank"
        rel="noreferrer"
        title="View on Solana Explorer"
        className="text-zinc-500 hover:text-emerald-400 transition-colors p-1"
      >
        <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.75} />
      </a>
    </div>
  );
}
