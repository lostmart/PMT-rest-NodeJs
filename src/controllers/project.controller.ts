import { RequestHandler, Response, Request } from "express"
import { projectService } from "../services/projects.service"
import { CreateProjectRequest } from "../interfaces/project.interface"

import dotenv from "dotenv"
import { logger } from "../utils/logger"
import { CreateProjectResponseDTO, Project } from "../models/project"
import { toProjectDTO } from "../utils/project.mapper"
import { userService } from "../services/user.service"
dotenv.config()

/* ---------- handlers ---------- */

const list: RequestHandler = (_req, res) => {
	return res.json({ projects: projectService.list() })
}

const getProjectById: RequestHandler<{ id: string }> = (req, res) => {
	const project = projectService.getById(req.params.id)
	if (!project) return res.status(404).json({ error: "Project not found" })
	return res.json({ project })
}

const createProject: RequestHandler = async (
	req: Request<{}, CreateProjectRequest, any>,
	res: Response
) => {
	try {
		const { projectName, description } = req.body
		const userId = req.user?.id

		if (!userId) {
			return res.status(401).json({ error: "Unauthorized" })
		}
		const newProject = await projectService.createProject({
			projectName,
			description,
			ownerId: userId,
			manager: userId,
		} as Project)
		const response: CreateProjectResponseDTO = {
			projects: toProjectDTO(newProject),
			message: "User created successfully",
		}
		return res.status(201).json(response)
	} catch (error: any) {
		logger.error({ error, body: req.body }, "Failed to create project")

		if (error.message === "UNIQUE_VIOLATION") {
			return res.status(409).json({
				error: "Project already exists",
				details: "A project with this name already exists",
			})
		}

		if (error.message === "INVALID_ROLE") {
			return res.status(400).json({
				error: "Invalid role specified",
				details: "Please check the role value",
			})
		}

		return res.status(500).json({
			error: "Internal server error",
			details: "Failed to create project",
		})
	}
}

const updateProject: RequestHandler<{ id: string }> = (req, res) => {
	const project = projectService.getById(req.params.id)
	if (!project) return res.status(404).json({ error: "Project not found" })
	// gets the manager's userName based on its id
	const managerFromDB = userService.get(project.manager)
	const newData = {
		manager: managerFromDB?.userName,
		projectName: req.body.projectName,
		description: req.body.description,
	}
	const result = projectService.updateProject(req.params.id, newData as Project)
	if (!result) return res.status(404).json({ error: "Error updating project" })
	const updatedProject = projectService.getById(req.params.id)
	if (!updatedProject)
		return res
			.status(404)
			.json({ error: "Error updating ... project not found ?!?!" })
	// removes unwanted fields
	const { ownerId, createdAt, updatedAt, ...cleanProject } = updatedProject
	//const manager = userService.getPoject
	return res.json({
		message: "Project updated successfully",
		project: cleanProject,
	})
}

const deleteProject: RequestHandler<{ id: string }> = (req, res) => {
	const project = projectService.getById(req.params.id)

	if (!project) return res.status(404).json({ error: "Project not found" })
	const deleteProject = projectService.deleteProject(req.params.id)
	if (!deleteProject)
		return res.status(404).json({ error: "Error deleting project" })
	return res.json({ message: "Project deleted successfully" })
}

export default {
	list,
	getProjectById,
	createProject,
	deleteProject,
	updateProject,
}
