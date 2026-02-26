import React from "react";

function initialsFromName(name) {
  const safe = (name || "").trim();
  if (!safe) return "?";
  const parts = safe.split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase()).join("");
}

// PUBLIC_INTERFACE
export function Avatar({ name, photoUrl, size = 44 }) {
  /** Shows a resident avatar using photoUrl or name initials fallback. */
  const r = Math.floor(size / 2);
  return (
    <div
      className="card"
      style={{
        width: size,
        height: size,
        borderRadius: r,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        padding: 0,
        background: "rgba(59, 130, 246, 0.08)",
        borderColor: "rgba(59, 130, 246, 0.18)"
      }}
      aria-label={name ? `Photo of ${name}` : "Resident photo"}
    >
      {photoUrl ? (
        <img src={photoUrl} alt={name || "Resident"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span style={{ fontWeight: 800, color: "var(--primary)" }}>{initialsFromName(name)}</span>
      )}
    </div>
  );
}
