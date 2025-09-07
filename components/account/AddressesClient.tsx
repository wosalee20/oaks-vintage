"use client";

import { useState } from "react";
import styled from "styled-components";
import AddressForm from "./AddressForm";

const Wrap = styled.div`
  --border: rgba(0, 0, 0, 0.08);
  --muted: rgba(17, 24, 39, 0.65);
  --primary: ${({ theme }) => theme?.colors?.primary ?? "#2563EB"};
  display: grid;
  gap: 16px;
`;

const List = styled.div`
  display: grid;
  gap: 12px;
`;

const Card = styled.div`
  border: 1px solid var(--border);
  border-radius: 12px;
  background: #fff;
  padding: 14px;
`;

const Muted = styled.div`
  color: var(--muted);
`;

const AddBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 6px;
`;

const AddBtn = styled.button`
  height: 44px;
  border-radius: 10px;
  padding: 0 14px;
  cursor: pointer;
  background: var(--primary);
  color: #fff;
  border: 0;
  font-weight: 800;
`;

const Collapse = styled.div<{ open: boolean }>`
  overflow: hidden;
  transition: grid-template-rows 0.35s ease, opacity 0.35s ease;
  display: grid;
  grid-template-rows: ${({ open }) => (open ? "1fr" : "0fr")};
  opacity: ${({ open }) => (open ? 1 : 0)};
`;

const CollapseInner = styled.div`
  min-height: 0;
`;

export default function AddressesClient({
  initialAddresses,
}: {
  initialAddresses: any[];
}) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function refresh() {
    setRefreshing(true);
    const res = await fetch("/api/account/address/list", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setAddresses(data.addresses);
    }
    setRefreshing(false);
  }

  return (
    <Wrap>
      <List>
        {addresses.length === 0 && <Muted>No addresses yet.</Muted>}
        {addresses.map((a: any) => (
          <Card key={a.id}>
            <div style={{ fontWeight: 700 }}>{a.fullName}</div>
            <div>
              {a.line1}
              {a.line2 ? `, ${a.line2}` : ""}
            </div>
            <div>
              {a.city}
              {a.state ? `, ${a.state}` : ""}
            </div>
            <div>
              {a.country}
              {a.phone ? ` · ${a.phone}` : ""}
            </div>
          </Card>
        ))}
      </List>

      <AddBar>
        <div style={{ color: "var(--muted)" }}>
          {refreshing
            ? "Refreshing…"
            : `${addresses.length} saved ${
                addresses.length === 1 ? "address" : "addresses"
              }`}
        </div>
        <AddBtn type="button" onClick={() => setOpen((v) => !v)}>
          {open ? "Close" : "Add new address"}
        </AddBtn>
      </AddBar>

      <Collapse open={open} aria-hidden={!open}>
        <CollapseInner>
          <AddressForm
            onSaved={async () => {
              await refresh();
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        </CollapseInner>
      </Collapse>
    </Wrap>
  );
}
