import Link from "next/link";

export default function NotFound() {
  return (
    <div className="hero-split" style={{ minHeight: "100vh" }}>
      <div className="hero-left">
        <span className="eyebrow" style={{ color: "var(--on-lime)" }}>
          404
        </span>
        <h1 style={{ marginTop: 16, fontSize: "clamp(40px,7vw,80px)" }}>Lost the thread.</h1>
        <p style={{ fontSize: 18, marginTop: 16, fontWeight: 500, maxWidth: "28ch" }}>
          This page doesn't exist — but your streak is still safe.
        </p>
        <div style={{ marginTop: 28 }}>
          <Link className="btn btn-dark" href="/">
            Back home →
          </Link>
        </div>
      </div>
      <div className="hero-right">
        <div className="codepanel">
          <span className="c-kw">SELECT</span> page <span className="c-kw">FROM</span> site
          <br />
          <span className="c-kw">WHERE</span> url = <span className="c-str">'?'</span>;
          <br />
          <span className="c-dim">-- 0 rows returned</span>
        </div>
      </div>
    </div>
  );
}
