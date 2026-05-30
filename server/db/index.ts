import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { logger } from "../_core/logger";

let _db: NodePgDatabase<Record<string, unknown>> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20,
      });
      _db = drizzle(pool);
    } catch (error) {
      logger.warn({ err: error }, "[Database] Failed to connect");
      _db = null;
    }
  }
  return _db;
}

// Re-export everything from drizzle schema
export * from "../../drizzle/schema";

// Re-export red-team helpers from ../db (db.ts)
export { createRedteamRun, getRedteamRun, recordRedteamFindings, updateRedteamRun } from "../db";

// Export query modules
export * from "./queries/users";
export * from "./queries/collections";
