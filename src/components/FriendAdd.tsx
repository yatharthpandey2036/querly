"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";

export default function FriendAdd() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const d = await res.json();
      if (res.ok) {
        track("Friend Added");
        setOk(true);
        setMsg(`Added ${d.name}! 🎉`);
        setEmail("");
        router.refresh();
      } else {
        setOk(false);
        setMsg(d.error || "Could not add friend.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={add} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <input
        className="input"
        style={{ flex: 1, minWidth: 180 }}
        type="email"
        placeholder="friend's email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button className="btn btn-primary" disabled={busy}>
        {busy ? "…" : "Add friend"}
      </button>
      {msg && (
        <div className="small" style={{ width: "100%", color: ok ? "var(--brand-2)" : "var(--coral)", fontWeight: 600 }}>
          {msg}
        </div>
      )}
    </form>
  );
}
