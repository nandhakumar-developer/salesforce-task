import { useSalesforceAuth } from "../hooks/useSalesforceAuth";

function CloudIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "1rem", height: "1rem" }} aria-hidden="true">
      <path d="M10.071 3.429c.657-1.072 1.822-1.786 3.158-1.786 1.638 0 3.028 1.009 3.606 2.457.538-.232 1.132-.36 1.757-.36 2.411 0 4.37 1.963 4.37 4.379 0 .367-.045.724-.13 1.066C23.618 9.7 24 10.505 24 11.4c0 1.743-1.413 3.157-3.155 3.157H7.714C5.218 14.557 3.2 12.54 3.2 10.04c0-2.14 1.47-3.944 3.453-4.444-.064-.305-.096-.62-.096-.941 0-2.5 2.025-4.527 4.524-4.527.363 0 .716.044 1.054.126z" />
    </svg>
  );
}

export default function Navbar({ pendingCount = 0 }) {
  const { userInfo, instanceUrl, handleLogout } = useSalesforceAuth();

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(15,25,35,.96)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--color-navy-700)",
    }}>
      <div style={{
        maxWidth: "64rem", margin: "0 auto", padding: "0 1.5rem",
        height: "4rem", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "2rem", height: "2rem", borderRadius: "0.5rem",
            background: "rgba(14,165,233,.12)", border: "1px solid rgba(14,165,233,.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--color-sky-400)",
          }}>
            <CloudIcon />
          </div>
          <div>
            <span style={{ fontWeight: 600, color: "#f1f5f9", fontSize: "0.9rem" }}>
              Validation Manager
            </span>
            {instanceUrl && (
              <p style={{
                fontSize: "0.65rem", color: "#475569",
                fontFamily: "var(--font-mono)", marginTop: "1px",
                maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {instanceUrl.replace("https://", "")}
              </p>
            )}
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {pendingCount > 0 && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "0.375rem",
              padding: "0.25rem 0.75rem", borderRadius: "9999px",
              fontSize: "0.7rem", fontWeight: 500,
              background: "rgba(251,191,36,.12)", color: "var(--color-amber-400)",
              border: "1px solid rgba(251,191,36,.3)",
            }}>
              <span style={{
                width: "6px", height: "6px", borderRadius: "9999px",
                background: "var(--color-amber-400)", animation: "var(--animate-pulse-dot)",
              }} />
              {pendingCount} unsaved
            </span>
          )}

          {userInfo && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {userInfo.picture ? (
                <img
                  src={userInfo.picture}
                  alt={userInfo.display_name || "User"}
                  style={{ width: "1.75rem", height: "1.75rem", borderRadius: "9999px", border: "1px solid var(--color-navy-600)" }}
                />
              ) : (
                <div style={{
                  width: "1.75rem", height: "1.75rem", borderRadius: "9999px",
                  background: "rgba(14,165,233,.15)", border: "1px solid rgba(14,165,233,.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: 600, color: "var(--color-sky-400)",
                }}>
                  {(userInfo.display_name || userInfo.name || "U")[0].toUpperCase()}
                </div>
              )}
              <span style={{
                fontSize: "0.75rem", color: "#94a3b8",
                maxWidth: "130px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {userInfo.display_name || userInfo.name || userInfo.email}
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            style={{
              fontSize: "0.75rem", color: "#64748b", padding: "0.375rem 0.75rem",
              borderRadius: "0.5rem", border: "1px solid transparent",
              background: "transparent", cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#e2e8f0";
              e.target.style.background = "var(--color-navy-700)";
              e.target.style.borderColor = "var(--color-navy-600)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#64748b";
              e.target.style.background = "transparent";
              e.target.style.borderColor = "transparent";
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}