import Link from "next/link";
import { notFound } from "next/navigation";
import { getLesson, getUnit } from "@/content/tracks";
import { getNotes } from "@/content/notes";
import NotesActions from "@/components/NotesActions";

export const dynamic = "force-dynamic";

function buildText(title: string, unit: string, n: ReturnType<typeof getNotes>): string {
  if (!n) return "";
  const lines: string[] = [];
  lines.push(`LEARNLY NOTES — ${title}`);
  lines.push(unit);
  lines.push("");
  lines.push(n.summary);
  lines.push("");
  lines.push("KEY IDEAS");
  n.points.forEach((p) => lines.push(`  - ${p}`));
  if (n.syntax?.length) {
    lines.push("");
    lines.push("HOW TO WRITE IT");
    n.syntax.forEach((s) => lines.push(`  ${s.pattern}\n    → ${s.means}`));
  }
  if (n.example) {
    lines.push("");
    lines.push("EXAMPLE");
    lines.push(`  ${n.example.sql}`);
    lines.push(`  → ${n.example.does}`);
  }
  lines.push("");
  lines.push(`REMEMBER: ${n.remember}`);
  return lines.join("\n");
}

export default function NotesPage({ params }: { params: { id: string } }) {
  const lesson = getLesson(params.id);
  const notes = lesson ? getNotes(params.id) : undefined;
  if (!lesson || !notes) notFound();

  const unit = getUnit(lesson.unitId);
  const unitLabel = unit ? `Unit ${unit.index} · ${unit.title}` : "Learnly";
  const text = buildText(lesson.title, unitLabel, notes);

  return (
    <div className="wrap" style={{ maxWidth: 720, paddingTop: 28, paddingBottom: 60 }}>
      {/* top actions (hidden when printing) */}
      <div className="no-print spread" style={{ marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <Link className="btn btn-ghost" href={`/lesson/${lesson.id}`} style={{ padding: "8px 14px" }}>
          ← Back to lesson
        </Link>
        <NotesActions text={text} filename={`learnly-${lesson.id}-notes.txt`} />
      </div>

      {/* the sheet */}
      <article className="notes-sheet">
        <header className="notes-head">
          <div className="brand" style={{ color: "var(--ink)", fontSize: 18 }}>
            <span className="logo" style={{ width: 26, height: 26, fontSize: 15 }}>
              L
            </span>
            <span className="wordmark">Learnly</span>
            <span className="mono small muted" style={{ marginLeft: 8 }}>
              revision notes
            </span>
          </div>
          <h1 style={{ fontSize: 32, marginTop: 18 }}>{lesson.title}</h1>
          <div className="mono small muted" style={{ marginTop: 6 }}>
            {unitLabel}
          </div>
        </header>

        <p className="notes-summary">{notes.summary}</p>

        <section className="notes-block">
          <h2>Key ideas</h2>
          <ul className="notes-list">
            {notes.points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>

        {notes.syntax && notes.syntax.length > 0 && (
          <section className="notes-block">
            <h2>How to write it</h2>
            <div className="notes-syntax">
              {notes.syntax.map((s, i) => (
                <div className="notes-syntax-row" key={i}>
                  <code>{s.pattern}</code>
                  <span>→ {s.means}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {notes.example && (
          <section className="notes-block">
            <h2>Example</h2>
            <div className="notes-example">
              <code>{notes.example.sql}</code>
              <div className="small muted" style={{ marginTop: 6 }}>
                → {notes.example.does}
              </div>
            </div>
          </section>
        )}

        <div className="notes-remember">
          <strong>Remember:</strong> {notes.remember}
        </div>

        <footer className="notes-foot mono small">learnly · learn ai &amp; data by playing</footer>
      </article>
    </div>
  );
}
