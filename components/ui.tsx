"use client";
import styled from "styled-components";
import { IconChevron } from "./header/icons";
// RightChevron: a right-pointing chevron icon for list items
export const RightChevron = (props: React.ComponentProps<"svg">) => (
  <IconChevron {...props} />
);

export const Container = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.container};
  margin: 0 auto;
  padding: 0 16px;
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid transparent;
  background: ${({ theme }) => theme.colors.brand};
  color: #fff;
  cursor: pointer;
  font-weight: 700;
  transition: 0.2s ease transform, 0.2s ease background, 0.2s ease box-shadow;
  &:hover {
    background: ${({ theme }) => theme.colors.brandDark};
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgElev};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  overflow: hidden;
`;

export const Grid3 = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const Muted = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;
