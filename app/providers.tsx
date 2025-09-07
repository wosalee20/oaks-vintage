"use client";

import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { theme } from "@/styles/theme";
import { CartProvider } from "@/components/cart/CartContext";
import AuthDialogProvider from "@/components/auth/AuthDialogProvider";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {isAdmin ? (
          // Admin area: NO CartProvider, NO AuthDialogProvider (admin data comes from Supabase).
          <>{children}</>
        ) : (
          // Storefront: normal providers
          <CartProvider>
            <AuthDialogProvider>{children}</AuthDialogProvider>
          </CartProvider>
        )}
      </ThemeProvider>
    </SessionProvider>
  );
}
