"use client";

// Runtime-error boundary. Replaces Next.js's default red-screen error
// page with a brand-consistent surface. The user can retry the failed
// render via the Retry button, or escape back to the marketplace.

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to whatever logging infra is wired (none today).
    console.error("[stave] runtime error:", error);
  }, [error]);

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full text-center">
        <div className="text-[11px] font-semibold tracking-[2px] uppercase text-amber-400/90 mb-4">
          Something broke
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] text-fg leading-[1.05] mb-6">
          Hit a snag rendering this page.
        </h1>
        <p className="text-sm text-muted leading-relaxed mb-3 max-w-sm mx-auto">
          Probably transient. Retry — or head back to the marketplace.
        </p>
        {error.digest && (
          <p className="text-[11px] text-muted/60 font-mono mb-6">
            Digest: {error.digest}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 mt-9">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center h-12 rounded-lg bg-accent text-accent-ink font-semibold text-sm px-6 shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:bg-emerald-400 transition-all duration-200"
          >
            Retry
          </button>
          <Link
            href="/"
            className="text-sm text-accent-bright font-medium hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5 group"
          >
            Back to marketplace
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
