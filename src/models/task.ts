export type StatusType = "todo" | "in_progress" | "done"

export interface Task {
	id?: number
	title: string
	description: string
	projectId: number
	assignedTo?: number
	status: StatusType
	createdAt: string
	updatedAt: string
}
