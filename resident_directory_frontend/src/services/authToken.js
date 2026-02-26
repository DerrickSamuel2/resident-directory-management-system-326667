import { config } from "../config";

// PUBLIC_INTERFACE
export function getAuthToken() {
  /** Returns the persisted admin auth token (or null). */
  try {
    const token = window.localStorage.getItem(config.authTokenStorageKey);
    return token || null;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function setAuthToken(token) {
  /** Persists the admin auth token. */
  try {
    if (!token) {
      window.localStorage.removeItem(config.authTokenStorageKey);
      return;
    }
    window.localStorage.setItem(config.authTokenStorageKey, token);
  } catch {
    // If storage isn't available, we silently ignore; app will behave as logged out on refresh.
  }
}

// PUBLIC_INTERFACE
export function clearAuthToken() {
  /** Clears the persisted admin auth token. */
  setAuthToken(null);
}
