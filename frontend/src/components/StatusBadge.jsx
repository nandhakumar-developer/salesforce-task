export default function StatusBadge({ active, pending = false }) {
  if (pending) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: "0.375rem",
        padding: "0.125rem 0.625rem", borderRadius: "9999px", fontSize: "0.7rem",
        fontWeight: 500, background: "rgba(251,191,36,.12)",
        color: "var(--color-amber-400)", border: "1px solid rgba(251,191,36,.3)",
      }}>
        <span style={{
          width: "6px", height: "6px", borderRadius: "9999px",
          background: "var(--color-amber-400)", animation: "var(--animate-pulse-dot)",
        }} />
        Pending
      </span>
    );
  }
  return active ? (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.375rem",
      padding: "0.125rem 0.625rem", borderRadius: "9999px", fontSize: "0.7rem",
      fontWeight: 500, background: "rgba(52,211,153,.12)",
      color: "var(--color-emerald-400)", border: "1px solid rgba(52,211,153,.3)",
    }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "9999px", background: "var(--color-emerald-400)" }} />
      Active
    </span>
  ) : (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.375rem",
      padding: "0.125rem 0.625rem", borderRadius: "9999px", fontSize: "0.7rem",
      fontWeight: 500, background: "rgba(100,116,139,.12)",
      color: "#94a3b8", border: "1px solid rgba(100,116,139,.3)",
    }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "9999px", background: "#64748b" }} />
      Inactive
    </span>
  );
}