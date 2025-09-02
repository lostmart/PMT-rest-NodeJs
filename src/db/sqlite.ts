import Database from "better-sqlite3"
import fs from "node:fs"
import path from "node:path"

const DEFAULT_DB_PATH = process.env.DB_PATH || "data/app.db"
const dbPath = path.resolve(DEFAULT_DB_PATH)

// ensure /data exists
fs.mkdirSync(path.dirname(dbPath), { recursive: true })

export const db = new Database(dbPath, { fileMustExist: false })

// sensible pragmas
db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

export function migrate(): void {
	db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         TEXT PRIMARY KEY,
      email      TEXT NOT NULL UNIQUE,
      userName   TEXT NOT NULL UNIQUE,
      firstName  TEXT NOT NULL,
      lastName   TEXT NOT NULL,
      role       TEXT NOT NULL CHECK (role IN ('admin','collaborator','guest')),
      createdAt  TEXT NOT NULL,
      updatedAt  TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_users_email     ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_userName  ON users(userName);
    CREATE INDEX IF NOT EXISTS idx_users_role      ON users(role);
  `)
}

migrate()
