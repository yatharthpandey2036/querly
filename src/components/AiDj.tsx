"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DJ_SONGS, MOODS, djDatasetSql } from "@/content/aidj";
import { gradeQuery, type QueryResult } from "@/lib/sqlEngine";
import ThemeToggle from "@/components/ThemeToggle";
import Mascots from "@/components/Mascots";
import { track } from "@/lib/analytics";

const DATASET = djDatasetSql();
const MISSION_SOLUTION = "SELECT title, popularity FROM songs ORDER BY popularity DESC LIMIT 5;";
const XP_REWARD = 120;

type Stage = "pick" | "playlist" | "reveal" | "mission" | "done";

export default function AiDj() {
  const [stage, setStage] = useState<Stage>("pick");
  const [mood, setMood] = useState<string | null>(null);
  const [sql, setSql] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [earned, setEarned] = useState(0);

  const recs = useMemo(() => {
    if (!mood) return [];
    return DJ_SONGS.filter((s) => s.mood === mood)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }, [mood]);

  function createPlaylist() {
    if (!mood) return;
    track("Studio DJ Mood Picked", { mood });
    setStage("playlist");
  }

  async function runMission() {
    setChecking(true);
    try {
      const g = await gradeQuery(DATASET, sql, MISSION_SOLUTION);
      setResult(g.result);
      setStatus(g.correct ? "correct" : "wrong");
      if (g.correct) finish();
    } finally {
      setChecking(false);
    }
  }

  async function finish() {
    setSaving(true);
    try {
      const res = await fetch("/api/studio/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: "ai-dj" }),
      });
      const d = await res.json();
      setEarned(d.alreadyDone ? 0 : XP_REWARD);
      track("Studio Project Completed", { projectId: "ai-dj" });
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
      setStage("done");
    }
  }

  return (
    <div className="project-shell" style={{ maxWidth: 720 }}>
      <div className="lesson-top">
        <Link href="/studio" style={{ fontSize: 20, color: "var(--ink-2)" }} aria-label="Back">
          ✕
        </Link>
        <span className="mono small muted">AI DJ</span>
        <span style={{ marginLeft: "auto" }} />
        <ThemeToggle />
      </div>

      {/* ---- the DJ app screen ---- */}
      <div className="dj-frame">
        <div className="app-bar">
          <span className="mono" style={{ fontSize: 12, letterSpacing: "0.1em" }}>
            🎧 AI DJ
          </span>
          <span className="stat xp" style={{ color: "var(--lime)" }}>
            ⭐ +{XP_REWARD} XP
          </span>
        </div>

        <div className="dj-body">
          {stage === "pick" && (
            <>
              <h2 className="center" style={{ fontSize: 24 }}>
                🎧 Build your AI DJ
              </h2>
              <p className="center muted mt8">Tell me what kind of music you like:</p>
              <div className="dj-moods mt16">
                {MOODS.map((m) => (
                  <button key={m.key} className={`dj-mood ${mood === m.key ? "on" : ""}`} onClick={() => setMood(m.key)} type="button">
                    <span style={{ fontSize: 22 }}>{m.icon}</span> {m.key}
                  </button>
                ))}
              </div>
              <button className="btn btn-primary btn-block mt24" disabled={!mood} onClick={createPlaylist}>
                🎵 Create my playlist
              </button>
            </>
          )}

          {stage === "playlist" && (
            <>
              <h2 style={{ fontSize: 22 }}>🎧 Your AI playlist</h2>
              <div className="aichip" style={{ marginTop: 12 }}>
                <span className="mascot">🤖</span>
                <span>I found {recs.length} songs for you!</span>
              </div>
              <div className="mt16">
                {recs.map((s, i) => (
                  <div key={s.id} className="spread dj-song">
                    <span>
                      <span className="mono" style={{ color: "var(--ink-3)", marginRight: 10 }}>
                        {i + 1}
                      </span>
                      🎵 {s.title} <span className="muted small">· {s.artist}</span>
                    </span>
                    <span style={{ color: "var(--ai)" }}>▶</span>
                  </div>
                ))}
              </div>
              <div className="banner" style={{ marginTop: 16, borderLeftColor: "var(--ai)" }}>
                <b>Why these?</b> You like <b>{mood}</b> songs — and I picked the ones with the highest ratings. ⭐
              </div>
              <button className="btn btn-dark btn-block mt16" onClick={() => setStage("reveal")}>
                🔧 Upgrade my AI
              </button>
            </>
          )}

          {stage === "reveal" && (
            <>
              <h2 style={{ fontSize: 22 }}>🧠 The secret</h2>
              <p className="muted mt8">Your AI didn&apos;t use magic. It ran a database query — this one:</p>
              <pre className="dj-code mt16">
                <span className="kw">SELECT</span> * <span className="kw">FROM</span> songs
                {"\n"}
                <span className="kw">WHERE</span> mood = <span style={{ color: "#9fd0ff" }}>&apos;{mood}&apos;</span>;
              </pre>
              <p className="mt16" style={{ fontWeight: 600 }}>
                🎯 Now it&apos;s your turn. Make the DJ smarter: find the <b>5 most popular songs</b> (any mood), most popular first.
              </p>
              <button className="btn btn-primary btn-block mt16" onClick={() => setStage("mission")}>
                Let&apos;s do it →
              </button>
            </>
          )}

          {stage === "mission" && (
            <>
              <div className="mono small muted">🎯 Mission</div>
              <h3 className="prompt-q">Find the 5 most popular songs</h3>
              <p className="muted" style={{ marginBottom: 12 }}>
                Show each song&apos;s title and popularity, most popular first, top 5 only.
              </p>
              <textarea
                className="sql"
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    e.preventDefault();
                    runMission();
                  }
                }}
                spellCheck={false}
                placeholder="SELECT …  (⌘/Ctrl + Enter to run)"
              />
              {status === "wrong" && result && (
                <div className="aichip">
                  <span className="mascot">🦫</span>
                  <span>
                    <b>Bit:</b>{" "}
                    {result.error ? result.error : "Sort by popularity DESC, then LIMIT 5. Column is 'popularity'."}
                  </span>
                </div>
              )}
              <button className="btn btn-primary btn-block mt16" onClick={runMission} disabled={checking || saving}>
                {checking ? "Running…" : saving ? "Saving…" : "Run query"}
              </button>
            </>
          )}

          {stage === "done" && (
            <div className="center">
              <div style={{ fontSize: 52 }}>🎉</div>
              <h2 style={{ fontSize: 24, marginTop: 8 }}>You built your AI DJ!</h2>
              <p className="muted mt8">
                You saw how an AI recommendation is really a SQL query — mood + ratings + popularity. Powerful, right?
              </p>
              <div className="card pad mt24" style={{ display: "inline-block" }}>
                <span className="stat xp">⭐ +{earned} XP</span>
              </div>
              <div className="mt24" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <Link className="btn btn-primary" href="/studio">
                  Back to Maker Lab →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Mascots track="ai" />
    </div>
  );
}
