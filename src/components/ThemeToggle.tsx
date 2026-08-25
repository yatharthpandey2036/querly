"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const cur = document.documentElement.getAttribute("data-theme");
    const isDark = cur ? cur === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(isDark);
  }, []);

  function toggle() {
    const next = dark ? "light" : "dark";
    track("Theme Toggled", { theme: next });
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("bitlab-theme", next);
    } catch {
      /* ignore */
    }
    setDark(!dark);
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      role="switch"
      aria-checked={dark}
      aria-label="Toggle dark mode"
      title="Light / dark"
    >
      <span className="knob">{dark ? "🌙" : "☀️"}</span>
    </button>
  );
}
