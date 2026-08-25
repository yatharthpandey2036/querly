"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";

export default function Checkout({
  plan,
  price,
  planName,
}: {
  plan: "premium" | "family";
  price: number;
  planName: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "processing" | "done">("idle");

  useEffect(() => {
    track("Checkout Started", { plan, price });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function pay() {
    track("Payment Completed", { plan, price });
    setState("processing");
    // fake gateway delay so it feels like a real payment
    await new Promise((r) => setTimeout(r, 1500));
    try {
      await fetch("/api/premium/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
    } catch {
      /* ignore */
    }
    setState("done");
    setTimeout(() => {
      router.push("/social");
      router.refresh();
    }, 1400);
  }

  if (state === "done") {
    return (
      <div className="card pad center" style={{ maxWidth: 460, margin: "0 auto", padding: 44 }}>
        <div style={{ fontSize: 52 }}>✅</div>
        <h2 style={{ fontSize: 24, marginTop: 8 }}>Payment successful!</h2>
        <p className="muted mt8">Unlocking your Premium… 🎉</p>
      </div>
    );
  }

  return (
    <div className="card pad" style={{ maxWidth: 460, margin: "0 auto" }}>
      <span className="eyebrow">Order summary</span>
      <div className="spread mt16" style={{ fontSize: 18 }}>
        <span style={{ fontWeight: 700 }}>Learnly {planName}</span>
        <span style={{ fontWeight: 800 }}>₹{price}</span>
      </div>
      <p className="muted small">Billed monthly · cancel anytime</p>
      <div className="spread" style={{ borderTop: "1px solid var(--line)", marginTop: 16, paddingTop: 14, fontSize: 18 }}>
        <span style={{ fontWeight: 700 }}>Total today</span>
        <span style={{ fontWeight: 900 }}>₹{price}</span>
      </div>
      <div className="banner" style={{ marginTop: 16, borderLeftColor: "var(--gold)" }}>
        🔒 Demo checkout — no card or UPI details are asked, and no real money is charged.
      </div>
      <button className="btn btn-primary btn-block mt16" onClick={pay} disabled={state === "processing"}>
        {state === "processing" ? "Processing payment…" : `Pay ₹${price} (demo)`}
      </button>
    </div>
  );
}
