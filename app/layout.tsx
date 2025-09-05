import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/header/Header";

export const metadata: Metadata = {
  title: "Oaks Vintage",
  description: "Vintage clothing & accessories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
          <footer
            style={{
              borderTop: "1px solid rgba(255,255,255,.1)",
              marginTop: 32,
            }}
          >
            <div style={{ maxWidth: 1120, margin: "0 auto", padding: "16px" }}>
              © {new Date().getFullYear()} Oaks Vintage
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
