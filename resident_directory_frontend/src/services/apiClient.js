import { config } from "../config";
import { getAuthToken, setAuthToken, clearAuthToken } from "./authToken";

/**
 * NOTE ABOUT BACKEND ENDPOINTS
 * The current OpenAPI spec exposed by the backend only shows a health endpoint (/).
 * This client implements a conventional REST surface expected for the resident directory app:
 * - Public:
 *   GET /api/residents?query=...
 *   GET /api/residents/:id
 * - Admin auth:
 *   POST /api/auth/login  { username, password } -> { access_token }
 *   POST /api/auth/logout (optional)
 * - Admin residents:
 *   POST /api/admin/residents
 *   PUT  /api/admin/residents/:id
 *   DELETE /api/admin/residents/:id
 *
 * If the backend uses different paths, adjust the constants below.
 */

const PATHS = {
  health: "/",
  publicResidents: "/api/residents",
  authLogin: "/api/auth/login",
  authLogout: "/api/auth/logout",
  adminResidents: "/api/admin/residents"
};

function buildUrl(path, params) {
  const base = config.apiBaseUrl.replace(/\/$/, "");
  const url = new URL(base + path);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).trim() !== "") {
        url.searchParams.set(k, String(v));
      }
    });
  }
  return url.toString();
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (response.status === 204) return null;

  const data = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null);

  if (!response.ok) {
    const message =
      (data && (data.detail || data.message || data.error)) ||
      (typeof data === "string" && data) ||
      `Request failed with status ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

async function request(path, { method = "GET", params, body, auth = false } = {}) {
  const headers = {
    Accept: "application/json"
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(path, params), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  // If token is invalid/expired, force logout UX.
  if (auth && (res.status === 401 || res.status === 403)) {
    clearAuthToken();
  }

  return parseResponse(res);
}

// PUBLIC_INTERFACE
export const apiClient = {
  /** Ping backend. Useful to detect connectivity issues. */
  async health() {
    return request(PATHS.health);
  },

  /** Public search/browse residents. */
  async listResidents({ query } = {}) {
    return request(PATHS.publicResidents, { params: { query } });
  },

  /** Public resident detail. */
  async getResident(id) {
    return request(`${PATHS.publicResidents}/${encodeURIComponent(id)}`);
  },

  /** Admin login: stores token on success and returns token payload. */
  async login({ username, password }) {
    const data = await request(PATHS.authLogin, { method: "POST", body: { username, password } });

    // Support a few common response shapes.
    const token = data?.access_token || data?.token || data?.accessToken;
    if (!token) {
      throw new Error("Login succeeded but no access token was returned by the server.");
    }
    setAuthToken(token);
    return data;
  },

  /** Admin logout (best-effort). */
  async logout() {
    try {
      await request(PATHS.authLogout, { method: "POST", auth: true });
    } catch {
      // ignore - backend logout may not exist; we still clear the token.
    } finally {
      clearAuthToken();
    }
  },

  /** Admin create resident. */
  async createResident(resident) {
    return request(PATHS.adminResidents, { method: "POST", body: resident, auth: true });
  },

  /** Admin update resident. */
  async updateResident(id, resident) {
    return request(`${PATHS.adminResidents}/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: resident,
      auth: true
    });
  },

  /** Admin delete resident. */
  async deleteResident(id) {
    return request(`${PATHS.adminResidents}/${encodeURIComponent(id)}`, { method: "DELETE", auth: true });
  }
};
