import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../components/LoginPage";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to rules dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/rules", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <LoadingSpinner size="lg" label="Restoring session…" />
      </div>
    );
  }

  return <LoginPage />;
}
