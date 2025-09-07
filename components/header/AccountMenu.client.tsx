"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useAuthDialog } from "@/components/auth/AuthDialogProvider";
import styled from "styled-components";
import useClickOutside from "@/hooks/useClickOutside";
import { DropHeader, Dropdown, DropWrap, NavBtn } from "./styles";
import { IconChevron, IconCart, IconHeart, IconUser } from "./icons";

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

const AccountMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const { openDialog } = useAuthDialog();
  const { data: session } = useSession();

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
        {!session?.user ? (
          <>
            <button
              type="button"
              onClick={openDialog}
              style={{
                display: "grid",
                gridTemplateColumns: "24px 1fr",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                fontSize: 14,
                color: "#111827",
                background: "none",
                border: "none",
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <IconUser /> <span>Sign In / Register</span>
            </button>
            <button
              type="button"
              onClick={() => {
                import("next-auth/react").then(({ signIn }) =>
                  signIn(undefined, { callbackUrl: "/admin" })
                );
                setOpen(false);
              }}
              style={{
                display: "grid",
                gridTemplateColumns: "24px 1fr",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                fontSize: 14,
                color: "#111827",
                background: "none",
                border: "none",
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <IconUser /> <span>Admin sign in</span>
            </button>
          </>
        ) : (
          <>
            <DropLink href="/account">
              <IconUser /> <span>My Account</span>
            </DropLink>
            <DropLink href="/account/orders">
              <IconCart /> <span>Orders</span>
            </DropLink>
            <DropLink href="/wishlist">
              <IconHeart /> <span>Wishlist</span>
            </DropLink>
          </>
        )}
      </Dropdown>
    </DropWrap>
  );
};

export default AccountMenu;
