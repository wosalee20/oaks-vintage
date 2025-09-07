"use client";
import { useState } from "react";

export default function EditProfileForm({
  initialName,
  initialPhone,
  onSaved,
}: {
  initialName?: string;
  initialPhone?: string;
  onSaved?: () => void;
}) {
  const [name, setName] = useState(initialName ?? "");
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/account/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });
    if (res.ok) {
      onSaved?.();
    } else {
      setError("Failed to update profile");
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: 12, marginTop: 16 }}
    >
      <div>
        <label style={{ fontWeight: 500 }}>Full Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
      </div>
      <div>
        <label style={{ fontWeight: 500 }}>Phone Number</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
      </div>
      {error && <div style={{ color: "#b91c1c" }}>{error}</div>}
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: 10,
          borderRadius: 4,
          background: "#2563eb",
          color: "#fff",
          fontWeight: 600,
        }}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
