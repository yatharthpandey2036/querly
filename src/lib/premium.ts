import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, type Plan } from "@/db/schema";

// Pricing. This is a DEMO subscription — no real payment is collected.
export const PLANS = {
  premium: {
    id: "premium" as const,
    name: "Premium",
    price: 170,
    period: "month",
    blurb: "For one learner",
    perks: ["Leagues & weekly ranks", "Add friends", "Query Race (timed sprints)", "Everything in Free"],
  },
  family: {
    id: "family" as const,
    name: "Family",
    price: 299,
    period: "month",
    blurb: "Up to 4 kids",
    perks: ["Everything in Premium", "Up to 4 child accounts", "One parent dashboard", "Best value per kid"],
  },
};

export async function getUserPlan(userId: string): Promise<Plan> {
  const rows = await db.select({ plan: users.plan }).from(users).where(eq(users.id, userId));
  return rows[0]?.plan ?? "free";
}

export async function isPremium(userId: string): Promise<boolean> {
  return (await getUserPlan(userId)) !== "free";
}

export async function setPlan(userId: string, plan: Plan) {
  await db
    .update(users)
    .set({ plan, planSince: plan === "free" ? null : new Date() })
    .where(eq(users.id, userId));
}
