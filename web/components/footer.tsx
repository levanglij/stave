import Link from "next/link";
import Image from "next/image";

interface LinkItem {
  label: string;
  href: string;
  external?: boolean;
}

const COLS: { heading: string; items: LinkItem[] }[] = [
  {
    heading: "Product",
    items: [
      { label: "Marketplace", href: "/marketplace" },
      { label: "Indices", href: "/indices" },
      { label: "For artists", href: "/for-artists" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Partners", href: "/partners" },
    ],
  },
  {
    heading: "Methodology",
    items: [
      {
        label: "Formulae",
        href: "https://github.com/levanglij/stave/blob/main/engine/FORMULAS.md",
        external: true,
      },
      {
        label: "Architecture",
        href: "https://github.com/levanglij/stave/blob/main/docs/02-architecture.md",
        external: true,
      },
      {
        label: "Submission",
        href: "https://github.com/levanglij/stave/blob/main/SUBMISSION.md",
        external: true,
      },
      {
        label: "Engine roadmap",
        href: "https://github.com/levanglij/stave/blob/main/docs/08-engine-roadmap.md",
        external: true,
      },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About", href: "/how-it-works" },
      { label: "Contact", href: "mailto:lgvarishvili@gmail.com", external: true },
      {
        label: "GitHub",
        href: "https://github.com/levanglij/stave",
        external: true,
      },
    ],
  },
  {
    heading: "Legal",
    items: [
      {
        label: "Legal roadmap",
        href: "https://github.com/levanglij/stave/blob/main/docs/10-legal-roadmap.md",
        external: true,
      },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 mt-24 pt-20">
      <div className="max-w-6xl mx-auto px-6 pb-14">
        <div className="grid gap-10 md:gap-10 grid-cols-2 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* Brand block */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-4"
              aria-label="Stave home"
            >
              <Image
                src="/logo.svg"
                alt="Stave"
                width={180}
                height={52}
                className="h-9 w-auto"
              />
            </Link>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
              Music royalties, made investable. Transparent grading, fractional
              shares, settlement on Solana.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.heading}>
              <div className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-4">
                {col.heading}
              </div>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Hackathon disclaimer — long form */}
        <div className="mt-12 pt-6 border-t border-zinc-900 max-w-3xl mx-auto text-center">
          <p className="text-[11px] italic text-zinc-500 leading-relaxed">
            Stave is a hackathon prototype built for demonstration purposes.
            The platform, scores, and any displayed return profiles are
            illustrative only. This is not an offer to sell securities, an
            investment recommendation, or financial advice. No real funds
            are managed or deployed through this interface.
          </p>
        </div>

        {/* Bottom strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-zinc-500 text-center">
          <span className="font-mono tabular">© 2026 Stave</span>
          <span aria-hidden>·</span>
          <span>Devnet preview</span>
          <span aria-hidden>·</span>
          <span>
            Data via{" "}
            <span className="text-zinc-300">
              Intellectual Property Owners Association (IPOA)
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ item }: { item: LinkItem }) {
  const cls = "text-sm text-zinc-400 hover:text-zinc-100 transition-colors";
  if (item.external) {
    return (
      <a
        href={item.href}
        target={item.href.startsWith("mailto:") ? undefined : "_blank"}
        rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}
        className={cls}
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} className={cls}>
      {item.label}
    </Link>
  );
}
