// // scripts/seed.ts
import db from "../db"
import { seedFixedUsers } from "../db/seed"
// import { seedProjects, seedProjectMembers } from "../db/projects.seed"

import { logger } from "../utils/logger"

const initSeeding = async () => {
	logger.info(
		{ message: "running seed.ts" },
		"All seeding should be completed!"
	)
	seedFixedUsers(db()) // Users first
}
// // Seed in the correct order
// seedProjects(db())   // Projects second (this creates projects)
// seedProjectMembers(db()) // Members last (this assigns members to projects)

// console.log("✅ All seeding completed!")

export default initSeeding
