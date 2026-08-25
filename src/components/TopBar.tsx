"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export interface Stats {
  streak: number;
  xp: number;
  gems: number;
  hearts: number;
}

export default function TopBar({
  name,
  stats,
}: {
  name?: string;
  stats?: Stats;
}) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="topbar">
      <div className="wrap row">
        <Link className="brand" href="/learn">
          <span className="logo">L</span>
          <span className="wordmark">Learnly</span>
        </Link>
        <div className="stats-row">
          {stats && (
            <>
              <span className={`stat streak${stats.streak > 0 ? " hot" : ""}`} title="Day streak">
                🔥 {stats.streak}
              </span>
              <span className="stat gems" title="Gems">
                💎 {stats.gems}
              </span>
              <span className="stat hearts" title="Hearts">
                ❤ {stats.hearts}
              </span>
              <span className="stat xp" title="XP">
                ⭐ {stats.xp}
              </span>
            </>
          )}
          <ThemeToggle />
          <button
            className="btn"
            style={{
              padding: "8px 14px",
              fontSize: 13,
              background: "transparent",
              color: "var(--on-dark)",
              borderColor: "var(--on-dark)",
            }}
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
