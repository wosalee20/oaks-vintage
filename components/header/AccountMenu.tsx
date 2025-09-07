"use client";
import Link from "next/link";
import { useState } from "react";
import styled from "styled-components";
import { useSession, signOut } from "next-auth/react";
import useClickOutside from "@/hooks/useClickOutside";
import { useAuthDialog } from "@/components/auth/AuthDialogProvider";
import { DropHeader, Dropdown, DropWrap, NavBtn } from "./styles";
import { IconChevron, IconCart, IconHeart, IconUser } from "./icons";

/* Shared dropdown link/button */
const DropLink = styled(Link)`
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  font-size: 14px;
  color: ${({ theme }) => theme?.colors?.text ?? "#111827"};
  text-decoration: none;
  border-radius: 0;
  &:hover {
    background: rgba(37, 99, 235, 0.06);
  }
`;

const DropBtn = styled.button`
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  font-size: 14px;
  color: ${({ theme }) => theme?.colors?.text ?? "#111827"};
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  &:hover {
    background: rgba(37, 99, 235, 0.06);
  }
`;

/* Polished brand-blue logout button */
const LogoutWrap = styled.div`
  padding: 10px 10px 12px;
  border-top: 1px solid
    ${({ theme }) => theme?.colors?.border ?? "rgba(0,0,0,.08)"};
`;

const LogoutBtn = styled.button`
  width: 100%;
  height: 44px;
  border: 0;
  border-radius: 10px;
  font-weight: 900;
  cursor: pointer;
  background: ${({ theme }) => theme?.colors?.primary ?? "#2563EB"};
  color: #fff;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.18);
  transition: background 0.15s ease, transform 0.06s ease;

  &:hover {
    background: ${({ theme }) => theme?.colors?.primaryDark ?? "#1D4ED8"};
  }
  &:active {
    transform: translateY(1px);
  }
  &:focus-visible {
    outline: 3px solid rgba(37, 99, 235, 0.35);
    outline-offset: 2px;
  }

  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

/* Inline logout icon so we don't add new files */
const IconLogout = (p: any) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    {...p}
  >
    <path d="M15 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9" strokeWidth="2" />
    <path d="M10 12h10M19 9l3 3-3 3" strokeWidth="2" />
  </svg>
);

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const { openDialog } = useAuthDialog();
  const { status } = useSession(); // "loading" | "authenticated" | "unauthenticated"
  const authed = status === "authenticated";

  const close = () => setOpen(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Use non-redirecting signOut to avoid NextAuth interstitials,
    // then hard navigate to home for a clean UX.
    try {
      await signOut({ redirect: false });
    } finally {
      window.location.assign("/");
    }
  };

  return (
    <DropWrap ref={ref}>
      <NavBtn
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <IconUser />
        <span className="label">Account</span>
        <IconChevron up={open} />
      </NavBtn>

      <Dropdown role="menu" open={open}>
        <DropHeader>Account</DropHeader>

        {!authed && (
          <DropBtn
            type="button"
            onClick={() => {
              close();
              openDialog();
            }}
          >
            <IconUser /> <span>Sign In / Register</span>
          </DropBtn>
        )}

        {authed && (
          <DropLink href="/account" onClick={close}>
            <IconUser /> <span>My Account</span>
          </DropLink>
        )}

        {authed ? (
          <DropLink href="/account/orders" onClick={close}>
            <IconCart /> <span>Orders</span>
          </DropLink>
        ) : (
          <DropBtn
            type="button"
            onClick={() => {
              close();
              openDialog();
            }}
          >
            <IconCart /> <span>Orders</span>
          </DropBtn>
        )}

        {authed ? (
          <DropLink href="/wishlist" onClick={close}>
            <IconHeart /> <span>Wishlist</span>
          </DropLink>
        ) : (
          <DropBtn
            type="button"
            onClick={() => {
              close();
              openDialog();
            }}
          >
            <IconHeart /> <span>Wishlist</span>
          </DropBtn>
        )}

        {authed && (
          <LogoutWrap>
            <LogoutBtn
              type="button"
              onClick={handleLogout}
              aria-label="Sign out"
            >
              <IconLogout />
              <span>Sign out</span>
            </LogoutBtn>
          </LogoutWrap>
        )}
      </Dropdown>
    </DropWrap>
  );
}
