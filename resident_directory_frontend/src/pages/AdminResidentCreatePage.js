import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiClient } from "../services/apiClient";
import { ResidentForm } from "../components/ResidentForm";
import { ErrorState } from "../components/ErrorState";

// PUBLIC_INTERFACE
export function AdminResidentCreatePage() {
  /** Admin create resident page. */
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleCreate(payload) {
    setError("");
    try {
      const created = await apiClient.createResident(payload);
      const id = created?.id ?? created?.resident_id ?? created?.uuid ?? created?._id;
      navigate(id ? `/admin/residents/${encodeURIComponent(id)}/edit` : "/admin/residents", { replace: true });
    } catch (e) {
      setError(e.message || "Create failed.");
      throw e;
    }
  }

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        <div className="col" style={{ gap: 6 }}>
          <h1 className="h1">Add Resident</h1>
          <div className="subtle">Create a new resident record.</div>
        </div>
        <Link to="/admin/residents" className="btn">
          Back
        </Link>
      </div>

      <div style={{ height: 14 }} />

      {error ? <ErrorState title="Create failed" message={error} /> : null}

      <ResidentForm initialValue={{}} onSubmit={handleCreate} submitLabel="Create resident" />
    </div>
  );
}
