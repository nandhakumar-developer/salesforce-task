import StatusBadge from "./StatusBadge";

function ToggleSwitch({ active, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={onChange}
      disabled={disabled}
      className={`toggle-root ${active ? "is-active" : "is-inactive"}`}
    >
      <span className="toggle-thumb" />
      <span className="sr-only">{active ? "Deactivate rule" : "Activate rule"}</span>
    </button>
  );
}

export default function ValidationRuleCard({ rule, onToggle, isPending, disabled = false }) {
  const { Id, ValidationName, Active, Description, ErrorMessage, ErrorDisplayField } = rule;

  return (
    <div
      className="card-hover"
      style={{
        padding: "1.25rem",
        animation: "var(--animate-slide-up)",
        ...(isPending ? {
          borderColor: "rgba(251,191,36,.4)",
          background: "rgba(251,191,36,.03)",
        } : {}),
        opacity: Active ? 1 : 0.8,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
            <h3 style={{
              fontFamily: "var(--font-mono)", fontWeight: 600,
              fontSize: "0.85rem", color: "#f1f5f9",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {ValidationName}
            </h3>
            <StatusBadge active={Active} pending={isPending} />
          </div>

          {Description && (
            <p style={{
              marginTop: "0.375rem", fontSize: "0.75rem", color: "#94a3b8",
              lineHeight: 1.6,
              display: "-webkit-box", WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {Description}
            </p>
          )}
        </div>

        <ToggleSwitch active={Active} onChange={() => onToggle(Id)} disabled={disabled} />
      </div>

      {/* Error message */}
      {ErrorMessage && (
        <div style={{ marginTop: "0.875rem", paddingTop: "0.875rem", borderTop: "1px solid var(--color-navy-700)" }}>
          <p style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: "0.375rem" }}>
            Error message shown to user
          </p>
          <p style={{
            fontSize: "0.75rem", color: "#cbd5e1", lineHeight: 1.6,
            background: "rgba(7,13,22,.6)", borderRadius: "0.375rem",
            padding: "0.5rem 0.75rem",
          }}>
            {ErrorMessage}
          </p>
        </div>
      )}

      {/* Footer meta */}
      <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        {ErrorDisplayField && (
          <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
            Field: <span style={{ fontFamily: "var(--font-mono)", color: "#94a3b8" }}>{ErrorDisplayField}</span>
          </span>
        )}
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "#334155" }}>
          {Id}
        </span>
      </div>
    </div>
  );
}