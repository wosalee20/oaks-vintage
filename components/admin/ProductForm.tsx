"use client";
import { UploadButton } from "./UploadButton";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/app/admin/products/actions";
import { slugify } from "@/lib/slugify";

const Card = styled.form`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  display: grid;
  gap: 14px;
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
  min-height: 120px;
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
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;
const Btn = styled.button<{ variant?: "primary" | "ghost" | "danger" }>`
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
  color: ${({ variant }) =>
    variant === "primary" ? "#fff" : variant === "danger" ? "#fff" : "#111827"};
  border: 1px solid
    ${({ variant }) =>
      variant === "primary"
        ? "transparent"
        : variant === "danger"
        ? "#DC2626"
        : "#e5e7eb"};
`;

type PImg = { id?: string; url: string; alt?: string | null; order: number };
type ProductInput = {
  id?: string;
  title: string;
  slug: string;
  description?: string | null;
  priceKobo: number;
  stock: number;
  isActive: boolean;
  categoryId?: string | null;
  images: PImg[];
};

export default function ProductForm({ product }: { product?: any }) {
  const router = useRouter();
  const [cats, setCats] = useState<{ id: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState<ProductInput>(() => ({
    id: product?.id,
    title: product?.title || "",
    slug: product?.slug || "",
    description: product?.description || "",
    priceKobo: product?.priceKobo ?? 0,
    stock: product?.stock ?? 0,
    isActive: product?.isActive ?? false,
    categoryId: product?.categoryId || "",
    images: (product?.images || []).map((im: any, idx: number) => ({
      id: im.id,
      url: im.url,
      alt: im.alt,
      order: im.order ?? idx,
    })),
  }));

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/categories-list", {
        cache: "no-store",
      });
      if (res.ok) setCats(await res.json());
    })();
  }, []);

  const formData = useMemo(() => {
    const fd = new FormData();
    fd.set("title", state.title);
    fd.set("slug", state.slug || slugify(state.title));
    fd.set("description", state.description || "");
    fd.set("priceKobo", String(state.priceKobo || 0));
    fd.set("stock", String(state.stock || 0));
    fd.set("isActive", String(state.isActive));
    fd.set("categoryId", state.categoryId || "");
    fd.set(
      "images",
      JSON.stringify(state.images.map((im, i) => ({ ...im, order: i })))
    );
    return fd;
  }, [state]);

  async function onSave() {
    if (saving) return;
    setSaving(true);
    try {
      if (state.id) {
        await updateProduct(state.id, formData);
      } else {
        const res = await createProduct(formData);
        if (res?.id) {
          toast.success("Product added");
          router.replace(`/admin/products/${res.id}`);
        }
      }
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!state.id) return;
    if (!confirm("Delete this product?")) return;
    setSaving(true);
    try {
      await deleteProduct(state.id);
      router.replace("/admin/products");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  function addImage() {
    setState((s) => ({
      ...s,
      images: [...s.images, { url: "", alt: "", order: s.images.length }],
    }));
  }
  function removeImage(i: number) {
    setState((s) => ({ ...s, images: s.images.filter((_, idx) => idx !== i) }));
  }
  function moveImage(i: number, dir: -1 | 1) {
    setState((s) => {
      const arr = [...s.images];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return s;
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
      return { ...s, images: arr };
    });
  }

  return (
    <Card
      action={state.id ? undefined : undefined}
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <Grid>
        <Field>
          <Label>Title</Label>
          <Input
            value={state.title}
            onChange={(e) => setState((s) => ({ ...s, title: e.target.value }))}
            required
          />
        </Field>
        <Field>
          <Label>Slug</Label>
          <Input
            value={state.slug}
            onChange={(e) => setState((s) => ({ ...s, slug: e.target.value }))}
            placeholder="auto from title"
          />
        </Field>
      </Grid>

      <Grid>
        <Field>
          <Label>Price (₦)</Label>
          <Input
            type="number"
            min={0}
            value={state.priceKobo / 100}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                priceKobo: Math.round(Number(e.target.value || 0) * 100),
              }))
            }
          />
        </Field>
        <Field>
          <Label>Stock</Label>
          <Input
            type="number"
            min={0}
            value={state.stock}
            onChange={(e) =>
              setState((s) => ({ ...s, stock: Number(e.target.value || 0) }))
            }
          />
        </Field>
      </Grid>

      <Grid>
        <Field>
          <Label>Category</Label>
          <select
            value={state.categoryId || ""}
            onChange={(e) =>
              setState((s) => ({ ...s, categoryId: e.target.value || "" }))
            }
            style={{
              height: 42,
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: "0 10px",
            }}
          >
            <option value="">— None —</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field>
          <Label>Status</Label>
          <Row>
            <label
              style={{ display: "inline-flex", gap: 8, alignItems: "center" }}
            >
              <input
                type="checkbox"
                checked={state.isActive}
                onChange={(e) =>
                  setState((s) => ({ ...s, isActive: e.target.checked }))
                }
              />
              Active (visible on store)
            </label>
          </Row>
        </Field>
      </Grid>

      <Field>
        <Label>Description</Label>
        <Textarea
          value={state.description ?? ""}
          onChange={(e) =>
            setState((s) => ({ ...s, description: e.target.value }))
          }
        />
      </Field>

      <Field>
        <Label>Images</Label>
        <div style={{ display: "grid", gap: 10 }}>
          {state.images.map((im, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr auto",
                gap: 8,
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Input
                  placeholder="Image URL"
                  value={im.url}
                  onChange={(e) =>
                    setState((s) => {
                      const arr = [...s.images];
                      arr[i] = { ...arr[i], url: e.target.value };
                      return { ...s, images: arr };
                    })
                  }
                  style={{ flex: 1 }}
                />
                <UploadButton
                  onUploaded={(url: string) =>
                    setState((s) => {
                      const arr = [...s.images];
                      arr[i] = { ...arr[i], url };
                      return { ...s, images: arr };
                    })
                  }
                  folder="products"
                />
              </div>
              <Input
                placeholder="Alt text"
                value={im.alt ?? ""}
                onChange={(e) =>
                  setState((s) => {
                    const arr = [...s.images];
                    arr[i] = { ...arr[i], alt: e.target.value };
                    return { ...s, images: arr };
                  })
                }
              />
              <div style={{ display: "flex", gap: 6 }}>
                <Btn type="button" onClick={() => moveImage(i, -1)}>
                  ↑
                </Btn>
                <Btn type="button" onClick={() => moveImage(i, 1)}>
                  ↓
                </Btn>
                <Btn
                  type="button"
                  variant="danger"
                  onClick={() => removeImage(i)}
                >
                  Remove
                </Btn>
              </div>
            </div>
          ))}
          <Btn type="button" onClick={addImage}>
            + Add image
          </Btn>
        </div>
      </Field>

      <Row style={{ justifyContent: "space-between", marginTop: 6 }}>
        {state.id ? (
          <Btn type="button" variant="danger" onClick={onDelete}>
            Delete
          </Btn>
        ) : (
          <span />
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <Btn type="button" onClick={() => history.back()}>
            Cancel
          </Btn>
          <Btn type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Btn>
        </div>
      </Row>
    </Card>
  );
}
