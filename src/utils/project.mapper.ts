import { Project, ProjectsListResponseDTO } from "../models/project"
import { ProjectResponseDTO } from "../models/project"

export const toProjectDTO = (project: Project): ProjectResponseDTO => {
	return {
		id: project.id,
		projectName: project.projectName,
		members: project.members,
		description: project.description,
	}
}

export const toProjectsListResponseDTO = (
	projects: Project[]
): ProjectsListResponseDTO => {
	return {
		projects: projects.map(toProjectDTO),
		count: projects.length,
	}
}
