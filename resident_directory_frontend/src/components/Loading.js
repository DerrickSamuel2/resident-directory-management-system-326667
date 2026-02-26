import React from "react";

// PUBLIC_INTERFACE
export function Loading({ label = "Loading…" }) {
  /** Simple loading indicator. */
  return (
    <div className="card" style={{ padding: 14 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="badge">{label}</span>
        <span className="subtle">Please wait</span>
      </div>
    </div>
  );
}
