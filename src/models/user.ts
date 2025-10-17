export type UserRole = "admin" | "collaborator" | "guest"

export interface User {
	id?: string // UUID string in backend (OK: FE accepts number|string)
	email: string
	password: string
	userName: string
	firstName: string
	lastName: string
	role: UserRole
	createdAt: string
	updatedAt: string
}

export type CreateUserBody = Pick<
	User,
	"email" | "userName" | "firstName" | "lastName" | "role" | "password"
>
export type UpdateUserBody = Partial<CreateUserBody>
