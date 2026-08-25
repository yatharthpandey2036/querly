"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";

type Role = "student" | "parent";
type Mode = "login" | "signup";

export default function AuthForm({
  initialRole,
  initialMode,
}: {
  initialRole: Role;
  initialMode: Mode;
}) {
  const router = useRouter();
  const [role, setRole] = useState<Role>(initialRole);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [linkEmail, setLinkEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isMinor = role === "student" && age !== "" && Number(age) < 18;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const url = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const body =
        mode === "signup"
          ? { role, name, email, password, age: age || undefined, linkEmail: linkEmail || undefined }
          : { email, password };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      track(mode === "signup" ? "Signed Up" : "Logged In", { role });
      router.push(data.redirect || "/learn");
      router.refresh();
    } catch {
      setError("Network error. Is the app running?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card pad">
      <div className="segment">
        <button className={role === "student" ? "on" : ""} onClick={() => setRole("student")} type="button">
          Student
        </button>
        <button className={role === "parent" ? "on" : ""} onClick={() => setRole("parent")} type="button">
          Parent
        </button>
      </div>

      <form onSubmit={submit}>
        {mode === "signup" && (
          <div className="field">
            <label>{role === "parent" ? "Your name" : "First name"}</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        )}
        <div className="field">
          <label>Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "signup" ? "at least 6 characters" : ""}
            required
          />
        </div>

        {mode === "signup" && role === "student" && (
          <div className="field">
            <label>Age</label>
            <input
              className="input"
              type="number"
              min={9}
              max={99}
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
        )}

        {mode === "signup" && isMinor && (
          <>
            <div className="banner">
              🛡️ Since you're under 18, we'll ask a parent to approve your account. Add their email
              so they can follow your progress.
            </div>
            <div className="field">
              <label>Parent's email (for approval)</label>
              <input
                className="input"
                type="email"
                value={linkEmail}
                onChange={(e) => setLinkEmail(e.target.value)}
              />
            </div>
          </>
        )}

        {mode === "signup" && role === "parent" && (
          <div className="field">
            <label>Your child's email (optional — links their account)</label>
            <input
              className="input"
              type="email"
              value={linkEmail}
              onChange={(e) => setLinkEmail(e.target.value)}
            />
          </div>
        )}

        {error && <div className="err">{error}</div>}

        <button className="btn btn-primary btn-block mt8" disabled={busy} type="submit">
          {busy ? "…" : mode === "signup" ? "Create my account" : "Log in"}
        </button>
      </form>

      <p className="center small muted mt16">
        {mode === "signup" ? "Already have an account?" : "New to Learnly?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "signup" ? "login" : "signup");
            setError("");
          }}
          style={{ background: "none", border: "none", color: "var(--brand-2)", fontWeight: 700 }}
        >
          {mode === "signup" ? "Log in" : "Sign up free"}
        </button>
      </p>
    </div>
  );
}
