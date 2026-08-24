import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Querly — learn SQL & data the fun way",
  description:
    "A Duolingo-style app that teaches SQL, databases and AI to students in class 9–12 through games, puzzles and quizzes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
