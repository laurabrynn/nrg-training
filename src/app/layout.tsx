import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NRG Training",
  description: "Staff training portal for Neighborhood Restaurant Group",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-nrg-cream">{children}</body>
    </html>
  );
}
