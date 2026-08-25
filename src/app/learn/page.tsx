import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getProgressFor } from "@/lib/gamification";
import { TRACKS, getTrack, curriculumFor } from "@/content/tracks";
import { projectForUnit } from "@/content/projects";
import { aiProjectForUnit } from "@/content/ai-projects";
import { getUserPlan } from "@/lib/premium";
import { studioAccess } from "@/lib/studio";
import { lessonRequiresPremium, projectRequiresPremium } from "@/lib/access";
import TopBar from "@/components/TopBar";

export const dynamic = "force-dynamic";

const R = 42;
const C = 2 * Math.PI * R;

export default async function LearnPage({ searchParams }: { searchParams: { track?: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "parent") redirect("/parent");

  const track = getTrack(searchParams.track).id;
  const curriculum = curriculumFor(track);

  const { stats, completedLessonIds } = await getProgressFor(session.id);
  const doneSet = new Set(completedLessonIds);
  const plan = await getUserPlan(session.id);
  const premium = plan !== "free";
  const studio = await studioAccess(session.id);

  const order = curriculum.flatMap((u) => u.lessons.map((l) => l.id));
  const currentIndex = order.findIndex((id) => !doneSet.has(id));
  const currentId = currentIndex === -1 ? null : order[currentIndex];

  // per-track completion for the side panel
  const trackStats = TRACKS.map((t) => {
    const ids = t.curriculum.flatMap((u) => u.lessons.map((l) => l.id));
    const total = ids.length;
    const done = ids.filter((id) => doneSet.has(id)).length;
    return { id: t.id, icon: t.icon, short: t.short, total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  });
  const cur = trackStats.find((t) => t.id === track)!;

  return (
    <>
      <TopBar name={session.name} stats={{ streak: stats.streakCount, xp: stats.xp, gems: stats.gems, hearts: stats.hearts }} />

      <main className="wrap-wide" style={{ paddingTop: 24, paddingBottom: 60 }}>
        {/* track picker */}
        <div className="tracktabs">
          {TRACKS.map((t) => (
            <Link key={t.id} href={`/learn?track=${t.id}`} className={`tt ${t.id === track ? "on" : ""}`}>
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              <span>
                <b>{t.short}</b>
                <span className="tt-sub">{t.blurb}</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="learn-grid">
          {/* ---- path (main) ---- */}
          <div className="learn-main">
            <div className="spread" style={{ marginBottom: 8 }}>
              <div>
                <span className="eyebrow">Your path</span>
                <h2 style={{ fontSize: 26, marginTop: 6 }}>Hey {session.name} 👋</h2>
              </div>
              {currentId && (
                <Link className="btn btn-primary" href={`/lesson/${currentId}`}>
                  Continue →
                </Link>
              )}
            </div>

            {currentId === null && (
              <div className="feedback ok mono">🎉 You finished this whole track — legend! Try the other track above.</div>
            )}

            <div className="tree mt16">
              {curriculum.map((unit) => (
                <div className="unit" key={unit.id}>
                  <div className="unit-head">
                    <h3>{unit.title}</h3>
                    <span className="blurb">{unit.blurb}</span>
                  </div>
                  {unit.lessons.map((lesson) => {
                    const isDone = doneSet.has(lesson.id);
                    const isCurrent = lesson.id === currentId;
                    const idx = order.indexOf(lesson.id);
                    const locked = !isDone && !isCurrent && idx > currentIndex && currentIndex !== -1;
                    const nodeClass = isDone ? "done" : isCurrent ? "current" : locked ? "locked" : "done";
                    const glyph = isDone ? "✓" : isCurrent ? "▶" : locked ? "🔒" : "•";
                    const premiumLocked = !premium && !isDone && lessonRequiresPremium(lesson.id);
                    if (premiumLocked) {
                      return (
                        <Link href="/premium" key={lesson.id}>
                          <div className="lesson-row" style={{ opacity: 0.85 }}>
                            <div className="node" style={{ background: "var(--surface-3)", color: "var(--gold)" }}>🔒</div>
                            <div className="lesson-meta">
                              <h4>{lesson.title}</h4>
                              <p>{lesson.subtitle}</p>
                            </div>
                            <div>
                              <span className="tag t-gold">Premium</span>
                            </div>
                          </div>
                        </Link>
                      );
                    }
                    return (
                      <div className="lesson-row" key={lesson.id} style={{ opacity: locked ? 0.6 : 1 }}>
                        {locked ? (
                          <div className={`node ${nodeClass}`}>{glyph}</div>
                        ) : (
                          <Link href={`/lesson/${lesson.id}`} className={`node ${nodeClass}`}>
                            {glyph}
                          </Link>
                        )}
                        <div className="lesson-meta">
                          {locked ? (
                            <h4>{lesson.title}</h4>
                          ) : (
                            <Link href={`/lesson/${lesson.id}`}>
                              <h4>{lesson.title}</h4>
                            </Link>
                          )}
                          <p>{lesson.subtitle}</p>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          {isDone && <span className="tag t-brand">done</span>}
                          {isCurrent && <span className="tag t-gold">start</span>}
                          <Link
                            href={`/lesson/${lesson.id}/notes`}
                            className="btn"
                            style={{ padding: "5px 9px", fontSize: 12, background: "transparent", color: "var(--ink-2)", border: "1px solid var(--line-2)" }}
                            title="Revision notes"
                          >
                            📄
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                  {(() => {
                    const sqlP = projectForUnit(unit.id);
                    const aiP = aiProjectForUnit(unit.id);
                    const project = sqlP ?? aiP;
                    if (!project) return null;
                    const unitDone = unit.lessons.every((l) => doneSet.has(l.id));
                    const projDone = doneSet.has(project.id);
                    const premiumLocked = !premium && !projDone && projectRequiresPremium(project.id);
                    const href = premiumLocked ? "/premium" : sqlP ? `/project/${sqlP.id}` : `/ai-project/${aiP!.id}`;
                    const locked = !unitDone && !projDone && !premiumLocked;
                    const inner = (
                      <div className="lesson-row project-row">
                        <div
                          className="node"
                          style={{
                            background: projDone ? "var(--dark)" : premiumLocked || locked ? "var(--surface-3)" : "var(--dark)",
                            color: premiumLocked ? "var(--gold)" : locked ? "var(--ink-3)" : "var(--lime)",
                          }}
                        >
                          {projDone ? "✓" : premiumLocked || locked ? "🔒" : "★"}
                        </div>
                        <div className="lesson-meta">
                          <h4>🚀 Project · {project.title}</h4>
                          <p>{project.tagline}</p>
                        </div>
                        <div>
                          {projDone ? (
                            <span className="tag t-brand">shipped</span>
                          ) : premiumLocked ? (
                            <span className="tag t-gold">Premium</span>
                          ) : !locked ? (
                            <span className="tag t-gold">build</span>
                          ) : null}
                        </div>
                      </div>
                    );
                    return locked ? <div style={{ opacity: 0.6 }}>{inner}</div> : <Link href={href}>{inner}</Link>;
                  })()}
                </div>
              ))}
            </div>
          </div>

          {/* ---- side panel ---- */}
          <aside className="side-panel">
            <div className="card pad">
              <span className="eyebrow">This track</span>
              <div className="ring-wrap mt16">
                <svg className="ring" viewBox="0 0 100 100" aria-hidden="true">
                  <circle className="bg" cx="50" cy="50" r={R} />
                  <circle className="fg" cx="50" cy="50" r={R} strokeDasharray={C} strokeDashoffset={C * (1 - cur.pct / 100)} />
                </svg>
                <div className="ring-label">
                  <div className="pct">{cur.pct}%</div>
                  <div className="sub">
                    {cur.done}/{cur.total} lessons
                  </div>
                </div>
              </div>
              <div className="panel-stats">
                <div className="panel-stat">
                  <div className="n" style={{ color: "var(--gold)" }}>🔥 {stats.streakCount}</div>
                  <div className="l">streak</div>
                </div>
                <div className="panel-stat">
                  <div className="n">⭐ {stats.xp}</div>
                  <div className="l">xp</div>
                </div>
                <div className="panel-stat">
                  <div className="n">💎 {stats.gems}</div>
                  <div className="l">gems</div>
                </div>
              </div>
            </div>

            <Link className="card pad" href={`/projects?track=${track}`} style={{ display: "block" }}>
              <span className="eyebrow">{premium ? "🌍 Real life" : "🔒 Real life · Premium"}</span>
              <h4 style={{ fontSize: 16, marginTop: 8 }}>Use it in real life →</h4>
              <p className="muted small mt8">Short, no-pressure projects: pocket money, watchlists, scam-spotting…</p>
            </Link>

            {plan === "free" ? (
              <Link className="card pad" href="/premium" style={{ display: "block", borderColor: "var(--gold)" }}>
                <span className="eyebrow" style={{ color: "var(--gold)" }}>🏆 Go Premium</span>
                <h4 style={{ fontSize: 16, marginTop: 8 }}>Leagues, friends &amp; races</h4>
                <p className="muted small mt8">Learning is free — unlock the competition for ₹170/mo.</p>
              </Link>
            ) : (
              <Link className="card pad" href="/social" style={{ display: "block" }}>
                <span className="eyebrow">🏆 Compete</span>
                <h4 style={{ fontSize: 16, marginTop: 8 }}>Leagues, friends &amp; races →</h4>
                <p className="muted small mt8">See your rank and challenge friends.</p>
              </Link>
            )}

            <Link className="card pad" href="/studio" style={{ display: "block", borderColor: studio.unlocked ? "var(--lime)" : "var(--line)" }}>
              <span className="eyebrow" style={studio.unlocked ? { color: "var(--brand-2)" } : undefined}>
                {studio.unlocked ? "🧪 Maker Lab · exclusive" : "🔒 Maker Lab · exclusive"}
              </span>
              <h4 style={{ fontSize: 16, marginTop: 8 }}>{studio.unlocked ? "Build an AI DJ →" : "Unlock the Maker Lab"}</h4>
              <p className="muted small mt8">
                {studio.unlocked
                  ? "Your exclusive build-with-AI projects."
                  : `Premium + ${studio.xpNeeded} XP + a friend (you: ${studio.xp} XP).`}
              </p>
            </Link>

            <div className="card pad">
              <span className="eyebrow">Your tracks</span>
              <div className="track-prog">
                {trackStats.map((t) => (
                  <Link key={t.id} href={`/learn?track=${t.id}`} style={{ display: "block" }}>
                    <div className="tp-top">
                      <b>
                        {t.icon} {t.short}
                      </b>
                      <span className="tp-count">
                        {t.done}/{t.total}
                      </span>
                    </div>
                    <div className="progressbar">
                      <i style={{ width: `${t.pct}%` }} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
