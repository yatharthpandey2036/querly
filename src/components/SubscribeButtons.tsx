"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubscribeButton({ plan }: { plan: "premium" | "family" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    try {
      await fetch("/api/premium/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      router.push("/social");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button className={`btn btn-block ${plan === "family" ? "btn-dark" : "btn-primary"}`} onClick={go} disabled={busy}>
      {busy ? "Starting…" : "Choose this plan"}
    </button>
  );
}
