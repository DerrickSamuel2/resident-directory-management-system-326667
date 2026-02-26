import React, { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export function Layout({ children }) {
  /** App shell with responsive sidebar navigation and a sticky topbar. */
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const title = useMemo(() => {
    if (location.pathname.startsWith("/admin")) return "Admin";
    return "Directory";
  }, [location.pathname]);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-inner">
          <div className="brand">
            <div className="brand-title">Resident Directory</div>
            <div className="brand-subtitle">Browse residents, admin manage records</div>
          </div>

          <nav className="nav" aria-label="Primary navigation">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Residents
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/admin/residents" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  Admin Residents
                </NavLink>
                <NavLink to="/admin/residents/new" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  Add Resident
                </NavLink>

                <button
                  type="button"
                  className="btn"
                  onClick={logout}
                  style={{ marginTop: 10, justifySelf: "flex-end" }}
                >
                  Log out
                </button>
              </>
            ) : (
              <NavLink to="/admin/login" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Admin Login
              </NavLink>
            )}
          </nav>

          <div className="subtle" style={{ marginTop: "auto" }}>
            Tip: Use search to quickly find a resident.
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-inner">
            <div className="row" style={{ gap: 10 }}>
              <span className="badge">{title}</span>
              <span className="subtle">Light modern UI</span>
            </div>
            <span className="kbd">API: {process.env.REACT_APP_API_BASE_URL || "http://localhost:3001"}</span>
          </div>
        </header>

        <div className="page">{children}</div>
      </main>
    </div>
  );
}
