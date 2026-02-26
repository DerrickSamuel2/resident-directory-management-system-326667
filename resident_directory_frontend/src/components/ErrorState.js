import React from "react";

// PUBLIC_INTERFACE
export function ErrorState({ title = "Something went wrong", message }) {
  /** Renders an inline error message card. */
  return (
    <div className="alert" role="alert">
      <strong>{title}</strong>
      {message ? <div style={{ marginTop: 6 }}>{message}</div> : null}
    </div>
  );
}
