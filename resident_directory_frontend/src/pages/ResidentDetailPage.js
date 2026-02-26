import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../services/apiClient";
import { Loading } from "../components/Loading";
import { ErrorState } from "../components/ErrorState";
import { Avatar } from "../components/Avatar";

// PUBLIC_INTERFACE
export function ResidentDetailPage() {
  /** Public resident detail page. */
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [resident, setResident] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const data = await apiClient.getResident(id);
        if (ignore) return;
        setResident(data);
      } catch (e) {
        if (ignore) return;
        setError(e.message || "Failed to load resident.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [id]);

  const view = useMemo(() => {
    if (!resident) return null;
    const name = resident.name || `${resident.first_name || ""} ${resident.last_name || ""}`.trim() || "Unknown";
    const unit = resident.unit || resident.apartment || resident.unit_number;
    const address = resident.address;
    const phone = resident.phone || resident.phone_number;
    const email = resident.email;
    const notes = resident.notes || resident.bio || resident.about;
    const photoUrl = resident.photo_url || resident.photoUrl || resident.photo;

    return { name, unit, address, phone, email, notes, photoUrl, raw: resident };
  }, [resident]);

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        <div className="col" style={{ gap: 6 }}>
          <h1 className="h1">Resident Profile</h1>
          <div className="subtle">Public view</div>
        </div>
        <Link to="/" className="btn">
          Back to list
        </Link>
      </div>

      <div style={{ height: 14 }} />

      {isLoading ? <Loading label="Loading profile" /> : null}
      {error ? <ErrorState title="Could not load resident" message={error} /> : null}

      {!isLoading && !error && view ? (
        <div className="card" style={{ padding: 16 }}>
          <div className="row" style={{ alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
            <Avatar name={view.name} photoUrl={view.photoUrl} size={84} />
            <div className="col" style={{ gap: 10, minWidth: "min(560px, 100%)" }}>
              <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
                <div>
                  <div className="h1">{view.name}</div>
                  <div className="subtle">{view.address || "Address not provided"}</div>
                </div>
                {view.unit ? <span className="badge">Unit {view.unit}</span> : null}
              </div>

              <div className="grid cols-2">
                <div className="card" style={{ padding: 12 }}>
                  <div className="subtle">Phone</div>
                  <div style={{ fontWeight: 700 }}>{view.phone || "—"}</div>
                </div>
                <div className="card" style={{ padding: 12 }}>
                  <div className="subtle">Email</div>
                  <div style={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {view.email || "—"}
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: 12 }}>
                <div className="subtle">Notes</div>
                <div style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>{view.notes || "No notes."}</div>
              </div>

              <details className="card" style={{ padding: 12 }}>
                <summary style={{ cursor: "pointer", fontWeight: 800, color: "var(--primary)" }}>Raw record</summary>
                <pre style={{ margin: 0, overflow: "auto", fontSize: 12, color: "var(--muted)" }}>
                  {JSON.stringify(view.raw, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
