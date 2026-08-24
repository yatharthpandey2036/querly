import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { progress, userStats } from "@/db/schema";
import { ensureStats } from "./auth";

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function daysBetween(a: string, b: string): number {
  const ms = Date.parse(b) - Date.parse(a);
  return Math.round(ms / 86_400_000);
}

export interface CompletionResult {
  xp: number;
  gems: number;
  streakCount: number;
  longestStreak: number;
  hearts: number;
  alreadyDone: boolean;
}

/** Record a completed lesson and roll forward XP, gems and the daily streak. */
export async function recordCompletion(
  userId: string,
  lessonId: string,
  xpEarned: number,
  stars: number,
): Promise<CompletionResult> {
  await ensureStats(userId);

  const existing = await db
    .select()
    .from(progress)
    .where(eq(progress.userId, userId));
  const alreadyDone = existing.some((p) => p.lessonId === lessonId);

  if (!alreadyDone) {
    await db
      .insert(progress)
      .values({ userId, lessonId, xpEarned, stars })
      .onConflictDoNothing();
  }

  const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
  const today = todayUTC();

  let streak = stats.streakCount;
  if (!stats.lastActiveDate) {
    streak = 1;
  } else {
    const gap = daysBetween(stats.lastActiveDate, today);
    if (gap === 0) {
      streak = stats.streakCount || 1;
    } else if (gap === 1) {
      streak = stats.streakCount + 1;
    } else {
      streak = 1;
    }
  }

  const gainXp = alreadyDone ? 0 : xpEarned;
  const gainGems = alreadyDone ? 0 : Math.max(5, Math.round(xpEarned / 4));
  const newXp = stats.xp + gainXp;
  const newGems = stats.gems + gainGems;
  const longest = Math.max(stats.longestStreak, streak);

  await db
    .update(userStats)
    .set({
      xp: newXp,
      gems: newGems,
      streakCount: streak,
      longestStreak: longest,
      lastActiveDate: today,
    })
    .where(eq(userStats.userId, userId));

  return {
    xp: newXp,
    gems: newGems,
    streakCount: streak,
    longestStreak: longest,
    hearts: stats.hearts,
    alreadyDone,
  };
}

export async function getProgressFor(userId: string) {
  await ensureStats(userId);
  const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
  const done = await db.select().from(progress).where(eq(progress.userId, userId));
  return {
    stats,
    completedLessonIds: done.map((d) => d.lessonId),
  };
}
