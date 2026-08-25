"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    try {
      await fetch("/api/premium/cancel", { method: "POST" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      className="btn"
      style={{ background: "transparent", color: "var(--ink-2)", border: "1px solid var(--line-2)" }}
      onClick={go}
      disabled={busy}
    >
      {busy ? "…" : "Cancel plan"}
    </button>
  );
}
