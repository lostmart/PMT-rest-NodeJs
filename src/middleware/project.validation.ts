import { NextFunction, Request, RequestHandler, Response } from "express"
import {
	ProjectRequestBody,
	ProjectSchema,
} from "../interfaces/project.interface"

export const projectValidation: RequestHandler = (
	req: Request<{}, any, any>,
	res: Response,
	next: NextFunction
) => {
	const result = ProjectSchema.safeParse(req.body)

	if (!result.success) {
		return res.status(422).json({
			error: "Invalid request body",
			details: result.error.issues.map((i) => ({
				path: i.path.join("."),
				message: i.message,
				code: i.code,
			})),
		})
	}

	// overwrite body with validated & typed data
	req.body = result.data as ProjectRequestBody

	return next()
}
