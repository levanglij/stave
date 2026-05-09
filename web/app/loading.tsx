// Default loading state shown by Next.js's app-router during route
// transitions. Keeps the shell visible (nav + footer survive the
// route change), only the main content area shows this skeleton.
//
// Two pulsing emerald dots on a dark background - minimal, on-brand,
// doesn't draw attention to itself.
export default function Loading() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <div
        className="flex items-center gap-2"
        role="status"
        aria-label="Loading"
      >
        <span
          className="w-2 h-2 rounded-full bg-accent-bright animate-pulse"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-accent-bright animate-pulse"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-accent-bright animate-pulse"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </main>
  );
}
