import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getProgressFor } from "@/lib/gamification";
import { isPremium } from "@/lib/premium";
import { leagueLeaderboard, leagueTier, listFriends } from "@/lib/social";
import TopBar from "@/components/TopBar";
import Paywall from "@/components/Paywall";
import FriendAdd from "@/components/FriendAdd";

export const dynamic = "force-dynamic";

export default async function SocialPage() {
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
          <Paywall feature="Leagues & Friends" />
        </main>
      </>
    );
  }

  const league = await leagueLeaderboard(15);
  const friends = await listFriends(session.id);
  const myTier = leagueTier(stats.xp);

  return (
    <>
      {topbar}
      <main className="wrap" style={{ paddingTop: 20, paddingBottom: 60, maxWidth: 1000 }}>
        <Link className="btn btn-ghost" href="/learn" style={{ padding: "8px 14px", marginBottom: 18 }}>
          ← Back
        </Link>
        <div className="spread" style={{ flexWrap: "wrap", gap: 12 }}>
          <div>
            <span className="eyebrow">Compete</span>
            <h2 style={{ fontSize: 26, marginTop: 6 }}>Leagues &amp; Friends</h2>
          </div>
          <Link className="btn btn-primary" href="/race">
            🏁 Query Race →
          </Link>
        </div>

        <div className="grid-2 mt24">
          {/* Leagues */}
          <div className="card pad">
            <div className="spread">
              <span className="eyebrow">This week&apos;s league</span>
              <span className="tag t-gold">
                {myTier.icon} {myTier.name}
              </span>
            </div>
            <div style={{ marginTop: 14 }}>
              {league.map((r, i) => {
                const me = r.id === session.id;
                return (
                  <div
                    key={r.id}
                    className="spread"
                    style={{
                      padding: "9px 10px",
                      borderTop: i ? "1px solid var(--line)" : "none",
                      background: me ? "var(--lime-soft)" : "transparent",
                      fontWeight: me ? 700 : 500,
                    }}
                  >
                    <span>
                      <span className="mono" style={{ color: "var(--ink-3)", marginRight: 10 }}>
                        {i + 1}
                      </span>
                      {r.name} {me && <span className="tag t-brand" style={{ marginLeft: 6 }}>you</span>}
                    </span>
                    <span className="spread" style={{ gap: 12 }}>
                      <span className="stat streak" style={{ fontSize: 13 }}>🔥 {r.streak}</span>
                      <span className="stat xp">⭐ {r.xp}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Friends */}
          <div className="card pad">
            <span className="eyebrow">Friends</span>
            <p className="muted small mt8">Add a friend by their email to compare progress.</p>
            <div className="mt16">
              <FriendAdd />
            </div>
            <div style={{ marginTop: 18 }}>
              {friends.length === 0 ? (
                <p className="muted small">No friends yet — add one above! 👆</p>
              ) : (
                friends.map((f, i) => (
                  <div key={f.id} className="spread" style={{ padding: "9px 0", borderTop: i ? "1px solid var(--line)" : "none" }}>
                    <span style={{ fontWeight: 600 }}>{f.name}</span>
                    <span className="spread" style={{ gap: 12 }}>
                      <span className="stat streak" style={{ fontSize: 13 }}>🔥 {f.streak}</span>
                      <span className="stat xp">⭐ {f.xp}</span>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
