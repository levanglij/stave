import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-semibold tracking-tight mb-4 text-fg">
        Catalog not found
      </h1>
      <p className="text-muted max-w-md">
        The catalog you&rsquo;re looking for isn&rsquo;t listed. It may have
        been delisted or never rated.
      </p>
      <Link
        href="/"
        className="mt-8 text-sm text-accent-bright hover:underline underline-offset-4"
      >
        ← Back to Marketplace
      </Link>
    </main>
  );
}
