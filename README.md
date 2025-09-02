# Project Manager Tool – Backend

[![Docker CI](https://github.com/lostmart/PMT-rest-NodeJs/actions/workflows/docker-ci.yml/badge.svg)](https://github.com/lostmart/rest-api-nodeJs/actions/workflows/docker-ci.yml)
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
src/
├─ index.ts # starts the server
├─ server.ts # app setup (middlewares, routes, error handling)
├─ routes/ # API routes
│ ├─ index.ts
│ ├─ health.ts
│ └─ echo.ts
└─ utils/ # utilities
└─ logger.ts
```

## 🛠️ Scripts

| Command             | Description                           |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Start in dev mode (nodemon + ts-node) |
| `npm run build`     | Compile TypeScript → `dist/`          |
| `npm start`         | Run compiled JavaScript               |
| `npm run typecheck` | Type-check without emitting JS        |

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

## 📜 License

This project is licensed under the ISC License.
