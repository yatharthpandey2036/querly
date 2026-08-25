import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getProgressFor } from "@/lib/gamification";
import { getTrack } from "@/content/tracks";
import { LIFE_SQL_PROJECTS } from "@/content/projects";
import { LIFE_AI_PROJECTS } from "@/content/ai-projects";
import { isPremium } from "@/lib/premium";
import TopBar from "@/components/TopBar";
import Paywall from "@/components/Paywall";

export const dynamic = "force-dynamic";

export default async function LifeProjectsPage({ searchParams }: { searchParams: { track?: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "parent") redirect("/parent");

  const track = getTrack(searchParams.track).id;
  const { stats, completedLessonIds } = await getProgressFor(session.id);
  const doneSet = new Set(completedLessonIds);

  if (!(await isPremium(session.id))) {
    return (
      <>
        <TopBar name={session.name} stats={{ streak: stats.streakCount, xp: stats.xp, gems: stats.gems, hearts: stats.hearts }} />
        <main className="wrap">
          <Paywall feature="Real-life projects" />
        </main>
      </>
    );
  }

  const items =
    track === "ai"
      ? LIFE_AI_PROJECTS.map((p) => ({
          id: p.id,
          title: p.title,
          tagline: p.tagline,
          why: p.why ?? "",
          xp: p.steps.reduce((n, s) => n + s.xp, 0),
          href: `/ai-project/${p.id}`,
          done: doneSet.has(p.id),
        }))
      : LIFE_SQL_PROJECTS.map((p) => ({
          id: p.id,
          title: p.title,
          tagline: p.tagline,
          why: p.why ?? "",
          xp: p.missions.reduce((n, m) => n + m.xp, 0),
          href: `/project/${p.id}`,
          done: doneSet.has(p.id),
        }));

  return (
    <>
      <TopBar name={session.name} stats={{ streak: stats.streakCount, xp: stats.xp, gems: stats.gems, hearts: stats.hearts }} />

      <main className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
        <div className="spread" style={{ flexWrap: "wrap", gap: 12 }}>
          <div>
            <span className="eyebrow">Real-life projects</span>
            <h2 style={{ fontSize: 28, marginTop: 6 }}>Use it in real life 🌍</h2>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link className={`btn ${track === "sql" ? "btn-dark" : "btn-ghost"}`} href="/projects?track=sql" style={{ padding: "9px 16px" }}>
              🗄️ SQL
            </Link>
            <Link className={`btn ${track === "ai" ? "btn-dark" : "btn-ghost"}`} href="/projects?track=ai" style={{ padding: "9px 16px" }}>
              🤖 AI
            </Link>
          </div>
        </div>

        <div className="banner" style={{ marginTop: 16, borderLeftColor: "var(--lime)" }}>
          🌿 No streak, no pressure. These are short — do one whenever you're curious. School comes first!
        </div>

        <div className="grid-3 mt24">
          {items.map((p) => (
            <Link key={p.id} href={p.href} className="card pad" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="spread">
                <h3 style={{ fontSize: 18 }}>{p.title}</h3>
                {p.done ? <span className="tag t-brand">shipped</span> : <span className="tag t-gold">2 mins</span>}
              </div>
              <p className="muted small">{p.tagline}</p>
              <div className="life-why">
                <b>Why it helps:</b> {p.why}
              </div>
              <div className="spread" style={{ marginTop: "auto", paddingTop: 6 }}>
                <span className="stat xp">⭐ {p.xp} XP</span>
                <span className="mono small" style={{ color: "var(--brand-2)" }}>{p.done ? "Play again →" : "Start →"}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
