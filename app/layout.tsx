import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contacts Dashboard",
  description: "View and manage contacts from Google Sheets",
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
