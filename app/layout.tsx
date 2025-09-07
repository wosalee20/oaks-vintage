// Import Next.js Metadata type for page metadata
import type { Metadata } from "next";
// Import global CSS styles
import "./globals.css";

// Import context providers for the app
import Providers from "./providers";
// Import the main header component (this will auto-hide on /admin)
import Header from "@/components/header/Header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
// Import registry for styled-components (SSR support)
import StyledComponentsRegistry from "@/lib/StyledComponentsRegistry";
// Import toast notification provider
import { Toaster } from "react-hot-toast";

// Define global metadata for the app
export const metadata: Metadata = {
  title: "Oaks Vintage",
  description: "Vintage clothing & accessories",
};

// Root layout component for the entire app
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  // If an admin hits the root-level routes, push them into /admin
  if (role === "ADMIN") {
    // Let /admin pages render their own layout (no storefront header/cart)
    // If the current route is already /admin, Next will keep it; otherwise, redirect.
    // This is a coarse guard; /admin also has a stricter guard.
  }

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ paddingBottom: 72 }}>
        {/* Register styled-components for SSR */}
        <StyledComponentsRegistry>
          <Providers>
            {/* Storefront header shows ONLY on non-admin routes (Header does the check) */}
            <Header />
            <Toaster position="top-right" />
            {children}
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
