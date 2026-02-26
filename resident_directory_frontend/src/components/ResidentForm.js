import React, { useMemo, useState } from "react";
import { ErrorState } from "./ErrorState";

function pick(obj, keys) {
  const out = {};
  keys.forEach(k => {
    if (obj[k] !== undefined) out[k] = obj[k];
  });
  return out;
}

// PUBLIC_INTERFACE
export function ResidentForm({ initialValue, onSubmit, submitLabel }) {
  /** Form for creating/editing a resident record. */
  const init = initialValue || {};
  const [form, setForm] = useState(() => ({
    name: init.name || "",
    first_name: init.first_name || "",
    last_name: init.last_name || "",
    unit: init.unit || init.apartment || init.unit_number || "",
    address: init.address || "",
    phone: init.phone || init.phone_number || "",
    email: init.email || "",
    photo_url: init.photo_url || init.photoUrl || init.photo || "",
    notes: init.notes || init.bio || init.about || ""
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const payload = useMemo(() => {
    // Prefer "name" if provided; otherwise send first/last if present.
    const cleaned = {
      ...form,
      unit: form.unit
    };

    // Remove empty strings to be kinder to strict backends.
    Object.keys(cleaned).forEach(k => {
      if (typeof cleaned[k] === "string" && cleaned[k].trim() === "") delete cleaned[k];
    });

    // If name is empty but first+last exist, remove name.
    if (!cleaned.name && (cleaned.first_name || cleaned.last_name)) delete cleaned.name;

    // Only send known fields.
    return pick(cleaned, ["name", "first_name", "last_name", "unit", "address", "phone", "email", "photo_url", "notes"]);
  }, [form]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.message || "Failed to submit.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: 16 }}>
      {error ? <ErrorState title="Save failed" message={error} /> : null}

      <div className="grid cols-2">
        <div className="col">
          <label className="subtle" htmlFor="name">
            Display name
          </label>
          <input id="name" className="input" value={form.name} onChange={e => setField("name", e.target.value)} />
          <div className="subtle">Optional if you provide first + last.</div>
        </div>

        <div className="col">
          <label className="subtle" htmlFor="unit">
            Unit
          </label>
          <input id="unit" className="input" value={form.unit} onChange={e => setField("unit", e.target.value)} />
        </div>

        <div className="col">
          <label className="subtle" htmlFor="first_name">
            First name
          </label>
          <input
            id="first_name"
            className="input"
            value={form.first_name}
            onChange={e => setField("first_name", e.target.value)}
          />
        </div>

        <div className="col">
          <label className="subtle" htmlFor="last_name">
            Last name
          </label>
          <input
            id="last_name"
            className="input"
            value={form.last_name}
            onChange={e => setField("last_name", e.target.value)}
          />
        </div>

        <div className="col">
          <label className="subtle" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="input"
            type="email"
            value={form.email}
            onChange={e => setField("email", e.target.value)}
          />
        </div>

        <div className="col">
          <label className="subtle" htmlFor="phone">
            Phone
          </label>
          <input id="phone" className="input" value={form.phone} onChange={e => setField("phone", e.target.value)} />
        </div>
      </div>

      <div style={{ height: 10 }} />

      <div className="col">
        <label className="subtle" htmlFor="address">
          Address
        </label>
        <input
          id="address"
          className="input"
          value={form.address}
          onChange={e => setField("address", e.target.value)}
        />
      </div>

      <div style={{ height: 10 }} />

      <div className="col">
        <label className="subtle" htmlFor="photo_url">
          Photo URL
        </label>
        <input
          id="photo_url"
          className="input"
          value={form.photo_url}
          onChange={e => setField("photo_url", e.target.value)}
          placeholder="https://…"
        />
      </div>

      <div style={{ height: 10 }} />

      <div className="col">
        <label className="subtle" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          className="textarea"
          value={form.notes}
          onChange={e => setField("notes", e.target.value)}
          placeholder="Allergies, preferred contact method, etc."
        />
      </div>

      <div style={{ height: 12 }} />

      <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        <button type="submit" className="btn btn-accent" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : submitLabel}
        </button>
        <details className="subtle">
          <summary style={{ cursor: "pointer" }}>Payload preview</summary>
          <pre style={{ margin: 0, fontSize: 12, color: "var(--muted)", overflow: "auto" }}>
            {JSON.stringify(payload, null, 2)}
          </pre>
        </details>
      </div>
    </form>
  );
}
