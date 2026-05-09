import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full text-center">
        <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-4">
          404 · Not found
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-[-0.03em] text-fg leading-[0.95] mb-6">
          That page doesn&rsquo;t{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
            exist.
          </span>
        </h1>
        <p className="text-base text-muted leading-relaxed mb-9 max-w-sm mx-auto">
          Or it moved. Either way - the marketplace is one click away.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-12 rounded-lg bg-accent text-accent-ink font-semibold text-sm px-6 shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:bg-emerald-400 transition-all duration-200"
          >
            Back to marketplace
          </Link>
          <Link
            href="/how-it-works"
            className="text-sm text-accent-bright font-medium hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5 group"
          >
            How Stave works
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
