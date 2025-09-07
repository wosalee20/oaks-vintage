"use client";
import LogoutButton from "./LogoutButton";
import {
  HeadBar,
  Welcome,
  Strip,
  LiveChat,
  SectionTitle,
  List,
  Row,
} from "./AccountStyled";
import { RightChevron } from "@/components/ui";
import React from "react";

export default function MobileAccountSection({
  displayName,
  email,
  ordersCount,
}: {
  displayName: string;
  email: string;
  ordersCount: number;
}) {
  return (
    <>
      <HeadBar>Account</HeadBar>
      <Welcome>
        <div style={{ fontWeight: 900, fontSize: 16 }}>
          Welcome <b>{displayName}!</b>
        </div>
        <small>{email}</small>
      </Welcome>
      <Strip>
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
        >
          <rect x="2" y="6" width="20" height="12" rx="3" strokeWidth="2" />
          <path d="M16 12h6" strokeWidth="2" />
        </svg>
        <span>Store credit balance: ₦ 0</span>
      </Strip>
      <LiveChat href="/help">Live Chat</LiveChat>
      <SectionTitle>Need Assistance?</SectionTitle>
      <List>
        <Row href="/help" aria-label="Help & Support">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M12 16v-4" strokeWidth="2" />
            <circle cx="12" cy="8" r="1" fill="currentColor" />
          </svg>
          <span style={{ fontWeight: 700 }}>Help &amp; Support</span>
          <RightChevron />
        </Row>
      </List>
      <SectionTitle>My Oaks Account</SectionTitle>
      <List>
        <Row href="/account/orders" aria-label="Orders">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
          >
            <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="2" />
          </svg>
          <span>Orders ({ordersCount})</span>
          <RightChevron />
        </Row>
        <Row href="/account/addresses" aria-label="Addresses">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M12 21s-6-4.3-8.5-7.6C1.3 10 3.2 6 7 6c2 0 3.2 1 4 2 .8-1 2-2 4-2 3.8 0 5.7 4 3.5 7.4C18 16.7 12 21 12 21z"
              strokeWidth="2"
            />
          </svg>
          <span>Addresses</span>
          <RightChevron />
        </Row>
        <Row href="/wishlist" aria-label="Wishlist">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 21s-7-4.6-9.5-8C.3 10 2.2 6 6 6c2 0 3.2 1 4 2 .8-1 2-2 4-2 3.8 0 5.7 4 3.5 7-2.5 3.4-9.5 8-9.5 8z" />
          </svg>
          <span>Wishlist</span>
          <RightChevron />
        </Row>
        <Row href="/account/profile" aria-label="Profile">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
          >
            <path d="M20 21a8 8 0 10-16 0" strokeWidth="2" />
            <circle cx="12" cy="7" r="4" strokeWidth="2" />
          </svg>
          <span>Profile</span>
          <RightChevron />
        </Row>
      </List>
      <LogoutButton />
    </>
  );
}
