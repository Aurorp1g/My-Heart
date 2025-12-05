import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gallery Wall - Aurorp1g",
  description: "Aurorp1g's personal gallery wall website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
