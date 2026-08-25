import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getProgressFor } from "@/lib/gamification";
import { getUserPlan, PLANS } from "@/lib/premium";
import TopBar from "@/components/TopBar";
import SubscribeButton from "@/components/SubscribeButtons";
import CancelButton from "@/components/CancelButton";

export const dynamic = "force-dynamic";

export default async function PremiumPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const { stats } = await getProgressFor(session.id);
  const plan = await getUserPlan(session.id);

  return (
    <>
      <TopBar name={session.name} stats={{ streak: stats.streakCount, xp: stats.xp, gems: stats.gems, hearts: stats.hearts }} />

      <main className="wrap" style={{ paddingTop: 20, paddingBottom: 60, maxWidth: 900 }}>
        <Link className="btn btn-ghost" href="/learn" style={{ padding: "8px 14px", marginBottom: 18 }}>
          ← Back
        </Link>
        <div className="center">
          <span className="eyebrow">Learnly Premium</span>
          <h2 style={{ fontSize: "clamp(28px,4vw,40px)", marginTop: 8 }}>Unlock the competition 🏆</h2>
          <p className="muted mt8" style={{ maxWidth: "48ch", margin: "8px auto 0" }}>
            Learning AI &amp; SQL is <b>always free</b>. Premium adds Leagues, Friends and Query Race.
          </p>
        </div>

        {plan !== "free" ? (
          <div className="card pad center mt24" style={{ maxWidth: 480, margin: "24px auto 0" }}>
            <div style={{ fontSize: 44 }}>✅</div>
            <h3 style={{ fontSize: 22, marginTop: 8 }}>You&apos;re on {plan === "family" ? "Family" : "Premium"}</h3>
            <p className="muted small mt8">All competitive features are unlocked. Have fun!</p>
            <div className="mt24" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="btn btn-primary" href="/social">
                Go to Leagues →
              </Link>
              <CancelButton />
            </div>
          </div>
        ) : (
          <>
            <div className="grid-2 mt24" style={{ maxWidth: 760, margin: "24px auto 0" }}>
              {(["premium", "family"] as const).map((key) => {
                const p = PLANS[key];
                return (
                  <div key={key} className="card pad" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div className="spread">
                      <h3 style={{ fontSize: 20 }}>{p.name}</h3>
                      {key === "premium" && <span className="tag t-gold">popular</span>}
                    </div>
                    <div>
                      <span style={{ fontSize: 34, fontWeight: 900, letterSpacing: "-0.03em" }}>₹{p.price}</span>
                      <span className="muted"> /{p.period}</span>
                    </div>
                    <p className="muted small">{p.blurb}</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0", display: "flex", flexDirection: "column", gap: 8 }}>
                      {p.perks.map((perk) => (
                        <li key={perk} className="small" style={{ display: "flex", gap: 8 }}>
                          <span style={{ color: "var(--brand-2)", fontWeight: 800 }}>✓</span> {perk}
                        </li>
                      ))}
                    </ul>
                    <div style={{ marginTop: "auto", paddingTop: 8 }}>
                      <SubscribeButton plan={key} />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="center small muted mt24" style={{ maxWidth: "46ch", margin: "24px auto 0" }}>
              🔒 This is a <b>demo</b> subscription — no real payment is taken and no card details are collected. It
              simply unlocks the premium features so you can try them.
            </p>
          </>
        )}
      </main>
    </>
  );
}
