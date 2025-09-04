export interface ProjectRequestBody {
	projectName: string
	description?: string
	// other project properties
}

export interface CreateProjectRequest {
	projectName: string
	description: string
}
