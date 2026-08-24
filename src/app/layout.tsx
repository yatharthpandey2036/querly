import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Querly",
  description: "Learn SQL, databases and AI by playing. Real queries, instant feedback, streaks that stick.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
