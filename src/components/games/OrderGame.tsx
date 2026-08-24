"use client";

import { useState } from "react";

// Sort game: reorder the cards into the correct order (highest first, etc).
export default function OrderGame({
  items,
  onSolved,
}: {
  items: string[]; // stored in the CORRECT order
  onSolved: () => void;
}) {
  // Start scrambled (reversed) so it's never already solved.
  const [order, setOrder] = useState<string[]>(() => [...items].reverse());
  const [wrong, setWrong] = useState(false);
  const [solved, setSolved] = useState(false);

  function move(i: number, dir: -1 | 1) {
    if (solved) return;
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
    setWrong(false);
  }

  function check() {
    const ok = order.every((v, i) => v === items[i]);
    if (ok) {
      setSolved(true);
      onSolved();
    } else {
      setWrong(true);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {order.map((label, i) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 14px",
              background: solved ? "var(--lime)" : "var(--surface)",
              border: `1px solid ${solved ? "var(--lime)" : "var(--line-2)"}`,
              fontFamily: "var(--mono)",
              fontWeight: 600,
            }}
          >
            <span style={{ color: "var(--ink-3)", width: 20 }}>{i + 1}</span>
            <span style={{ flex: 1 }}>{label}</span>
            {!solved && (
              <span style={{ display: "flex", gap: 4 }}>
                <button className="btn btn-ghost" style={{ padding: "4px 10px" }} onClick={() => move(i, -1)} type="button" aria-label="Move up">
                  ↑
                </button>
                <button className="btn btn-ghost" style={{ padding: "4px 10px" }} onClick={() => move(i, 1)} type="button" aria-label="Move down">
                  ↓
                </button>
              </span>
            )}
          </div>
        ))}
      </div>
      {!solved && (
        <button className="btn btn-primary mt16" onClick={check} type="button">
          Check order
        </button>
      )}
      {wrong && !solved && <div className="feedback no mt16">Close! Keep moving cards until they're in order.</div>}
    </div>
  );
}
