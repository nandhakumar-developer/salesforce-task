import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { parseCallbackHash } from "../api/auth";
import { useSalesforceAuth } from "../hooks/useSalesforceAuth";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Callback() {
  const { handleCallback } = useSalesforceAuth();
  const navigate = useNavigate();
  const processed = useRef(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const hash = window.location.hash;

    if (!hash || hash === "#") {
      setError("No authentication data received. Please try logging in again.");
      return;
    }

    const parsed = parseCallbackHash(hash);

    if (parsed.error) {
      setError(
        `Salesforce returned an error: ${parsed.errorDescription || parsed.error}`
      );
      return;
    }

    if (!parsed.accessToken || !parsed.instanceUrl) {
      setError("Incomplete authentication response. Please try again.");
      return;
    }

    handleCallback({
      accessToken: parsed.accessToken,
      instanceUrl: parsed.instanceUrl,
      refreshToken: parsed.refreshToken,
    }).catch((err) => {
      setError(err.message || "Authentication failed. Please try again.");
    });
  }, [handleCallback]);

  if (error) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full card p-8 text-center animate-slide-up">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-slate-100 font-semibold text-lg mb-2">Login Failed</h2>
          <p className="text-sm text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate("/", { replace: true })}
            className="btn-primary mx-auto"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" label="Completing login…" />
      <p className="text-xs text-slate-600 font-mono">Verifying with Salesforce…</p>
    </div>
  );
}