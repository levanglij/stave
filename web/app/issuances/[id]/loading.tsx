// Skeleton for catalog detail pages. Mirrors the live layout so
// route transitions don't introduce jumps. Renders during navigation
// from /marketplace → /issuances/[id], and during the brief moment
// any client-fetched data (on-chain status) hydrates.

export default function CatalogLoading() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back link */}
        <Sk className="h-4 w-32 mb-6" />

        {/* Tags + Watch/Share row */}
        <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
          <div className="flex flex-wrap items-center gap-2">
            <Sk className="h-6 w-24 rounded-full" />
            <Sk className="h-6 w-20 rounded-full" />
            <Sk className="h-6 w-28 rounded-full" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Sk className="h-7 w-20 rounded-md" />
            <Sk className="h-7 w-20 rounded-md" />
          </div>
        </div>

        {/* Title + subtitle + meta */}
        <Sk className="h-12 md:h-14 w-2/3 mb-3" />
        <Sk className="h-4 w-1/3 mb-3" />
        <Sk className="h-3 w-64 mb-8" />

        <div className="border-t border-border mb-8" />

        {/* Hero: waveform (2/3) + purchase panel (1/3) */}
        <div className="grid md:grid-cols-3 gap-6 mb-2">
          <div className="md:col-span-2">
            <Sk className="aspect-[16/9] md:aspect-[2/1] w-full rounded-2xl" />
          </div>
          <div>
            <Sk className="h-[420px] w-full rounded-2xl" />
          </div>
        </div>

        {/* On-chain strip placeholder (matches OnchainStatus height
            roughly - only renders for bootstrapped catalogs, but the
            skeleton always shows a strip for consistency. */}
        <div className="mt-6">
          <Sk className="h-44 w-full rounded-xl" />
        </div>

        {/* Tabs */}
        <div className="border-b border-border mt-8 mb-6 flex gap-1 overflow-x-auto">
          <Sk className="h-9 w-24" />
          <Sk className="h-9 w-24 ml-2" />
          <Sk className="h-9 w-32 ml-2" />
        </div>

        {/* 4-stat row + Returns Calculator */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Sk className="h-24 rounded-xl" />
              <Sk className="h-24 rounded-xl" />
              <Sk className="h-24 rounded-xl" />
              <Sk className="h-24 rounded-xl" />
            </div>
            <Sk className="h-32 rounded-xl" />
          </div>
          <div>
            <Sk className="h-[360px] rounded-xl" />
          </div>
        </div>

        <div className="border-t border-border my-12" />

        {/* Engine breakdown title block */}
        <div className="mb-6">
          <Sk className="h-2.5 w-40 mb-2" />
          <Sk className="h-7 w-72 mb-3" />
          <Sk className="h-3 w-3/4" />
        </div>

        {/* Factor breakdown + side panel */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Sk className="md:col-span-2 h-72 rounded-xl" />
          <Sk className="h-72 rounded-xl" />
        </div>
      </div>
    </main>
  );
}

function Sk({ className = "" }: { className?: string }) {
  return (
    <div
      className={
        "rounded animate-pulse bg-zinc-800/60 " + className
      }
    />
  );
}
