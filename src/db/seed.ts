import { randomUUID } from "crypto"
import Database from "better-sqlite3"

export function seedFixedUsers(db: Database.Database) {
	const now = new Date().toISOString()

	const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (
      id, email, password, userName, firstName, lastName, role,
      createdAt, updatedAt
    ) VALUES (
      @id, @email, @password, @userName, @firstName, @lastName, @role,
      @createdAt, @updatedAt
    )
  `)

	const users = [
		{
			id: randomUUID(),
			email: "admin@example.com",
			password: "admin123", // Hash in real apps
			userName: "admin",
			firstName: "Alice",
			lastName: "Admin",
			role: "admin",
			createdAt: now,
			updatedAt: now,
		},
		{
			id: randomUUID(),
			email: "guest@example.com",
			password: "guest123",
			userName: "guest",
			firstName: "Gary",
			lastName: "Guest",
			role: "guest",
			createdAt: now,
			updatedAt: now,
		},
	]

	for (const user of users) {
		insertUser.run(user)
	}

	console.log("✅ Seeded fixed users.")
}
