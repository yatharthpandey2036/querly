import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getProgressFor } from "@/lib/gamification";
import { studioAccess } from "@/lib/studio";
import TopBar from "@/components/TopBar";
import TrackOnMount from "@/components/TrackOnMount";

export const dynamic = "force-dynamic";

function Req({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="spread" style={{ padding: "10px 0", borderTop: "1px solid var(--line)" }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <span style={{ color: ok ? "var(--brand-2)" : "var(--ink-3)", fontWeight: 800 }}>{ok ? "✓ done" : "locked"}</span>
    </div>
  );
}

export default async function StudioPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const { stats } = await getProgressFor(session.id);
  const a = await studioAccess(session.id);

  const topbar = (
    <TopBar name={session.name} stats={{ streak: stats.streakCount, xp: stats.xp, gems: stats.gems, hearts: stats.hearts }} />
  );

  if (!a.unlocked) {
    return (
      <>
        {topbar}
        <main className="wrap" style={{ maxWidth: 620, paddingTop: 20, paddingBottom: 60 }}>
          <TrackOnMount event="Studio Locked Viewed" />
          <Link className="btn btn-ghost" href="/learn" style={{ padding: "8px 14px", marginBottom: 18 }}>
            ← Back
          </Link>
          <div className="card pad center" style={{ padding: 40 }}>
            <div style={{ fontSize: 48 }}>🎧</div>
            <h2 style={{ fontSize: 26, marginTop: 8 }}>The Studio</h2>
            <p className="muted mt8" style={{ maxWidth: "42ch", margin: "8px auto 0" }}>
              Our most exclusive build-with-AI projects. Unlock all three to enter:
            </p>
            <div style={{ textAlign: "left", marginTop: 20 }}>
              <Req ok={a.premium} label="🏆 Be on Premium" />
              <Req ok={a.xp >= a.xpNeeded} label={`⭐ Reach ${a.xpNeeded} XP  (you: ${a.xp})`} />
              <Req ok={a.hasFriend} label="👥 Bring in a friend" />
            </div>
            <div className="mt24" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {!a.premium && (
                <Link className="btn btn-primary" href="/premium">
                  Go Premium →
                </Link>
              )}
              {a.premium && !a.hasFriend && (
                <Link className="btn btn-primary" href="/social">
                  Add a friend →
                </Link>
              )}
              {a.premium && a.hasFriend && a.xp < a.xpNeeded && (
                <Link className="btn btn-primary" href="/learn">
                  Earn more XP →
                </Link>
              )}
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {topbar}
      <main className="wrap" style={{ maxWidth: 900, paddingTop: 20, paddingBottom: 60 }}>
        <TrackOnMount event="Studio Opened" />
        <Link className="btn btn-ghost" href="/learn" style={{ padding: "8px 14px", marginBottom: 18 }}>
          ← Back
        </Link>
        <span className="eyebrow">🎧 The Studio · exclusive</span>
        <h2 style={{ fontSize: 28, marginTop: 6 }}>Build something amazing with AI ✨</h2>
        <p className="muted mt8">You unlocked it — welcome in. Pick a project to build.</p>

        <div className="grid-2 mt24">
          <Link className="card pad" href="/studio/ai-dj" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="spread">
              <h3 style={{ fontSize: 20 }}>🎧 AI DJ</h3>
              <span className="tag t-gold">exclusive</span>
            </div>
            <p className="muted small">
              Become a DJ. Tell the AI your vibe, get a smart playlist — then learn the SQL that powers the
              recommendation.
            </p>
            <span className="mono small" style={{ color: "var(--brand-2)", marginTop: "auto" }}>
              Build it → · +120 XP
            </span>
          </Link>

          <div className="card pad" style={{ opacity: 0.65, display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="spread">
              <h3 style={{ fontSize: 20 }}>🛒 AI Shopkeeper</h3>
              <span className="tag t-brand">soon</span>
            </div>
            <p className="muted small">Build a store assistant that recommends products — more Studio projects are on the way.</p>
          </div>
        </div>
      </main>
    </>
  );
}
