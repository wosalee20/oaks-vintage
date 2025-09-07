"use client";

import { useState } from "react";
import styled from "styled-components";

const Form = styled.form`
  --border: rgba(0, 0, 0, 0.12);
  --primary: ${({ theme }) => theme?.colors?.primary ?? "#2563EB"};
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  margin-top: 10px;
  display: grid;
  gap: 12px;
`;

const Row = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: grid;
  gap: 6px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 13px;
`;

const Input = styled.input<{ error?: boolean }>`
  height: 44px;
  border-radius: 10px;
  padding: 0 12px;
  outline: none;
  border: 1px solid ${({ error }) => (error ? "#dc2626" : "var(--border)")};
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 2px;
`;

const Btn = styled.button<{ variant?: "ghost" | "primary" }>`
  height: 44px;
  padding: 0 14px;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid
    ${({ variant }) =>
      variant === "ghost" ? "rgba(0,0,0,.12)" : "transparent"};
  background: ${({ variant }) =>
    variant === "ghost" ? "#fff" : "var(--primary)"};
  color: ${({ variant }) => (variant === "ghost" ? "#111827" : "#fff")};
  font-weight: 800;
`;

export default function AddressForm({
  onSaved,
  onCancel,
}: {
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/account/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        line1,
        line2,
        city,
        state,
        country,
        phone,
      }),
    });

    if (res.ok) {
      // clear & notify
      setFullName("");
      setLine1("");
      setLine2("");
      setCity("");
      setState("");
      setCountry("");
      setPhone("");
      onSaved?.();
    } else {
      setError("Failed to add address");
    }
    setLoading(false);
  }

  const requiredErr = (v: string) => (!v && error ? true : false);

  return (
    <Form onSubmit={handleSubmit} aria-label="Add address">
      <Row>
        <Field>
          <Label>Full Name</Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={requiredErr(fullName) || undefined}
            required
          />
        </Field>
        <Field>
          <Label>Phone</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            inputMode="tel"
            placeholder="+234 812 345 6789"
          />
        </Field>
      </Row>

      <Field>
        <Label>Address Line 1</Label>
        <Input
          value={line1}
          onChange={(e) => setLine1(e.target.value)}
          error={requiredErr(line1) || undefined}
          required
        />
      </Field>

      <Field>
        <Label>Address Line 2 (optional)</Label>
        <Input value={line2} onChange={(e) => setLine2(e.target.value)} />
      </Field>

      <Row>
        <Field>
          <Label>City</Label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            error={requiredErr(city) || undefined}
            required
          />
        </Field>
        <Field>
          <Label>State / Region</Label>
          <Input value={state} onChange={(e) => setState(e.target.value)} />
        </Field>
      </Row>

      <Field>
        <Label>Country</Label>
        <Input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          error={requiredErr(country) || undefined}
          required
        />
      </Field>

      {error && <div style={{ color: "#dc2626" }}>{error}</div>}

      <Actions>
        <Btn type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Btn>
        <Btn type="submit" variant="primary" disabled={loading}>
          {loading ? "Saving..." : "Save address"}
        </Btn>
      </Actions>
    </Form>
  );
}
