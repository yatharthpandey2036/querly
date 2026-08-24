"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CapstoneProject } from "@/content/projects";
import { gradeQuery, type QueryResult } from "@/lib/sqlEngine";

export default function ProjectBuilder({
  project,
  userName,
}: {
  project: CapstoneProject;
  userName: string;
}) {
  const missions = project.missions;
  const totalXp = useMemo(() => missions.reduce((n, m) => n + m.xp, 0), [missions]);

  const [idx, setIdx] = useState(0);
  const mission = missions[idx];

  const [sql, setSql] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [hint, setHint] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [shipped, setShipped] = useState<null | { streakCount: number; alreadyDone: boolean }>(null);
  const [saving, setSaving] = useState(false);

  function reset() {
    setSql("");
    setResult(null);
    setStatus("idle");
    setHint(null);
  }

  async function run() {
    setChecking(true);
    setHint(null);
    try {
      const g = await gradeQuery(project.datasetSql, sql, mission.solutionSql);
      setResult(g.result);
      if (g.correct) {
        setStatus("correct");
        setToast(`+${mission.xp} XP`);
        setTimeout(() => setToast(null), 1600);
      } else {
        setStatus("wrong");
        setWrongCount((n) => n + 1);
        setHint(mission.hint);
      }
    } finally {
      setChecking(false);
    }
  }

  async function askBit() {
    setHintLoading(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskPrompt: mission.brief,
          fallbackHint: mission.hint,
          userQuery: sql,
          errorMsg: result?.error,
        }),
      });
      const d = await res.json();
      setHint(d.hint || mission.hint);
    } catch {
      setHint(mission.hint);
    } finally {
      setHintLoading(false);
    }
  }

  async function next() {
    if (idx < missions.length - 1) {
      setIdx(idx + 1);
      reset();
    } else {
      setSaving(true);
      try {
        const res = await fetch("/api/project/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: project.id }),
        });
        const data = await res.json();
        setShipped({ streakCount: data.streakCount ?? 0, alreadyDone: data.alreadyDone ?? false });
      } catch {
        setShipped({ streakCount: 0, alreadyDone: false });
      } finally {
        setSaving(false);
      }
    }
  }

  // ---- shipped screen ----
  if (shipped) {
    return (
      <div className="lesson-shell center" style={{ paddingTop: 56 }}>
        <div style={{ fontSize: 56 }}>🚀</div>
        <h2 style={{ fontSize: 30, marginTop: 8 }}>Project shipped!</h2>
        <p className="muted mt8" style={{ maxWidth: "40ch", margin: "8px auto 0" }}>
          {project.ship}
        </p>
        <div className="card pad mt24" style={{ display: "inline-block", minWidth: 260 }}>
          <div className="spread">
            <span className="stat xp">⭐ +{shipped.alreadyDone ? 0 : totalXp} XP</span>
            <span className="stat streak">🔥 {shipped.streakCount} day streak</span>
          </div>
        </div>
        <div className="mt24" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="btn btn-primary" href="/learn">
            Back to path →
          </Link>
        </div>
        {toast && <div className="toast">⭐ {toast}</div>}
      </div>
    );
  }

  const progress = (idx / missions.length) * 100;

  return (
    <div className="project-shell">
      <div className="lesson-top">
        <Link href="/learn" style={{ fontSize: 20, color: "var(--ink-2)" }} aria-label="Close">
          ✕
        </Link>
        <div className="progressbar">
          <i style={{ width: `${progress}%` }} />
        </div>
        <span className="mono small muted">
          feature {idx + 1}/{missions.length}
        </span>
      </div>

      <div className="proj-head">
        <span className="tag t-brand">Capstone project</span>
        <h2 style={{ fontSize: 26, marginTop: 10 }}>{project.title}</h2>
        <p className="muted small mt8">{project.tagline}</p>
      </div>

      <div className="proj-grid">
        {/* build panel */}
        <div>
          {idx === 0 && <div className="concept">🎬 {project.scenario}</div>}

          <div className="mono small muted" style={{ marginBottom: 4 }}>
            Feature to build
          </div>
          <h3 className="prompt-q">{mission.title}</h3>
          <p className="muted" style={{ marginBottom: 12 }}>
            {mission.brief}
          </p>

          <textarea
            className="sql"
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && status !== "correct") {
                e.preventDefault();
                run();
              }
            }}
            spellCheck={false}
            placeholder="Write the query for this feature…  (⌘/Ctrl + Enter to run)"
          />

          {hint && (
            <div className="aichip">
              <span className="mascot">🦫</span>
              <span>
                <b>Bit:</b> {hint}
              </span>
            </div>
          )}
          {status === "correct" && <div className="feedback ok">✅ Feature built! Nice work.</div>}

          <div className="mt16" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {status === "correct" ? (
              <button className="btn btn-primary" onClick={next} disabled={saving}>
                {saving ? "Shipping…" : idx < missions.length - 1 ? "Next feature →" : "Ship it 🚀"}
              </button>
            ) : (
              <>
                <button className="btn btn-primary" onClick={run} disabled={checking}>
                  {checking ? "Building…" : "Build feature"}
                </button>
                <button className="btn btn-ai" onClick={askBit} disabled={hintLoading}>
                  {hintLoading ? "Bit is thinking…" : "🦫 Build with Bit"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* app preview + mission list */}
        <div>
          <div className="app-screen">
            <div className="app-bar">
              <span className="mono" style={{ fontSize: 11, letterSpacing: "0.1em" }}>
                {project.title.toUpperCase()}
              </span>
              <span style={{ fontSize: 11, color: "var(--lime)" }}>● live</span>
            </div>
            <div className="app-body">
              {result && !result.error && result.columns.length > 0 ? (
                <ProjTable result={result} />
              ) : result?.error ? (
                <div className="feedback no mono small">⚠️ {result.error}</div>
              ) : (
                <div className="muted small center" style={{ padding: "24px 0" }}>
                  Run a query to power this screen ↑
                </div>
              )}
            </div>
          </div>

          <div className="mission-list mt16">
            {missions.map((m, i) => (
              <div key={m.id} className={`mission-item ${i === idx ? "on" : ""} ${i < idx || (i === idx && status === "correct") ? "done" : ""}`}>
                <span className="mi-box">{i < idx || (i === idx && status === "correct") ? "✓" : i + 1}</span>
                <span>{m.title}</span>
              </div>
            ))}
          </div>

          <div className="banner mt16">💡 {project.aiIdea}</div>
        </div>
      </div>

      {toast && <div className="toast">⭐ {toast}</div>}
    </div>
  );
}

function ProjTable({ result }: { result: QueryResult }) {
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
