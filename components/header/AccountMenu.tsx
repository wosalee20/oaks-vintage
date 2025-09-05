"use client";
import Link from "next/link";
import { useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import { DropHeader, DropItem, Dropdown, DropWrap, NavBtn } from "./styles";
import { IconChevron, IconCart, IconHeart, IconUser } from "./icons";

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

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
        <Link href="/auth/signin" passHref legacyBehavior>
          <DropItem>
            <IconUser /> <span>Sign In</span>
          </DropItem>
        </Link>
        <Link href="/account" passHref legacyBehavior>
          <DropItem>
            <IconUser /> <span>My Account</span>
          </DropItem>
        </Link>
        <Link href="/account/orders" passHref legacyBehavior>
          <DropItem>
            <IconCart /> <span>Orders</span>
          </DropItem>
        </Link>
        <Link href="/wishlist" passHref legacyBehavior>
          <DropItem>
            <IconHeart /> <span>Wishlist</span>
          </DropItem>
        </Link>
      </Dropdown>
    </DropWrap>
  );
}
