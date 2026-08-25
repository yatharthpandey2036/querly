import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learnly",
  description: "Get fluent in AI, data and code — by playing. Pick a track, play games, build real projects with Bit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* set theme before paint to avoid a flash */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('bitlab-theme');if(!t)t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();",
          }}
        />
        {children}
      </body>
    </html>
  );
}
