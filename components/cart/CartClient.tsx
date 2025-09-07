"use client";

import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/cart/CartContext";
import { useAuthDialog } from "@/components/auth/AuthDialogProvider";

/* ============ helpers ============ */
const naira = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

const MobileWrap = styled.div`
  display: block;
  padding: 12px 12px 96px; /* extra bottom so the bottom nav doesn't cover */
  @media (min-width: 769px) {
    display: none;
  }
  --primary: ${({ theme }) => theme?.colors?.primary ?? "#2563EB"};
  --text: ${({ theme }) => theme?.colors?.text ?? "#111827"};
  --muted: rgba(17, 24, 39, 0.65);
  --border: rgba(0, 0, 0, 0.08);
  --card: #fff;
`;

const Head = styled.div`
  padding: 10px 2px 8px;
  font-weight: 900;
  font-size: 18px;
  color: var(--text);
`;

const Section = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
`;

const SectionTitle = styled.div`
  font-weight: 800;
  letter-spacing: 0.2px;
  color: #6b7280;
  text-transform: uppercase;
  font-size: 12px;
  margin-bottom: 8px;
`;

const RowBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Muted = styled.div`
  color: var(--muted);
  font-size: 12px;
`;

const NotIncluded = styled(Section)`
  background: #fafafa;
`;

const ActionBar = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 10px;
  margin: 12px 0;
`;

const CallBtn = styled.button`
  height: 48px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: #fff;
  display: grid;
  place-items: center;
`;

const CheckoutBtn = styled.button<{ disabled?: boolean }>`
  height: 48px;
  border-radius: 10px;
  border: 0;
  font-weight: 800;
  color: #fff;
  background: var(--primary);
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const EmptyBox = styled(Section)`
  display: grid;
  place-items: center;
  text-align: center;
  gap: 12px;
  padding: 28px 12px;
`;
const BigEmoji = styled.div`
  font-size: 56px;
  line-height: 1;
  opacity: 0.35;
`;
const ContinueShopping = styled(Link)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--border);
  color: var(--text);
  font-weight: 800;
  text-decoration: none;
`;

const ItemCard = styled(Section)`
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 10px;
  padding: 10px;
`;
const Thumb = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  background: #f4f6fa;
`;
const ItemTitle = styled(Link)`
  font-weight: 700;
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
const QtyBox = styled.div`
  display: inline-flex;
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  margin-top: 8px;
  button {
    width: 32px;
    height: 36px;
    border: none;
    background: #fff;
    font-weight: 900;
    cursor: pointer;
  }
  input {
    width: 46px;
    height: 36px;
    text-align: center;
    border: none;
    outline: none;
  }
`;
const Price = styled.div`
  font-weight: 900;
  color: var(--text);
  text-align: right;
`;

/* mobile inline “Remove” */
const RemoveLink = styled.button`
  margin-top: 6px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 0;
  background: var(--primary);
  color: #fff;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.12);
  transition: background 0.15s ease, transform 0.1s ease;

  &:hover {
    background: #1d4ed8;
  } /* theme.colors.primaryDark */
  &:active {
    transform: translateY(1px);
  }
  &:focus-visible {
    outline: 3px solid rgba(37, 99, 235, 0.35);
    outline-offset: 2px;
  }
`;

/* confirmation modal */
const Mask = styled.div<{ open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: ${({ open }) => (open ? "grid" : "none")};
  place-items: center;
  z-index: 2147483600;
`;
const Modal = styled.div`
  width: min(92vw, 520px);
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.22);
`;
const ModalHead = styled.div`
  font-weight: 900;
  font-size: 18px;
  margin-bottom: 6px;
  color: var(--text);
`;
const ModalRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-top: 14px;
`;

/* BLUE modal buttons (theme-aware) */
const ModalBtn = styled.button<{ variant?: "ghost" | "danger" }>`
  height: 48px;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;
  transition: background 0.15s ease, border 0.15s ease, transform 0.08s ease;

  background: ${({ variant, theme }) =>
    variant === "ghost" ? "#fff" : theme?.colors?.primary ?? "#2563EB"};
  color: ${({ variant }) =>
    variant === "ghost" ? "var(--text, #111827)" : "#fff"};
  border: 1px solid
    ${({ variant }) =>
      variant === "ghost" ? "rgba(0,0,0,.12)" : "transparent"};
  box-shadow: ${({ variant }) =>
    variant === "ghost" ? "none" : "0 2px 8px rgba(37,99,235,0.12)"};

  &:hover {
    background: ${({ variant, theme }) =>
      variant === "ghost"
        ? "#f3f4f6"
        : theme?.colors?.primaryDark ?? "#1D4ED8"};
    border-color: ${({ variant, theme }) =>
      variant === "ghost"
        ? "#d1d5db"
        : theme?.colors?.primaryDark ?? "#1D4ED8"};
  }
  &:active {
    transform: translateY(1px);
  }
  &:focus-visible {
    outline: 3px solid rgba(37, 99, 235, 0.35);
    outline-offset: 2px;
  }
`;

