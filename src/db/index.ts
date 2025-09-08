// src/db/index.ts
import Database from "better-sqlite3"
import fs from "fs"
import path from "path"
import dotenv from "dotenv"
import { runMigrations as _runMigrations } from "./migrate"

dotenv.config()

let db: Database.Database | null = null

function resolveDbPath(): string {
	const isProd = process.env.NODE_ENV === "production"
	const envPath = process.env.DB_PATH // prefer explicit path if provided

	// Defaults:
	// - local dev:   <repo>/data/db.sqlite
	// - Render prod: /app/data/db.sqlite   (inside container)
	const defaultDev = path.join(process.cwd(), "data", "db.sqlite")
	const defaultProd = "/app/data/db.sqlite"

	return envPath || (isProd ? defaultProd : defaultDev)
}

function ensureDir(filePath: string) {
	const dir = path.dirname(filePath)
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function runMigrations(db: Database.Database) {
	// Prefer a compiled migrations dir in dist/migrations (postbuild copy),
	// otherwise fall back to src/migrations for dev.
	const distDir = path.join(__dirname, "migrations") // e.g. dist/db/migrations or dist/migrations
	const srcDir = path.join(process.cwd(), "src", "migrations")

	// If your runMigrations only accepts (db), keep the first call.
	// If you extend it to accept a directory, call with the best existing one.
	if (
		typeof (_runMigrations as any) === "function" &&
		(_runMigrations as any).length >= 2
	) {
		const preferred = fs.existsSync(distDir) ? distDir : srcDir
		;(_runMigrations as any)(db, preferred)
	} else {
		_runMigrations(db) // original signature (db)
	}
}

export const initializeDB = (): Database.Database => {
	if (db) return db

	const DB_FILE = resolveDbPath()
	ensureDir(DB_FILE)

	const isProd = process.env.NODE_ENV === "production"
	db = new Database(DB_FILE, {
		// Verbose SQL logs only in dev
		verbose: !isProd ? console.log : undefined,
	})

	// Pragmas
	db.pragma("foreign_keys = ON")
	// Enable WAL if you want better concurrency; safe to leave ON in dev/prod.
	// If you committed -wal/-shm previously, you can still keep this.
	db.pragma("journal_mode = WAL")

	// Apply migrations
	try {
		runMigrations(db)
	} catch (err) {
		console.error("[DB] Migration error:", err)
		throw err
	}

	console.log("[DB] PATH:", DB_FILE)

	// Optional quick debug (PRINT TABLES) when DEBUG_DB=1
	if (process.env.DEBUG_DB === "1") {
		try {
			const tables = db
				.prepare(
					"SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
				)
				.all()
			console.log("[DB] Tables:", tables)
		} catch (e) {
			console.warn("[DB] Could not list tables:", e)
		}
	}

	return db
}

export default initializeDB
