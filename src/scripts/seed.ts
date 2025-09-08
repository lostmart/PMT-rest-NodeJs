// // scripts/seed.ts
import db from "../db"
import { seedProjectMembers, seedProjects } from "../db/projects.seed"
import { seedFixedUsers } from "../db/seed"
// import { seedProjects, seedProjectMembers } from "../db/projects.seed"

import { logger } from "../utils/logger"

const initSeeding = async () => {
	await seedFixedUsers(db()) // Users first
	await seedProjects(db()) // Projects second (this creates projects)
	await seedProjectMembers(db()) // Members last (this assigns members to projects)
	logger.info(
		{ message: "running seed.ts" },
		"All seeding should be completed!"
	)
}

export default initSeeding
