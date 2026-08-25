import Link from "next/link";

export default function Paywall({ feature }: { feature: string }) {
  return (
    <div className="card pad center" style={{ maxWidth: 540, margin: "48px auto", padding: 44 }}>
      <div style={{ fontSize: 48 }}>🔒</div>
      <h2 style={{ fontSize: 26, marginTop: 8 }}>{feature} is a Premium feature</h2>
      <p className="muted mt8" style={{ maxWidth: "40ch", margin: "8px auto 0" }}>
        Learning AI &amp; SQL is always free. Premium unlocks Leagues, Friends and Query Race.
      </p>
      <div className="mt24">
        <Link className="btn btn-primary" href="/premium">
          See plans — ₹170/mo →
        </Link>
      </div>
    </div>
  );
}
