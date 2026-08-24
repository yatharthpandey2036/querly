import { redirect } from "next/navigation";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { getSession } from "@/lib/session";
import { parentLinks, users, userStats, progress } from "@/db/schema";
import { ALL_LESSONS } from "@/content/curriculum";
import TopBar from "@/components/TopBar";

export const dynamic = "force-dynamic";

export default async function ParentDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "parent") redirect("/learn");

  const links = await db.select().from(parentLinks).where(eq(parentLinks.parentUserId, session.id));
  const childIds = links.map((l) => l.studentUserId);

  let children: {
    name: string;
    streak: number;
    xp: number;
    gems: number;
    lessonsCompleted: number;
    mastered: string[];
  }[] = [];

  if (childIds.length > 0) {
    const kids = await db.select().from(users).where(inArray(users.id, childIds));
    const stats = await db.select().from(userStats).where(inArray(userStats.userId, childIds));
    const done = await db.select().from(progress).where(inArray(progress.userId, childIds));
    children = kids.map((k) => {
      const s = stats.find((x) => x.userId === k.id);
      const myLessons = done.filter((d) => d.userId === k.id);
      const mastered = ALL_LESSONS.filter((l) => myLessons.some((d) => d.lessonId === l.id)).map((l) => l.title);
      return {
        name: k.name,
        streak: s?.streakCount ?? 0,
        xp: s?.xp ?? 0,
        gems: s?.gems ?? 0,
        lessonsCompleted: myLessons.length,
        mastered,
      };
    });
  }

  return (
    <>
      <TopBar name={session.name} />
      <main className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
        <span className="eyebrow">Parent dashboard</span>
        <h2 style={{ fontSize: 26, marginTop: 6 }}>Hi {session.name} 👋</h2>
        <p className="muted mt8">A read-only view of your children's learning. You observe — you never play for them.</p>

        {children.length === 0 ? (
          <div className="card pad mt24">
            <h3 style={{ fontSize: 18 }}>No child linked yet</h3>
            <p className="muted small mt8">
              Ask your child to add your email when they sign up, or link them by re-signing up with
              their email. Once linked, their progress shows up here.
            </p>
          </div>
        ) : (
          <div className="grid-3 mt24">
            {children.map((c) => (
              <div className="card pad" key={c.name}>
                <div className="spread">
                  <h3 style={{ fontSize: 18 }}>{c.name}</h3>
                  <span className="tag t-brand">active</span>
                </div>
                <div className="spread mt16">
                  <span className="stat streak">🔥 {c.streak}</span>
                  <span className="stat xp">⭐ {c.xp} XP</span>
                  <span className="stat gems">💎 {c.gems}</span>
                </div>
                <div className="mono small muted mt16">
                  {c.lessonsCompleted} lesson{c.lessonsCompleted === 1 ? "" : "s"} completed
                </div>
                {c.mastered.length > 0 && (
                  <div className="mt8" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {c.mastered.slice(0, 6).map((m) => (
                      <span key={m} className="tag t-brand">
                        {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
