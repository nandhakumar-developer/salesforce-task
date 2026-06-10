import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loadTokens, saveTokens, clearTokens, revokeToken, isTokenValid } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    accessToken:     null,
    instanceUrl:     null,
    userInfo:        null,
    isAuthenticated: false,
    isLoading:       true,   // true while restoring from localStorage
  });

  // Restore session on mount
  useEffect(() => {
    const { accessToken, instanceUrl, userInfo } = loadTokens();
    if (accessToken && isTokenValid(accessToken) && instanceUrl) {
      setState({ accessToken, instanceUrl, userInfo, isAuthenticated: true, isLoading: false });
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = useCallback(({ accessToken, instanceUrl, userInfo, refreshToken }) => {
    saveTokens({ accessToken, instanceUrl, userInfo, refreshToken });
    setState({ accessToken, instanceUrl, userInfo, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(async () => {
    if (state.accessToken) await revokeToken(state.accessToken);
    clearTokens();
    setState({ accessToken: null, instanceUrl: null, userInfo: null, isAuthenticated: false, isLoading: false });
  }, [state.accessToken]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}