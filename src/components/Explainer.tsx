"use client";

import { useEffect, useState } from "react";
import type { Explainer as ExplainerData } from "@/content/curriculum";

const SCENE_MS = 8000;

export default function Explainer({
  data,
  title,
  onDone,
}: {
  data: ExplainerData;
  title: string;
  onDone: () => void;
}) {
  const scenes = data.scenes;
  const [i, setI] = useState(0);
  const [p, setP] = useState(0); // 0..1 progress of current scene
  const [playing, setPlaying] = useState(true);
  const last = i === scenes.length - 1;
  const scene = scenes[i];

  // advance progress while playing
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setP((prev) => (prev >= 1 ? 1 : prev + 80 / SCENE_MS)), 80);
    return () => clearInterval(id);
  }, [playing]);

  // when a scene finishes, move on (or stop on the last)
  useEffect(() => {
    if (p < 1) return;
    if (i < scenes.length - 1) {
      setI(i + 1);
      setP(0);
    } else {
      setPlaying(false);
    }
  }, [p, i, scenes.length]);

  const go = (n: number) => {
    setI(Math.max(0, Math.min(scenes.length - 1, n)));
    setP(0);
    setPlaying(true);
  };

  const overall = ((i + Math.min(p, 1)) / scenes.length) * 100;

  return (
    <div className="explainer">
      <div className="exp-frame">
        <div className="exp-tag">▶ Intro · {title}</div>
        <AnimStage anim={scene.anim} sceneKey={i} />
        <div className="exp-bit">
          <span className="bit">🦫</span>
          <div className="exp-caption" key={i}>
            {scene.text}
          </div>
        </div>
        <div className="exp-progress">
          <i style={{ width: `${overall}%` }} />
        </div>
      </div>

      <div className="exp-controls">
        <div className="exp-dots">
          {scenes.map((_, d) => (
            <span key={d} className={d === i ? "on" : ""} onClick={() => go(d)} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" style={{ padding: "8px 12px" }} onClick={() => go(i - 1)} disabled={i === 0}>
            ← Prev
          </button>
          <button className="btn btn-ghost" style={{ padding: "8px 14px" }} onClick={() => setPlaying((v) => !v)}>
            {playing ? "❚❚" : "▶"}
          </button>
          {last ? (
            <button className="btn btn-primary" style={{ padding: "8px 18px" }} onClick={onDone}>
              Start lesson →
            </button>
          ) : (
            <button className="btn btn-ghost" style={{ padding: "8px 12px" }} onClick={() => go(i + 1)}>
              Next →
            </button>
          )}
        </div>
        <button
          className="btn"
          style={{ padding: "8px 12px", background: "transparent", color: "var(--ink-2)", border: "1px solid var(--line-2)" }}
          onClick={onDone}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

// A small animated table that reacts to the scene's `anim` type.
function AnimStage({ anim, sceneKey }: { anim?: string; sceneKey: number }) {
  const rows = [
    { n: "Aarav", s: 92 },
    { n: "Diya", s: 68 },
    { n: "Meera", s: 95 },
    { n: "Rohan", s: 74 },
  ];
  return (
    <div className={`stage anim-${anim || "talk"}`} key={`${anim}-${sceneKey}`}>
      <div className="stage-head">
        <span className="scol" style={{ ["--d" as string]: "0s" } as React.CSSProperties}>
          name
        </span>
        <span className="scol" style={{ ["--d" as string]: "0.15s" } as React.CSSProperties}>
          score
        </span>
      </div>
      {rows.map((r, idx) => (
        <div
          key={idx}
          className={`srow ${anim === "filter" ? (r.s > 90 ? "keep" : "dim") : ""}`}
          style={{ ["--d" as string]: `${idx * 0.15}s` } as React.CSSProperties}
        >
          <span>{r.n}</span>
          <span>{r.s}</span>
        </div>
      ))}
    </div>
  );
}
