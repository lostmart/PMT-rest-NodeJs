import Database from "better-sqlite3"
import fs from "fs"
import path from "path"
import { runMigrations } from "./migrate"
import dotenv from "dotenv"

dotenv.config()

let db: Database.Database

export const initializeDB = (): Database.Database => {
	if (db) return db

	const env = process.env.NODE_ENV ?? 'development';
	const isProd = process.env.NODE_ENV === "production"
	const DB_PATH = process.env.DB_PATH

	if (!DB_PATH) {
		throw new Error("DB_PATH env var is not set")
	}

	try {
		const dir = path.dirname(DB_PATH)
		if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

		db = new Database(DB_PATH, { verbose: isProd ? undefined : console.log })

		// Optional: sensible PRAGMAs
		db.pragma("journal_mode = WAL")
		db.pragma("foreign_keys = ON")

		db.transaction(() => {
			runMigrations(db) // make sure this is idempotent
		})()

		console.log("[DB] PATH:", DB_PATH, "| env:", env)
		return db!
	} catch (err) {
		// add context and rethrow
		const msg = err instanceof Error ? err.message : String(err)
		throw new Error(`[DB] initialization failed: ${msg}`)
	}
}

export default initializeDB
