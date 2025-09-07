import {
	Project,
	ProjectsListResponseDTO,
	ProjectWithMembers,
	ProjectResponseDTO,
} from "../models/project"

// Type guard for better type safety
const isProjectWithMembers = (project: any): project is ProjectWithMembers => {
	return "members" in project && Array.isArray(project.members)
}

export const toProjectDTO = (
	project: Project | ProjectWithMembers
): ProjectResponseDTO => {
	const baseDTO = {
		id: project.id,
		projectName: project.projectName,
		description: project.description,
	}

	// Using type guard
	if (isProjectWithMembers(project)) {
		return {
			...baseDTO,
			members: project.members,
		}
	}

	return {
		...baseDTO,
		members: [],
	}
}

export const toProjectsListResponseDTO = (
	projects: (Project | ProjectWithMembers)[]
): ProjectsListResponseDTO => {
	return {
		projects: projects.map(toProjectDTO),
		count: projects.length,
	}
}
