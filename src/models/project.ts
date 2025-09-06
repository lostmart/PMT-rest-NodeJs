export interface Project {
	id?: any
	projectName: string
	ownerId: string
	manager: string
	members?: string[]
	description: string
	createdAt: string
	updatedAt: string
}

export interface ProjectResponseDTO {
	id?: number
	projectName: string
	description: string
	members?: string[]
}

export interface CreateProjectResponseDTO {
	projects: ProjectResponseDTO
	message?: string
}

export interface ProjectsListResponseDTO {
	projects: ProjectResponseDTO[]
	count: number
}
