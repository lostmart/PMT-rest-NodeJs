// scripts/seed.ts
import db from "../src/db"
import { seedFixedUsers } from "../src/db/seed"

seedFixedUsers(db())
