import Database from "better-sqlite3"
import fs from "fs"
import path from "path"

import dotenv from "dotenv"
dotenv.config()
import { runMigrations } from "./migrate"

const isProd = process.env.NODE_ENV === "production"
const DB_PATH = isProd ? "/app/data/db.sqlite" : "./data/dev.sqlite"

const dir = path.dirname(DB_PATH)
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

const db = new Database(DB_PATH, {
	verbose: !isProd ? console.log : undefined,
})

// ⬇️ Apply all non-applied migrations
runMigrations(db)

export default db
