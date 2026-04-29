"use client";

import { useState } from "react";
import type { Listing } from "@/lib/types";
import { usd, pct } from "@/lib/format";
import { getHeadlineStats } from "@/lib/headline-stats";

const TOTAL_SHARES = 1000;
const AVAILABLE = 500;

export function PurchasePanel({ listing }: { listing: Listing }) {
  const [qty, setQty] = useState(10);
  const total = qty * listing.price;
  const { annualYield } = getHeadlineStats(listing);

  return (
    <div className="rounded-xl border border-border bg-panel p-5 sticky top-20">
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="text-muted text-sm">Price per token</span>
          <span className="font-semibold tabular text-fg text-base">
            {usd(listing.price)}
          </span>
        </div>
        <div className="flex items-baseline justify-between border-b border-border pb-4">
          <span className="text-muted text-sm">Tokens available</span>
          <span className="font-mono tabular text-sm">
            <span className="font-semibold text-fg">{AVAILABLE}</span>{" "}
            <span className="text-muted">/ {TOTAL_SHARES.toLocaleString()}</span>
          </span>
        </div>

        <div>
          <div className="text-[10px] tracking-[1.5px] uppercase text-muted mb-2">
            Quantity
          </div>
          <div className="flex items-stretch gap-2">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="rounded-md border border-border bg-panel-2 hover:border-border-strong w-10 text-fg text-lg leading-none transition-colors"
              aria-label="decrease quantity"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              max={AVAILABLE}
              value={qty}
              onChange={(e) =>
                setQty(Math.max(1, Math.min(AVAILABLE, parseInt(e.target.value) || 1)))
              }
              className="flex-1 bg-panel-2 border border-border rounded-md text-center text-fg font-mono tabular text-base py-2 focus:outline-none focus:border-border-strong"
            />
            <button
              onClick={() => setQty((q) => Math.min(AVAILABLE, q + 1))}
              className="rounded-md border border-border bg-panel-2 hover:border-border-strong w-10 text-fg text-lg leading-none transition-colors"
              aria-label="increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-muted text-sm">Total</span>
          <span className="font-bold tabular text-fg text-2xl tracking-tight">
            {usd(total)}
          </span>
        </div>

        <button
          disabled
          className="btn-glow w-full rounded-lg bg-accent text-accent-ink font-semibold text-sm py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buy {qty} token{qty !== 1 ? "s" : ""}
        </button>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border text-xs">
          <div>
            <div className="text-muted">Next royalty</div>
            <div className="font-mono tabular text-fg mt-1">Mar 2026</div>
          </div>
          <div className="text-right">
            <div className="text-muted">Est. annual yield</div>
            <div className="font-mono tabular text-accent-bright mt-1 font-semibold">
              {pct(annualYield, 1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
