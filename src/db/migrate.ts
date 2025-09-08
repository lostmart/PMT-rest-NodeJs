import fs from "fs"
import path from "path"
import Database from "better-sqlite3"

export function runMigrations(db: Database.Database) {
	const MIGRATIONS_DIR = path.resolve("migrations")
	const APPLIED_TABLE = "applied_migrations"

	// In db/migrate.ts
	if (!fs.existsSync(MIGRATIONS_DIR)) {
		console.log(
			`[migration] No migrations directory found at ${MIGRATIONS_DIR}`
		)
		// Consider creating essential tables here as fallback
		return
	}

	// Ensure applied_migrations table exists
	db.prepare(
		`
        CREATE TABLE IF NOT EXISTS ${APPLIED_TABLE} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `
	).run()

	const appliedRows = db.prepare(`SELECT name FROM ${APPLIED_TABLE}`).all()
	const applied = new Set(appliedRows.map((row: any) => row.name))

	// Check if migrations directory exists
	if (!fs.existsSync(MIGRATIONS_DIR)) {
		console.log(
			`[migration] No migrations directory found at ${MIGRATIONS_DIR}, skipping migrations`
		)
		return
	}

	try {
		const files = fs
			.readdirSync(MIGRATIONS_DIR)
			.filter((f) => f.endsWith(".sql"))
			.sort()

		if (files.length === 0) {
			console.log("[migration] No migration files found, skipping migrations")
			return
		}

		for (const file of files) {
			if (applied.has(file)) {
				console.log(`[migration] ${file} already applied, skipping`)
				continue
			}

			const filePath = path.join(MIGRATIONS_DIR, file)
			const sql = fs.readFileSync(filePath, "utf-8")

			console.log(`[migration] applying ${file}...`)

			// Use a transaction for each migration
			const transaction = db.transaction(() => {
				db.exec(sql)
				db.prepare(`INSERT INTO ${APPLIED_TABLE} (name) VALUES (?)`).run(file)
			})

			try {
				transaction()
				console.log(`[migration] ${file} applied successfully`)
			} catch (error) {
				console.error(`[migration] Failed to apply ${file}:`, error)
				throw error // Re-throw to stop further migrations
			}
		}
	} catch (error) {
		console.error("[migration] Error during migration process:", error)
		throw error
	}
}
