// Skeleton for the indices page. Two-column grid of basket cards,
// each with a header row, a 3-stat row, a stacked composition bar,
// and a CVaR footer. Matches /indices layout so the transition from
// marketplace → indices feels instant.

export default function IndicesLoading() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
          <div className="max-w-2xl">
            <Sk className="h-2.5 w-20 mb-3" />
            <Sk className="h-12 md:h-14 w-3/4 mb-4" />
            <Sk className="h-4 w-full max-w-lg mb-1.5" />
            <Sk className="h-4 w-2/3" />
          </div>
          <div className="text-right space-y-2">
            <Sk className="h-3 w-44 ml-auto" />
            <Sk className="h-3 w-36 ml-auto" />
          </div>
        </div>

        {/* 4 basket cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <BasketCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}

function BasketCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-gradient-to-b from-zinc-900/60 to-zinc-950/60 p-5">
      {/* Header: ticker badge + name + rating chip */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <Sk className="w-11 h-11 rounded-lg shrink-0" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Sk className="h-4 w-40" />
            <Sk className="h-3 w-32" />
          </div>
        </div>
        <Sk className="h-5 w-12 rounded-full" />
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="space-y-1.5">
          <Sk className="h-2.5 w-16" />
          <Sk className="h-6 w-20" />
        </div>
        <div className="space-y-1.5">
          <Sk className="h-2.5 w-16" />
          <Sk className="h-6 w-12" />
        </div>
        <div className="space-y-1.5">
          <Sk className="h-2.5 w-12" />
          <Sk className="h-6 w-14" />
        </div>
      </div>

      {/* Composition: stacked bar + legend */}
      <div className="space-y-2">
        <Sk className="h-2.5 w-24" />
        <Sk className="h-2 w-full rounded-full" />
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1">
          <Sk className="h-3 w-24" />
          <Sk className="h-3 w-28" />
          <Sk className="h-3 w-20" />
        </div>
      </div>

      {/* CVaR footer */}
      <div className="mt-5 pt-4 border-t border-zinc-800/60 flex items-baseline justify-between">
        <Sk className="h-3 w-40" />
        <Sk className="h-3 w-14" />
      </div>
    </div>
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
