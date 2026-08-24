"use client";

import { useState } from "react";

// Filter game: tap every row that matches the condition, then "Catch!".
export default function TapGame({
  rows,
  onSolved,
}: {
  rows: { label: string; match: boolean }[];
  onSolved: () => void;
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);

  function toggle(i: number) {
    if (solved) return;
    const next = new Set(selected);
    next.has(i) ? next.delete(i) : next.add(i);
    setSelected(next);
    setChecked(false);
  }

  function check() {
    const ok = rows.every((r, i) => r.match === selected.has(i));
    setChecked(true);
    if (ok) {
      setSolved(true);
      onSolved();
    }
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {rows.map((r, i) => {
          const sel = selected.has(i);
          let bg = "var(--surface)";
          let border = "var(--line-2)";
          let mark = "";
          if (checked) {
            if (r.match && sel) {
              bg = "var(--lime)";
              border = "var(--lime)";
              mark = "✓";
            } else if (r.match && !sel) {
              border = "var(--coral)";
              mark = "missed";
            } else if (!r.match && sel) {
              bg = "var(--coral-soft)";
              border = "var(--coral)";
              mark = "✗";
            }
          } else if (sel) {
            bg = "var(--lime-soft)";
            border = "var(--ink)";
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              disabled={solved}
              style={{
                textAlign: "left",
                padding: "13px 15px",
                background: bg,
                border: `1px solid ${border}`,
                color: "var(--ink)",
                fontWeight: 600,
                fontSize: 14.5,
                fontFamily: "var(--mono)",
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                cursor: solved ? "default" : "pointer",
              }}
            >
              <span>{r.label}</span>
              <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{mark}</span>
            </button>
          );
        })}
      </div>
      {!solved && (
        <button className="btn btn-primary mt16" onClick={check} type="button">
          Catch! ({selected.size} selected)
        </button>
      )}
      {checked && !solved && (
        <div className="feedback no mt16">Not quite — check the marks and try again.</div>
      )}
    </div>
  );
}
