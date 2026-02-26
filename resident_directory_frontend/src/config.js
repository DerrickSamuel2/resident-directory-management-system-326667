/**
 * Frontend runtime configuration.
 *
 * Note: Create React App only exposes environment variables prefixed with REACT_APP_*
 */
export const config = {
  /**
   * Base URL for the backend API, e.g. "http://localhost:3001"
   * or the deployed backend URL.
   */
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || "http://localhost:3001",

  /**
   * localStorage key used for persisting the auth token.
   */
  authTokenStorageKey: "rd_admin_token"
};
