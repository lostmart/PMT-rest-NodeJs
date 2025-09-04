import { NextFunction, Request, RequestHandler, Response } from "express"
import { logger } from "../utils/logger"
import { ProjectRequestBody } from "../interfaces/project.interface"
// import { z } from "zod"
// / todo add validation add valiudation with zod

export const projectValidation: RequestHandler = (
	req: Request<{}, ProjectRequestBody, ProjectRequestBody>,
	res: Response,
	next: NextFunction
) => {
	logger.info(req.body, "projectValidation middleware")

	// check for empty
	if (!req.body.projectName || req.body.projectName === "")
		return res.status(400).json({ error: "Missing projectName" })
	if (!req.body.description || req.body.description === "")
		return res.status(400).json({ error: "Missing description" })
	return next()
}
