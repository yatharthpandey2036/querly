// Client-side SQLite via sql.js (WASM). All lesson queries run here in the
// browser — the server never executes learner SQL, which keeps the backend light.
import initSqlJs, { type Database, type SqlJsStatic } from "sql.js";

let sqlPromise: Promise<SqlJsStatic> | null = null;

async function getSql(): Promise<SqlJsStatic> {
  if (!sqlPromise) {
    // sql-wasm.wasm is copied into /public at build time.
    sqlPromise = initSqlJs({ locateFile: () => "/sql-wasm.wasm" });
  }
  return sqlPromise;
}

export interface QueryResult {
  columns: string[];
  rows: unknown[][];
  error?: string;
}

/** Build a fresh sandbox from datasetSql and run a single query against it. */
export async function runQuery(datasetSql: string, query: string): Promise<QueryResult> {
  const SQL = await getSql();
  const db: Database = new SQL.Database();
  try {
    db.run(datasetSql);
    const res = db.exec(query);
    if (res.length === 0) return { columns: [], rows: [] };
    const last = res[res.length - 1];
    return { columns: last.columns, rows: last.values as unknown[][] };
  } catch (e) {
    return { columns: [], rows: [], error: (e as Error).message };
  } finally {
    db.close();
  }
}

/** Preview a dataset table (first N rows) for the "your data" panel. */
export async function previewTable(datasetSql: string, table: string, limit = 6): Promise<QueryResult> {
  return runQuery(datasetSql, `SELECT * FROM ${table} LIMIT ${limit};`);
}

export interface GradeResult {
  correct: boolean;
  result: QueryResult;
  expected: QueryResult;
  error?: string;
}

function normalizeRows(rows: unknown[][]): string[] {
  return rows.map((r) => JSON.stringify(r));
}

function resultsMatch(a: QueryResult, b: QueryResult, ordered: boolean): boolean {
  if (a.rows.length !== b.rows.length) return false;
  const na = normalizeRows(a.rows);
  const nb = normalizeRows(b.rows);
  if (ordered) return na.every((v, i) => v === nb[i]);
  return [...na].sort().join("|") === [...nb].sort().join("|");
}

/** Run the learner's query and compare its result set to the solution. */
export async function gradeQuery(
  datasetSql: string,
  userQuery: string,
  solutionSql: string,
): Promise<GradeResult> {
  const result = await runQuery(datasetSql, userQuery);
  const expected = await runQuery(datasetSql, solutionSql);
  if (result.error) {
    return { correct: false, result, expected, error: result.error };
  }
  // Only enforce row order when the solution explicitly sorts.
  const ordered = /order\s+by/i.test(solutionSql);
  return { correct: resultsMatch(result, expected, ordered), result, expected };
}
