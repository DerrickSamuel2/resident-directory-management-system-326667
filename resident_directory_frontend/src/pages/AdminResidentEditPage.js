import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../services/apiClient";
import { Loading } from "../components/Loading";
import { ErrorState } from "../components/ErrorState";
import { ResidentForm } from "../components/ResidentForm";

// PUBLIC_INTERFACE
export function AdminResidentEditPage() {
  /** Admin edit resident page. */
  const { id } = useParams();
  const navigate = useNavigate();

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
        if (!ignore) setResident(data);
      } catch (e) {
        if (!ignore) setError(e.message || "Failed to load resident.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [id]);

  async function handleUpdate(payload) {
    setError("");
    await apiClient.updateResident(id, payload);
    navigate("/admin/residents", { replace: true });
  }

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        <div className="col" style={{ gap: 6 }}>
          <h1 className="h1">Edit Resident</h1>
          <div className="subtle">Update fields and save.</div>
        </div>
        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <Link to={`/residents/${encodeURIComponent(id)}`} className="btn">
            View public
          </Link>
          <Link to="/admin/residents" className="btn">
            Back
          </Link>
        </div>
      </div>

      <div style={{ height: 14 }} />

      {isLoading ? <Loading label="Loading resident" /> : null}
      {error ? <ErrorState title="Could not load resident" message={error} /> : null}

      {!isLoading && !error ? (
        <ResidentForm initialValue={resident || {}} onSubmit={handleUpdate} submitLabel="Save changes" />
      ) : null}
    </div>
  );
}
