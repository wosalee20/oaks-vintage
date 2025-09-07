"use client";
import Link from "next/link";
import styled from "styled-components";
import { IconClose, IconMenu } from "./icons";
import { color } from "./styles";

const Mask = styled.div<{ open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  opacity: ${({ open }) => (open ? 1 : 0)};
  pointer-events: ${({ open }) => (open ? "auto" : "none")};
  transition: 0.15s ease;
  z-index: 45;
`;
const Drawer = styled.aside<{ open: boolean }>`
  position: fixed;
  inset: 0 auto 0 0;
  width: 320px;
  max-width: 84vw;
  background: #fff;
  border-right: 1px solid ${color.border};
  transform: translateX(${({ open }) => (open ? "0" : "-100%")});
  transition: transform 0.2s ease;
  z-index: 50;
  display: flex;
  flex-direction: column;
`;
const Head = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  border-bottom: 1px solid ${color.border};
`;
const List = styled.nav`
  padding: 10px;
  a {
    display: block;
    padding: 12px 10px;
    border-radius: 10px;
    color: ${color.text};
  }
  a:hover {
    background: rgba(37, 99, 235, 0.08);
  }
`;
const IconBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid ${color.border};
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
const InlineSearch = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  padding: 10px;
  input {
    height: 40px;
    border: 1px solid ${color.border};
    border-radius: 8px;
    padding: 0 12px;
  }
`;

export function MobileHamburger({ onClick }: { onClick(): void }) {
  return (
    <IconBtn aria-label="Open menu" onClick={onClick}>
      <IconMenu />
    </IconBtn>
  );
}

export default function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose(): void;
}) {
  return (
    <>
      <Mask open={open} onClick={onClose} />
      <Drawer open={open} aria-hidden={!open}>
        <Head>
          <strong>Browse</strong>
          <IconBtn aria-label="Close menu" onClick={onClose}>
            <IconClose />
          </IconBtn>
        </Head>
        <InlineSearch action="/search">
          <input name="q" placeholder="Search products…" />
        </InlineSearch>
        <List onClick={onClose}>
          <Link href="/category/jackets">Jackets</Link>
          <Link href="/category/tees">T-Shirts</Link>
          <Link href="/category/accessories">Accessories</Link>
          <Link href="/account">My Account</Link>
          <Link href="/help">Help</Link>
        </List>
      </Drawer>
    </>
  );
}
