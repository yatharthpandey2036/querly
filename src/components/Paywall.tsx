import Link from "next/link";
import TrackOnMount from "@/components/TrackOnMount";

export default function Paywall({ feature }: { feature: string }) {
  return (
    <div className="card pad center" style={{ maxWidth: 540, margin: "48px auto", padding: 44 }}>
      <TrackOnMount event="Paywall Hit" props={{ feature }} />
      <div style={{ fontSize: 48 }}>🔒</div>
      <h2 style={{ fontSize: 26, marginTop: 8 }}>{feature} is a Premium feature</h2>
      <p className="muted mt8" style={{ maxWidth: "40ch", margin: "8px auto 0" }}>
        Learning AI &amp; SQL is always free. Premium unlocks Leagues, Friends and Query Race.
      </p>
      <div className="mt24" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <Link className="btn btn-primary" href="/premium">
          See plans — ₹170/mo →
        </Link>
        <Link className="btn btn-ghost" href="/learn">
          ← Back to learning
        </Link>
      </div>
    </div>
  );
}
