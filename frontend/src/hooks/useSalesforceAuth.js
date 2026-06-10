import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { buildAuthUrl } from "../api/auth";
import { fetchUserInfo } from "../api/salesforce";

export function useSalesforceAuth() {
  const { login, logout, isAuthenticated, isLoading, userInfo, instanceUrl, accessToken } =
    useAuth();
  const navigate = useNavigate();

  // Step 1 – redirect browser to Salesforce OAuth login page
  const initiateLogin = useCallback(() => {
    window.location.href = buildAuthUrl();
  }, []);

  // Step 2 – called from /callback after Salesforce redirects back
  const handleCallback = useCallback(
    async ({ accessToken, instanceUrl, refreshToken }) => {
      if (!accessToken || !instanceUrl)
        throw new Error("Missing access_token or instance_url in callback");

      let userInfo = { display_name: "Salesforce User", email: "" };
      try {
        userInfo = await fetchUserInfo(instanceUrl, accessToken);
      } catch {
        /* non-fatal */
      }

      login({ accessToken, instanceUrl, userInfo, refreshToken });
      navigate("/rules", { replace: true });
    },
    [login, navigate]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);

  return { initiateLogin, handleCallback, handleLogout, isAuthenticated, isLoading, userInfo, instanceUrl, accessToken };
}