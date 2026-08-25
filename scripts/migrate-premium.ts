// One-off migration for the premium/social features — idempotent, avoids the
// interactive drizzle-kit push prompt. Run: npx tsx scripts/migrate-premium.ts
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'free'`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_since timestamptz`;
  await sql`CREATE TABLE IF NOT EXISTS friendships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    friend_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, friend_user_id)
  )`;
  await sql`CREATE TABLE IF NOT EXISTS race_scores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score integer NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;
  console.log("✅ premium/social schema applied");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
