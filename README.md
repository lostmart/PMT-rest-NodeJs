# Project Manager Tool – Backend

[![Docker CI](https://github.com/lostmart/PMT-rest-NodeJs/actions/workflows/docker-ci.yml/badge.svg)](https://github.com/lostmart/PMT-rest-NodeJs/actions/workflows/docker-ci.yml)
![Node.js CI](https://img.shields.io/badge/node-20.x-green)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)

This repository contains the **REST API** for the **Project Manager Tool**.  
It is built with **Node.js**, **TypeScript**, and **Express**.  
Future versions will add **SQLite** for data persistence.

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
npx ts-node scripts/seed.ts
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

## 📜 License

This project is licensed under the ISC License.
