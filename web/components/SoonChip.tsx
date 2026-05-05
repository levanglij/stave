// Tiny amber pill placed next to a nav label or page heading to flag a
// feature as "designed but not yet live." Reusable so we use the same
// treatment everywhere (Indices today; Portfolio, Audit log, etc. later).

export function SoonChip({ label = "soon" }: { label?: string }) {
  return (
    <span
      className="inline-flex items-center font-semibold uppercase rounded-full align-middle"
      style={{
        backgroundColor: "rgba(245, 158, 11, 0.15)",
        color: "#fbbf24",
        fontSize: "9px",
        letterSpacing: "0.08em",
        padding: "2px 6px",
      }}
    >
      {label}
    </span>
  );
}
