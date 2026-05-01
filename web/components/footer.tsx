import Link from "next/link";

const LINKS = [
  { label: "GitHub", href: "https://github.com/levanglij/stave", external: true },
  { label: "Methodology", href: "https://github.com/levanglij/stave/blob/main/engine/FORMULAS.md", external: true },
  { label: "Architecture", href: "https://github.com/levanglij/stave/blob/main/docs/02-architecture.md", external: true },
  { label: "Submission", href: "https://github.com/levanglij/stave/blob/main/SUBMISSION.md", external: true },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="font-mono tabular">© 2026 Stave</span>
          <span aria-hidden>·</span>
          <span>Devnet prototype, not production</span>
          <span aria-hidden>·</span>
          <span>
            Data via{" "}
            <span className="text-fg/80">Intellectual Property Owners Association (IPOA)</span>
          </span>
        </div>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noreferrer" : undefined}
              className="text-muted hover:text-fg transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
