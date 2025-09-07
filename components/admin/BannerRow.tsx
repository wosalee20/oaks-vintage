"use client";

import styled from "styled-components";
import { UploadButton } from "./UploadButton";
import { useState } from "react";
import {
  createBanner,
  updateBanner,
  deleteBanner,
  moveBanner,
} from "@/app/admin/banners/actions";

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
  grid-template-columns: 2fr 1fr 1fr;
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
const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
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

export default function BannerRow({
  banner,
  index,
  total,
}: {
  banner?: any;
  index?: number;
  total?: number;
}) {
  const [image, setImage] = useState(banner?.image || "");
  const [link, setLink] = useState(banner?.link || "");
  const [alt, setAlt] = useState(banner?.alt || "");
  const [active, setActive] = useState(Boolean(banner?.active));
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("image", image);
      fd.set("link", link);
      fd.set("alt", alt);
      if (active) fd.set("active", "on");

      if (banner?.id) await updateBanner(banner.id, fd);
      else await createBanner(fd);

      location.reload();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card onSubmit={onSubmit}>
      <Grid>
        <Field>
          <Label>Image URL</Label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://... or /demo/banner.jpg"
              required
              style={{ flex: 1 }}
            />
            <UploadButton
              onUploaded={(url) => setImage(url)}
              folder="banners"
            />
          </div>
        </Field>
        <Field>
          <Label>Link (optional)</Label>
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="/products/slug or https://..."
          />
        </Field>
        <Field>
          <Label>Alt text (optional)</Label>
          <Input value={alt} onChange={(e) => setAlt(e.target.value)} />
        </Field>
      </Grid>

      <Row style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label
            style={{ display: "inline-flex", gap: 8, alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            Active
          </label>

          {banner?.id && (
            <>
              <Btn
                type="button"
                onClick={async () => {
                  await moveBanner(banner.id, -1);
                  location.reload();
                }}
              >
                ↑
              </Btn>
              <Btn
                type="button"
                onClick={async () => {
                  await moveBanner(banner.id, 1);
                  location.reload();
                }}
              >
                ↓
              </Btn>
            </>
          )}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {banner?.id ? (
            <Btn
              type="button"
              variant="danger"
              onClick={async () => {
                if (!confirm("Delete this banner?")) return;
                await deleteBanner(banner.id);
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
        </div>
      </Row>
    </Card>
  );
}
