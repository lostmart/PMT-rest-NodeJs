import { app } from "./server"
import { logger } from "./utils/logger"

const PORT = Number(process.env.PORT) || 3000

app.listen(PORT, () => {
	logger.info(`API running on http://localhost:${PORT}/api/health`)
})
