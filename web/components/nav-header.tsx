"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ConnectButton } from "./connect-button";
import { SoonChip } from "./SoonChip";

interface NavItem {
  label: string;
  href: string;
  soon?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Indices", href: "/indices", soon: true },
  { label: "How it works", href: "/how-it-works" },
  { label: "Partners", href: "/partners" },
  { label: "For artists", href: "/for-artists" },
];

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function NavHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo — bumped ~30% from 180/52 to 234/68 */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          aria-label="Stave home"
        >
          <Image
            src="/logo.svg"
            alt="Stave"
            width={234}
            height={68}
            priority
            className="h-11 w-auto md:h-12"
          />
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1 text-sm">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={
                  "px-3 py-1.5 rounded-md transition-colors relative " +
                  (active
                    ? "text-fg bg-panel"
                    : "text-muted hover:text-fg hover:bg-panel/50")
                }
                aria-current={active ? "page" : undefined}
              >
                <span className="inline-flex items-center gap-1.5">
                  {item.label}
                  {item.soon && <SoonChip />}
                </span>
                {active && (
                  <span
                    aria-hidden
                    className="absolute left-3 right-3 -bottom-px h-px bg-accent-bright"
                  />
                )}
              </Link>
            );
          })}
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
