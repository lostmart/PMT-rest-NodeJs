// // scripts/seed.ts
// import db from "../db"
// import { seedFixedUsers } from "../db/seed"
// import { seedProjects, seedProjectMembers } from "../db/projects.seed"

import { logger } from "../utils/logger"

// // Seed in the correct order
// seedFixedUsers(db()) // Users first
// seedProjects(db())   // Projects second (this creates projects)
// seedProjectMembers(db()) // Members last (this assigns members to projects)

// console.log("✅ All seeding completed!")

logger.info({ message: "running seed.ts" }, "All seeding should be completed!")