/* ============ DESKTOP styles (hidden on mobile) ============ */
const DesktopWrap = styled.div`
  --primary: ${({ theme }) => theme?.colors?.primary ?? "#2563EB"};
  --text: ${({ theme }) => theme?.colors?.text ?? "#111827"};
  --muted: rgba(17, 24, 39, 0.65);
  --border: rgba(0, 0, 0, 0.08);

  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 20px;
  @media (max-width: 768px) {
    display: none;
  }
`;
const Promo = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid var(--border);
  padding: 12px 14px;
  border-radius: 12px;
  color: var(--text);
  font-weight: 700;
`;
const Col = styled.div``;
const List = styled.div`
  display: grid;
  gap: 12px;
`;
const Row = styled.div`
  display: grid;
  grid-template-columns: 96px 1fr auto;
  gap: 12px;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px;
  background: #fff;
`;
const DThumb = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 10px;
  overflow: hidden;
  background: #f4f6fa;
`;
const PTitle = styled(Link)`
  font-weight: 600;
  color: var(--text);
`;
const DPrice = styled.div`
  font-weight: 800;
  color: var(--text);
`;
const DMuted = styled.div`
  color: var(--muted);
  font-size: 12px;
`;
const DQty = styled.div`
  display: inline-flex;
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  button {
    width: 32px;
    height: 36px;
    border: none;
    background: #fff;
    cursor: pointer;
  }
  input {
    width: 46px;
    height: 36px;
    text-align: center;
    border: none;
    outline: none;
  }
`;
const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

/* desktop inline “Remove” — BLUE */
const Btn = styled.button`
  border: 0;
  border-radius: 10px;
  background: var(--primary);
  color: #fff;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.12);
  transition: background 0.15s ease, transform 0.1s ease;

  &:hover {
    background: #1d4ed8;
  }
  &:active {
    transform: translateY(1px);
  }
  &:focus-visible {
    outline: 3px solid rgba(37, 99, 235, 0.35);
    outline-offset: 2px;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;
const Card = styled.div`
  border: 1px solid var(--border);
  border-radius: 12px;
  background: #fff;
  padding: 16px;
`;
const RowBetweenDesk = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Checkout = styled.button`
  margin-top: 12px;
  width: 100%;
  height: 54px;
  border-radius: 999px;
  border: 0;
  background: var(--primary);
  color: #fff;
  font-weight: 900;
  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/* ================= types ================= */
type Item = {
  itemId: string;
  productId: string;
  slug: string;
  title: string;
  imageUrl: string;
  priceKobo: number;
  quantity: number;
  stock: number;
};

