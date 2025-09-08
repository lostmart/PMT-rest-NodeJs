import Database from "better-sqlite3"
import fs from "fs"
import path from "path"
import { runMigrations } from "./migrate"
import dotenv from "dotenv"

dotenv.config()

let db: Database.Database

export const initializeDB = (): Database.Database => {
	if (db) return db

	const env = process.env.NODE_ENV ?? "development"
	const isProd = env === "production"
	const rawPath = process.env.DB_PATH
	if (!rawPath) throw new Error("DB_PATH env var is not set")

	const isMemory = rawPath === ":memory:"
	const DB_PATH = isMemory ? rawPath : path.resolve(rawPath)

	if (!DB_PATH) {
		throw new Error("DB_PATH env var is not set")
	}

	console.log(`[DB DEBUG] Raw DB_PATH from env: ${rawPath}`) // ← ADD THIS

	try {
		if (!isMemory) {
			const dir = path.dirname(DB_PATH)
			if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
		}

		db = new Database(DB_PATH, { verbose: isProd ? undefined : console.log })
		db.pragma("journal_mode = WAL")
		db.pragma("foreign_keys = ON")

		const migrate = db.transaction(() => {
			runMigrations(db)
		})
		migrate()

		console.log(`[DB DEBUG] Resolved DB_PATH: ${DB_PATH}`) // ← ADD THIS

		// ADD THIS: Check what tables/columns actually exist
		try {
			const userTableInfo = db.prepare("PRAGMA table_info(users)").all()
			console.log("[DB DEBUG] Users table schema:", userTableInfo)
		} catch (error) {
			console.log("[DB DEBUG] Could not inspect users table:", error)
		}

		console.log("[DB] PATH:", DB_PATH, "| env:", env)
		return db
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err)
		throw new Error(`[DB] initialization failed: ${msg}`)
	}
}

export default initializeDB
