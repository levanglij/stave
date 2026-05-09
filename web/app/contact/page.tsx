import type { Metadata } from "next";
import { Mail, GitBranch, MapPin, AtSign, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact - Stave",
  description:
    "Get in touch with Stave. Email, X, GitHub, and our Tbilisi office.",
};

interface ContactItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  hint?: string;
}

const ITEMS: ContactItem[] = [
  {
    icon: <Mail className="w-5 h-5" strokeWidth={1.75} />,
    label: "Email",
    value: "info@stave.cc",
    href: "mailto:info@stave.cc",
    hint: "Primary inbox. Investor, artist and partnership enquiries.",
  },
  {
    icon: <AtSign className="w-5 h-5" strokeWidth={1.75} />,
    label: "X / Twitter",
    value: "@Staveapp",
    href: "https://x.com/Staveapp",
    hint: "Live build-in-public updates and product news.",
  },
  {
    icon: <GitBranch className="w-5 h-5" strokeWidth={1.75} />,
    label: "GitHub",
    value: "github.com/levanglij/stave",
    href: "https://github.com/levanglij/stave",
    hint: "Open source. Engine, Anchor program and frontend.",
  },
  {
    icon: <MapPin className="w-5 h-5" strokeWidth={1.75} />,
    label: "Office",
    value: "Tbilisi, Georgia",
    hint: "Headquartered alongside our data partner IPOA.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20 space-y-14">
        {/* Hero */}
        <section className="max-w-3xl">
          <div className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-4">
            Contact
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-fg text-balance leading-[1.05]">
            Get in touch with{" "}
            <span className="text-accent-bright">Stave.</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed mt-6 max-w-2xl">
            Reach the team directly. We answer investor enquiries,
            artist applications and partnership conversations from the
            same inbox.
          </p>
        </section>

        {/* Contact grid */}
        <section>
          <div className="grid sm:grid-cols-2 gap-4">
            {ITEMS.map((item) => (
              <ContactCard key={item.label} item={item} />
            ))}
          </div>
        </section>

        {/* Closing note */}
        <section className="rounded-2xl border border-border bg-panel/70 px-6 py-10 md:py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-fg mb-4">
            Investor or institutional enquiry?
          </h2>
          <p className="text-sm text-muted max-w-xl mx-auto leading-relaxed mb-6">
            Email is fastest. We respond within 48 hours and route
            partnership conversations directly to the founding team.
          </p>
          <a
            href="mailto:info@stave.cc"
            className="btn-glow inline-flex items-center gap-2 rounded-lg bg-accent text-accent-ink font-semibold text-base px-7 py-3.5"
          >
            <Mail className="w-4 h-4" strokeWidth={2.25} />
            Email info@stave.cc
          </a>
        </section>
      </div>
    </main>
  );
}

function ContactCard({ item }: { item: ContactItem }) {
  const inner = (
    <div className="rounded-xl border border-border bg-panel p-6 transition-all duration-200 hover:border-emerald-900/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/20 h-full flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 text-accent-bright flex items-center justify-center">
          {item.icon}
        </div>
        {item.href ? (
          <ExternalLink
            className="w-3.5 h-3.5 text-zinc-600"
            strokeWidth={1.75}
          />
        ) : null}
      </div>
      <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-muted mb-1">
        {item.label}
      </div>
      <div className="font-mono tabular text-fg text-base mb-2 break-all">
        {item.value}
      </div>
      {item.hint ? (
        <p className="text-xs text-muted leading-relaxed mt-auto pt-2">
          {item.hint}
        </p>
      ) : null}
    </div>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target={item.href.startsWith("mailto:") ? undefined : "_blank"}
        rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}
        className="block"
      >
        {inner}
      </a>
    );
  }
  return inner;
}
