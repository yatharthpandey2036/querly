// Ambient animated characters for learning screens — AI + Database buddies
// who think, get curious, and play. Pure CSS animation, no JS.
export default function Mascots({ track = "sql" }: { track?: string }) {
  const chars =
    track === "ai"
      ? [
          { e: "🤖", b: "✨", cls: "curious" },
          { e: "🧠", b: "💭", cls: "thinking" },
          { e: "🦫", b: "🎮", cls: "playing" },
        ]
      : [
          { e: "🗄️", b: "💭", cls: "thinking" },
          { e: "🛢️", b: "❓", cls: "curious" },
          { e: "🦫", b: "🎮", cls: "playing" },
        ];
  return (
    <div className="mascot-strip" aria-hidden="true">
      {chars.map((c, i) => (
        <div key={i} className={`mascot ${c.cls}`} style={{ animationDelay: `${i * 0.2}s` }}>
          <span className="m-body">{c.e}</span>
          <span className="m-bubble">{c.b}</span>
        </div>
      ))}
      <span className="mascot-cap mono">Bit &amp; friends are cheering you on</span>
    </div>
  );
}
