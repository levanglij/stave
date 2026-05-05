"use client";

import { useState } from "react";
import { ApplyModal } from "./apply-modal";

interface Props {
  className?: string;
  children: React.ReactNode;
}

// Thin client wrapper: a button that opens the apply modal. Lets the
// surrounding page stay a server component and just drop these wherever
// a CTA is needed. Each instance owns its own modal state — there are
// only ever ~2 of these per page so the duplication is harmless.
export function ApplyTrigger({ className, children }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        {children}
      </button>
      <ApplyModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
