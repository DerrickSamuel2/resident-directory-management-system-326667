import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export function NotFoundPage() {
  /** Simple 404 page. */
  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <div className="card" style={{ padding: 16 }}>
        <div className="col" style={{ gap: 8 }}>
          <h1 className="h1">Page not found</h1>
          <div className="subtle">The page you requested doesn’t exist.</div>
          <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
            <Link className="btn btn-primary" to="/">
              Go to Residents
            </Link>
            <Link className="btn" to="/admin/login">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
