import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "./connect-button";

const NAV_ITEMS = [
  { label: "Marketplace", href: "/", active: false },
  { label: "Tokenize", href: "/tokenize", active: false },
  { label: "Indices", href: "#", active: false, soon: true },
  { label: "Methodology", href: "#", active: false, soon: true },
  { label: "Portfolio", href: "#", active: false, soon: true },
];

export function NavHeader() {
  return (
    <header className="border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Stave home">
          <Image
            src="/logo.svg"
            alt="Stave"
            width={140}
            height={40}
            priority
          />
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-disabled={item.soon}
              className={
                "px-3 py-1.5 rounded-md transition-colors " +
                (item.active
                  ? "text-fg bg-panel"
                  : item.soon
                  ? "text-muted/60 cursor-default pointer-events-none"
                  : "text-muted hover:text-fg")
              }
            >
              {item.label}
              {item.soon && (
                <span className="ml-1.5 text-[10px] uppercase tracking-wider text-muted/40">
                  soon
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[10px] tracking-widest uppercase border border-border rounded-full px-2 py-0.5 text-muted">
            devnet · mock
          </span>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
