import Link from "next/link";
import { getSession } from "@/lib/session";
import { homePathForRole } from "@/lib/rbac";
import ThemeToggle from "@/components/ThemeToggle";

export default async function Landing() {
  const session = await getSession();
  const primaryHref = session ? homePathForRole(session.role) : "/login?mode=signup";

  return (
    <>
      {/* nav */}
      <nav className="topbar">
        <div className="wrap row">
          <div className="brand">
            <span className="logo">L</span>
            <span className="wordmark">Learnly</span>
          </div>
          <div className="stats-row">
            <ThemeToggle />
            <Link
              className="btn"
              href={session ? primaryHref : "/login"}
              style={{ padding: "10px 18px", background: "transparent", color: "var(--on-dark)", borderColor: "var(--on-dark)" }}
            >
              {session ? "Dashboard" : "Log in"}
            </Link>
          </div>
        </div>
      </nav>

      {/* hero — split lime / dark */}
      <section className="hero-split">
        <div className="hero-left">
          <span className="eyebrow" style={{ color: "var(--on-lime)" }}>
            AI · Data · Real-world skills
          </span>
          <h1 style={{ marginTop: 18 }}>
            Get fluent in the language of&nbsp;tech.
          </h1>
          <p style={{ fontSize: 19, maxWidth: "34ch", marginTop: 18, fontWeight: 500 }}>
            Pick a track, play games, and build real projects — with Bit, your sidekick. Start young, stay ahead.
          </p>
          <div className="pill-row">
            <span className="pill">Games &amp; puzzles</span>
            <span className="pill">AI &amp; data tracks</span>
            <span className="pill">Build real projects</span>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 30 }}>
            <Link className="btn btn-dark" href={primaryHref}>
              {session ? "Continue →" : "Start free →"}
            </Link>
            <Link className="btn btn-ghost" href="/login?role=parent">
              For parents
            </Link>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-menu">
            <div className="hm-title mono">▶ pick your track</div>
            <div className="hm-tracks">
              <div className="hm-track">
                <span className="hm-ic">🤖</span>
                <b>AI</b>
                <small>how it learns &amp; thinks</small>
              </div>
              <div className="hm-track">
                <span className="hm-ic">🗄️</span>
                <b>Data &amp; SQL</b>
                <small>ask data anything</small>
              </div>
            </div>
            <div className="hm-acts">
              <span className="hm-act">🎮 play</span>
              <span className="hm-act">🧩 puzzles</span>
              <span className="hm-act">🚀 build</span>
            </div>
            <div className="hm-foot mono">
              <span>🔥 streak</span>
              <span>⭐ xp</span>
              <span>💎 gems</span>
            </div>
          </div>
        </div>
      </section>

      {/* stat strip */}
      <section className="band band-panel">
        <div className="band-inner" style={{ paddingTop: 48, paddingBottom: 48 }}>
          <div className="statstrip">
            <div className="bigstat">
              <div className="n">3 min</div>
              <div className="l">a day, that's it</div>
            </div>
            <div className="bigstat">
              <div className="n">100%</div>
              <div className="l">runs in the browser</div>
            </div>
            <div className="bigstat">
              <div className="n">2 tracks</div>
              <div className="l">AI &amp; data</div>
            </div>
            <div className="bigstat">
              <div className="n">0</div>
              <div className="l">setup to start</div>
            </div>
          </div>
        </div>
      </section>

      {/* feature boxes */}
      <section className="wrap" style={{ paddingTop: 64, paddingBottom: 24 }}>
        <h2 style={{ fontSize: "clamp(30px,4vw,44px)" }}>How it works</h2>
        <div className="featgrid mt24">
          <div className="featbox">
            <span className="idx">01</span>
            <h3>Play</h3>
            <p>Tap, match, sort and build — every concept is a game or puzzle, never a lecture.</p>
          </div>
          <div className="featbox">
            <span className="idx">02</span>
            <h3>Learn with AI</h3>
            <p>Stuck? Bit explains why in plain language and points the way. Hints, never spoilers.</p>
          </div>
          <div className="featbox">
            <span className="idx">03</span>
            <h3>Keep the streak</h3>
            <p>Earn XP, collect gems, hold your streak. Come back tomorrow to keep it alive.</p>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="band band-lime">
        <div className="band-inner center" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <h2 style={{ fontSize: "clamp(34px,5vw,60px)", fontWeight: 900 }}>Ready to play?</h2>
          <div style={{ marginTop: 26 }}>
            <Link className="btn btn-dark" href={primaryHref}>
              {session ? "Continue →" : "Start free →"}
            </Link>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="band band-dark">
        <div className="band-inner on-dark spread" style={{ paddingTop: 32, paddingBottom: 32, flexWrap: "wrap" }}>
          <div className="brand">
            <span className="logo">L</span>
            <span className="wordmark">Learnly</span>
          </div>
          <span className="small" style={{ color: "#8a978f" }}>Learn AI &amp; data by playing.</span>
        </div>
      </footer>
    </>
  );
}
