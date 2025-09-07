"use client";

import { useState } from "react";
import styled from "styled-components";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/admin/categories/actions";

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
  grid-template-columns: 1fr 1fr;
  @media (max-width: 900px) {
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
const Textarea = styled.textarea`
  min-height: 80px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  outline: none;
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
`;
const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
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
  color: #fff;
  border: 1px solid transparent;
`;

export default function CategoryForm({ category }: { category?: any }) {
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [description, setDescription] = useState(category?.description || "");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("name", name);
      fd.set("slug", slug);
      fd.set("description", description);

      if (category?.id) await updateCategory(category.id, fd);
      else await createCategory(fd);

      // Let the server revalidate and stream fresh list
      location.reload();
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!category?.id) return;
    if (!confirm("Delete this category?")) return;
    setSaving(true);
    try {
      await deleteCategory(category.id);
      location.reload();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card onSubmit={onSubmit}>
      <Grid>
        <Field>
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Field>
        <Field>
          <Label>Slug</Label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto from name"
          />
        </Field>
      </Grid>

      <Field>
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>

      <Row style={{ justifyContent: "space-between" }}>
        {category?.id ? (
          <Btn type="button" variant="danger" onClick={onDelete}>
            Delete
          </Btn>
        ) : (
          <span />
        )}

        <Btn type="submit" variant="primary" disabled={saving}>
          {saving
            ? "Saving..."
            : category?.id
            ? "Save changes"
            : "Create category"}
        </Btn>
      </Row>
    </Card>
  );
}
