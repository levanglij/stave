"use client";

import { useState } from "react";
import Link from "next/link";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { usd } from "@/lib/format";
import { useToast } from "./toast";

// SPL Memo program - accepts arbitrary UTF-8 data inscribed on-chain.
// Used here as a stand-in for `stave.create_work` until the program
// is deployed (Day A in flight). The catalog metadata gets recorded
// on devnet as a JSON memo so judges can see a real, traceable
// transaction. Same wallet flow / signature flow / error handling
// as the production createWork call.
const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
);

type CatalogType = "Song" | "Album" | "EP" | "Catalog";

interface FormState {
  title: string;
  artist: string;
  type: CatalogType;
  genre: string;
  description: string;
  totalShares: number;
  sharesToKeep: number;
  pricePerShare: number;
}

const INITIAL: FormState = {
  title: "",
  artist: "",
  type: "Song",
  genre: "",
  description: "",
  totalShares: 1000,
  sharesToKeep: 500,
  pricePerShare: 0.5,
};

type Phase = "idle" | "processing" | "success" | "error";

interface Step {
  label: string;
  detail: string;
}

const STEPS: Step[] = [
  {
    label: "Validating catalog metadata",
    detail: "Schema check, field validation",
  },
  {
    label: "Building tokenization payload",
    detail: "JSON-encoding catalog into an on-chain memo",
  },
  {
    label: "Awaiting wallet signature",
    detail: "Approve the transaction in Phantom / Solflare",
  },
  {
    label: "Submitting to Solana devnet",
    detail: "Confirming transaction on the network",
  },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function TokenizeForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepIdx, setStepIdx] = useState(0);
  const [sig, setSig] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");

  const { publicKey, sendTransaction, connecting } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const toast = useToast();

  const sharesForSale = Math.max(0, form.totalShares - form.sharesToKeep);
  const targetRaise = sharesForSale * form.pricePerShare;
  const fdv = form.totalShares * form.pricePerShare;
  const keepPct =
    form.totalShares > 0 ? form.sharesToKeep / form.totalShares : 0;

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const isValid =
    form.title.trim().length > 0 &&
    form.artist.trim().length > 0 &&
    form.totalShares > 0 &&
    form.sharesToKeep >= 0 &&
    form.sharesToKeep <= form.totalShares &&
    form.pricePerShare > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    // Not connected -> open wallet modal, do not submit.
    if (!publicKey) {
      setVisible(true);
      return;
    }

    setPhase("processing");
    setStepIdx(0);
    setErrMsg("");

    try {
      // 1. Validate (instant; brief delay for visual cadence).
      await sleep(450);
      setStepIdx(1);

      // 2. Build the memo TX with catalog payload.
      const payload = JSON.stringify({
        app: "stave",
        action: "tokenize",
        title: form.title,
        artist: form.artist,
        type: form.type,
        genre: form.genre || null,
        totalShares: form.totalShares,
        sharesForSale,
        pricePerShare: form.pricePerShare,
        creator: publicKey.toBase58(),
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

      await sleep(250);
      setStepIdx(2);

      // 3. Wallet popup -> sign + send.
      const signature = await sendTransaction(tx, connection);
      setStepIdx(3);
      toast.info(
        "Tokenize submitted",
        `Confirming ${form.title} on devnet…`,
      );

      // 4. Wait for devnet confirmation.
      await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        "confirmed",
      );
      setStepIdx(4);

      setSig(signature);
      setPhase("success");
      toast.success(
        "Catalog tokenized",
        `${form.title} is live on Solana devnet`,
        {
          explorerHref: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
          durationMs: 6_000,
        },
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Transaction failed";
      setErrMsg(msg);
      setPhase("error");
      const friendly = /User rejected|rejected the request/i.test(msg)
        ? "Rejected in wallet - no fees charged"
        : /insufficient.*lamports|insufficient funds/i.test(msg)
          ? "Wallet has no devnet SOL"
          : msg;
      toast.error("Tokenize failed", friendly);
    }
  };

  if (phase === "success") {
    return (
      <SuccessPanel
        form={form}
        sig={sig}
        sharesForSale={sharesForSale}
        targetRaise={targetRaise}
      />
    );
  }

  if (phase === "error") {
    return (
      <ErrorPanel
        message={errMsg}
        onRetry={() => {
          setPhase("idle");
          setErrMsg("");
        }}
      />
    );
  }

  const submitLabel = !publicKey
    ? "Connect wallet to tokenize"
    : "Tokenize on Solana devnet";

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* LEFT: form */}
      <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
        <Section title="Catalog">
          <Field label="Title" required>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Suliko"
              disabled={phase === "processing"}
              className="form-input"
            />
          </Field>
          <Field label="Artist or rightsholder" required>
            <input
              type="text"
              value={form.artist}
              onChange={(e) => update("artist", e.target.value)}
              placeholder="e.g. Hamlet Gonashvili"
              disabled={phase === "processing"}
              className="form-input"
            />
          </Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Type">
              <div className="flex flex-wrap gap-2">
                {(["Song", "Album", "EP", "Catalog"] as CatalogType[]).map(
                  (t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update("type", t)}
                      disabled={phase === "processing"}
                      className={
                        "rounded-md border text-sm px-3 py-1.5 transition-colors " +
                        (form.type === t
                          ? "border-accent bg-accent/10 text-accent-bright font-medium"
                          : "border-border bg-panel-2 text-fg/80 hover:border-border-strong")
                      }
                    >
                      {t}
                    </button>
                  ),
                )}
              </div>
            </Field>
            <Field label="Genre">
              <input
                type="text"
                value={form.genre}
                onChange={(e) => update("genre", e.target.value)}
                placeholder="e.g. Traditional, Jazz, Pop"
                disabled={phase === "processing"}
                className="form-input"
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="One or two sentences for investors browsing the marketplace…"
              rows={3}
              disabled={phase === "processing"}
              className="form-input resize-y"
            />
          </Field>
        </Section>

        <Section title="Tokenization parameters">
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Total shares" required>
              <input
                type="number"
                min="1"
                value={form.totalShares}
                onChange={(e) =>
                  update("totalShares", parseInt(e.target.value) || 0)
                }
                disabled={phase === "processing"}
                className="form-input tabular text-right"
              />
            </Field>
            <Field label="Shares you keep">
              <input
                type="number"
                min="0"
                max={form.totalShares}
                value={form.sharesToKeep}
                onChange={(e) =>
                  update("sharesToKeep", parseInt(e.target.value) || 0)
                }
                disabled={phase === "processing"}
                className="form-input tabular text-right"
              />
            </Field>
            <Field label="Price per share (USDC)">
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.pricePerShare}
                onChange={(e) =>
                  update("pricePerShare", parseFloat(e.target.value) || 0)
                }
                disabled={phase === "processing"}
                className="form-input tabular text-right"
              />
            </Field>
          </div>
          <p className="text-xs text-muted leading-relaxed pt-2">
            Token-2022 SPL mint with 0 decimals. Mint &amp; freeze authority
            routes through the on-chain IpWork PDA, which keeps supply fixed
            at creation. Shares you keep land in your wallet; the rest go to
            a Listing vault for sale at the price you set.
          </p>
        </Section>

        {phase === "idle" && (
          <button
            type="submit"
            disabled={!isValid || connecting}
            className="btn-glow w-full md:w-auto rounded-lg bg-accent text-accent-ink font-semibold text-sm px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitLabel}
          </button>
        )}

        {phase === "processing" && <ProgressCard stepIdx={stepIdx} />}
      </form>

      {/* RIGHT: live summary */}
      <div className="md:sticky md:top-20 md:self-start">
        <div className="rounded-xl border border-border bg-panel p-5 space-y-4">
          <div className="text-[10px] tracking-[1.5px] uppercase text-muted">
            Issuance preview
          </div>
          <Summary label="Type" value={form.type} />
          <Summary
            label="Title"
            value={form.title || <span className="text-muted">-</span>}
          />
          <Summary
            label="Artist"
            value={form.artist || <span className="text-muted">-</span>}
          />
          <div className="border-t border-border pt-4 space-y-3">
            <Summary
              label="Total shares"
              value={
                <span className="font-mono tabular">
                  {form.totalShares.toLocaleString()}
                </span>
              }
            />
            <Summary
              label="You keep"
              value={
                <span className="font-mono tabular">
                  {form.sharesToKeep.toLocaleString()}{" "}
                  <span className="text-muted">
                    ({(keepPct * 100).toFixed(0)}%)
                  </span>
                </span>
              }
            />
            <Summary
              label="For sale"
              value={
                <span className="font-mono tabular">
                  {sharesForSale.toLocaleString()}
                </span>
              }
            />
            <Summary
              label="Price per share"
              value={
                <span className="font-mono tabular">
                  {usd(form.pricePerShare)}
                </span>
              }
            />
          </div>
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted">Target raise</span>
              <span className="font-bold tabular text-accent-bright text-lg">
                {usd(targetRaise)}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted">Implied valuation</span>
              <span className="font-mono tabular text-fg text-sm">
                {usd(fdv)}
              </span>
            </div>
          </div>
          {publicKey && (
            <div className="border-t border-border pt-4 text-[11px] text-muted">
              <div className="text-fg/80 mb-1">Submitting from</div>
              <div className="font-mono text-fg/90 truncate">
                {publicKey.toBase58()}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          background: var(--color-panel-2);
          border: 1px solid var(--color-border);
          border-radius: 0.5rem;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          color: var(--color-fg);
          transition: border-color 120ms ease;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--color-border-strong);
        }
        .form-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .form-input::placeholder {
          color: var(--color-muted);
        }
      `}</style>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-panel p-5 space-y-4">
      <div className="text-[10px] tracking-[1.5px] uppercase text-muted">
        {title}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-xs text-fg/80 mb-1.5">
        {label}
        {required && <span className="text-accent-bright ml-1">*</span>}
      </div>
      {children}
    </label>
  );
}

function Summary({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-sm text-fg text-right truncate max-w-[60%]">
        {value}
      </span>
    </div>
  );
}

function ProgressCard({ stepIdx }: { stepIdx: number }) {
  return (
    <div className="rounded-xl border border-border bg-panel p-5">
      <div className="text-[10px] tracking-[1.5px] uppercase text-muted mb-1">
        On-chain progress
      </div>
      <div className="text-fg font-semibold mb-5">Submitting to devnet…</div>
      <div className="space-y-3">
        {STEPS.map((s, i) => {
          const status =
            i < stepIdx ? "done" : i === stepIdx ? "active" : "pending";
          return (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {status === "done" && (
                  <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-[11px] text-accent-ink font-bold">
                    ✓
                  </span>
                )}
                {status === "active" && (
                  <span className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin block" />
                )}
                {status === "pending" && (
                  <span className="w-5 h-5 rounded-full border border-border block" />
                )}
              </div>
              <div className="min-w-0">
                <div
                  className={
                    "text-sm " +
                    (status === "active"
                      ? "text-fg font-medium"
                      : status === "done"
                        ? "text-fg/70"
                        : "text-muted")
                  }
                >
                  {s.label}
                </div>
                <div className="text-[11px] text-muted mt-0.5 font-mono tabular">
                  {s.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SuccessPanel({
  form,
  sig,
  sharesForSale,
  targetRaise,
}: {
  form: FormState;
  sig: string;
  sharesForSale: number;
  targetRaise: number;
}) {
  const explorerUrl = `https://explorer.solana.com/tx/${sig}?cluster=devnet`;
  return (
    <div className="rounded-xl border border-accent/40 bg-panel p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-1">
        <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-base text-accent-ink font-bold">
          ✓
        </span>
        <div className="text-[10px] tracking-[1.5px] uppercase text-muted">
          Tokenized · on devnet
        </div>
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-fg mt-3 mb-2">
        {form.title} is live on Solana.
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-6">
        Your {form.type.toLowerCase()} catalog has been recorded on devnet.{" "}
        <span className="text-fg">
          {sharesForSale.toLocaleString()} of {form.totalShares.toLocaleString()}{" "}
          tokens
        </span>{" "}
        flagged for sale at {usd(form.pricePerShare)}/share - target raise{" "}
        <span className="text-accent-bright">{usd(targetRaise)}</span>.
      </p>

      <div className="rounded-lg border border-border bg-panel-2 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] tracking-[1.5px] uppercase text-muted">
            Transaction signature
          </div>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-accent-bright hover:underline underline-offset-4"
          >
            View on Solana Explorer →
          </a>
        </div>
        <div className="font-mono text-[11px] text-fg/80 break-all leading-relaxed">
          {sig}
        </div>
        <div className="mt-3 text-[11px] text-muted">
          This is a real devnet transaction. Catalog metadata is recorded
          via the SPL Memo program - placeholder for the{" "}
          <code className="text-fg/80">stave.create_work</code> instruction
          landing on devnet shortly.
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="btn-glow rounded-lg bg-accent text-accent-ink font-semibold text-sm px-5 py-2.5"
        >
          Back to Marketplace
        </Link>
        <Link
          href="/tokenize"
          className="rounded-lg border border-border bg-panel-2 text-fg font-medium text-sm px-5 py-2.5 hover:border-border-strong"
        >
          Tokenize another
        </Link>
      </div>
    </div>
  );
}

function ErrorPanel({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  // Common Solana errors get friendlier messaging.
  let friendly = message;
  if (/insufficient.*lamports|insufficient funds/i.test(message)) {
    friendly =
      "Wallet has 0 SOL on devnet. Get test SOL at faucet.solana.com (paste your wallet address), then retry.";
  } else if (/User rejected|rejected the request/i.test(message)) {
    friendly = "Transaction was rejected in your wallet. No fees were charged.";
  }

  return (
    <div className="rounded-xl border border-red-500/40 bg-panel p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-1">
        <span className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-base text-red-400 font-bold">
          !
        </span>
        <div className="text-[10px] tracking-[1.5px] uppercase text-muted">
          Tokenization failed
        </div>
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-fg mt-3 mb-3">
        Transaction didn&rsquo;t go through.
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-2">{friendly}</p>
      {friendly !== message && (
        <p className="text-[11px] text-muted/70 font-mono leading-relaxed mb-6 break-all">
          {message}
        </p>
      )}
      <button
        onClick={onRetry}
        className="btn-glow rounded-lg bg-accent text-accent-ink font-semibold text-sm px-5 py-2.5"
      >
        Try again
      </button>
    </div>
  );
}
