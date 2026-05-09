"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
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
  { label: "For artists", href: "/for-artists", soon: true },
];

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function NavHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the menu whenever the route changes (link tap → navigation).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // ESC closes; lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo - bumped ~30% from 180/52 to 234/68 */}
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

        {/* Desktop nav - hidden under md */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
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

        {/* Right side - desktop */}
        <div className="hidden md:flex items-center gap-3 text-sm">
          <span className="text-[10px] tracking-widest uppercase border border-border rounded-full px-2 py-0.5 text-muted">
            devnet · mock
          </span>
          <ConnectButton />
        </div>

        {/* Hamburger - visible only under md */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-border text-muted hover:text-fg hover:border-zinc-700 transition-colors"
        >
          {open ? (
            <X className="w-5 h-5" strokeWidth={1.75} />
          ) : (
            <Menu className="w-5 h-5" strokeWidth={1.75} />
          )}
        </button>
      </div>

      {/* Mobile drawer - full-bleed sheet that slides down from the
          header. Uses absolute (not fixed) so it docks to the sticky
          header rather than overlaying weirdly on iOS Safari. */}
      <div
        id="mobile-nav"
        className={
          "md:hidden absolute left-0 right-0 top-full origin-top transition-all duration-200 ease-out " +
          (open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none")
        }
        aria-hidden={!open}
      >
        <div className="bg-bg/95 backdrop-blur-md border-b border-border shadow-2xl shadow-black/40">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={
                    "flex items-center justify-between px-4 py-3 rounded-md text-base transition-colors " +
                    (active
                      ? "text-fg bg-panel"
                      : "text-muted hover:text-fg hover:bg-panel/50")
                  }
                  aria-current={active ? "page" : undefined}
                >
                  <span className="inline-flex items-center gap-2">
                    {item.label}
                    {item.soon && <SoonChip />}
                  </span>
                  <span
                    aria-hidden
                    className="text-zinc-600 group-hover:text-emerald-400"
                  >
                    →
                  </span>
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border px-6 py-4 flex items-center justify-between gap-3">
            <span className="text-[10px] tracking-widest uppercase border border-border rounded-full px-2 py-0.5 text-muted">
              devnet · mock
            </span>
            <ConnectButton />
          </div>
        </div>
      </div>

      {/* Click-catch backdrop - fades in under the drawer so taps
          outside close the menu. Only mounted while open. */}
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 top-16 bg-black/40 backdrop-blur-[2px] z-[-1]"
        />
      )}
    </header>
  );
}
