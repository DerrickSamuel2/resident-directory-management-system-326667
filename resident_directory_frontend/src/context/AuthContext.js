import React, { createContext, useContext, useMemo, useState } from "react";
import { apiClient } from "../services/apiClient";
import { getAuthToken } from "../services/authToken";

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides admin auth state + actions to the app. */
  const [token, setToken] = useState(getAuthToken());
  const isAuthenticated = Boolean(token);

  const value = useMemo(() => {
    return {
      token,
      isAuthenticated,
      // PUBLIC_INTERFACE
      async login({ username, password }) {
        /** Log in and update local state based on stored token. */
        await apiClient.login({ username, password });
        setToken(getAuthToken());
      },
      // PUBLIC_INTERFACE
      async logout() {
        /** Log out and clear token. */
        await apiClient.logout();
        setToken(getAuthToken());
      },
      // PUBLIC_INTERFACE
      refresh() {
        /** Refresh token from storage (rarely needed, but safe). */
        setToken(getAuthToken());
      }
    };
  }, [token, isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state/actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}
