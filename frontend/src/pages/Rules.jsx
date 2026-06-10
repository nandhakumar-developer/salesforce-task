import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useValidationRules } from "../hooks/useValidationRules";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Rules() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Single source of truth for rules state — passed as props to Dashboard
  const rulesState = useValidationRules();
  const { pendingIds } = rulesState;

  // Protect route
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Warn user before leaving if they have unsaved changes
  useEffect(() => {
    const handler = (e) => {
      if (pendingIds.size > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [pendingIds]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading…" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar pendingCount={pendingIds.size} />
      <main>
        <Dashboard {...rulesState} />
      </main>
    </div>
  );
}