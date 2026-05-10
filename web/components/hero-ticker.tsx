"use client";

import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";

const PROGRAM_ID = "EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q";
const DEVNET_RPC = "https://api.devnet.solana.com";

/** Real bootstrapped TXs - verifiable on Solana Explorer (devnet). */
const SEED_EVENTS: TickerEvent[] = [
  {
    sig: "24aATvsPhsuctY5vN22XRL8CpckfnD8fLcQmaCmrJV5PbnWWggrojHdybB7JS71RWLMPmkN3DuoAmPVzBcRG9Xbo",
    label: "create_work",
    target: "Suliko",
  },
  {
    sig: "5mGeuaHoUSi35ArqoeEiFb7xqZVQci6yKppUuL9X3yKyVsdrduEesFKYN3efuex38UnHM9PG6ohUaJVjHDf4sK8b",
    label: "list_shares",
    target: "Suliko",
  },
];

interface TickerEvent {
  sig: string;
  label: string;
  target?: string;
  /** Unix seconds (only present on live-fetched entries). */
  blockTime?: number;
}

function shortSig(sig: string): string {
  return `${sig.slice(0, 4)}…${sig.slice(-4)}`;
}

function explorerUrl(sig: string): string {
  return `https://explorer.solana.com/tx/${sig}?cluster=devnet`;
}

function ago(seconds: number | undefined): string {
  if (!seconds) return "";
  const delta = Math.max(0, Date.now() / 1000 - seconds);
  if (delta < 60) return `${Math.round(delta)}s ago`;
  if (delta < 3600) return `${Math.round(delta / 60)}m ago`;
  if (delta < 86400) return `${Math.round(delta / 3600)}h ago`;
  return `${Math.round(delta / 86400)}d ago`;
}

export function HeroTicker() {
  const [events, setEvents] = useState<TickerEvent[]>(SEED_EVENTS);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const conn = new Connection(DEVNET_RPC, "confirmed");
        const sigs = await conn.getSignaturesForAddress(
          new PublicKey(PROGRAM_ID),
          { limit: 8 },
        );
        if (cancelled) return;
        const live = sigs
          .filter((s) => !s.err)
          .map((s) => ({
            sig: s.signature,
            label: "tx",
            blockTime: s.blockTime ?? undefined,
          }));
        if (live.length > 0) {
          setEvents(live);
          setIsLive(true);
        }
      } catch {
        // Silently keep seed events - strip never goes blank.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Need at least 2× repeat for seamless marquee loop.
  const tape = [...events, ...events];

  return (
    <div className="border-y border-zinc-900 bg-black/60 backdrop-blur-sm overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-2.5 flex items-center gap-5">
        {/* Live indicator pill */}
        <div className="shrink-0 inline-flex items-center gap-2 text-[10px] font-semibold tracking-[1.5px] uppercase">
          <span className="relative inline-flex items-center justify-center w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-emerald-400">
            {isLive ? "Live" : "Live"} · devnet
          </span>
        </div>

        <div className="h-3 w-px bg-zinc-800 shrink-0" aria-hidden />

        {/* Marquee track */}
        <div className="relative flex-1 overflow-hidden ticker-mask">
          <div className="ticker-track flex gap-8 whitespace-nowrap">
            {tape.map((e, i) => (
              <a
                key={`${e.sig}-${i}`}
                href={explorerUrl(e.sig)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[11px] text-zinc-400 hover:text-emerald-300 transition-colors group"
              >
                <span className="font-mono tabular text-emerald-500/80 group-hover:text-emerald-300">
                  {e.label}
                </span>
                {e.target ? (
                  <span className="text-zinc-600">·</span>
                ) : null}
                {e.target ? (
                  <span className="text-zinc-300 group-hover:text-emerald-200">
                    {e.target}
                  </span>
                ) : null}
                <span className="text-zinc-600">·</span>
                <span className="font-mono tabular text-zinc-500 group-hover:text-emerald-400">
                  {shortSig(e.sig)}
                </span>
                {e.blockTime ? (
                  <>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-500 tabular">
                      {ago(e.blockTime)}
                    </span>
                  </>
                ) : null}
                <span
                  aria-hidden
                  className="text-zinc-700 group-hover:text-emerald-400 transition-colors"
                >
                  →
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Trailing program link - anchor for "see all activity" */}
        <a
          href={`https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`}
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex shrink-0 items-center gap-1 text-[10px] font-medium tracking-[1px] uppercase text-zinc-500 hover:text-emerald-400 transition-colors"
        >
          See all
          <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}
