import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getProgressFor } from "@/lib/gamification";
import { isPremium } from "@/lib/premium";
import { raceLeaderboard } from "@/lib/social";
import TopBar from "@/components/TopBar";
import Paywall from "@/components/Paywall";
import QueryRace from "@/components/QueryRace";

export const dynamic = "force-dynamic";

export default async function RacePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const { stats } = await getProgressFor(session.id);

  const topbar = (
    <TopBar name={session.name} stats={{ streak: stats.streakCount, xp: stats.xp, gems: stats.gems, hearts: stats.hearts }} />
  );

  if (!(await isPremium(session.id))) {
    return (
      <>
        {topbar}
        <main className="wrap">
          <Paywall feature="Query Race" />
        </main>
      </>
    );
  }

  const board = await raceLeaderboard(10);

  return (
    <>
      {topbar}
      <main className="wrap" style={{ paddingTop: 20, paddingBottom: 60 }}>
        <Link className="btn btn-ghost" href="/social" style={{ padding: "8px 14px", marginBottom: 24 }}>
          ← Back
        </Link>
        <QueryRace initialBoard={board} />
      </main>
    </>
  );
}
