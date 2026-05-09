// Skeleton shown by Next.js App Router during route transitions into
// the marketplace. Matches the real page's layout closely so there's
// no jump when listings hydrate. Pure CSS - animate-pulse from
// Tailwind handles the shimmer.

export default function MarketplaceLoading() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Header eyebrow + title block */}
        <div className="mb-3">
          <Sk className="h-2.5 w-32 mb-3" />
          <Sk className="h-12 md:h-16 w-3/4" />
        </div>
        <Sk className="h-3 w-72 mt-2 mb-8" />

        {/* Filter row - outline-pill placeholders */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Sk className="h-9 w-24 rounded-full" />
          <Sk className="h-9 w-32 rounded-full" />
          <Sk className="h-9 w-28 rounded-full" />
          <Sk className="h-9 w-24 rounded-full" />
        </div>

        {/* Listing grid - 8 skeleton cards (matches actual count). */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>

        <div className="mt-4">
          <Sk className="h-3 w-80" />
        </div>
      </div>
    </main>
  );
}

function ListingCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-gradient-to-b from-zinc-900/60 to-zinc-950/60 p-4">
      {/* Cover - square gradient placeholder */}
      <Sk className="aspect-square w-full rounded-lg mb-4" />
      {/* Title row */}
      <div className="flex items-start justify-between gap-3 mb-1">
        <Sk className="h-4 w-2/3" />
        <Sk className="h-4 w-10 rounded-full" />
      </div>
      {/* Artist */}
      <Sk className="h-3 w-1/2 mb-4" />
      {/* Stat row */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800/60">
        <div>
          <Sk className="h-2 w-10 mb-1.5" />
          <Sk className="h-4 w-16" />
        </div>
        <div className="text-right">
          <Sk className="h-2 w-12 mb-1.5 ml-auto" />
          <Sk className="h-4 w-14 ml-auto" />
        </div>
      </div>
    </div>
  );
}

// Small skeleton primitive - same color treatment everywhere so the
// shimmer reads as a coherent loading state. animate-pulse gives the
// gentle opacity oscillation; the tone matches the Stave panel
// background (slightly lighter than bg) so it sits inside the dark
// theme without glaring.
function Sk({ className = "" }: { className?: string }) {
  return (
    <div
      className={
        "rounded animate-pulse bg-zinc-800/60 " + className
      }
    />
  );
}
