import type { RequestHandler } from "express"
import jwt from "jsonwebtoken"
import { userService } from "../services/user.service"
// import assert from "node:assert"; // optional if you want runtime checks

const {
	JWT_SECRET = "",
	JWT_ISS = "your-app",
	JWT_AUD = "your-app-users",
} = process.env

if (!JWT_SECRET) {
	throw new Error("Missing JWT_SECRET")
}


