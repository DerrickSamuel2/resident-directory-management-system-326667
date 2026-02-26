import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiClient } from "../services/apiClient";
import { Loading } from "../components/Loading";
import { ErrorState } from "../components/ErrorState";
import { Avatar } from "../components/Avatar";

function normalizeResidents(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.items)) return payload.items;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
}

// PUBLIC_INTERFACE
export function AdminResidentsPage() {
  /** Admin list/manage residents (uses public list endpoint for convenience). */
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [residents, setResidents] = useState([]);

  const count = useMemo(() => residents.length, [residents]);

  async function load() {
    setIsLoading(true);
    setError("");
    try {
      const data = await apiClient.listResidents({ query: initialQuery });
      setResidents(normalizeResidents(data));
    } catch (e) {
      setError(e.message || "Failed to load residents.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  async function onSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    setSearchParams(q ? { q } : {});
  }

  async function onDelete(resident) {
    const id = resident.id ?? resident.resident_id ?? resident.uuid ?? resident._id ?? resident.email ?? resident.name;
    const name = resident.name || `${resident.first_name || ""} ${resident.last_name || ""}`.trim() || "this resident";
    const ok = window.confirm(`Delete ${name}? This cannot be undone.`);
    if (!ok) return;

    try {
      await apiClient.deleteResident(id);
      await load();
    } catch (e) {
      setError(e.message || "Delete failed.");
    }
  }

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap" }}>
        <div className="col" style={{ gap: 6 }}>
          <h1 className="h1">Admin Residents</h1>
          <div className="subtle">Manage resident records. Total shown: {count}</div>
        </div>

        <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
          <Link to="/admin/residents/new" className="btn btn-accent">
            + Add resident
          </Link>
        </div>
      </div>

      <div style={{ height: 14 }} />

      <form onSubmit={onSubmit} className="row" style={{ gap: 10 }}>
        <input
          className="input"
          placeholder="Filter by name, unit, phone, email…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Filter residents"
        />
        <button type="submit" className="btn btn-primary">
          Filter
        </button>
        <button type="button" className="btn" onClick={load}>
          Refresh
        </button>
      </form>

      <div style={{ height: 14 }} />

      {isLoading ? <Loading label="Loading residents" /> : null}
      {error ? <ErrorState title="Admin error" message={error} /> : null}

      {!isLoading && !error ? (
        residents.length === 0 ? (
          <div className="card" style={{ padding: 16 }}>
            <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
              <span className="badge">No residents</span>
              <span className="subtle">Try clearing the filter or add a new resident.</span>
            </div>
          </div>
        ) : (
          <div className="card" style={{ overflow: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Resident</th>
                  <th>Unit</th>
                  <th>Contact</th>
                  <th style={{ width: 210 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {residents.map(r => {
                  const id = r.id ?? r.resident_id ?? r.uuid ?? r._id ?? r.email ?? r.name;
                  const name = r.name || `${r.first_name || ""} ${r.last_name || ""}`.trim() || "Unknown";
                  const unit = r.unit || r.apartment || r.unit_number;
                  const phone = r.phone || r.phone_number;
                  const email = r.email;
                  const photoUrl = r.photo_url || r.photoUrl || r.photo;

                  return (
                    <tr key={String(id)}>
                      <td>
                        <div className="row" style={{ gap: 10 }}>
                          <Avatar name={name} photoUrl={photoUrl} size={34} />
                          <div className="col" style={{ gap: 2 }}>
                            <div style={{ fontWeight: 800 }}>{name}</div>
                            <div className="subtle">ID: {String(id)}</div>
                          </div>
                        </div>
                      </td>
                      <td>{unit ? <span className="badge">{unit}</span> : <span className="subtle">—</span>}</td>
                      <td className="subtle">
                        {phone ? <span>{phone}</span> : null}
                        {phone && email ? <span> • </span> : null}
                        {email ? <span>{email}</span> : !phone ? <span>—</span> : null}
                      </td>
                      <td>
                        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
                          <Link to={`/admin/residents/${encodeURIComponent(id)}/edit`} className="btn btn-primary">
                            Edit
                          </Link>
                          <button type="button" className="btn btn-danger" onClick={() => onDelete(r)}>
                            Delete
                          </button>
                          <Link to={`/residents/${encodeURIComponent(id)}`} className="btn">
                            View public
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      ) : null}
    </div>
  );
}
