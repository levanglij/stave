"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import type { Listing } from "@/lib/types";
import { usd, pct } from "@/lib/format";
import { getHeadlineStats } from "@/lib/headline-stats";
import { useToast } from "./toast";

// SPL Memo program — placeholder for `stave.buy_shares` until the
// program is deployed to devnet. The buy intent gets recorded
// on-chain as JSON; same wallet flow as Tokenize.
const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
);

const TOTAL_SHARES = 1000;
const AVAILABLE = 500;

type Phase = "idle" | "processing" | "success" | "error";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function PurchasePanel({ listing }: { listing: Listing }) {
  const [qty, setQty] = useState(10);
  const [phase, setPhase] = useState<Phase>("idle");
  const [sig, setSig] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const { publicKey, sendTransaction, connecting } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const toast = useToast();

  const total = qty * listing.price;
  const { annualYield } = getHeadlineStats(listing);

  const handleBuy = async () => {
    if (!publicKey) {
      setVisible(true);
      return;
    }

    setPhase("processing");
    setErrMsg("");

    try {
      await sleep(300);

      const payload = JSON.stringify({
        app: "stave",
        action: "buy",
        catalogId: listing.catalog_id,
        title: listing.title,
        quantity: qty,
        pricePerShare: listing.price,
        total,
        buyer: publicKey.toBase58(),
        ts: Math.floor(Date.now() / 1000),
      });

      const tx = new Transaction().add(
        new TransactionInstruction({
          keys: [],
          programId: MEMO_PROGRAM_ID,
          data: Buffer.from(payload, "utf-8"),
        }),
      );

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      const signature = await sendTransaction(tx, connection);
      toast.info(
        "Buy intent submitted",
        `Confirming ${qty} share${qty !== 1 ? "s" : ""} of ${listing.title}…`,
      );
      await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        "confirmed",
      );

      setSig(signature);
      setPhase("success");
      toast.success(
        "Buy intent confirmed",
        `${qty} share${qty !== 1 ? "s" : ""} of ${listing.title} · ${usd(total)}`,
        {
          explorerHref: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
          durationMs: 6_000,
        },
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Transaction failed";
      setErrMsg(msg);
      setPhase("error");
      // The inline error block already shows the friendly message;
      // the toast is the at-a-glance signal so users notice without
      // scrolling.
      const friendly = /User rejected|rejected the request/i.test(msg)
        ? "Rejected in wallet — no fees charged"
        : /insufficient.*lamports|insufficient funds/i.test(msg)
          ? "Wallet has no devnet SOL"
          : msg;
      toast.error("Transaction failed", friendly);
    }
  };

  const buttonLabel = !publicKey
    ? `Connect wallet to buy`
    : phase === "processing"
      ? "Confirming on devnet…"
      : `Buy ${qty} token${qty !== 1 ? "s" : ""}`;

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
              disabled={phase === "processing"}
              className="rounded-md border border-border bg-panel-2 hover:border-border-strong w-10 text-fg text-lg leading-none transition-colors disabled:opacity-50"
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
              disabled={phase === "processing"}
              className="flex-1 bg-panel-2 border border-border rounded-md text-center text-fg font-mono tabular text-base py-2 focus:outline-none focus:border-border-strong disabled:opacity-50"
            />
            <button
              onClick={() => setQty((q) => Math.min(AVAILABLE, q + 1))}
              disabled={phase === "processing"}
              className="rounded-md border border-border bg-panel-2 hover:border-border-strong w-10 text-fg text-lg leading-none transition-colors disabled:opacity-50"
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
          onClick={handleBuy}
          disabled={connecting || phase === "processing" || phase === "success"}
          className="btn-glow w-full rounded-lg bg-accent text-accent-ink font-semibold text-sm py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {phase === "processing" && (
            <span className="w-4 h-4 rounded-full border-2 border-accent-ink border-t-transparent animate-spin" />
          )}
          {phase === "success" && <span>✓</span>}
          {buttonLabel}
        </button>

        {/* Devnet-funds callout — only shown once a wallet is connected,
            so first-time visitors aren't distracted by faucet links
            until they actually need them. */}
        {publicKey && phase === "idle" && (
          <div className="text-[10px] text-muted/70 text-center leading-relaxed">
            Need devnet funds?{" "}
            <a
              href="https://faucet.solana.com"
              target="_blank"
              rel="noreferrer"
              className="text-accent-bright/80 hover:text-accent-bright hover:underline"
            >
              SOL faucet
            </a>
            {" · "}
            <a
              href="https://faucet.circle.com"
              target="_blank"
              rel="noreferrer"
              className="text-accent-bright/80 hover:text-accent-bright hover:underline"
            >
              USDC devnet
            </a>
          </div>
        )}

        {phase === "success" && (
          <a
            href={`https://explorer.solana.com/tx/${sig}?cluster=devnet`}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg border border-accent/40 bg-accent/5 p-3 text-xs"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-accent-bright font-semibold">
                Buy intent recorded
              </span>
              <span className="text-muted">View on Explorer →</span>
            </div>
            <div className="font-mono text-[10px] text-fg/70 break-all leading-relaxed">
              {sig.slice(0, 32)}…{sig.slice(-16)}
            </div>
            <div className="text-[10px] text-muted mt-1.5">
              Settles when <code className="text-fg/80">buy_shares</code> ships
              on devnet.
            </div>
          </a>
        )}

        {phase === "error" && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/5 p-3 text-xs">
            <div className="text-red-400 font-semibold mb-1">
              Transaction failed
            </div>
            <div className="text-fg/80 leading-relaxed">
              {/insufficient.*lamports|insufficient funds/i.test(errMsg)
                ? "Wallet has 0 SOL on devnet. Get test SOL at faucet.solana.com, then retry."
                : /User rejected|rejected the request/i.test(errMsg)
                  ? "Transaction rejected in your wallet. No fees were charged."
                  : errMsg}
            </div>
            <button
              onClick={() => setPhase("idle")}
              className="mt-2 text-[11px] text-accent-bright hover:underline"
            >
              Try again
            </button>
          </div>
        )}

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
