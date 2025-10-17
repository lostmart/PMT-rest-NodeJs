// src/db/seed.ts
import Database from "better-sqlite3"
import bcrypt from "bcrypt"
import { User } from "../models/user"
import { seedProjects, seedProjectMembers } from "./projects.seed"
import { seedTasks } from "./tasks.seed"

/**
 * Seed initial users into the database
 * Uses INSERT OR IGNORE so it's safe to run multiple times
 */
export function seedDatabase(db: Database.Database) {
	const now = new Date().toISOString()

	// Prepare statement once
	const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (
      email, password, userName, firstName, lastName, role,
      createdAt, updatedAt
    ) VALUES (
      @email, @password, @userName, @firstName, @lastName, @role,
      @createdAt, @updatedAt
    )
  `)

	// Seed data
	const users: User[] = [
		{
			email: "admin@example.com",
			password: bcrypt.hashSync("admin123@@", 10),
			userName: "adminUser",
			firstName: "Alice",
			lastName: "Adminikhan",
			role: "admin",
			createdAt: now,
			updatedAt: now,
		},
		{
			email: "guest@example.com",
			password: bcrypt.hashSync("guest123@@", 10),
			userName: "guest",
			firstName: "Gary",
			lastName: "Guest",
			role: "guest",
			createdAt: now,
			updatedAt: now,
		},
		{
			email: "example@example.com",
			password: bcrypt.hashSync("example123@@", 10),
			userName: "exampleUser",
			firstName: "Example",
			lastName: "Exampleikhan",
			role: "collaborator",
			createdAt: now,
			updatedAt: now,
		},
		{
			email: "collaborator@example.com",
			password: bcrypt.hashSync("collaborator123@@", 10),
			userName: "collaborator",
			firstName: "Collaborator",
			lastName: "Collaboratorikhan",
			role: "collaborator",
			createdAt: now,
			updatedAt: now,
		},
	]

	// Insert all users in a transaction
	const seedTransaction = db.transaction(() => {
		users.forEach((user) => insertUser.run(user))
	})

	seedTransaction()
	console.log(`✅ Seeded ${users.length} users`)

	// Seed projects and members after users
	seedProjects(db)
	seedProjectMembers(db)

	// Seed tasks after projects and members
	seedTasks(db)
}

/**
 * Check if database needs seeding
 */
export function shouldSeed(db: Database.Database): boolean {
	const result = db.prepare("SELECT COUNT(*) as count FROM users").get() as {
		count: number
	}
	return result.count === 0
}

/**
 * Auto-seed if database is empty
 * Call this from sqlite.ts after creating tables
 */
export function autoSeed(db: Database.Database) {
	if (shouldSeed(db)) {
		console.log("📦 Database empty, seeding...")
		seedDatabase(db)
	} else {
		const count = db.prepare("SELECT COUNT(*) as count FROM users").get() as {
			count: number
		}
		console.log(`✅ Database already has ${count.count} users`)
	}
}

// ============================================
// FULL FILE STRUCTURE:
// ============================================
// src/db/seed.ts (THIS FILE) contains:
// - seedDatabase() - the actual seeding logic
// - shouldSeed() - checks if seeding is needed
// - autoSeed() - wrapper that checks + seeds
//
// Export autoSeed so sqlite.ts can import it!
