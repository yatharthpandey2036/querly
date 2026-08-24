"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

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
          <span className="logo">🦫</span> Querly
        </Link>
        <div className="stats-row">
          {stats && (
            <>
              <span className="stat streak" title="Day streak">
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
          <button className="btn btn-ghost" style={{ padding: "8px 12px", fontSize: 13 }} onClick={logout}>
            {name ? `Log out` : "Log out"}
          </button>
        </div>
      </div>
    </nav>
  );
}
