import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bitlab",
  description: "Learn AI and SQL by playing. Pick your track, play games, build real apps with Bit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
