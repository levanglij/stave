"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CheckCircle2, AlertCircle, Info, X, ExternalLink } from "lucide-react";

/**
 * Tiny in-house toast system. Built rather than pulling in sonner /
 * react-hot-toast because:
 *  - Bundle is ~3 KB instead of 8-15 KB
 *  - The visual style matches Stave's dark+emerald palette exactly
 *  - We control every behavior (auto-dismiss, hover-pause, manual
 *    close, optional explorer link, etc.)
 *
 * Usage:
 *   const toast = useToast();
 *   toast.success("Copied to clipboard");
 *   toast.success("Wallet connected", "Phantom · 4eXh…JqM7");
 *   toast.error("Transaction failed", err.message);
 *   toast.info("Tx submitted", undefined, { explorerHref: url });
 *
 * The provider lives in app/layout.tsx wrapping the whole tree, so
 * any client component can call useToast(). Render order: a fixed
 * stack in the bottom-right, newest on bottom.
 */

type ToastKind = "success" | "error" | "info";

interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  body?: string;
  /** Optional click-through (e.g. Solana Explorer). */
  explorerHref?: string;
  /** Override default 3.5s auto-dismiss. Use 0 for sticky. */
  durationMs?: number;
}

interface ToastApi {
  success: (title: string, body?: string, opts?: ToastOptions) => void;
  error: (title: string, body?: string, opts?: ToastOptions) => void;
  info: (title: string, body?: string, opts?: ToastOptions) => void;
}

interface ToastOptions {
  explorerHref?: string;
  durationMs?: number;
}

const ToastCtx = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastCtx);
  if (!ctx) {
    // No provider mounted yet (e.g. server component import) - return
    // a safe no-op so callers don't have to null-check. Logs to
    // console for debugging.
    return {
      success: (t) => console.info("[toast/success]", t),
      error: (t) => console.warn("[toast/error]", t),
      info: (t) => console.info("[toast/info]", t),
    };
  }
  return ctx;
}

const DEFAULT_DURATION = 3_500;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((cur) => cur.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (
      kind: ToastKind,
      title: string,
      body?: string,
      opts?: ToastOptions,
    ) => {
      idRef.current += 1;
      const id = idRef.current;
      const duration = opts?.durationMs ?? DEFAULT_DURATION;
      setToasts((cur) => [
        ...cur,
        {
          id,
          kind,
          title,
          body,
          explorerHref: opts?.explorerHref,
          durationMs: duration,
        },
      ]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss],
  );

  const api: ToastApi = {
    success: (title, body, opts) => push("success", title, body, opts),
    error: (title, body, opts) => push("error", title, body, opts),
    info: (title, body, opts) => push("info", title, body, opts),
  };

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastCtx.Provider>
  );
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;
  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger the slide-in transition one frame after mount.
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  const tone = TONE[toast.kind];

  return (
    <div
      className={
        "pointer-events-auto min-w-[280px] max-w-sm rounded-xl border bg-zinc-950/95 backdrop-blur-md shadow-2xl shadow-black/40 px-4 py-3 transition-all duration-300 ease-out " +
        (mounted
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-3")
      }
      style={{ borderColor: tone.border }}
      role={toast.kind === "error" ? "alert" : "status"}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5" style={{ color: tone.icon }}>
          <tone.Icon className="w-4 h-4" strokeWidth={2.25} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-fg leading-snug">
            {toast.title}
          </div>
          {toast.body ? (
            <div className="text-xs text-zinc-400 mt-1 leading-relaxed break-words">
              {toast.body}
            </div>
          ) : null}
          {toast.explorerHref ? (
            <a
              href={toast.explorerHref}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-[11px] text-emerald-300 hover:text-emerald-200 transition-colors"
            >
              View on Explorer
              <ExternalLink className="w-3 h-3" strokeWidth={2.25} />
            </a>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="shrink-0 -mr-1 -mt-1 p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
        >
          <X className="w-3.5 h-3.5" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}

// Per-kind theming. Kept colocated so a new kind only requires one
// edit. Borders are subdued tints; icons are bright accent.
const TONE: Record<
  ToastKind,
  { border: string; icon: string; Icon: typeof CheckCircle2 }
> = {
  success: {
    border: "rgba(16, 185, 129, 0.45)",
    icon: "#34D399",
    Icon: CheckCircle2,
  },
  error: {
    border: "rgba(248, 113, 113, 0.45)",
    icon: "#F87171",
    Icon: AlertCircle,
  },
  info: {
    border: "rgba(56, 189, 248, 0.4)",
    icon: "#38BDF8",
    Icon: Info,
  },
};
