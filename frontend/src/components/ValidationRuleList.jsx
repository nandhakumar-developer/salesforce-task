import ValidationRuleCard from "./ValidationRuleCard";

function SkeletonCard() {
  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div className="shimmer" style={{ height: "1rem", borderRadius: "0.375rem", width: "40%" }} />
          <div className="shimmer" style={{ height: "0.75rem", borderRadius: "0.375rem", width: "70%" }} />
        </div>
        <div className="shimmer" style={{ height: "1.5rem", width: "2.75rem", borderRadius: "9999px", flexShrink: 0 }} />
      </div>
      <div style={{ marginTop: "0.875rem", paddingTop: "0.875rem", borderTop: "1px solid var(--color-navy-700)", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
        <div className="shimmer" style={{ height: "0.75rem", borderRadius: "0.375rem", width: "25%" }} />
        <div className="shimmer" style={{ height: "2.25rem", borderRadius: "0.375rem", width: "100%" }} />
      </div>
    </div>
  );
}

export default function ValidationRuleList({
  rules, isFetching, fetchError, pendingIds, onToggle, isDeploying, filter = "all",
}) {
  if (isFetching) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>⚠️</div>
        <p style={{ color: "#f1f5f9", fontWeight: 500, marginBottom: "0.375rem" }}>Failed to load rules</p>
        <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{fetchError}</p>
      </div>
    );
  }

  if (rules.length === 0) {
    return (
      <div className="card" style={{ padding: "4rem", textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📋</div>
        <p style={{ color: "#f1f5f9", fontWeight: 500, marginBottom: "0.5rem" }}>No validation rules found</p>
        <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
          No validation rules exist on the Account object in this org.
        </p>
      </div>
    );
  }

  const filtered =
    filter === "all" ? rules :
    filter === "active" ? rules.filter((r) => r.Active) :
    rules.filter((r) => !r.Active);

  if (filtered.length === 0) {
    return (
      <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
        <p style={{ color: "#94a3b8" }}>
          No <span style={{ color: "var(--color-sky-400)" }}>{filter}</span> rules to show.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {filtered.map((rule) => (
        <ValidationRuleCard
          key={rule.Id}
          rule={rule}
          onToggle={onToggle}
          isPending={pendingIds.has(rule.Id)}
          disabled={isDeploying}
        />
      ))}
    </div>
  );
}