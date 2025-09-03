import Database from "better-sqlite3"
import { randomUUID } from "crypto"
import fs from "fs"
import bcrypt from "bcrypt"

const DB_PATH = process.env.DB_PATH || "data/app.db"

if (!fs.existsSync(DB_PATH)) {
	console.error("Database file not found at", DB_PATH)
	process.exit(1)
}

const db = new Database(DB_PATH)

const insertUser = db.prepare(`
  INSERT INTO users (
    id, email, password, userName, firstName, lastName, role,
    createdAt, updatedAt
  ) VALUES (
    @id, @email, @password, @userName, @firstName, @lastName, @role,
    @createdAt, @updatedAt
  )
`)

const now = new Date().toISOString()
const admin = {
	id: randomUUID(),
	email: "admin@example.com",
	password: bcrypt.hashSync("admin123@@", 10), // NOTE: hash in real apps
	userName: "admin",
	firstName: "Alice",
	lastName: "Admin",
	role: "admin",
	createdAt: now,
	updatedAt: now,
}

const guest = {
	id: randomUUID(),
	email: "guest@example.com",
	password: bcrypt.hashSync("guest123@@", 10),
	userName: "guest",
	firstName: "Gary",
	lastName: "Guest",
	role: "guest",
	createdAt: now,
	updatedAt: now,
}

try {
	insertUser.run(admin)
	insertUser.run(guest)
	console.log("✅ Seeded admin and guest users.")
} catch (err) {
	console.error("❌ Error inserting users:", (err as Error).message)
} finally {
	db.close()
}
