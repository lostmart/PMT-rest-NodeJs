export interface User {
	id: string
	name: string
	email: string
	createdAt: string
	updatedAt: string
}

export type CreateUserBody = {
	name: string
	email: string
}

export type UpdateUserBody = Partial<CreateUserBody>
