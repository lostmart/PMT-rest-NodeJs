import fs from "fs"
import path from "path"
import Database from "better-sqlite3"

export function runMigrations(db: Database.Database) {
	const MIGRATIONS_DIR = path.resolve("migrations")

	console.log(`[MIGRATION DEBUG] Looking at: ${MIGRATIONS_DIR}`)

	const APPLIED_TABLE = "applied_migrations"

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
			`[migration] No migrations directory found at ${MIGRATIONS_DIR}, creating essential tables programmatically`
		)
		createEssentialTables(db)
		return
	}

	try {
		const files = fs
			.readdirSync(MIGRATIONS_DIR)
			.filter((f) => f.endsWith(".sql"))
			.sort()

		if (files.length === 0) {
			console.log(
				"[migration] No migration files found, creating essential tables programmatically"
			)
			createEssentialTables(db)
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
function createEssentialTables(db: Database.Database) {
	console.log("[migration] Creating essential tables programmatically")

	// const insertProject = db.prepare(`
	// 	INSERT OR IGNORE INTO projects (
	// 		projectName, ownerId, manager, description, createdAt, updatedAt
	// 	) VALUES (
	// 		@projectName, @ownerId, @manager, @description, @createdAt, @updatedAt
	// 	)
	// `)

	try {
		db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                userName TEXT NOT NULL UNIQUE,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                role TEXT NOT NULL CHECK (role IN ('admin', 'collaborator', 'guest')),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT DEFAULT 'pending',
                user_id INTEGER,
                project_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (project_id) REFERENCES projects (id)
            );
            
            CREATE TABLE IF NOT EXISTS projects (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				projectName TEXT NOT NULL,
				ownerId INTEGER NOT NULL,
				manager TEXT,
				description TEXT,
				createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
				updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE
			);

			
            
            CREATE TABLE IF NOT EXISTS project_members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER,
                user_id INTEGER,
                role TEXT DEFAULT 'member',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects (id),
                FOREIGN KEY (user_id) REFERENCES users (id),
                UNIQUE(project_id, user_id)
            );
            
            -- Create indexes for better performance
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_users_userName ON users(userName);
        `)

		console.log("[migration] Essential tables created successfully")
	} catch (error) {
		console.error("[migration] Failed to create essential tables:", error)
		throw error
	}
}
