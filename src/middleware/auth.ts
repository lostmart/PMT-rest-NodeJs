import jwt from "jsonwebtoken"
import { NextFunction, Request, Response, RequestHandler } from "express"
import { logger } from "../utils/logger"
import { User } from "../models/user"

interface JwtPayload {
	id: string
	email: string
	role: string
	iat?: number
	exp?: number
	// other JWT standard claims as needed
}

// Extend the Request interface to include user property
declare global {
	namespace Express {
		interface Request {
			user?: User
		}
	}
}

export const authMiddleware: RequestHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization
	if (!authHeader) {
		return res.status(401).json({ error: "Unauthorized" })
	}

	const token = authHeader.split(" ")[1]
	if (!token) {
		return res.status(401).json({ error: "Unauthorized" })
	}

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as JwtPayload

		// Check if decoded is a valid JWT payload with required properties
		if (typeof decoded === "string" || !decoded) {
			return res.status(401).json({ error: "Unauthorized" })
		}

		// Type assertion to ensure we have the expected structure
		const userPayload = decoded as { [key: string]: any }

		logger.debug(userPayload)

		if (!userPayload.role || !userPayload.email || !userPayload.id) {
			return res.status(401).json({ error: "Unauthorized" })
		}

		// Assign the decoded user data to req.user
		req.user = {
			id: userPayload.id,
			email: userPayload.email,
			role: userPayload.role,
			// Add other properties from your User model as needed
			...userPayload,
		} as User

		return next()
	} catch (e) {
		logger.error(e)
		return res.status(401).json({ error: "Unauthorized" })
	}
}
