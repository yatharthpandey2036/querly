"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RACE_QUESTIONS, type RaceQ } from "@/content/race";

const DURATION = 60;
const GHOST_TARGET = 12;

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

type Row = { name: string; score: number };

export default function QueryRace({ initialBoard }: { initialBoard: Row[] }) {
  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");
  const [qs, setQs] = useState<RaceQ[]>([]);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(DURATION);
  const [pick, setPick] = useState<number | null>(null);
  const [board, setBoard] = useState<Row[]>(initialBoard);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const ghost = Math.min(GHOST_TARGET, Math.round(((DURATION - time) / DURATION) * GHOST_TARGET));

  function start() {
    setQs(shuffle(RACE_QUESTIONS));
    setQi(0);
    setScore(0);
    setTime(DURATION);
    setPick(null);
    setPhase("playing");
  }

  useEffect(() => {
    if (phase !== "playing") return;
    timer.current = setInterval(() => setTime((t) => t - 1), 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && time <= 0) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, phase]);

  async function finish() {
    if (timer.current) clearInterval(timer.current);
    setPhase("done");
    try {
      const res = await fetch("/api/race/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score }),
      });
      const d = await res.json();
      if (d.board) setBoard(d.board);
    } catch {
      /* ignore */
    }
  }

  function answer(i: number) {
    if (pick !== null) return;
    setPick(i);
    if (i === qs[qi].answer) setScore((s) => s + 1);
    setTimeout(() => {
      setPick(null);
      setQi((x) => (x + 1) % qs.length);
    }, 220);
  }

  const Leaderboard = () => (
    <div className="card pad mt24" style={{ maxWidth: 460, margin: "24px auto 0", textAlign: "left" }}>
      <span className="eyebrow">🏁 Race leaderboard</span>
      {board.length === 0 ? (
        <p className="muted small mt8">Be the first to set a time!</p>
      ) : (
        <div style={{ marginTop: 12 }}>
          {board.map((r, i) => (
            <div key={i} className="spread" style={{ padding: "7px 0", borderTop: i ? "1px solid var(--line)" : "none" }}>
              <span style={{ fontWeight: 600 }}>
                <span className="mono" style={{ color: "var(--ink-3)", marginRight: 8 }}>
                  {i + 1}
                </span>
                {r.name}
              </span>
              <span className="stat xp">⭐ {r.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (phase === "ready") {
    return (
      <div className="center">
        <div style={{ fontSize: 54 }}>🏁</div>
        <h2 style={{ fontSize: 30, marginTop: 8 }}>Query Race</h2>
        <p className="muted mt8" style={{ maxWidth: "42ch", margin: "8px auto 0" }}>
          Answer as many quick questions as you can in <b>60 seconds</b>. Beat Bit&apos;s ghost (score {GHOST_TARGET}) to
          win!
        </p>
        <button className="btn btn-primary mt24" onClick={start}>
          Start race →
        </button>
        <Leaderboard />
      </div>
    );
  }

  if (phase === "playing") {
    const q = qs[qi];
    return (
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div className="spread" style={{ marginBottom: 14 }}>
          <span className="stat xp" style={{ fontSize: 18 }}>
            ⭐ You {score}
          </span>
          <span className="mono" style={{ fontSize: 22, fontWeight: 800, color: time <= 10 ? "var(--coral)" : "var(--ink)" }}>
            ⏱ {time}s
          </span>
          <span className="mono muted">👻 Ghost {ghost}</span>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
          <div className="progressbar" style={{ flex: 1 }}>
            <i style={{ width: `${(score / GHOST_TARGET) * 100}%` }} />
          </div>
          <div className="progressbar" style={{ flex: 1 }}>
            <i style={{ width: `${(ghost / GHOST_TARGET) * 100}%`, background: "var(--ink-3)" }} />
          </div>
        </div>

        <h3 className="prompt-q" style={{ minHeight: 60 }}>
          {q.q}
        </h3>
        <div className="mt16">
          {q.options.map((opt, i) => {
            let cls = "choice";
            if (pick !== null) {
              if (i === q.answer) cls += " correct";
              else if (i === pick) cls += " wrong";
            }
            return (
              <button key={i} type="button" className={cls} onClick={() => answer(i)}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // done
  const won = score >= GHOST_TARGET;
  return (
    <div className="center">
      <div style={{ fontSize: 54 }}>{won ? "🏆" : "🏁"}</div>
      <h2 style={{ fontSize: 30, marginTop: 8 }}>{won ? "You beat the ghost!" : "Time's up!"}</h2>
      <p className="muted mt8">
        You scored <b>{score}</b> · Ghost scored <b>{GHOST_TARGET}</b>
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 22 }}>
        <button className="btn btn-primary" onClick={start}>
          Race again →
        </button>
        <Link className="btn btn-ghost" href="/social">
          Leagues &amp; friends
        </Link>
      </div>
      <Leaderboard />
    </div>
  );
}
