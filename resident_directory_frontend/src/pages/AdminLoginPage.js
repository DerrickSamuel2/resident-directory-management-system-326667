import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ErrorState } from "../components/ErrorState";

// PUBLIC_INTERFACE
export function AdminLoginPage() {
  /** Admin login screen. */
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/admin/residents";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await login({ username, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/residents" replace />;
  }

  return (
    <div className="container" style={{ maxWidth: 560 }}>
      <div className="col" style={{ gap: 8 }}>
        <h1 className="h1">Admin Login</h1>
        <div className="subtle">Sign in to create, edit, and delete residents.</div>
      </div>

      <div style={{ height: 14 }} />

      {error ? <ErrorState title="Login failed" message={error} /> : null}

      <form onSubmit={onSubmit} className="card" style={{ padding: 16 }}>
        <div className="col">
          <label className="subtle" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className="input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            required
          />

          <label className="subtle" htmlFor="password" style={{ marginTop: 8 }}>
            Password
          </label>
          <input
            id="password"
            className="input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <div className="row" style={{ justifyContent: "space-between", marginTop: 12, flexWrap: "wrap" }}>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
            <div className="subtle">
              Uses <code>POST /api/auth/login</code> and stores a bearer token.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
