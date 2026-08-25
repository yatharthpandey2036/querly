import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { friendships, userStats } from "@/db/schema";
import { getUserPlan } from "@/lib/premium";

// The Studio (exclusive build-with-AI projects) unlocks when ALL are true:
//   • Premium (or Family) plan
//   • at least STUDIO_XP experience points
//   • has brought in ≥1 friend (registered/connected another learner)
export const STUDIO_XP = 250;

export interface StudioAccess {
  unlocked: boolean;
  premium: boolean;
  xp: number;
  xpNeeded: number;
  hasFriend: boolean;
}

export async function studioAccess(userId: string): Promise<StudioAccess> {
  const plan = await getUserPlan(userId);
  const premium = plan !== "free";

  const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
  const xp = stats?.xp ?? 0;

  const friends = await db.select().from(friendships).where(eq(friendships.userId, userId));
  const hasFriend = friends.length > 0;

  return {
    unlocked: premium && xp >= STUDIO_XP && hasFriend,
    premium,
    xp,
    xpNeeded: STUDIO_XP,
    hasFriend,
  };
}
