import { randomUUID } from "node:crypto"
import { db } from "../db/sqlite"
import { CreateUserBody, UpdateUserBody, User, UserRole } from "../models/user"
import bcrypt from "bcrypt"

const SALT_ROUNDS = 12

export type AuthResponse = {
	authenticated: boolean
	user?: User
}

export const userService = {
	async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, SALT_ROUNDS)
	},

	async authenticate(email: string, password: string): Promise<AuthResponse> {
		const selectAuthByEmail = db.prepare(
			"SELECT id, email, password, userName, firstName, lastName, role, createdAt, updatedAt FROM users WHERE lower(email)=lower(?) LIMIT 1"
		)
		const user = selectAuthByEmail.get(email) as User
		if (!user) return { authenticated: false }
		const authenticated = await bcrypt.compare(password, user.password)
		return { authenticated, user }
	},

	list(): User[] {
		const selectAll = db.prepare(
			"SELECT id,email,userName,firstName,lastName,role,createdAt,updatedAt FROM users ORDER BY createdAt DESC"
		)
		return selectAll.all() as User[]
	},

	get(id: string): User | null {
		const selectById = db.prepare(
			"SELECT id,email,userName,firstName,lastName,role,createdAt,updatedAt FROM users WHERE id = ?"
		)
		const row = selectById.get(id)
		return (row as User) ?? null
	},

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
			role: input.role,
			createdAt: now,
			updatedAt: now,
		}

		const insertUser = db.prepare(
			"INSERT INTO users (id,email,userName,firstName,lastName,role,createdAt,updatedAt,password) VALUES (?,?,?,?,?,?,?,?,?)"
		)

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

		const updateUser = db.prepare(
			"UPDATE users SET email=?, userName=?, firstName=?, lastName=?, role=?, updatedAt=? WHERE id=?"
		)

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
		const deleteUser = db.prepare("DELETE FROM users WHERE id = ?")
		return deleteUser.run(id).changes > 0
	},

	emailInUse(email: string, excludeId?: string): boolean {
		if (excludeId) {
			const selectByEmailEx = db.prepare(
				"SELECT id FROM users WHERE lower(email)=lower(?) AND id != ? LIMIT 1"
			)
			return !!selectByEmailEx.get(email, excludeId)
		} else {
			const selectByEmail = db.prepare(
				"SELECT id FROM users WHERE lower(email)=lower(?) LIMIT 1"
			)
			return !!selectByEmail.get(email)
		}
	},

	userNameInUse(userName: string, excludeId?: string): boolean {
		if (excludeId) {
			const selectByUserEx = db.prepare(
				"SELECT id FROM users WHERE lower(userName)=lower(?) AND id != ? LIMIT 1"
			)
			return !!selectByUserEx.get(userName, excludeId)
		} else {
			const selectByUserName = db.prepare(
				"SELECT id FROM users WHERE lower(userName)=lower(?) LIMIT 1"
			)
			return !!selectByUserName.get(userName)
		}
	},
}
