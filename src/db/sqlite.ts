import Database from "better-sqlite3"
import fs from "node:fs"
import path from "node:path"
import dotenv from "dotenv"

// Load environment variables FIRST
dotenv.config()

const DEFAULT_DB_PATH = process.env.DB_PATH
// const dbPath = path.resolve(DEFAULT_DB_PATH)

if (!DEFAULT_DB_PATH) {
	throw new Error("DB_PATH env var is not set")
}
// ensure /data exists
fs.mkdirSync(path.dirname(DEFAULT_DB_PATH), { recursive: true })

export const db = new Database(DEFAULT_DB_PATH, { fileMustExist: false })

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
      password   TEXT NOT NULL,
      lastName   TEXT NOT NULL,
      role       TEXT NOT NULL,
      createdAt  TEXT NOT NULL,
      updatedAt  TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_users_email     ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_userName  ON users(userName);
    CREATE INDEX IF NOT EXISTS idx_users_role      ON users(role);
  `)
}

migrate()
