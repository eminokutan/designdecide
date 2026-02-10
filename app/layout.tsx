import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Development Case Game",
  description: "Team-based branching case studies for design students.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
