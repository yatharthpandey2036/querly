import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getProgressFor } from "@/lib/gamification";
import { PLANS } from "@/lib/premium";
import TopBar from "@/components/TopBar";
import Checkout from "@/components/Checkout";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ searchParams }: { searchParams: { plan?: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const key = searchParams.plan === "family" ? "family" : "premium";
  const p = PLANS[key];
  const { stats } = await getProgressFor(session.id);

  return (
    <>
      <TopBar name={session.name} stats={{ streak: stats.streakCount, xp: stats.xp, gems: stats.gems, hearts: stats.hearts }} />
      <main className="wrap" style={{ paddingTop: 20, paddingBottom: 60, maxWidth: 560 }}>
        <Link className="btn btn-ghost" href="/premium" style={{ padding: "8px 14px", marginBottom: 20 }}>
          ← Back
        </Link>
        <div className="center" style={{ marginBottom: 20 }}>
          <span className="eyebrow">Checkout</span>
          <h2 style={{ fontSize: 26, marginTop: 6 }}>Start {p.name} 🚀</h2>
        </div>
        <Checkout plan={key} price={p.price} planName={p.name} />
      </main>
    </>
  );
}
