import { RequestHandler } from "express"
import { userService } from "../services/user.service"
import { logger } from "../utils/logger"
import { CreateUserBody, UpdateUserBody, UserRole } from "../models/user"

const allowedRoles: readonly UserRole[] = [
	"admin",
	"collaborator",
	"guest",
] as const

const isEmail = (e: unknown): e is string =>
	typeof e === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
const isNonEmptyString = (s: unknown): s is string =>
	typeof s === "string" && s.trim().length > 0

/* ---------- handlers ---------- */

const list: RequestHandler = (_req, res) => {
	res.json({ users: userService.list() })
}

const getById: RequestHandler<{ id: string }> = (req, res) => {
	const u = userService.get(req.params.id)
	if (!u) return res.status(404).json({ error: "User not found" })
	res.json(u)
}

const create: RequestHandler<{}, any, CreateUserBody> = (req, res) => {
	const { userName, email, firstName, lastName, role, password } =
		req.body || ({} as CreateUserBody)

	if (!isNonEmptyString(userName))
		return res
			.status(400)
			.json({ error: "`userName` is required (non-empty string)" })
	if (!isEmail(email))
		return res.status(400).json({ error: "`email` is invalid" })
	if (!isNonEmptyString(firstName))
		return res
			.status(400)
			.json({ error: "`firstName` is required (non-empty string)" })
	if (!isNonEmptyString(lastName))
		return res
			.status(400)
			.json({ error: "`lastName` is required (non-empty string)" })
	if (!allowedRoles.includes(role as UserRole))
		return res
			.status(400)
			.json({ error: "`role` must be one of: admin | collaborator | guest" })

	if (userService.emailInUse(email))
		return res.status(409).json({ error: "Email already in use" })
	if (userService.userNameInUse(userName))
		return res.status(409).json({ error: "userName already in use" })

	try {
		const user = userService.create({
			userName,
			email,
			firstName,
			lastName,
			password,
			role: role as UserRole,
		})
		logger.debug({ userId: user.id }, "User created")
		return res.status(201).json(user)
	} catch (e: any) {
		if (e?.message === "UNIQUE_VIOLATION")
			return res.status(409).json({ error: "Email or userName already in use" })
		if (e?.message === "INVALID_ROLE")
			return res
				.status(400)
				.json({ error: "`role` must be one of: admin | collaborator | guest" })
		logger.error({ err: e }, "Create user failed")
		return res.status(500).json({ error: "Internal Server Error" })
	}
}

const update: RequestHandler<{ id: string }, any, UpdateUserBody> = (
	req,
	res
) => {
	const { email, userName, firstName, lastName, role } = req.body || {}

	if (email !== undefined && !isEmail(email))
		return res.status(400).json({ error: "`email` is invalid" })
	if (userName !== undefined && !isNonEmptyString(userName))
		return res
			.status(400)
			.json({ error: "`userName` must be a non-empty string" })
	if (firstName !== undefined && !isNonEmptyString(firstName))
		return res
			.status(400)
			.json({ error: "`firstName` must be a non-empty string" })
	if (lastName !== undefined && !isNonEmptyString(lastName))
		return res
			.status(400)
			.json({ error: "`lastName` must be a non-empty string" })
	if (role !== undefined && !allowedRoles.includes(role as UserRole))
		return res
			.status(400)
			.json({ error: "`role` must be one of: admin | collaborator | guest" })

	if (email && userService.emailInUse(email, req.params.id))
		return res.status(409).json({ error: "Email already in use" })
	if (userName && userService.userNameInUse(userName, req.params.id))
		return res.status(409).json({ error: "userName already in use" })

	try {
		const updated = userService.update(req.params.id, {
			email,
			userName,
			firstName,
			lastName,
			role: role as UserRole | undefined,
		})
		if (!updated) return res.status(404).json({ error: "User not found" })
		return res.json(updated)
	} catch (e: any) {
		if (e?.message === "UNIQUE_VIOLATION")
			return res.status(409).json({ error: "Email or userName already in use" })
		if (e?.message === "INVALID_ROLE")
			return res
				.status(400)
				.json({ error: "`role` must be one of: admin | collaborator | guest" })
		return res.status(500).json({ error: "Internal Server Error" })
	}
}

const remove: RequestHandler<{ id: string }> = (req, res) => {
	const ok = userService.remove(req.params.id)
	if (!ok) return res.status(404).json({ error: "User not found" })
	return res.status(204).send()
}

/* named exports (optional) */
export { list, getById, create, update, remove }

/* default export so your current import works */
export default { list, getById, create, update, remove }
