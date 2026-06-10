import { useSalesforceAuth } from "../hooks/useSalesforceAuth";
import { SF_CLIENT_ID } from "../utils/constants";

const FEATURES = [
  {
    icon: (
      <svg style={{ width: "1.25rem", height: "1.25rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: "Fetch All Rules",
    desc: "Pull Account validation rules directly via Salesforce Tooling API",
  },
  {
    icon: (
      <svg style={{ width: "1.25rem", height: "1.25rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    title: "Toggle Active State",
    desc: "Enable or disable individual rules, or bulk update all at once",
  },
  {
    icon: (
      <svg style={{ width: "1.25rem", height: "1.25rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    title: "Deploy Changes",
    desc: "Push local changes to the live Salesforce org in one click",
  },
];

export default function LoginPage() {
  const { initiateLogin } = useSalesforceAuth();
  const isMisconfigured = !SF_CLIENT_ID;

  return (
    <div style={{
      minHeight: "100vh", background: "var(--color-navy-950)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Grid overlay */}
      <div aria-hidden="true" style={{
        position: "fixed", inset: 0, opacity: 0.025,
        backgroundImage: "linear-gradient(#38bdf8 1px,transparent 1px),linear-gradient(90deg,#38bdf8 1px,transparent 1px)",
        backgroundSize: "48px 48px",
        pointerEvents: "none",
      }} />

      {/* Glow */}
      <div aria-hidden="true" style={{
        position: "fixed", top: "-200px", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "600px", borderRadius: "9999px",
        background: "radial-gradient(circle, rgba(14,165,233,.18) 0%, transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", flex: 1,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "4rem 1rem",
      }}>
        <div style={{ width: "100%", maxWidth: "26rem", animation: "var(--animate-slide-up)" }}>

          {/* Logo + heading */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{
              width: "4rem", height: "4rem", margin: "0 auto 1.5rem",
              borderRadius: "1rem",
              background: "rgba(14,165,233,.12)", border: "1px solid rgba(14,165,233,.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "2rem", height: "2rem", color: "var(--color-sky-400)" }}>
                <path d="M10.071 3.429c.657-1.072 1.822-1.786 3.158-1.786 1.638 0 3.028 1.009 3.606 2.457.538-.232 1.132-.36 1.757-.36 2.411 0 4.37 1.963 4.37 4.379 0 .367-.045.724-.13 1.066C23.618 9.7 24 10.505 24 11.4c0 1.743-1.413 3.157-3.155 3.157H7.714C5.218 14.557 3.2 12.54 3.2 10.04c0-2.14 1.47-3.944 3.453-4.444-.064-.305-.096-.62-.096-.941 0-2.5 2.025-4.527 4.524-4.527.363 0 .716.044 1.054.126z" />
              </svg>
            </div>
            <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
              Validation Manager
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.6 }}>
              Connect to your Salesforce org to view and manage Account validation rules.
            </p>
          </div>

          {/* Login card */}
          <div className="card" style={{ padding: "2rem", marginBottom: "1rem" }}>
            {isMisconfigured && (
              <div style={{
                marginBottom: "1.25rem", padding: "0.75rem",
                background: "rgba(251,191,36,.08)", border: "1px solid rgba(251,191,36,.3)",
                borderRadius: "0.5rem",
              }}>
                <p style={{ fontSize: "0.75rem", color: "var(--color-amber-400)", fontWeight: 500, marginBottom: "0.25rem" }}>
                  Configuration required
                </p>
                <p style={{ fontSize: "0.72rem", color: "rgba(251,191,36,.75)" }}>
                  Set <code style={{ background: "var(--color-navy-900)", padding: "1px 4px", borderRadius: "3px" }}>VITE_SF_CLIENT_ID</code> in your{" "}
                  <code style={{ background: "var(--color-navy-900)", padding: "1px 4px", borderRadius: "3px" }}>.env</code> file.
                </p>
              </div>
            )}

            <button
              onClick={initiateLogin}
              disabled={isMisconfigured}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "0.75rem 1.5rem", fontSize: "1rem" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "1.25rem", height: "1.25rem" }}>
                <path d="M10.071 3.429c.657-1.072 1.822-1.786 3.158-1.786 1.638 0 3.028 1.009 3.606 2.457.538-.232 1.132-.36 1.757-.36 2.411 0 4.37 1.963 4.37 4.379 0 .367-.045.724-.13 1.066C23.618 9.7 24 10.505 24 11.4c0 1.743-1.413 3.157-3.155 3.157H7.714C5.218 14.557 3.2 12.54 3.2 10.04c0-2.14 1.47-3.944 3.453-4.444-.064-.305-.096-.62-.096-.941 0-2.5 2.025-4.527 4.524-4.527.363 0 .716.044 1.054.126z" />
              </svg>
              Connect with Salesforce
            </button>

            <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.72rem", color: "#475569" }}>
              Uses OAuth 2.0 — your credentials are never stored here
            </p>
          </div>

          {/* Features list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="card" style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "1rem" }}>
                <div style={{
                  width: "2.25rem", height: "2.25rem", borderRadius: "0.5rem", flexShrink: 0,
                  background: "rgba(14,165,233,.1)", border: "1px solid rgba(14,165,233,.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--color-sky-400)",
                }}>
                  {icon}
                </div>
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 500, color: "#e2e8f0" }}>{title}</p>
                  <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "2px", lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ position: "relative", textAlign: "center", paddingBottom: "2rem", fontSize: "0.7rem", color: "#334155" }}>
        CloudVandana ASE Assignment · Salesforce Tooling API · OAuth 2.0
      </footer>
    </div>
  );
}