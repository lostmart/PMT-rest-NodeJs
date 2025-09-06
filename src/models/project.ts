export interface Project {
	id?: any
	projectName: string
	ownerId: number | string
	manager: number | string
	members?: number[]
	description: string
	createdAt: string
	updatedAt: string
}

export interface ProjectResponseDTO {
	id?: number
	projectName: string
	description: string
	members?: number[]
}

export interface CreateProjectResponseDTO {
	projects: ProjectResponseDTO
	message?: string
}

export interface ProjectsListResponseDTO {
	projects: ProjectResponseDTO[]
	count: number
}
