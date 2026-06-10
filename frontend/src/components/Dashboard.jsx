import { useState } from "react";
import ValidationRuleList from "./ValidationRuleList";
import DeployModal from "./DeployModel";

/* ── Stats bar ──────────────────────────────────────────────────────────── */
function StatsBar({ rules }) {
  const active   = rules.filter((r) => r.Active).length;
  const inactive = rules.length - active;
  const stats = [
    { label: "Total Rules", value: rules.length, color: "#f1f5f9" },
    { label: "Active",      value: active,        color: "#34d399" },
    { label: "Inactive",    value: inactive,      color: "#94a3b8" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.75rem" }}>
      {stats.map(({ label, value, color }) => (
        <div key={label} className="card" style={{ padding: "1rem", textAlign: "center" }}>
          <p style={{ fontSize: "1.6rem", fontWeight: 700, fontFamily: "var(--font-mono)", color }}>{value}</p>
          <p style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "2px" }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Filter tabs ────────────────────────────────────────────────────────── */
function FilterTabs({ filter, setFilter, rules }) {
  const tabs = [
    { key: "all",      label: "All",      count: rules.length },
    { key: "active",   label: "Active",   count: rules.filter((r) => r.Active).length },
    { key: "inactive", label: "Inactive", count: rules.filter((r) => !r.Active).length },
  ];
  return (
    <div style={{
      display: "flex", gap: "0.25rem",
      background: "var(--color-navy-800)", border: "1px solid var(--color-navy-700)",
      borderRadius: "0.625rem", padding: "0.25rem",
    }}>
      {tabs.map(({ key, label, count }) => {
        const isActive = filter === key;
        return (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem",
              padding: "0.4rem 0.75rem", borderRadius: "0.375rem",
              fontSize: "0.78rem", fontWeight: 500, border: "none", cursor: "pointer",
              transition: "all 0.15s",
              background: isActive ? "var(--color-sky-500)" : "transparent",
              color:      isActive ? "#fff"                 : "#94a3b8",
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--color-navy-700)"; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          >
            {label}
            <span style={{
              padding: "1px 6px", borderRadius: "0.25rem",
              fontSize: "0.65rem", fontFamily: "var(--font-mono)",
              background: isActive ? "rgba(255,255,255,.2)" : "var(--color-navy-700)",
              color:      isActive ? "#fff" : "#64748b",
            }}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Dashboard ──────────────────────────────────────────────────────────── */
// Receives all state as props from Rules.jsx (single useValidationRules instance)
export default function Dashboard({
  rules, isFetching, isDeploying, fetchError, deployResult,
  pendingIds, hasFetched, fetchRules, toggleRule,
  activateAll, deactivateAll, resetChanges, deploy, clearDeployResult,
}) {
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [filter, setFilter] = useState("all");

  const pendingRules = rules.filter((r) => pendingIds.has(r.Id));

  const handleDeploy = async () => {
    await deploy();
    setShowDeployModal(false);
  };

  return (
    <div style={{
      maxWidth: "64rem", margin: "0 auto", padding: "2rem 1.5rem",
      display: "flex", flexDirection: "column", gap: "1.5rem",
      animation: "var(--animate-fade-in)",
    }}>

      {/* ── Page heading + fetch button ──────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f1f5f9" }}>
            Account Validation Rules
          </h1>
          <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "3px" }}>
            Manage and deploy validation rules directly to your Salesforce org
          </p>
        </div>
        <button onClick={fetchRules} disabled={isFetching} className="btn-primary">
          {isFetching ? (
            <>
              <span style={{
                width: "1rem", height: "1rem", borderRadius: "9999px",
                border: "2px solid rgba(255,255,255,.25)", borderTopColor: "#fff",
                animation: "spin 1s linear infinite", display: "inline-block",
              }} />
              Fetching…
            </>
          ) : (
            <>
              <svg style={{ width: "1rem", height: "1rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {hasFetched ? "Refresh Rules" : "Fetch Rules"}
            </>
          )}
        </button>
      </div>

      {/* ── Deploy result toast ──────────────────────────────────────────── */}
      {deployResult && (
        <div className="card" style={{
          padding: "1rem", display: "flex", alignItems: "flex-start", gap: "0.75rem",
          animation: "var(--animate-slide-up)",
          borderColor: deployResult.failed.length === 0 ? "rgba(52,211,153,.4)" : "rgba(239,68,68,.4)",
          background:  deployResult.failed.length === 0 ? "rgba(52,211,153,.04)" : "rgba(239,68,68,.04)",
        }}>
          {deployResult.failed.length === 0 ? (
            <svg style={{ width: "1.25rem", height: "1.25rem", color: "var(--color-emerald-400)", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg style={{ width: "1.25rem", height: "1.25rem", color: "var(--color-red-400)", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <div style={{ flex: 1 }}>
            {deployResult.failed.length === 0 ? (
              <p style={{ fontSize: "0.85rem", color: "#6ee7b7", fontWeight: 500 }}>
                Deployed {deployResult.success.length} {deployResult.success.length === 1 ? "rule" : "rules"} successfully
              </p>
            ) : (
              <>
                <p style={{ fontSize: "0.85rem", color: "var(--color-red-400)", fontWeight: 500 }}>
                  {deployResult.success.length} deployed · {deployResult.failed.length} failed
                </p>
                {deployResult.failed.map((f, i) => (
                  <p key={i} style={{ fontSize: "0.75rem", color: "var(--color-red-400)", marginTop: "4px" }}>{f.error}</p>
                ))}
              </>
            )}
          </div>
          <button onClick={clearDeployResult} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: "2px" }}>
            <svg style={{ width: "1rem", height: "1rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      {hasFetched && rules.length > 0 && <StatsBar rules={rules} />}

      {/* ── Controls toolbar ─────────────────────────────────────────────── */}
      {hasFetched && rules.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
          {/* Bulk actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.72rem", color: "#64748b", marginRight: "0.25rem" }}>Bulk:</span>
            <button
              onClick={activateAll}
              disabled={isDeploying || rules.every((r) => r.Active)}
              className="btn-secondary"
              style={{ padding: "0.375rem 0.875rem", fontSize: "0.78rem" }}
            >
              Activate All
            </button>
            <button
              onClick={deactivateAll}
              disabled={isDeploying || rules.every((r) => !r.Active)}
              className="btn-secondary"
              style={{ padding: "0.375rem 0.875rem", fontSize: "0.78rem" }}
            >
              Deactivate All
            </button>
            {pendingIds.size > 0 && (
              <button
                onClick={resetChanges}
                disabled={isDeploying}
                className="btn-danger"
                style={{ padding: "0.375rem 0.875rem", fontSize: "0.78rem" }}
              >
                Reset Changes
              </button>
            )}
          </div>

          {/* Deploy button */}
          <button
            onClick={() => setShowDeployModal(true)}
            disabled={pendingIds.size === 0 || isDeploying}
            className="btn-primary"
          >
            {isDeploying ? (
              <>
                <span style={{
                  width: "1rem", height: "1rem", borderRadius: "9999px",
                  border: "2px solid rgba(255,255,255,.25)", borderTopColor: "#fff",
                  animation: "spin 1s linear infinite", display: "inline-block",
                }} />
                Deploying…
              </>
            ) : (
              <>
                <svg style={{ width: "1rem", height: "1rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Deploy{pendingIds.size > 0 ? ` (${pendingIds.size})` : ""}
              </>
            )}
          </button>
        </div>
      )}

      {/* ── Filter tabs ──────────────────────────────────────────────────── */}
      {hasFetched && rules.length > 0 && (
        <FilterTabs filter={filter} setFilter={setFilter} rules={rules} />
      )}

      {/* ── Empty state before first fetch ───────────────────────────────── */}
      {!hasFetched && !isFetching && !fetchError && (
        <div className="card" style={{ padding: "5rem 2rem", textAlign: "center", animation: "var(--animate-fade-in)" }}>
          <div style={{
            width: "4rem", height: "4rem", margin: "0 auto 1.25rem",
            borderRadius: "1rem", background: "rgba(14,165,233,.08)",
            border: "1px solid rgba(14,165,233,.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg style={{ width: "2rem", height: "2rem", color: "var(--color-sky-400)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "#f1f5f9", marginBottom: "0.5rem" }}>
            Ready to fetch rules
          </p>
          <p style={{ fontSize: "0.85rem", color: "#64748b", maxWidth: "28rem", margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
            Click "Fetch Rules" to load all Account validation rules from your connected Salesforce org.
          </p>
          <button onClick={fetchRules} className="btn-primary" style={{ margin: "0 auto" }}>
            <svg style={{ width: "1rem", height: "1rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Fetch Validation Rules
          </button>
        </div>
      )}

      {/* ── Rule list ────────────────────────────────────────────────────── */}
      {(hasFetched || isFetching || fetchError) && (
        <ValidationRuleList
          rules={rules}
          isFetching={isFetching}
          fetchError={fetchError}
          pendingIds={pendingIds}
          onToggle={toggleRule}
          isDeploying={isDeploying}
          filter={filter}
        />
      )}

      {/* ── Deploy modal ──────────────────────────────────────────────────── */}
      {showDeployModal && (
        <DeployModal
          pendingRules={pendingRules}
          onConfirm={handleDeploy}
          onCancel={() => setShowDeployModal(false)}
          isDeploying={isDeploying}
        />
      )}
    </div>
  );
}