import Database from "better-sqlite3"
import fs from "fs"
import path from "path"
import { runMigrations } from "./migrate"

let db: Database.Database | null = null

export const initializeDB = (): Database.Database => {
	if (db) return db

	const isProd = process.env.NODE_ENV === "production"
	const DB_PATH = process.env.DB_PATH

	if (!DB_PATH) {
		throw new Error("DB_PATH env var is not set")
	}

	const dir = path.dirname(DB_PATH)
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

	db = new Database(DB_PATH, {
		verbose: !isProd ? console.log : undefined,
	})

	// ⬇️ Apply all non-applied migrations
	runMigrations(db)
	console.log("[DB] PATH:", DB_PATH)

	return db
}

export default initializeDB
