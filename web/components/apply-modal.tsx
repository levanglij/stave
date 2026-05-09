"use client";

import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  name: string;
  email: string;
  catalog: string;
  link: string;
  message: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  catalog: "",
  link: "",
  message: "",
};

type Phase = "idle" | "submitting" | "success" | "error";

const SUCCESS_AUTOCLOSE_MS = 4000;

export function ApplyModal({ open, onClose }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [phase, setPhase] = useState<Phase>("idle");
  const [errMsg, setErrMsg] = useState("");

  // Reset form whenever the modal closes - never carry stale state into
  // the next open.
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setForm(EMPTY);
      setPhase("idle");
      setErrMsg("");
    }, 200);
    return () => clearTimeout(t);
  }, [open]);

  // Auto-close after a successful submit.
  useEffect(() => {
    if (phase !== "success") return;
    const t = setTimeout(onClose, SUCCESS_AUTOCLOSE_MS);
    return () => clearTimeout(t);
  }, [phase, onClose]);

  // Esc closes (only when open).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // Prevent body scroll while modal is up.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhase("submitting");
    setErrMsg("");
    try {
      const res = await fetch("/api/tokenize-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || `Submission failed (${res.status})`);
      }
      setPhase("success");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Submission failed");
      setPhase("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-start justify-center p-4 md:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border bg-panel p-6 md:p-8 mt-8 md:mt-16 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-muted hover:text-fg transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {phase === "success" ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-accent/15 border border-accent/40 text-accent-bright flex items-center justify-center mx-auto mb-5">
              <Check className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-fg mb-2">
              Got it.
            </h2>
            <p className="text-sm text-muted">
              We&rsquo;ll reply within a week.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="mb-1">
              <h2
                id="apply-modal-title"
                className="text-2xl font-bold tracking-tight text-fg"
              >
                Apply to tokenize
              </h2>
              <p className="text-sm text-muted mt-1.5">
                Tell us about your catalog. We&rsquo;ll respond within a week.
              </p>
            </div>

            <Field label="Your name" required>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                disabled={phase === "submitting"}
                className="apply-input"
                autoComplete="name"
              />
            </Field>

            <Field label="Email" required>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                disabled={phase === "submitting"}
                className="apply-input"
                autoComplete="email"
              />
            </Field>

            <Field label="Catalog or artist name" required>
              <input
                type="text"
                required
                value={form.catalog}
                onChange={(e) => update("catalog", e.target.value)}
                disabled={phase === "submitting"}
                className="apply-input"
              />
            </Field>

            <Field
              label="Link to your music"
              required
              hint="Spotify, Apple Music, or your website"
            >
              <input
                type="url"
                required
                placeholder="https://"
                value={form.link}
                onChange={(e) => update("link", e.target.value)}
                disabled={phase === "submitting"}
                className="apply-input"
              />
            </Field>

            <Field
              label="Anything else?"
              hint={`${form.message.length} / 500`}
            >
              <textarea
                rows={3}
                maxLength={500}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                disabled={phase === "submitting"}
                className="apply-input resize-none"
              />
            </Field>

            {phase === "error" && (
              <div
                role="alert"
                className="text-xs text-red-400 leading-relaxed"
              >
                {errMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={phase === "submitting"}
              className="btn-glow w-full rounded-lg bg-accent text-accent-ink font-semibold text-sm py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {phase === "submitting" ? "Sending…" : "Send application"}
            </button>
          </form>
        )}

        <style>{`
          .apply-input {
            width: 100%;
            background: var(--color-panel-2);
            border: 1px solid var(--color-border);
            border-radius: 0.5rem;
            padding: 0.625rem 0.75rem;
            font-size: 0.875rem;
            color: var(--color-fg);
            transition: border-color 120ms ease;
            font-family: inherit;
          }
          .apply-input:focus {
            outline: none;
            border-color: var(--color-border-strong);
          }
          .apply-input:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          .apply-input::placeholder {
            color: var(--color-muted);
          }
        `}</style>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1.5 gap-2">
        <span className="text-xs text-fg/85">
          {label}
          {required && (
            <span className="text-accent-bright ml-1" aria-hidden>
              *
            </span>
          )}
        </span>
        {hint && (
          <span className="text-[10px] text-muted font-mono tabular">
            {hint}
          </span>
        )}
      </div>
      {children}
    </label>
  );
}
