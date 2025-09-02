import { User } from "../models/user"
import { UserResponseDTO, UsersListResponseDTO } from "../models/user.dto"

export const toUserResponseDTO = (user: User): UserResponseDTO => {
	return {
		email: user.email,
		userName: user.userName,
		role: user.role,
	}
}

export const toUsersListResponseDTO = (users: User[]): UsersListResponseDTO => {
	return {
		users: users.map(toUserResponseDTO),
		count: users.length,
	}
}
