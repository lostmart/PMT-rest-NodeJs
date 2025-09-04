import { RequestHandler, Response, Request } from "express"
import { projectService } from "../services/projects.service"

import dotenv from "dotenv"
dotenv.config()

interface ProjectRequestBody {
	name: string
	description?: string
	// other project properties
}

interface CreateProjectRequest {
	name: string
	description: string
}

/* ---------- handlers ---------- */

const list: RequestHandler = (_req, res) => {
	return res.json({ projects: projectService.list() })
}

const getProjectById: RequestHandler<{ id: string }> = (req, res) => {
	const project = projectService.getById(req.params.id)
	if (!project) return res.status(404).json({ error: "Project not found" })
	return res.json({ project })
}

const createProject: RequestHandler = (
	req: Request<{}, CreateProjectRequest, ProjectRequestBody>,
	res: Response
) => {
	return res.json({ msg: req.body })
}

export default { list, getProjectById, createProject }
