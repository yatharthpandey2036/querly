"use client";

import { useState } from "react";

// Match game: tap a term on the left, then its meaning on the right.
export default function MatchGame({
  pairs,
  onSolved,
}: {
  pairs: { left: string; right: string }[];
  onSolved: () => void;
}) {
  const lefts = pairs.map((p) => p.left);
  // Shuffle the right-hand meanings once.
  const [rights] = useState<string[]>(() => {
    const arr = pairs.map((p) => p.right);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  const [activeLeft, setActiveLeft] = useState<number | null>(null);
  const [matchedLeft, setMatchedLeft] = useState<Set<number>>(new Set());
  const [matchedRight, setMatchedRight] = useState<Set<number>>(new Set());
  const [wrongRight, setWrongRight] = useState<number | null>(null);

  function tapRight(ri: number) {
    if (activeLeft === null || matchedRight.has(ri)) return;
    const wanted = pairs[activeLeft].right;
    if (rights[ri] === wanted) {
      const ml = new Set(matchedLeft).add(activeLeft);
      const mr = new Set(matchedRight).add(ri);
      setMatchedLeft(ml);
      setMatchedRight(mr);
      setActiveLeft(null);
      if (ml.size === pairs.length) onSolved();
    } else {
      setWrongRight(ri);
      setTimeout(() => setWrongRight(null), 400);
    }
  }

  const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 8, flex: 1 };
  const cell = (active: boolean, matched: boolean, wrong: boolean): React.CSSProperties => ({
    padding: "13px 15px",
    fontFamily: "var(--mono)",
    fontWeight: 600,
    fontSize: 14,
    textAlign: "left",
    cursor: matched ? "default" : "pointer",
    background: matched ? "var(--lime)" : active ? "var(--dark)" : wrong ? "var(--coral-soft)" : "var(--surface)",
    color: active ? "var(--lime)" : "var(--ink)",
    border: `1px solid ${matched ? "var(--lime)" : active ? "var(--dark)" : wrong ? "var(--coral)" : "var(--line-2)"}`,
    opacity: matched ? 0.85 : 1,
  });

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={col}>
        {lefts.map((l, i) => (
          <button
            key={l}
            type="button"
            disabled={matchedLeft.has(i)}
            onClick={() => !matchedLeft.has(i) && setActiveLeft(i)}
            style={cell(activeLeft === i, matchedLeft.has(i), false)}
          >
            {l}
          </button>
        ))}
      </div>
      <div style={col}>
        {rights.map((r, i) => (
          <button
            key={r}
            type="button"
            disabled={matchedRight.has(i)}
            onClick={() => tapRight(i)}
            style={cell(false, matchedRight.has(i), wrongRight === i)}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
