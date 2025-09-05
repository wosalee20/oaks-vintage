import styled, { css } from "styled-components";

export const color = {
  primary: (p: any) => p.theme?.colors?.primary ?? "#2563EB",
  primaryDark: (p: any) => p.theme?.colors?.primaryDark ?? "#1D4ED8",
  text: (p: any) => p.theme?.colors?.text ?? "#111827",
  muted: (p: any) => p.theme?.colors?.muted ?? "rgba(17,24,39,.62)",
  border: (p: any) => p.theme?.colors?.border ?? "rgba(0,0,0,.08)",
  headerBg: (p: any) => p.theme?.colors?.headerBg ?? "#ffffff",
  topStripBg: (p: any) => p.theme?.colors?.topStripBg ?? "#1E3A8A",
};

export const TopStrip = styled.div`
  background: ${color.topStripBg};
  color: #fff;
  font-size: 13px;
  line-height: 40px;
  a {
    color: #fff;
    font-weight: 600;
  }
`;

export const Wrap = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  background: ${color.headerBg};
  border-bottom: 1px solid ${color.border};
`;

export const Shell = styled.div`
  max-width: ${({ theme }) => theme?.layout?.max ?? 1180}px;
  margin: 0 auto;
  padding: 10px 16px;
`;

export const Row = styled.div`
  display: grid;
  align-items: center;
  gap: 12px;
  grid-template-columns: 1fr 2fr 1fr;
  @media (max-width: 1024px) {
    grid-template-columns: auto 1fr auto;
  }
`;

export const Logo = styled.span`
  font-weight: 800;
  letter-spacing: 0.2px;
  color: ${color.text};
  font-size: 22px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  b {
    color: ${color.primary};
  }
  span.star {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${color.primary};
    display: inline-block;
  }
`;

export const NavBtn = styled.button`
  background: transparent;
  border: 1px solid ${color.border};
  border-radius: 10px;
  height: 40px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${color.text};
  cursor: pointer;
  &:hover {
    border-color: ${color.primary};
  }
`;

export const iconCss = css`
  display: inline-block;
  width: 20px;
  height: 20px;
`;

export const Right = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 14px;
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

export const Hamburger = styled.button`
  display: none;
  @media (max-width: 1024px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: 1px solid ${color.border};
    background: transparent;
    cursor: pointer;
  }
`;

/* Dropdown primitives */
export const DropWrap = styled.div`
  position: relative;
`;
export const Dropdown = styled.div<{ open: boolean }>`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  background: #fff;
  color: ${color.text};
  border: 1px solid ${color.border};
  border-radius: 12px;
  min-width: 220px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transform-origin: top right;
  opacity: ${({ open }) => (open ? 1 : 0)};
  pointer-events: ${({ open }) => (open ? "auto" : "none")};
  transform: ${({ open }) => (open ? "scale(1)" : "scale(.98)")};
  transition: 0.12s ease;
  z-index: 50;
`;
export const DropHeader = styled.div`
  padding: 12px 14px;
  background: rgba(37, 99, 235, 0.08);
  font-weight: 700;
  color: ${color.text};
`;
export const DropItem = styled.a`
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  font-size: 14px;
  color: ${color.text};
  &:hover {
    background: rgba(37, 99, 235, 0.06);
  }
`;
