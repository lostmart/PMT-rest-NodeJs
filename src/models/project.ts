export interface Project {
	id?: any
	projectName: string
	ownerId: number | string
	manager: number | string
	description: string
	createdAt: string
	updatedAt: string
}

export interface ProjectResponseDTO {
	id?: number
	projectName: string
	description: string
	members?: number[] | ProjectMember[]
}

export interface CreateProjectResponseDTO {
	projects: ProjectResponseDTO
	message?: string
}

export interface ProjectsListResponseDTO {
	projects: ProjectResponseDTO[]
	count: number
}

export interface ProjectMember {
	userId: number
	email: string
	userName: string
	firstName: string
	lastName: string
	role: string
}

export interface ProjectWithMembers extends Project {
	members: ProjectMember[]
}
