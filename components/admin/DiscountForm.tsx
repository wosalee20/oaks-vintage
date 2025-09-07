"use client";

import styled from "styled-components";
import { useState } from "react";
import {
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "@/app/admin/discounts/actions";

const Card = styled.form`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 10px;
`;
const Grid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;
const Field = styled.div`
  display: grid;
  gap: 6px;
`;
const Label = styled.label`
  font-weight: 700;
  font-size: 13px;
`;
const Input = styled.input`
  height: 42px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  outline: none;
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
`;
const Select = styled.select`
  height: 42px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 10px;
`;
const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
`;
const Btn = styled.button<{ variant?: "primary" | "danger" }>`
  height: 42px;
  padding: 0 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 800;
  background: ${({ variant }) =>
    variant === "primary"
      ? "#2563EB"
      : variant === "danger"
      ? "#DC2626"
      : "#fff"};
  color: ${({ variant }) => (variant ? "#fff" : "#111827")};
  border: 1px solid ${({ variant }) => (variant ? "transparent" : "#e5e7eb")};
`;

export default function DiscountForm({ discount }: { discount?: any }) {
  const [saving, setSaving] = useState(false);
  const [code, setCode] = useState(discount?.code || "");
  const [type, setType] = useState(discount?.type || "PERCENT");
  const [value, setValue] = useState(discount?.value ?? 0);
  const [startsAt, setStartsAt] = useState(
    discount?.startsAt ? discount.startsAt.slice(0, 16) : ""
  );
  const [endsAt, setEndsAt] = useState(
    discount?.endsAt ? discount.endsAt.slice(0, 16) : ""
  );
  const [maxUses, setMaxUses] = useState(discount?.maxUses ?? "");
  const [active, setActive] = useState(Boolean(discount?.active));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("code", code);
      fd.set("type", type);
      fd.set("value", String(value));
      if (startsAt) fd.set("startsAt", startsAt);
      if (endsAt) fd.set("endsAt", endsAt);
      if (maxUses !== "") fd.set("maxUses", String(maxUses));
      if (active) fd.set("active", "on");

      if (discount?.id) await updateDiscount(discount.id, fd);
      else await createDiscount(fd);

      location.reload();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card onSubmit={onSubmit}>
      <Grid>
        <Field>
          <Label>Code</Label>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="BRANDFEST10"
            required
          />
        </Field>
        <Field>
          <Label>Type</Label>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="PERCENT">Percent (%)</option>
            <option value="FIXED">Fixed (₦)</option>
          </Select>
        </Field>
        <Field>
          <Label>Value</Label>
          <Input
            type="number"
            min={0}
            value={value}
            onChange={(e) => setValue(Number(e.target.value || 0))}
          />
        </Field>
        <Field>
          <Label>Max uses</Label>
          <Input
            type="number"
            min={0}
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            placeholder="optional"
          />
        </Field>
      </Grid>

      <Grid>
        <Field>
          <Label>Starts</Label>
          <Input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />
        </Field>
        <Field>
          <Label>Ends</Label>
          <Input
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
          />
        </Field>
        <Field>
          <Label>Status</Label>
          <label
            style={{
              display: "inline-flex",
              gap: 8,
              alignItems: "center",
              height: 42,
            }}
          >
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            Active
          </label>
        </Field>
        <div />
      </Grid>

      <Row>
        {discount?.id ? (
          <Btn
            type="button"
            variant="danger"
            onClick={async () => {
              if (!confirm("Delete discount?")) return;
              await deleteDiscount(discount.id);
              location.reload();
            }}
          >
            Delete
          </Btn>
        ) : (
          <span />
        )}

        <Btn type="submit" variant="primary" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Btn>
      </Row>
    </Card>
  );
}
