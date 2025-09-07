"use client";
import {
  MobileWrap,
  HeadBar,
  Welcome,
} from "@/components/account/AccountStyled";
import { useAuthDialog } from "@/components/auth/AuthDialogProvider";

export default function MobileAccountGuest() {
  const { openDialog } = useAuthDialog();
  return (
    <MobileWrap>
      <HeadBar>Account</HeadBar>
      <Welcome>
        <div style={{ fontWeight: 900, fontSize: 16 }}>Welcome!</div>
        <small>Sign in to access your account features.</small>
      </Welcome>
      <button
        type="button"
        onClick={openDialog}
        style={{
          display: "block",
          width: "100%",
          margin: "18px 0 0 0",
          background: "#2563EB",
          color: "#fff",
          borderRadius: 12,
          textAlign: "center",
          fontWeight: 900,
          fontSize: 16,
          padding: "14px 0",
          textDecoration: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        Sign In / Register
      </button>
    </MobileWrap>
  );
}
