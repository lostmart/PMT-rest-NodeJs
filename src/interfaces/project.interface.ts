import { z } from "zod"

// type based on zod validation

export const ProjectSchema = z
	.object({
		projectName: z.string().trim().min(3).max(50),
		description: z.string().trim().min(3).max(100),
	})
	.strict() // reject unknown props

// derive the type from schema
export type ProjectRequestBody = z.infer<typeof ProjectSchema>

export interface CreateProjectRequest {
	projectName: string
	description: string
}
