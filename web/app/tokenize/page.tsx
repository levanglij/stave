import type { Metadata } from "next";
import { TokenizeForm } from "@/components/tokenize-form";

export const metadata: Metadata = {
  title: "Tokenize a catalog · Stave",
  description:
    "Mint Token-2022 fractional shares for any music catalog — songs, albums, full discographies. Investors and fans buy fractional shares and earn pro-rata royalties.",
};

export default function TokenizePage() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-10">
          <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-3">
            Tokenize
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-fg mb-4 text-balance">
            Mint your catalog into{" "}
            <span className="text-accent-bright">fractional shares.</span>
          </h1>
          <p className="text-muted text-base leading-relaxed max-w-2xl">
            Any music IP — a single song, an album, a back catalog — can be
            split into fungible Token-2022 shares on Solana. You keep the cut
            you want, list the rest at a price you set, and shareholders earn
            pro-rata royalties as your catalog generates revenue.
          </p>
        </div>

        <TokenizeForm />

        <div className="mt-16 pt-8 border-t border-border">
          <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-3">
            What happens on submit
          </div>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <Step
              n={1}
              title="Validate"
              detail="Schema check on your inputs and a hash of the cover art / audio preview if attached."
            />
            <Step
              n={2}
              title="Mint share supply"
              detail="A Token-2022 mint is created with 0 decimals. Mint authority is the IpWork PDA, so total supply is fixed."
            />
            <Step
              n={3}
              title="On-chain registry"
              detail="An IpWork PDA is created (seeds: work, creator, work_id) recording you as the creator and the catalog metadata URI."
            />
            <Step
              n={4}
              title="List on Marketplace"
              detail="A Listing PDA is created. Shares you marked for sale move to a vault; the rest go to your wallet."
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function Step({ n, title, detail }: { n: number; title: string; detail: string }) {
  return (
    <div className="rounded-xl border border-border bg-panel p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 rounded-full bg-panel-2 border border-border flex items-center justify-center text-[11px] font-semibold text-fg tabular">
          {n}
        </span>
        <span className="text-fg font-semibold text-sm">{title}</span>
      </div>
      <p className="text-xs text-muted leading-relaxed">{detail}</p>
    </div>
  );
}
