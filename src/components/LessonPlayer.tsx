"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Lesson } from "@/content/curriculum";
import { gradeQuery, previewTable, type QueryResult } from "@/lib/sqlEngine";
import Explainer from "@/components/Explainer";
import ThemeToggle from "@/components/ThemeToggle";
import Mascots from "@/components/Mascots";
import { track as trackEvent } from "@/lib/analytics";
import TapGame from "@/components/games/TapGame";
import OrderGame from "@/components/games/OrderGame";
import MatchGame from "@/components/games/MatchGame";

type Status = "idle" | "correct" | "wrong";

export default function LessonPlayer({
  lesson,
  nextId,
  userName,
  track = "sql",
}: {
  lesson: Lesson;
  nextId: string | null;
  userName: string;
  track?: string;
}) {
  const learnHref = `/learn?track=${track}`;
  const router = useRouter();
  const challenges = lesson.challenges;
  const totalXp = useMemo(() => challenges.reduce((n, c) => n + c.xp, 0), [challenges]);

  const [idx, setIdx] = useState(0);
  const challenge = challenges[idx];

  // per-challenge state
  const [placed, setPlaced] = useState<string[]>([]);
  const [sql, setSql] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [hint, setHint] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  // lesson-wide
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [wrongCount, setWrongCount] = useState(0);
  const [showData, setShowData] = useState(false);
  const [preview, setPreview] = useState<QueryResult | null>(null);
  const [finished, setFinished] = useState<null | { streakCount: number; alreadyDone: boolean }>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [phase, setPhase] = useState<"intro" | "play">(lesson.explainer ? "intro" : "play");

  const isGame = challenge?.type === "tap" || challenge?.type === "order" || challenge?.type === "match";

  // Games call this when the learner solves them interactively.
  function handleSolved() {
    trackEvent("Challenge Answered", { lessonId: lesson.id, challengeId: challenge.id, type: challenge.type, correct: true });
    setStatus("correct");
    if (!solved.has(challenge.id)) {
      setSolved(new Set(solved).add(challenge.id));
      setToast(`+${challenge.xp} XP`);
      setTimeout(() => setToast(null), 1600);
    }
  }

  // analytics: lesson opened
  useEffect(() => {
    trackEvent("Lesson Started", { lessonId: lesson.id, track });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reset when moving to a new challenge
  useEffect(() => {
    setPlaced([]);
    setSql(challenge?.starterSql ?? "");
    setSelected(null);
    setResult(null);
    setStatus("idle");
    setHint(null);
  }, [idx, challenge]);

  // load a preview of the first dataset table (SQL lessons only)
  useEffect(() => {
    if (!lesson.datasetSql || !lesson.tables?.length) return;
    let active = true;
    previewTable(lesson.datasetSql, lesson.tables[0]).then((r) => {
      if (active) setPreview(r);
    });
    return () => {
      active = false;
    };
  }, [lesson]);

  const progress = (idx / challenges.length) * 100;

  async function onCheck() {
    if (!challenge) return;
    setChecking(true);
    setHint(null);
    let correct = false;
    try {
      if (challenge.type === "choice" || challenge.type === "predict") {
        if (selected === null) {
          setChecking(false);
          return;
        }
        correct = !!challenge.options?.[selected]?.correct;
      } else {
        const query = challenge.type === "build" ? placed.join(" ") : sql;
        const g = await gradeQuery(lesson.datasetSql ?? "", query, challenge.solutionSql ?? "");
        setResult(g.result.error ? g.result : g.result);
        correct = g.correct;
      }
    } finally {
      setChecking(false);
    }

    trackEvent("Challenge Answered", { lessonId: lesson.id, challengeId: challenge.id, type: challenge.type, correct });
    if (correct) {
      setStatus("correct");
      if (!solved.has(challenge.id)) {
        setSolved(new Set(solved).add(challenge.id));
        setToast(`+${challenge.xp} XP`);
        setTimeout(() => setToast(null), 1600);
      }
    } else {
      setStatus("wrong");
      setWrongCount((n) => n + 1);
      setHint(challenge.hint); // instant curated hint; AI is optional
    }
  }

  async function askBit() {
    if (!challenge) return;
    setHintLoading(true);
    try {
      const query = challenge.type === "build" ? placed.join(" ") : sql;
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          challengeId: challenge.id,
          userQuery: query,
          errorMsg: result?.error,
        }),
      });
      const d = await res.json();
      setHint(d.hint || challenge.hint);
    } catch {
      setHint(challenge.hint);
    } finally {
      setHintLoading(false);
    }
  }

  async function onContinue() {
    if (idx < challenges.length - 1) {
      setIdx(idx + 1);
    } else {
      // finish the lesson
      setSaving(true);
      const stars = wrongCount === 0 ? 3 : wrongCount <= 2 ? 2 : 1;
      try {
        const res = await fetch("/api/progress/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId: lesson.id, stars }),
        });
        const data = await res.json();
        trackEvent("Lesson Completed", { lessonId: lesson.id, track, stars });
        setFinished({ streakCount: data.streakCount ?? 0, alreadyDone: data.alreadyDone ?? false });
      } catch {
        setFinished({ streakCount: 0, alreadyDone: false });
      } finally {
        setSaving(false);
      }
    }
  }

  // ---- completion screen ----
  if (finished) {
    return (
      <div className="lesson-shell finish">
        <div style={{ fontSize: 56 }}>🎉</div>
        <h2 style={{ fontSize: 28, marginTop: 8 }}>Lesson complete!</h2>
        <p className="muted mt8">Nice work, {userName}. Here's what you earned:</p>
        <div className="card pad mt24" style={{ display: "inline-block", minWidth: 260 }}>
          <div className="spread">
            <span className="stat xp">⭐ +{finished.alreadyDone ? 0 : totalXp} XP</span>
            <span className="stat streak">🔥 {finished.streakCount} day streak</span>
          </div>
        </div>
        <div className="mt24" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {nextId ? (
            <Link className="btn btn-primary" href={`/lesson/${nextId}`} onClick={() => router.refresh()}>
              Next lesson →
            </Link>
          ) : (
            <Link className="btn btn-primary" href={learnHref}>
              Back to path
            </Link>
          )}
          <Link className="btn btn-ghost" href={`/lesson/${lesson.id}/notes`}>
            📄 Notes
          </Link>
          <Link className="btn btn-ghost" href={learnHref}>
            My path
          </Link>
        </div>
      </div>
    );
  }

  // Animated character intro before the challenges.
  if (phase === "intro" && lesson.explainer) {
    return (
      <div className="lesson-shell" style={{ minHeight: "calc(100vh - 8px)", display: "flex", flexDirection: "column" }}>
        <div className="lesson-top">
          <Link href={learnHref} style={{ fontSize: 20, color: "var(--ink-2)" }} aria-label="Close">
            ✕
          </Link>
          <span className="mono small muted">{lesson.title}</span>
          <span style={{ marginLeft: "auto" }} />
          <ThemeToggle />
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <div style={{ width: "100%" }}>
            <Explainer data={lesson.explainer} title={lesson.title} onDone={() => setPhase("play")} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-shell">
      <div className="lesson-top">
        <Link href={learnHref} style={{ fontSize: 20, color: "var(--ink-2)" }} aria-label="Close">
          ✕
        </Link>
        <div className="progressbar">
          <i style={{ width: `${progress}%` }} />
        </div>
        {lesson.explainer && (
          <button
            className="btn"
            style={{ padding: "5px 10px", fontSize: 12, background: "transparent", color: "var(--ink-2)", border: "1px solid var(--line-2)" }}
            onClick={() => setPhase("intro")}
            title="Watch the intro again"
          >
            ↺ intro
          </button>
        )}
        <Link
          href={`/lesson/${lesson.id}/notes`}
          className="btn"
          style={{ padding: "5px 10px", fontSize: 12, background: "transparent", color: "var(--ink-2)", border: "1px solid var(--line-2)" }}
          title="Revision notes"
        >
          📄 notes
        </Link>
        <ThemeToggle />
        <span className="mono small muted">
          {idx + 1}/{challenges.length}
        </span>
      </div>

      <div className="lesson-grid">
        <div className="lesson-main">
      {idx === 0 && <div className="concept">💡 {lesson.concept}</div>}

      <div className="mono small muted" style={{ marginBottom: 4 }}>
        {challenge.type === "build" && "Build the query"}
        {challenge.type === "free" && "Write the query"}
        {challenge.type === "fixbug" && "Fix the bug"}
        {challenge.type === "predict" && "Predict the result"}
        {challenge.type === "choice" && "Quick quiz"}
      </div>
      {challenge.story && <div className="story">🕵️ {challenge.story}</div>}
      <h3 className="prompt-q">{challenge.prompt}</h3>

      {/* data preview toggle (SQL challenges only) */}
      {!isGame && lesson.tables?.length ? (
        <>
          <button
            className="btn btn-ghost small"
            style={{ padding: "6px 12px", marginBottom: 12 }}
            onClick={() => setShowData((s) => !s)}
            type="button"
          >
            {showData ? "Hide" : "Show"} the {lesson.tables[0]} table
          </button>
          {showData && preview && <ResultTable result={preview} />}
        </>
      ) : null}

      {/* ---- interactive games ---- */}
      {challenge.type === "tap" && challenge.rows && (
        <div style={{ marginTop: 12 }}>
          <TapGame key={challenge.id} rows={challenge.rows} onSolved={handleSolved} />
        </div>
      )}
      {challenge.type === "order" && challenge.items && (
        <div style={{ marginTop: 12 }}>
          <OrderGame key={challenge.id} items={challenge.items} onSolved={handleSolved} />
        </div>
      )}
      {challenge.type === "match" && challenge.pairs && (
        <div style={{ marginTop: 12 }}>
          <MatchGame key={challenge.id} pairs={challenge.pairs} onSolved={handleSolved} />
        </div>
      )}

      {/* ---- per-type input ---- */}
      {challenge.type === "build" && (
        <div style={{ marginTop: 12 }}>
          <div className="qb">
            {placed.length === 0 ? (
              <span className="muted">Tap tokens below to build your query…</span>
            ) : (
              placed.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  className="token placed"
                  onClick={() => setPlaced(placed.filter((_, j) => j !== i))}
                  title="Tap to remove"
                >
                  {t}
                </button>
              ))
            )}
          </div>
          <div>
            {challenge.tokens?.map((t, i) => (
              <button key={i} type="button" className="token" onClick={() => setPlaced([...placed, t])}>
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {(challenge.type === "free" || challenge.type === "fixbug") && (
        <textarea
          className="sql"
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && status !== "correct") {
              e.preventDefault();
              onCheck();
            }
          }}
          spellCheck={false}
          placeholder="Type your SQL here…  (⌘/Ctrl + Enter to run)"
        />
      )}

      {(challenge.type === "choice" || challenge.type === "predict") && (
        <div style={{ marginTop: 8 }}>
          {challenge.options?.map((opt, i) => {
            let cls = "choice";
            if (status !== "idle") {
              if (opt.correct) cls += " correct";
              else if (selected === i) cls += " wrong";
            } else if (selected === i) {
              cls += " sel";
            }
            return (
              <button
                key={i}
                type="button"
                className={cls}
                disabled={status === "correct"}
                onClick={() => setSelected(i)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}

      {/* result table for SQL challenges */}
      {result && (challenge.type === "free" || challenge.type === "fixbug" || challenge.type === "build") && (
        <div style={{ marginTop: 12 }}>
          {result.error ? (
            <div className="feedback no mono small">⚠️ {result.error}</div>
          ) : (
            <>
              <div className="mono small muted" style={{ marginBottom: 4 }}>
                your result:
              </div>
              <ResultTable result={result} />
            </>
          )}
        </div>
      )}

      {/* hint */}
      {hint && (
        <div className="aichip">
          <span className="mascot">🦫</span>
          <span>
            <b>Bit:</b> {hint}
          </span>
        </div>
      )}

      {/* feedback */}
      {status === "correct" && <div className="feedback ok">✅ {challenge.explain}</div>}

      {/* actions */}
      <div className="mt16" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {status === "correct" ? (
          <button className="btn btn-primary" onClick={onContinue} disabled={saving}>
            {saving ? "Saving…" : idx < challenges.length - 1 ? "Continue →" : "Finish lesson 🎉"}
          </button>
        ) : isGame ? null : (
          <>
            <button className="btn btn-primary" onClick={onCheck} disabled={checking}>
              {checking ? "Running…" : challenge.type === "free" || challenge.type === "fixbug" || challenge.type === "build" ? "Run query" : "Check"}
            </button>
            {status === "wrong" && (
              <button className="btn btn-ai" onClick={askBit} disabled={hintLoading}>
                {hintLoading ? "Bit is thinking…" : "🦫 Ask Bit"}
              </button>
            )}
          </>
        )}
      </div>

        </div>
        <aside className="lesson-side">
          <div className="card pad buddy-card">
            <span className="eyebrow">Your buddies</span>
            <Mascots track={track} />
          </div>
        </aside>
      </div>

      {toast && <div className="toast">⭐ {toast}</div>}
    </div>
  );
}

function ResultTable({ result }: { result: QueryResult }) {
  if (result.error) return <div className="feedback no mono small">⚠️ {result.error}</div>;
  if (result.columns.length === 0) return <div className="muted small">(no rows)</div>;
  return (
    <div className="datatable-wrap">
      <table className="datatable">
        <thead>
          <tr>
            {result.columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell === null ? "NULL" : String(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
