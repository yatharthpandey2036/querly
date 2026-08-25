"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { AiProject } from "@/content/ai-projects";
import OrderGame from "@/components/games/OrderGame";
import ThemeToggle from "@/components/ThemeToggle";
import Mascots from "@/components/Mascots";

export default function AiProjectBuilder({ project }: { project: AiProject }) {
  const steps = project.steps;
  const totalXp = useMemo(() => steps.reduce((n, s) => n + s.xp, 0), [steps]);

  const [idx, setIdx] = useState(0);
  const step = steps[idx];

  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [built, setBuilt] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [shipped, setShipped] = useState<null | { streakCount: number; alreadyDone: boolean }>(null);
  const [saving, setSaving] = useState(false);

  function solvedStep() {
    setStatus("correct");
    setBuilt((b) => (b.includes(step.preview) ? b : [...b, step.preview]));
    setToast(`+${step.xp} XP`);
    setTimeout(() => setToast(null), 1600);
  }

  function checkChoice() {
    if (selected === null) return;
    if (step.options?.[selected]?.correct) solvedStep();
    else setStatus("wrong");
  }

  async function next() {
    if (idx < steps.length - 1) {
      setIdx(idx + 1);
      setSelected(null);
      setStatus("idle");
    } else {
      setSaving(true);
      try {
        const res = await fetch("/api/ai-project/complete", {
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

  if (shipped) {
    return (
      <div className="lesson-shell center" style={{ paddingTop: 56 }}>
        <div style={{ fontSize: 56 }}>🚀</div>
        <h2 style={{ fontSize: 30, marginTop: 8 }}>App shipped!</h2>
        <p className="muted mt8" style={{ maxWidth: "40ch", margin: "8px auto 0" }}>
          {project.ship}
        </p>
        <div className="card pad mt24" style={{ display: "inline-block", minWidth: 260 }}>
          <div className="spread">
            <span className="stat xp">⭐ +{shipped.alreadyDone ? 0 : totalXp} XP</span>
            <span className="stat streak">🔥 {shipped.streakCount} day streak</span>
          </div>
        </div>
        <div className="mt24">
          <Link className="btn btn-primary" href="/learn?track=ai">
            Back to path →
          </Link>
        </div>
        {toast && <div className="toast">⭐ {toast}</div>}
      </div>
    );
  }

  const progress = (idx / steps.length) * 100;

  return (
    <div className="project-shell">
      <div className="lesson-top">
        <Link href="/learn?track=ai" style={{ fontSize: 20, color: "var(--ink-2)" }} aria-label="Close">
          ✕
        </Link>
        <div className="progressbar">
          <i style={{ width: `${progress}%` }} />
        </div>
        <ThemeToggle />
        <span className="mono small muted">
          feature {idx + 1}/{steps.length}
        </span>
      </div>

      <div className="proj-head">
        <span className="tag t-brand">AI capstone</span>
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
          <h3 className="prompt-q">{step.title}</h3>
          <p className="muted" style={{ marginBottom: 12 }}>
            {step.brief}
          </p>

          {step.kind === "choice" && (
            <div>
              {step.options?.map((opt, i) => {
                let cls = "choice";
                if (status !== "idle") {
                  if (opt.correct) cls += " correct";
                  else if (selected === i) cls += " wrong";
                } else if (selected === i) cls += " sel";
                return (
                  <button key={i} type="button" className={cls} disabled={status === "correct"} onClick={() => setSelected(i)}>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}

          {step.kind === "order" && step.items && <OrderGame key={step.id} items={step.items} onSolved={solvedStep} />}

          {status === "wrong" && (
            <div className="aichip">
              <span className="mascot">🦫</span>
              <span>
                <b>Bit:</b> {step.hint}
              </span>
            </div>
          )}
          {status === "correct" && <div className="feedback ok">✅ {step.explain}</div>}

          <div className="mt16" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {status === "correct" ? (
              <button className="btn btn-primary" onClick={next} disabled={saving}>
                {saving ? "Shipping…" : idx < steps.length - 1 ? "Next feature →" : "Ship it 🚀"}
              </button>
            ) : step.kind === "choice" ? (
              <button className="btn btn-primary" onClick={checkChoice}>
                Build feature
              </button>
            ) : null}
          </div>
        </div>

        {/* app preview */}
        <div>
          <div className="app-screen">
            <div className="app-bar">
              <span className="mono" style={{ fontSize: 11, letterSpacing: "0.1em" }}>
                {project.appName}
              </span>
              <span style={{ fontSize: 11, color: "var(--lime)" }}>● building</span>
            </div>
            <div className="app-body">
              {built.length === 0 ? (
                <div className="muted small center" style={{ padding: "24px 0" }}>
                  Build a feature to power this app ↑
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {built.map((b, i) => (
                    <div key={i} className="mono small" style={{ color: "var(--brand-2)" }}>
                      {b}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mission-list mt16">
            {steps.map((s, i) => (
              <div key={s.id} className={`mission-item ${i === idx ? "on" : ""} ${i < idx || (i === idx && status === "correct") ? "done" : ""}`}>
                <span className="mi-box">{i < idx || (i === idx && status === "correct") ? "✓" : i + 1}</span>
                <span>{s.title}</span>
              </div>
            ))}
          </div>

          <div className="banner mt16">💡 {project.aiIdea}</div>
        </div>
      </div>

      <Mascots track="ai" />

      {toast && <div className="toast">⭐ {toast}</div>}
    </div>
  );
}
