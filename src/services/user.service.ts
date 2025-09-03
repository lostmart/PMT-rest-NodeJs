import { randomUUID } from "node:crypto"
import { db } from "../db/sqlite"
import { CreateUserBody, UpdateUserBody, User, UserRole } from "../models/user"
import bcrypt from "bcrypt"
import { logger } from "../utils/logger"

const SALT_ROUNDS = 12

// Prepared statements (no fancy generics; cast results when reading)
const selectAll = db.prepare(
	"SELECT id,email,userName,firstName,lastName,role,createdAt,updatedAt FROM users ORDER BY createdAt DESC"
)
const selectById = db.prepare(
	"SELECT id,email,userName,firstName,lastName,role,createdAt,updatedAt FROM users WHERE id = ?"
)
const selectByEmail = db.prepare(
	"SELECT id FROM users WHERE lower(email)=lower(?) LIMIT 1"
)
const selectByUserName = db.prepare(
	"SELECT id FROM users WHERE lower(userName)=lower(?) LIMIT 1"
)
const selectByEmailEx = db.prepare(
	"SELECT id FROM users WHERE lower(email)=lower(?) AND id != ? LIMIT 1"
)
const selectAuthByEmail = db.prepare(
	"SELECT id, email, password, userName, firstName, lastName, role, createdAt, updatedAt \
   FROM users WHERE lower(email)=lower(?) LIMIT 1"
)
const selectByUserEx = db.prepare(
	"SELECT id FROM users WHERE lower(userName)=lower(?) AND id != ? LIMIT 1"
)

const insertUser = db.prepare(
	"INSERT INTO users (id,email,userName,firstName,lastName,role,createdAt,updatedAt,password) VALUES (?,?,?,?,?,?,?,?,?)"
)
const updateUser = db.prepare(
	"UPDATE users SET email=?, userName=?, firstName=?, lastName=?, role=?, updatedAt=? WHERE id=?"
)
const deleteUser = db.prepare("DELETE FROM users WHERE id = ?")

const DUMMY_HASH =
	"$2b$12$KIX0xXQG3lGqR8mFf1cQ7eXn3N.zjst7rU5k7C6kqz6W0v0bMwFAS"

export const userService = {
	async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, SALT_ROUNDS)
	},

	async comparePassword(
		password: string,
		hashedPassword: string
	): Promise<boolean> {
		return bcrypt.compare(password, hashedPassword)
	},

	async authenticate(email: string, candidate: unknown) {
		const row = selectAuthByEmail.get(email) as
			| { id: string; password: string }
			| undefined

		if (typeof candidate !== "string") return false

		// Always compare to avoid user-enumeration timing leaks
		const hash = typeof row?.password === "string" ? row.password : DUMMY_HASH
		const ok = await bcrypt.compare(candidate, hash)

		return ok && !!row?.id ? { id: row.id } : false
	},

	list(): User[] {
		return selectAll.all() as User[]
	},

	get(id: string): User | null {
		const row = selectById.get(id)
		return (row as User) ?? null
	},

	// Update your create method to hash password
	// async create(userData: CreateUserBody): Promise<void> {
	// const hashedPassword = await this.hashPassword(userData.password)
	// ... rest of your create logic using hashedPassword
	// },

	async create(input: CreateUserBody): Promise<User> {
		const now = new Date().toISOString()
		const hashedPassword = await this.hashPassword(input.password)
		const user: User = {
			id: randomUUID(),
			email: input.email.trim(),
			userName: input.userName.trim(),
			firstName: input.firstName.trim(),
			lastName: input.lastName.trim(),
			password: hashedPassword,
			role: input.role, // controller should validate; DB CHECK enforces too
			createdAt: now,
			updatedAt: now,
		}

		try {
			insertUser.run(
				user.id,
				user.email,
				user.userName,
				user.firstName,
				user.lastName,
				user.role,
				user.createdAt,
				user.updatedAt,
				user.password
			)
			return user
		} catch (e: any) {
			if (e?.code === "SQLITE_CONSTRAINT_UNIQUE")
				throw new Error("UNIQUE_VIOLATION")
			if (e?.code === "SQLITE_CONSTRAINT_CHECK") throw new Error("INVALID_ROLE")
			throw e
		}
	},

	update(id: string, patch: UpdateUserBody): User | null {
		const current = this.get(id)
		if (!current) return null

		const next: User = {
			...current,
			email: patch.email?.trim() ?? current.email,
			userName: patch.userName?.trim() ?? current.userName,
			firstName: patch.firstName?.trim() ?? current.firstName,
			lastName: patch.lastName?.trim() ?? current.lastName,
			role: patch.role ?? current.role,
			updatedAt: new Date().toISOString(),
		}

		try {
			updateUser.run(
				next.email,
				next.userName,
				next.firstName,
				next.lastName,
				next.role as UserRole,
				next.updatedAt,
				id
			)
			return next
		} catch (e: any) {
			if (e?.code === "SQLITE_CONSTRAINT_UNIQUE")
				throw new Error("UNIQUE_VIOLATION")
			if (e?.code === "SQLITE_CONSTRAINT_CHECK") throw new Error("INVALID_ROLE")
			throw e
		}
	},

	remove(id: string): boolean {
		return deleteUser.run(id).changes > 0
	},

	emailInUse(email: string, excludeId?: string): boolean {
		return excludeId
			? !!selectByEmailEx.get(email, excludeId)
			: !!selectByEmail.get(email)
	},

	userNameInUse(userName: string, excludeId?: string): boolean {
		return excludeId
			? !!selectByUserEx.get(userName, excludeId)
			: !!selectByUserName.get(userName)
	},
}
