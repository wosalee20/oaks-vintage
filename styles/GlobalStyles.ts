"use client";
import { createGlobalStyle, DefaultTheme } from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      bg: string;
      text: string;
      [key: string]: string;
    };
  }
}

export const GlobalStyles = createGlobalStyle`
  :root { --bg: ${({ theme }) => theme.colors.bg}; }
  html, body {
    background: var(--bg);
    color: ${({ theme }) => theme.colors.text};
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Apple Color Emoji","Segoe UI Emoji";
  }
  * { box-sizing: border-box; }
  a { color: inherit; text-decoration: none; }
`;
