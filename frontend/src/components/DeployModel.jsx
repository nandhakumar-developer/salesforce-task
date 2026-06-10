import { useEffect } from "react";

export default function DeployModal({ pendingRules, onConfirm, onCancel, isDeploying }) {
  // Close on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onCancel]);

  const toActivate   = pendingRules.filter((r) => r.Active);
  const toDeactivate = pendingRules.filter((r) => !r.Active);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
    }}>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.65)", backdropFilter: "blur(4px)" }}
      />

      {/* Panel */}
      <div
        className="card"
        style={{
          position: "relative", width: "100%", maxWidth: "28rem",
          boxShadow: "0 25px 60px rgba(0,0,0,.5)",
          animation: "var(--animate-slide-up)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.5rem 1.5rem 1.25rem",
          borderBottom: "1px solid var(--color-navy-700)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "2.25rem", height: "2.25rem", borderRadius: "0.625rem",
              background: "rgba(14,165,233,.12)", border: "1px solid rgba(14,165,233,.3)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg style={{ width: "1.1rem", height: "1.1rem", color: "var(--color-sky-400)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontWeight: 600, color: "#f1f5f9", fontSize: "1rem" }}>Deploy to Salesforce</h2>
              <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "1px" }}>Changes go live immediately</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#475569", padding: "0.25rem", borderRadius: "0.375rem",
              transition: "color 0.2s",
            }}
            aria-label="Close"
          >
            <svg style={{ width: "1.1rem", height: "1.1rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            You have{" "}
            <span style={{ color: "#f1f5f9", fontWeight: 500 }}>{pendingRules.length}</span>{" "}
            pending {pendingRules.length === 1 ? "change" : "changes"} to deploy:
          </p>

          {/* Change list */}
          <div style={{ maxHeight: "14rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {toActivate.length > 0 && (
              <div>
                <p style={{ fontSize: "0.65rem", color: "var(--color-emerald-400)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                  Activating ({toActivate.length})
                </p>
                {toActivate.map((r) => (
                  <div key={r.Id} style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.4rem 0.75rem", borderRadius: "0.5rem", marginBottom: "0.375rem",
                    background: "rgba(52,211,153,.08)", border: "1px solid rgba(52,211,153,.2)",
                  }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "9999px", background: "var(--color-emerald-400)", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.8rem", color: "#cbd5e1", fontFamily: "var(--font-mono)" }}>{r.ValidationName}</span>
                  </div>
                ))}
              </div>
            )}

            {toDeactivate.length > 0 && (
              <div>
                <p style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                  Deactivating ({toDeactivate.length})
                </p>
                {toDeactivate.map((r) => (
                  <div key={r.Id} style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.4rem 0.75rem", borderRadius: "0.5rem", marginBottom: "0.375rem",
                    background: "rgba(100,116,139,.1)", border: "1px solid rgba(100,116,139,.25)",
                  }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "9999px", background: "#64748b", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.8rem", color: "#cbd5e1", fontFamily: "var(--font-mono)" }}>{r.ValidationName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Warning notice */}
          <div style={{
            display: "flex", alignItems: "flex-start", gap: "0.625rem",
            padding: "0.75rem", borderRadius: "0.5rem",
            background: "rgba(251,191,36,.08)", border: "1px solid rgba(251,191,36,.2)",
          }}>
            <svg style={{ width: "1rem", height: "1rem", color: "var(--color-amber-400)", flexShrink: 0, marginTop: "1px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p style={{ fontSize: "0.72rem", color: "rgba(251,191,36,.8)", lineHeight: 1.6 }}>
              These changes will immediately affect data validation in your Salesforce org. Ensure you have tested them.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: "0.75rem", padding: "0 1.5rem 1.5rem" }}>
          <button onClick={onCancel} disabled={isDeploying} className="btn-secondary" style={{ flex: 1, justifyContent: "center" }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isDeploying} className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Confirm Deploy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}