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
export function ResidentsListPage() {
  /** Public browse/search residents. */
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [residents, setResidents] = useState([]);

  const hasQuery = useMemo(() => query.trim().length > 0, [query]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const data = await apiClient.listResidents({ query: initialQuery });
        if (ignore) return;
        setResidents(normalizeResidents(data));
      } catch (e) {
        if (ignore) return;
        setError(e.message || "Failed to load residents.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [initialQuery]);

  async function onSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    setSearchParams(q ? { q } : {});
  }

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap" }}>
        <div className="col" style={{ gap: 6 }}>
          <h1 className="h1">Residents</h1>
          <div className="subtle">Search the public directory and open a resident’s profile.</div>
        </div>

        <form onSubmit={onSubmit} className="row" style={{ gap: 10, width: "min(520px, 100%)" }}>
          <input
            className="input"
            placeholder="Search by name, unit, phone, email…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search residents"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      <div style={{ height: 14 }} />

      {isLoading ? <Loading label="Loading residents" /> : null}
      {error ? <ErrorState title="Could not load residents" message={error} /> : null}

      {!isLoading && !error ? (
        residents.length === 0 ? (
          <div className="card" style={{ padding: 16 }}>
            <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
              <span className="badge">{hasQuery ? "No matches" : "No residents"}</span>
              <span className="subtle">{hasQuery ? "Try a different search." : "Ask an admin to add residents."}</span>
            </div>
          </div>
        ) : (
          <div className="grid cols-2">
            {residents.map(r => {
              const id = r.id ?? r.resident_id ?? r.uuid ?? r._id ?? r.email ?? r.name;
              const name = r.name || `${r.first_name || ""} ${r.last_name || ""}`.trim() || "Unknown";
              const unit = r.unit || r.apartment || r.unit_number;
              const phone = r.phone || r.phone_number;
              const email = r.email;
              const address = r.address;
              const photoUrl = r.photo_url || r.photoUrl || r.photo;

              return (
                <Link
                  key={String(id)}
                  to={`/residents/${encodeURIComponent(id)}`}
                  className="card"
                  style={{ padding: 14, display: "block" }}
                >
                  <div className="row" style={{ alignItems: "flex-start" }}>
                    <Avatar name={name} photoUrl={photoUrl} size={48} />
                    <div className="col" style={{ gap: 6, minWidth: 0 }}>
                      <div className="row" style={{ justifyContent: "space-between" }}>
                        <div className="h2" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {name}
                        </div>
                        {unit ? <span className="badge">Unit {unit}</span> : null}
                      </div>

                      <div className="subtle" style={{ display: "grid", gap: 4 }}>
                        {address ? <span>{address}</span> : null}
                        <span>
                          {phone ? <span>{phone}</span> : null}
                          {phone && email ? <span> • </span> : null}
                          {email ? <span>{email}</span> : null}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )
      ) : null}
    </div>
  );
}
