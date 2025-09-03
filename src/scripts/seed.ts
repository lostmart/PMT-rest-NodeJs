// scripts/seed.ts
import db from "../db"
import { seedFixedUsers } from "../db/seed"

seedFixedUsers(db())
