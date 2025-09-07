import { app } from "./server"
import { logger } from "./utils/logger"

import dotenv from "dotenv"

// Load environment variables FIRST
dotenv.config()

// Initialize DB and run migrations FIRST
import initializeDB from "./db"
const db = initializeDB()

// Then seed users
import { seedFixedUsers } from "./db/seed"
seedFixedUsers(db)

// Then seed projects
import { seedProjects } from "./db/projects.seed"
seedProjects(db) // This will now also seed members

const PORT = Number(process.env.PORT) || 3000

app.listen(PORT, () => {
	logger.info(`API running on http://localhost:${PORT}/api/health`)
})
