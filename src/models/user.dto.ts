import { UserRole } from "./user"

export interface UserResponseDTO {
	email: string
	userName: string
	role: UserRole
}

export interface CreateUserResponseDTO {
	user: UserResponseDTO
	message?: string
}

export interface UsersListResponseDTO {
	users: UserResponseDTO[]
	count: number
}
