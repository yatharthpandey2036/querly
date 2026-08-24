// Optional demo seed: creates a linked student + parent so you can log in immediately.
// Run with:  npm run db:seed   (after DATABASE_URL is set and `npm run db:push` has run)
//
// Note: we build the DB client *inside* main() after dotenv loads, because ESM
// import hoisting would otherwise evaluate a shared db module before env is set.
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { users, userStats, parentLinks } from "./schema";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set in .env.local");
  const db = drizzle(neon(url), { schema: { users, userStats, parentLinks } });

  async function upsertUser(input: {
    role: "student" | "parent";
    name: string;
    email: string;
    password: string;
    age?: number;
  }) {
    const existing = await db.select().from(users).where(eq(users.email, input.email));
    if (existing[0]) return existing[0];
    const [u] = await db
      .insert(users)
      .values({
        role: input.role,
        name: input.name,
        email: input.email,
        passwordHash: bcrypt.hashSync(input.password, 10),
        age: input.age,
        consentStatus: input.role === "student" ? "granted" : "not_required",
      })
      .returning();
    if (input.role === "student") {
      await db.insert(userStats).values({ userId: u.id }).onConflictDoNothing();
    }
    return u;
  }

  const student = await upsertUser({
    role: "student",
    name: "Aarav",
    email: "student@demo.com",
    password: "querly123",
    age: 15,
  });
  const parent = await upsertUser({
    role: "parent",
    name: "Priya",
    email: "parent@demo.com",
    password: "querly123",
  });
  await db
    .insert(parentLinks)
    .values({ parentUserId: parent.id, studentUserId: student.id })
    .onConflictDoNothing();

  console.log("✅ Seeded demo accounts:");
  console.log("   Student → student@demo.com / querly123");
  console.log("   Parent  → parent@demo.com  / querly123");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
