import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

// 👇 Export so you can re-use it for testing
export function runMigrations(db: Database.Database) {
	const MIGRATIONS_DIR = path.resolve("migrations");
	const APPLIED_TABLE = "applied_migrations";

	// Ensure applied_migrations table exists
	db.prepare(`
		CREATE TABLE IF NOT EXISTS ${APPLIED_TABLE} (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL UNIQUE,
			applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`).run();

	const appliedRows = db.prepare(`SELECT name FROM ${APPLIED_TABLE}`).all();
	const applied = new Set(appliedRows.map(row => row.name));

	const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith(".sql")).sort();

	for (const file of files) {
		if (applied.has(file)) continue;

		const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf-8");
		console.log(`[migration] applying ${file}...`);
		db.exec(sql);
		db.prepare(`INSERT INTO ${APPLIED_TABLE} (name) VALUES (?)`).run(file);
	}
}
