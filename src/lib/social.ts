import "server-only";
import { eq, desc, inArray } from "drizzle-orm";
import { db } from "@/db";
import { users, userStats, friendships, raceScores } from "@/db/schema";

// ---- Friends ----
export async function addFriendByEmail(userId: string, email: string) {
  const friend = (await db.select().from(users).where(eq(users.email, email.toLowerCase())))[0];
  if (!friend) return { ok: false as const, error: "No learner found with that email." };
  if (friend.id === userId) return { ok: false as const, error: "That's your own email!" };
  await db
    .insert(friendships)
    .values([
      { userId, friendUserId: friend.id },
      { userId: friend.id, friendUserId: userId },
    ])
    .onConflictDoNothing();
  return { ok: true as const, name: friend.name };
}

export async function listFriends(userId: string) {
  const links = await db.select().from(friendships).where(eq(friendships.userId, userId));
  const ids = links.map((l) => l.friendUserId);
  if (ids.length === 0) return [];
  const us = await db.select().from(users).where(inArray(users.id, ids));
  const stats = await db.select().from(userStats).where(inArray(userStats.userId, ids));
  return us
    .map((u) => {
      const s = stats.find((x) => x.userId === u.id);
      return { id: u.id, name: u.name, xp: s?.xp ?? 0, streak: s?.streakCount ?? 0 };
    })
    .sort((a, b) => b.xp - a.xp);
}

// ---- Query Race ----
export async function submitRaceScore(userId: string, score: number) {
  await db.insert(raceScores).values({ userId, score: Math.max(0, Math.min(999, score)) });
}

export async function raceLeaderboard(limit = 10) {
  const rows = await db.select().from(raceScores);
  const best = new Map<string, number>();
  for (const r of rows) {
    if (r.score > (best.get(r.userId) ?? 0)) best.set(r.userId, r.score);
  }
  const ids = [...best.keys()];
  if (ids.length === 0) return [];
  const us = await db.select().from(users).where(inArray(users.id, ids));
  return [...best.entries()]
    .map(([uid, score]) => ({ name: us.find((u) => u.id === uid)?.name ?? "Learner", score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ---- Leagues (weekly-ish leaderboard by XP) ----
export async function leagueLeaderboard(limit = 15) {
  const stats = await db.select().from(userStats).orderBy(desc(userStats.xp)).limit(limit);
  const ids = stats.map((s) => s.userId);
  if (ids.length === 0) return [];
  const us = await db.select().from(users).where(inArray(users.id, ids));
  return stats.map((s) => ({
    id: s.userId,
    name: us.find((u) => u.id === s.userId)?.name ?? "Learner",
    xp: s.xp,
    streak: s.streakCount,
  }));
}

export function leagueTier(xp: number) {
  if (xp >= 500) return { name: "Gold", icon: "🥇", color: "var(--gold)" };
  if (xp >= 200) return { name: "Silver", icon: "🥈", color: "var(--ink-2)" };
  return { name: "Bronze", icon: "🥉", color: "var(--brand-2)" };
}
