import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-semibold tracking-tight mb-4">
        Issuance not found
      </h1>
      <p className="text-neutral-400 max-w-md">
        The catalog you&rsquo;re looking for isn&rsquo;t listed. It may have
        been delisted or never rated.
      </p>
      <Link
        href="/"
        className="mt-8 text-sm text-emerald-400 hover:text-emerald-300 underline-offset-4 hover:underline"
      >
        ← Back to all issuances
      </Link>
    </main>
  );
}
