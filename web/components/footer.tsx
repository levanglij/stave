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
    <footer className="border-t border-border mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-14">
        <div className="grid gap-10 md:gap-8 grid-cols-2 md:grid-cols-[1.4fr_repeat(4,1fr)]">
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
            <p className="text-xs text-muted leading-relaxed max-w-xs">
              The rating layer for music royalty assets. Open methodology,
              fractional shares, settlement on Solana.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.heading}>
              <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-muted mb-3">
                {col.heading}
              </div>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="mt-12 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted">
          <span className="font-mono tabular">© 2026 Stave</span>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span>Devnet preview</span>
            <span aria-hidden>·</span>
            <span>
              Data via{" "}
              <span className="text-fg/80">
                Intellectual Property Owners Association (IPOA)
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ item }: { item: LinkItem }) {
  const cls = "text-sm text-muted hover:text-fg transition-colors";
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
