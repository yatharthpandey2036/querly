import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getProgressFor } from "@/lib/gamification";
import { CURRICULUM, ALL_LESSONS } from "@/content/curriculum";
import { projectForUnit } from "@/content/projects";
import TopBar from "@/components/TopBar";

export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "parent") redirect("/parent");

  const { stats, completedLessonIds } = await getProgressFor(session.id);
  const doneSet = new Set(completedLessonIds);

  // The current lesson is the first one not yet completed; everything after it is locked.
  const order = ALL_LESSONS.map((l) => l.id);
  const currentIndex = order.findIndex((id) => !doneSet.has(id));
  const currentId = currentIndex === -1 ? null : order[currentIndex];

  return (
    <>
      <TopBar
        name={session.name}
        stats={{
          streak: stats.streakCount,
          xp: stats.xp,
          gems: stats.gems,
          hearts: stats.hearts,
        }}
      />

      <main className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
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
          <div className="feedback ok mono">🎉 You finished every lesson we have so far — legend!</div>
        )}

        <div className="tree mt16">
          {CURRICULUM.map((unit) => (
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
                const project = projectForUnit(unit.id);
                if (!project) return null;
                const unitDone = unit.lessons.every((l) => doneSet.has(l.id));
                const projDone = doneSet.has(project.id);
                const locked = !unitDone && !projDone;
                const inner = (
                  <div className="lesson-row project-row">
                    <div
                      className="node"
                      style={{
                        background: locked ? "var(--surface-3)" : "var(--dark)",
                        color: locked ? "var(--ink-3)" : "var(--lime)",
                      }}
                    >
                      {projDone ? "✓" : locked ? "🔒" : "★"}
                    </div>
                    <div className="lesson-meta">
                      <h4>🚀 Project · {project.title}</h4>
                      <p>{project.tagline}</p>
                    </div>
                    <div>
                      {projDone ? (
                        <span className="tag t-brand">shipped</span>
                      ) : !locked ? (
                        <span className="tag t-gold">build</span>
                      ) : null}
                    </div>
                  </div>
                );
                return locked ? (
                  <div style={{ opacity: 0.6 }}>{inner}</div>
                ) : (
                  <Link href={`/project/${project.id}`}>{inner}</Link>
                );
              })()}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
