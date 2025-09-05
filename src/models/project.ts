export interface Project {
	id: string
	projectName: string
	ownerId: string
	manager: string
	members?: string[]
	description: string
	createdAt: string
	updatedAt: string
}
