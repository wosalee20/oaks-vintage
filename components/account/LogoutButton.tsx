"use client";

import { useState } from "react";
import styled from "styled-components";
import { signOut } from "next-auth/react";

/* Brand-blue, mobile-friendly button */
const Button = styled.button`
  --primary: ${({ theme }) => theme?.colors?.primary ?? "#2563EB"};
  --primaryDark: ${({ theme }) => theme?.colors?.primaryDark ?? "#1D4ED8"};

  width: 100%;
  max-width: 420px;
  height: 44px;
  margin: 16px auto 0;
  display: inline-grid;
  grid-template-columns: 22px 1fr;
  align-items: center;
  justify-content: center;
  gap: 10px;

  border: 0;
  border-radius: 12px;
  background: var(--primary);
  color: #fff;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.18);
  transition: background 0.15s ease, transform 0.06s ease;

  &:hover {
    background: var(--primaryDark);
  }
  &:active {
    transform: translateY(1px);
  }
  &:focus-visible {
    outline: 3px solid rgba(37, 99, 235, 0.35);
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/* Small inline icon so we don't add files */
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

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Avoid NextAuth interstitial for a clean mobile UX
      await signOut({ redirect: false });
    } finally {
      // Hard redirect ensures all client state is cleared
      window.location.assign("/");
    }
  };

  return (
    <Button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      aria-label="Log out"
    >
      <IconLogout />
      <span>{loading ? "Logging out…" : "Log out"}</span>
    </Button>
  );
}
