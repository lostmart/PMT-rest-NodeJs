// src/db/sqlite.ts
import Database from "better-sqlite3"
import path from "path"
import fs from "fs"
import { autoSeed } from "./seed"

const DB_PATH = path.join(process.cwd(), "data", "app.db")

// Ensure data directory exists
const dbDir = path.dirname(DB_PATH)
if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, { recursive: true })
}

// Create database connection
export const db = new Database(DB_PATH)

// Performance optimizations
db.pragma("journal_mode = WAL")
db.pragma("synchronous = NORMAL")
db.pragma("foreign_keys = ON")

console.log("✅ Connected to SQLite database")

// ============================================
// Create Tables
// ============================================

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    userName TEXT UNIQUE NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'guest', 'collaborator')),
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectName TEXT NOT NULL UNIQUE,
    ownerId INTEGER NOT NULL,
    manager TEXT,
    description TEXT,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    projectId INTEGER NOT NULL,
    assignedTo INTEGER,
    status TEXT NOT NULL DEFAULT 'todo' CHECK(status IN ('todo', 'in_progress', 'done')),
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assignedTo) REFERENCES users(id) ON DELETE SET NULL
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS projects_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(projectId, userId)
  )
`)

console.log("✅ Database tables created")

// ============================================
// Auto-seed if empty

// ✅ Tables get created
// ✅ autoSeed(db) is called
// ✅ It checks if users table is empty
// ✅ If empty → seeds, if not → skips
// ✅ Only runs once when the module is first imported
// ✅ Safe to run multiple times (uses INSERT OR IGNORE)
// ============================================

autoSeed(db)

console.log("✅ Database auto-seeded")
