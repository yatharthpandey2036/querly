import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // We throw lazily at query time rather than import time so that pages which
  // don't touch the DB (e.g. the marketing landing) still render if unconfigured.
  console.warn(
    "[querly] DATABASE_URL is not set — database features will fail until you add it to .env.local",
  );
}

// A well-formed placeholder so neon() constructs without throwing at import time
// when DATABASE_URL is unset (e.g. during `next build`). Queries still fail loudly.
const sql = neon(connectionString ?? "postgresql://user:pass@localhost/placeholder?sslmode=require");
export const db = drizzle(sql, { schema });
export { schema };
