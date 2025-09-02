// controllers/user.controller.ts
import { RequestHandler } from "express"
import { userService } from "../services/user.service"
import { logger } from "../utils/logger"
import { CreateUserBody, UpdateUserBody, UserRole, User } from "../models/user"
import {
	UserResponseDTO,
	CreateUserResponseDTO,
	UsersListResponseDTO,
} from "../models/user.dto"
import { toUserResponseDTO, toUsersListResponseDTO } from "../utils/user.mappers"

const allowedRoles: readonly UserRole[] = [
	"admin",
	"collaborator",
	"guest",
] as const

const isEmail = (e: unknown): e is string =>
	typeof e === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
const isNonEmptyString = (s: unknown): s is string =>
	typeof s === "string" && s.trim().length > 0
const isValidPassword = (p: unknown): p is string =>
	typeof p === "string" && p.length >= 8

/* ---------- handlers ---------- */

const list: RequestHandler = (_req, res) => {
	const users = userService.list()
	const response: UsersListResponseDTO = toUsersListResponseDTO(users)
	res.json(response)
}

const getById: RequestHandler<{ id: string }> = (req, res) => {
	const user = userService.get(req.params.id)
	if (!user) return res.status(404).json({ error: "User not found" })

	const response: UserResponseDTO = toUserResponseDTO(user)
	res.json(response)
}

const create: RequestHandler<{}, any, CreateUserBody> = async (req, res) => {
	const { userName, email, firstName, lastName, password, role } =
		req.body || ({} as CreateUserBody)

	logger.debug({ userName, email, firstName, lastName, password, role })

	// Validate and set the role
	let userRole: UserRole
	if (role && allowedRoles.includes(role as UserRole)) {
		userRole = role as UserRole
	} else if (role) {
		return res.status(400).json({
			error: "`role` must be one of: admin | collaborator | guest",
		})
	} else {
		userRole = "guest"
	}

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
	if (!isValidPassword(password))
		return res
			.status(400)
			.json({ error: "`password` must be at least 8 characters" })

	if (userService.emailInUse(email))
		return res.status(409).json({ error: "Email already in use" })
	if (userService.userNameInUse(userName))
		return res.status(409).json({ error: "userName already in use" })

	try {
		const hashedPassword = await userService.hashPassword(password)
		const user = await userService.create({
			userName,
			email,
			firstName,
			lastName,
			password: hashedPassword,
			role: userRole,
		})

		const response: CreateUserResponseDTO = {
			user: toUserResponseDTO(user),
			message: "User created successfully",
		}

		logger.debug({ user: response.user }, "User created")
		return res.status(201).json(response)
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

const update: RequestHandler<{ id: string }, any, UpdateUserBody> = async (
	req,
	res
) => {
	const { email, userName, firstName, lastName, role, password } =
		req.body || {}

	// Validate and set the role if provided
	let userRole: UserRole | undefined
	if (role) {
		if (allowedRoles.includes(role as UserRole)) {
			userRole = role as UserRole
		} else {
			return res.status(400).json({
				error: "`role` must be one of: admin | collaborator | guest",
			})
		}
	}

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
	if (password !== undefined && !isValidPassword(password))
		return res
			.status(400)
			.json({ error: "`password` must be at least 8 characters" })

	if (email && userService.emailInUse(email, req.params.id))
		return res.status(409).json({ error: "Email already in use" })
	if (userName && userService.userNameInUse(userName, req.params.id))
		return res.status(409).json({ error: "userName already in use" })

	try {
		let updateData: any = {
			email,
			userName,
			firstName,
			lastName,
			role: userRole,
		}

		if (password) {
			updateData.password = await userService.hashPassword(password)
		}

		const updated = userService.update(req.params.id, updateData)
		if (!updated) return res.status(404).json({ error: "User not found" })

		const response: UserResponseDTO = toUserResponseDTO(updated)
		return res.json(response)
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

export { list, getById, create, update, remove }
export default { list, getById, create, update, remove }
