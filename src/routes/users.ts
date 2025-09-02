import { Router, Request, Response } from "express"
import { randomUUID } from "node:crypto"
import { logger } from "../utils/logger"
import { User, CreateUserBody, UpdateUserBody } from "../models/user"

const router = Router()

// naive in-memory store (resets on restart)
const users = new Map<string, User>()

const isEmail = (e: unknown): e is string =>
	typeof e === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
const isNonEmptyString = (s: unknown): s is string =>
	typeof s === "string" && s.trim().length > 0

// GET /api/users
router.get("/", (_req: Request, res: Response) => {
	res.json({ users: Array.from(users.values()) })
})

// GET /api/users/:id
router.get("/:id", (req: Request, res: Response) => {
	const u = users.get(req.params.id)
	if (!u) return res.status(404).json({ error: "User not found" })
	res.json(u)
})

// POST /api/users
router.post("/", (req: Request<{}, {}, CreateUserBody>, res: Response) => {
	const { name, email } = req.body || {}

	if (!isNonEmptyString(name)) {
		return res.status(400).json({ error: "`name` is required (string)" })
	}
	if (!isEmail(email)) {
		return res.status(400).json({ error: "`email` is invalid" })
	}
	// unique email check (O(n), fine for demo)
	for (const u of users.values()) {
		if (u.email.toLowerCase() === email.toLowerCase()) {
			return res.status(409).json({ error: "Email already in use" })
		}
	}

	const now = new Date().toISOString()
	const user: User = {
		id: randomUUID(),
		name: name.trim(),
		email: email.trim(),
		createdAt: now,
		updatedAt: now,
	}

	users.set(user.id, user)
	logger.debug({ userId: user.id }, "User created")
	res.status(201).json(user)
})

// PATCH /api/users/:id
router.patch(
	"/:id",
	(req: Request<{ id: string }, {}, UpdateUserBody>, res: Response) => {
		const existing = users.get(req.params.id)
		if (!existing) return res.status(404).json({ error: "User not found" })

		const { name, email } = req.body || {}

		if (name !== undefined && !isNonEmptyString(name)) {
			return res
				.status(400)
				.json({ error: "`name` must be a non-empty string" })
		}
		if (email !== undefined && !isEmail(email)) {
			return res.status(400).json({ error: "`email` is invalid" })
		}
		if (email) {
			for (const u of users.values()) {
				if (
					u.id !== existing.id &&
					u.email.toLowerCase() === email.toLowerCase()
				) {
					return res.status(409).json({ error: "Email already in use" })
				}
			}
		}

		const updated: User = {
			...existing,
			name: name !== undefined ? name.trim() : existing.name,
			email: email !== undefined ? email.trim() : existing.email,
			updatedAt: new Date().toISOString(),
		}

		users.set(updated.id, updated)
		logger.debug({ userId: updated.id }, "User updated")
		res.json(updated)
	}
)

// DELETE /api/users/:id
router.delete("/:id", (req: Request, res: Response) => {
	const ok = users.delete(req.params.id)
	if (!ok) return res.status(404).json({ error: "User not found" })
	logger.debug({ userId: req.params.id }, "User deleted")
	res.status(204).send()
})

export default router
