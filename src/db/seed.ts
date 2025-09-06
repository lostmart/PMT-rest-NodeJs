import Database from "better-sqlite3"

import bcrypt from "bcrypt"
import { User } from "../models/user"

export function seedFixedUsers(db: Database.Database) {
	const now = new Date().toISOString()

	const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (
      email, password, userName, firstName, lastName, role,
      createdAt, updatedAt
    ) VALUES (
      @email, @password, @userName, @firstName, @lastName, @role,
      @createdAt, @updatedAt
    )
  `)

	const users = [
		{
			email: "admin@example.com",
			password: bcrypt.hashSync("admin123@@", 10),
			userName: "adminUser",
			firstName: "Alice",
			lastName: "Adminikhan",
			role: "admin",
			createdAt: now,
			updatedAt: now,
		} as User,
		{
			email: "guest@example.com",
			password: bcrypt.hashSync("guest123@@", 10),
			userName: "guest",
			firstName: "Gary",
			lastName: "Guest",
			role: "guest",
			createdAt: now,
			updatedAt: now,
		} as User,
	]

	for (const user of users) {
		insertUser.run(user)
	}

	console.log("✅ Seeded fixed users.")
}
