import Link from "next/link";
import { getSession } from "@/lib/session";
import { homePathForRole } from "@/lib/rbac";
import { CURRICULUM } from "@/content/curriculum";

export default async function Landing() {
  const session = await getSession();
  const primaryHref = session ? homePathForRole(session.role) : "/login";
  const primaryLabel = session ? "Continue learning →" : "Start free →";

  return (
    <>
      <nav className="topbar">
        <div className="wrap row">
          <div className="brand">
            <span className="logo">🦫</span> Querly
          </div>
          <div className="stats-row">
            <Link className="btn btn-ghost" href={primaryHref}>
              {session ? "Dashboard" : "Log in"}
            </Link>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap">
          <span className="eyebrow">SQL · Databases · AI · for class 9–12</span>
          <h1 style={{ marginTop: 16 }}>
            Get <em>fluent in data</em>
            <br /> before the world asks you to.
          </h1>
          <p className="lede">
            Querly turns databases into a daily 4-minute game — real queries, instant answers, and
            streaks that stick. Learn by playing, not by memorising.
          </p>
          <div className="pill-row">
            <span className="pill">🎮 Games &amp; puzzles</span>
            <span className="pill">⚡ Real SQL, instant feedback</span>
            <span className="pill">🦫 Bit, your AI tutor</span>
            <span className="pill">🔥 Streaks &amp; XP</span>
          </div>
          <div className="mt24" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="btn btn-primary" href={primaryHref}>
              {primaryLabel}
            </Link>
            <Link className="btn btn-ghost" href="/login?role=parent">
              I'm a parent
            </Link>
          </div>
        </div>
      </header>

      <section className="wrap" style={{ paddingBottom: 40 }}>
        <div className="grid-3">
          <div className="card pad">
            <span className="tag t-brand">Play to learn</span>
            <h3 style={{ marginTop: 12, fontSize: 18 }}>Every query is a puzzle</h3>
            <p className="muted small mt8">
              Build queries from blocks, fix broken ones, predict the output, and crack data
              mysteries — all running on a real database in your browser.
            </p>
          </div>
          <div className="card pad">
            <span className="tag t-ai">Learn with AI</span>
            <h3 style={{ marginTop: 12, fontSize: 18 }}>Bit never gives up on you</h3>
            <p className="muted small mt8">
              Stuck? Bit the beaver explains <i>why</i> in plain language and nudges you toward the
              answer — hints, never spoilers.
            </p>
          </div>
          <div className="card pad">
            <span className="tag t-gold">Keep the streak</span>
            <h3 style={{ marginTop: 12, fontSize: 18 }}>4 minutes a day</h3>
            <p className="muted small mt8">
              Earn XP, collect gems, and protect your streak. Basic to medium — always fun, never
              a lecture.
            </p>
          </div>
        </div>

        <div className="mt24 center">
          <span className="eyebrow">Start here</span>
          <div className="mt8 muted small">
            {CURRICULUM.length} units · {CURRICULUM.reduce((n, u) => n + u.lessons.length, 0)}{" "}
            lessons · from “what is a row?” to real filtering
          </div>
        </div>
      </section>

      <footer className="wrap small muted" style={{ padding: "28px 20px 50px", borderTop: "1px solid var(--line)" }}>
        <div className="spread" style={{ flexWrap: "wrap" }}>
          <div className="brand" style={{ fontSize: 15 }}>
            <span className="logo" style={{ width: 24, height: 24, fontSize: 14 }}>🦫</span> Querly
          </div>
          <span className="mono">a shippable learning MVP · v0.1</span>
        </div>
      </footer>
    </>
  );
}
