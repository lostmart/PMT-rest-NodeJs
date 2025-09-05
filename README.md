# Project Manager Tool – Backend

### 🚀 Core Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

### 🗄️ Database

![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![better-sqlite3](https://img.shields.io/badge/better--sqlite3-4479A1?style=for-the-badge&logo=sqlite&logoColor=white)

### 🔐 Security & Auth

![bcrypt](https://img.shields.io/badge/bcrypt-363636?style=for-the-badge&logo=keepassxc&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![CORS](https://img.shields.io/badge/CORS-005571?style=for-the-badge&logo=fastify&logoColor=white)

### 🧰 Utilities & Validation

![dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)
![zod](https://img.shields.io/badge/zod-3068B7?style=for-the-badge&logo=typescript&logoColor=white)

### 📊 Logging

![Pino](https://img.shields.io/badge/Pino-FF6600?style=for-the-badge&logo=logstash&logoColor=white)

### 🛠️ Dev Tools

![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=black)
![ts-node](https://img.shields.io/badge/ts--node-3178C6?style=for-the-badge&logo=ts-node&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript&logoColor=white)

### 📦 API & Docs

![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

### ⚙️ CI/CD

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

<!-- Live GitHub Actions Workflow Badges -->

[![Build Status](https://github.com/lostmart/PMT-rest-NodeJs/actions/workflows/ci.yml/badge.svg)](https://github.com/lostmart/PMT-rest-NodeJs/actions/workflows/ci.yml)
[![Tests](https://github.com/lostmart/PMT-rest-NodeJs/actions/workflows/tests.yml/badge.svg)](https://github.com/lostmart/PMT-rest-NodeJs/actions/workflows/tests.yml)

This repository contains the **REST API** for the **Project Manager Tool**.  
It is built with **Node.js**, **TypeScript**, and **Express**.  
**SQLite** for data persistence.

![Node.js CI](https://img.shields.io/badge/node-20.x-green)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)

---

## 🚀 Features

- Health check endpoint (`/api/health`)
- Echo endpoint (`/api/echo`)
- JSON body parsing
- CORS support
- Centralized error handling
- Structured logging with [pino](https://github.com/pinojs/pino)
- Dockerized build & runtime (multi-stage)

---

## 📂 Project Structure

```
├─ data/ # local SQLite files (gitignored: app.db, -wal, -shm)
├─ src/
│ ├─ index.ts             # process bootstrap (reads PORT, starts server)
│ ├─ server.ts            # Express app wiring (middlewares, routes, errors)
│ │
│ ├─ config/              # Configuration & env helpers
│ │
│ ├─ db/
│ │ └─ sqlite.ts          # SQLite connection, pragmas, migrate() (auto-run)
│ │
│ ├─ controllers/
│ │ └─ user.controller.ts # HTTP layer for /api/users (validation, status codes)
│ │
│ ├─ services/
│ │ └─ user.service.ts    # Business logic + SQLite queries, Argon2 hashing
│ │
│ ├─ models/
│ │ ├─ user.ts            # Domain types (User, UserRole)
│ │ └─ user.dto.ts        # Request/response DTOs if needed
│ │
│ ├─ routes/
│ │ ├─ index.ts           # Routes aggregator: mounts /api/*
│ │ ├─ health.ts          # GET /api/health
│ │ ├─ echo.ts            # POST /api/echo
│ │ └─ users.ts           # /api/users CRUD -> controller -> service
│ │
│ └─ utils/
│ ├─ logger.ts            # pino logger (pretty in dev, JSON in prod)
│ ├─ user.mappers.ts      # DTO ↔ domain mapping helpers
│ └─ index.ts             # shared utilities (optional)
│
├─ Dockerfile
├─ .dockerignore
├─ .gitignore
├─ package.json
└─ tsconfig.json
```

## 🛠️ Scripts

| Command                       | Description                           |
| ----------------------------- | ------------------------------------- |
| `npm run dev`                 | Start in dev mode (nodemon + ts-node) |
| `npm run build`               | Compile TypeScript → `dist/`          |
| `npm start`                   | Run compiled JavaScript               |
| `npm run typecheck`           | Type-check without emitting JS        |
| `npx ts-node scripts/seed.ts` | Seeds two users into the db           |

## 🐳 Docker

### Build and run locally

```bash
docker build -t pm-backend .
docker run -p 3000:3000 pm-backend
```

API available at:
👉 http://localhost:3000/api/health

## 📌 Roadmap

- Base REST API with Express + TypeScript
- Logging with pino
- Dockerized build & runtime
- Add SQLite persistence
- Implement Projects, Tasks, Users endpoints
- Authentication & authorization

## 🌱 Seeding Users

To seed the database with initial users, run:

```bash
npx ts-node src/scripts/seed.ts
```

**NOTE:** This ode will automattically run itself if the user's tabe is empty !

This will insert two users into the SQLite database:

```ts
const users = [
	{
		id: randomUUID(),
		email: "admin@example.com",
		password: "admin123", // hased
		userName: "admin",
		firstName: "Alice",
		lastName: "Admin",
		role: "admin",
		createdAt: now,
		updatedAt: now,
	},
	{
		id: randomUUID(),
		email: "guest@example.com",
		password: "guest123", // hased
		userName: "guest",
		firstName: "Gary",
		lastName: "Guest",
		role: "guest",
		createdAt: now,
		updatedAt: now,
	},
]
```

## Request body validation

We validate incoming HTTP bodies with Zod, using the schema as the single source of truth and deriving TypeScript types from it. This avoids duplicating interfaces and prevents type/validation drift.

### Schema & Type

```ts
import { z } from "zod"

/**
 * Canonical request schema for creating a project.
 * - trims strings before length checks
 * - bounds lengths for predictable UX and storage
 * - .strict() rejects unknown properties to surface client bugs early
 */
export const ProjectSchema = z
	.object({
		projectName: z.string().trim().min(3).max(50),
		description: z.string().trim().min(3).max(100),
	})
	.strict()

// Derived static type (no separate interface needed)
export type ProjectRequestBody = z.infer<typeof ProjectSchema>
```

### Middleware

```ts
import { Request, Response, NextFunction, RequestHandler } from "express"
import { ProjectSchema, ProjectRequestBody } from "./project.schema"

/**
 * Validates req.body against ProjectSchema.
 * On success: replaces req.body with the parsed, trimmed, typed object.
 * On failure: responds 422 with field-level details.
 */
export const projectValidation: RequestHandler = (
	req: Request<{}, any, any>,
	res: Response,
	next: NextFunction
) => {
	const result = ProjectSchema.safeParse(req.body)

	if (!result.success) {
		return res.status(422).json({
			error: "Invalid request body",
			details: result.error.issues.map((i) => ({
				path: i.path.join("."),
				message: i.message,
				code: i.code,
			})),
		})
	}

	req.body = result.data as ProjectRequestBody
	return next()
}
```

## 📜 License

This project is licensed under the ISC License.
