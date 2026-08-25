import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Retry the driver's HTTP fetch a few times. Neon's free tier suspends the
// compute when idle; the first query after a wake can fail with "fetch failed"
// until it's up. This makes those cold-starts transparent instead of 500s.
neonConfig.fetchFunction = async (input: RequestInfo | URL, init?: RequestInit) => {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      return await fetch(input, init);
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
    }
  }
  throw lastErr;
};

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
