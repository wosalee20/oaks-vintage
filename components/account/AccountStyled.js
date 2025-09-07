"use client";
import Link from "next/link";

export const Strip = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  margin: 8px 0 12px;
  font-weight: 700;
`;

export const LiveChat = styled(Link)`
  display: block;
  text-align: center;
  height: 48px;
  line-height: 48px;
  border-radius: 12px;
  background: var(--primary);
  color: #fff;
  font-weight: 900;
  text-decoration: none;
  margin: 4px 0 12px;
`;

export const SectionTitle = styled.div`
  margin-top: 14px;
  font-weight: 800;
  color: #6b7280;
  font-size: 12px;
  text-transform: uppercase;
`;

export const List = styled.div`
  margin-top: 6px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
`;

export const Row = styled(Link)`
  display: grid;
  grid-template-columns: 24px 1fr 24px;
  align-items: center;
  gap: 10px;
  padding: 14px;
  color: var(--text);
  text-decoration: none;
  border-bottom: 1px solid var(--border);
  &:last-child {
    border-bottom: none;
  }
`;
import styled from "styled-components";

export const MobileWrap = styled.div`
  display: block;
  @media (min-width: 1024px) {
    display: none;
  }
  --primary: ${({ theme }) => theme?.colors?.primary ?? "#2563EB"};
  --text: ${({ theme }) => theme?.colors?.text ?? "#111827"};
  --muted: rgba(17, 24, 39, 0.65);
  --border: rgba(0, 0, 0, 0.08);
`;

export const HeadBar = styled.div`
  background: #2f2f2f;
  color: #fff;
  border-radius: 12px;
  padding: 14px 12px;
  font-weight: 900;
  font-size: 18px;
`;

export const Welcome = styled.div`
  padding: 14px 6px 6px;
  b {
    color: var(--primary);
  }
  small {
    display: block;
    color: var(--muted);
    margin-top: 2px;
  }
`;

export const Desktop = styled.div`
  display: grid;
  gap: 16px;
  @media (max-width: 1023px) {
    display: none;
  }
`;