export default function CartClient({
  initialItems,
  initialSubtotalKobo,
  isAuthed,
}: {
  initialItems: Item[];
  initialSubtotalKobo: number; // kept for prop stability
  isAuthed: boolean;
}) {
  const { fetchCount } = useCart();
  const { openDialog } = useAuthDialog();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [confirm, setConfirm] = useState<Item | null>(null);

  // sync state after router.refresh
  useEffect(() => setItems(initialItems), [initialItems]);

  // listen for global cart changes
  useEffect(() => {
    const onChanged = () => refreshCart();
    window.addEventListener("ov:cart-changed", onChanged);
    return () => window.removeEventListener("ov:cart-changed", onChanged);
  }, []);

  async function refreshCart() {
    const res = await fetch("/api/cart", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setItems(Array.isArray(data.items) ? data.items : []);
    await fetchCount();
  }

  const subtotalKobo = useMemo(
    () => items.reduce((s, it) => s + it.priceKobo * it.quantity, 0),
    [items]
  );
  const count = useMemo(
    () => items.reduce((s, it) => s + it.quantity, 0),
    [items]
  );

  async function setQty(it: Item, qty: number) {
    const body = it.itemId.startsWith("cookie-")
      ? { productId: it.productId, quantity: qty }
      : { itemId: it.itemId, quantity: qty };

    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setItems((prev) =>
      qty <= 0
        ? prev.filter((p) => p.itemId !== it.itemId)
        : prev.map((p) =>
            p.itemId === it.itemId ? { ...p, quantity: qty } : p
          )
    );
    await fetchCount();
  }

  async function remove(it: Item) {
    const body = it.itemId.startsWith("cookie-")
      ? { productId: it.productId }
      : { itemId: it.itemId };

    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setItems((prev) => prev.filter((p) => p.itemId !== it.itemId));
    await fetchCount();
  }

  const notIncluded = items.filter((it) => it.quantity > it.stock).length;
  const empty = items.length === 0;

  /* ============ MOBILE RENDER ============ */
  const mobile = (
    <MobileWrap>
      <Head>Cart</Head>
      {empty ? (
        <EmptyBox>
          <BigEmoji>🛒</BigEmoji>
          <div style={{ fontWeight: 900, fontSize: 18 }}>
            Your shopping cart is empty
          </div>
          <Muted>Add your favorite items in it.</Muted>
          {!isAuthed && (
            <CheckoutBtn onClick={openDialog}>Sign in / Register</CheckoutBtn>
          )}
          <ContinueShopping href="/">Continue shopping</ContinueShopping>
        </EmptyBox>
      ) : (
        <>
          {items.map((it) => (
            <ItemCard key={it.itemId}>
              <Thumb>
                {it.imageUrl && (
                  <Image src={it.imageUrl} alt={it.title} fill sizes="80px" />
                )}
              </Thumb>
              <div>
                <ItemTitle href={`/products/${it.slug}`}>{it.title}</ItemTitle>
                <Muted>{naira(it.priceKobo)}</Muted>
                <QtyBox>
                  <button
                    onClick={() => setQty(it, Math.max(0, it.quantity - 1))}
                  >
                    −
                  </button>
                  <input
                    value={it.quantity}
                    onChange={(e) => {
                      const val = Math.max(0, Number(e.target.value || 0));
                      setQty(it, val);
                    }}
                  />
                  <button onClick={() => setQty(it, it.quantity + 1)}>+</button>
                </QtyBox>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Price>{naira(it.priceKobo * it.quantity)}</Price>
                <RemoveLink type="button" onClick={() => setConfirm(it)}>
                  Remove
                </RemoveLink>
              </div>
            </ItemCard>
          ))}

          {/* action bar like screenshot */}
          <ActionBar>
            <CallBtn aria-label="Call support">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1l-1.3 1.3a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2.5z"
                  strokeWidth="2"
                />
              </svg>
            </CallBtn>
            <CheckoutBtn onClick={() => alert("Proceed to checkout")}>
              Checkout ({naira(subtotalKobo)})
            </CheckoutBtn>
          </ActionBar>

          <Section>
            <div style={{ fontWeight: 900, marginBottom: 4 }}>
              Returns are easy
            </div>
            <Muted>
              Free return within 7 days for ALL eligible items{" "}
              <Link href="/help">Details</Link>
            </Muted>
          </Section>
        </>
      )}
    </MobileWrap>
  );

  /* ============ DESKTOP RENDER ============ */
  const desktop = (
    <DesktopWrap>
      <Promo>
        <span role="img" aria-label="truck">
          🚚
        </span>
        <span>Free shipping on all orders</span>
      </Promo>

      <Col>
        {empty ? (
          <Section>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 64, lineHeight: 1, opacity: 0.35 }}>
                🛒
              </div>
              <div style={{ fontWeight: 900, fontSize: 18, marginTop: 8 }}>
                Your shopping cart is empty
              </div>
              <div style={{ color: "var(--muted)" }}>
                Add your favorite items in it.
              </div>
              <div
                style={{
                  display: "grid",
                  gap: 12,
                  marginTop: 14,
                  placeItems: "center",
                }}
              >
                {!isAuthed && (
                  <Checkout onClick={openDialog}>Sign in / Register</Checkout>
                )}
                <ContinueShopping href="/">Continue shopping</ContinueShopping>
              </div>
            </div>
          </Section>
        ) : (
          <List>
            {items.map((it) => (
              <Row key={it.itemId}>
                <DThumb>
                  {it.imageUrl && (
                    <Image src={it.imageUrl} alt={it.title} fill sizes="96px" />
                  )}
                </DThumb>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  <PTitle href={`/products/${it.slug}`}>{it.title}</PTitle>
                  <DMuted>{naira(it.priceKobo)}</DMuted>
                  <DQty>
                    <button
                      onClick={() => setQty(it, Math.max(0, it.quantity - 1))}
                    >
                      −
                    </button>
                    <input
                      value={it.quantity}
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value || 0));
                        setQty(it, val);
                      }}
                    />
                    <button onClick={() => setQty(it, it.quantity + 1)}>
                      +
                    </button>
                  </DQty>
                </div>
                <Right>
                  <DPrice>{naira(it.priceKobo * it.quantity)}</DPrice>
                  <Actions>
                    <Btn onClick={() => setConfirm(it)}>Remove</Btn>
                  </Actions>
                </Right>
              </Row>
            ))}
          </List>
        )}
      </Col>

      <Col>
        <Card>
          <RowBetweenDesk>
            <div style={{ fontWeight: 800 }}>Total</div>
            <div style={{ fontWeight: 800 }}>{naira(subtotalKobo)}</div>
          </RowBetweenDesk>
          <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 8 }}>
            Please refer to your final actual payment amount.
          </div>
          <Checkout
            disabled={count === 0}
            onClick={() => (count === 0 ? null : alert("Proceed to checkout"))}
          >
            Checkout ({count})
          </Checkout>
        </Card>
      </Col>
    </DesktopWrap>
  );

  // Confirmation modal rendered globally for both mobile and desktop
  return (
    <>
      {mobile}
      {desktop}
      <Mask open={!!confirm} onClick={() => setConfirm(null)}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <ModalHead>Remove from cart</ModalHead>
          <div>Do you really want to remove this item from cart?</div>
          <ModalRow>
            <ModalBtn variant="ghost" onClick={() => setConfirm(null)}>
              Save For Later
            </ModalBtn>
            <ModalBtn
              variant="danger" /* blue by default */
              onClick={() => {
                if (confirm) remove(confirm);
                setConfirm(null);
              }}
            >
              Remove Item
            </ModalBtn>
          </ModalRow>
        </Modal>
      </Mask>
    </>
  );
}
