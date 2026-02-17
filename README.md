# Task Manager (Express + TypeScript + MongoDB)
# Task Manager

---

This project is a **Task Manager REST API** built with **Node.js, Express, TypeScript, and MongoDB and ElasticSearch**. It follows a clean, scalable, and production-ready architecture including JWT authentication, oAith2, simple authorization, request validation, centralized error handling, save all logs, and layered separation of concerns.

---

## Features

- Server: Express (TypeScript)
- Views: EJS templates for UI
- Database: MongoDB with Mongoose models for `User` and `Task`
- Search: Elasticsearch index (`task`) kept in sync via Mongoose middleware
- Auth: local email/password + GitHub OAuth (passport-github2)
- Session support with `express-session` and cookie-based JWT for rendering authenticated profile

---

## Requirements

- Node.js (>=16)
- npm or yarn
- MongoDB (running and accessible)
- Elasticsearch (running at `http://localhost:9200` or change config)

---

## 📁 Project Structure

```
src/
|
├── config/
│   ├── elastic.ts
│   └── passport.ts
|
├── controllers/
│   ├─ github-controller.ts
│   ├─ task-controller.ts
│   └─ user-controller.ts
|
├── dto/
│   ├── createTaskDto.ts
│   ├── registerDto.ts
│   └── userDto.ts
|
├── errors/
│   ├── app-error.ts
│   └── catch-async.ts
|
├── middlewares/
│   ├── error-handler.ts
│   ├── jwtAuth.ts
│   ├── validation.ts
│
├── model/
│   ├── task-model.ts
│   └── user-model.ts
│
├── public/
│   └── styles.css
|
├── routes/
│   ├── task-routes.ts
│   └── user-routes.ts
│
├── utils/
│   ├── auth.ts
│   ├── logger.ts
│   └── sync-helper.ts
│
├── views/
│   ├── createTask.ejs
│   ├── editProfile.ejs
│   ├── error.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   ├── register.ejs
│   └── search.ejs
│
├── services/
│   ├── elastic-service.ts
│   ├── task-service.ts
│   └── user-service.ts
|
├── utils/
│   ├── auth.ts
│   └── swagger.ts
│
├── index.ts
├── tsconfig.json
└── package.json
```

---

## Environment variables

Create a `.env` file at the project root (or supply env vars in your environment) with the following values:

- `DB_URL` — MongoDB connection string (e.g. `mongodb://localhost:27017/task-manager`)
- `PORT` — optional, default `5500`
- `SECRET` — JWT secret used by `src/utils/auth.ts`
- `SESSION_SECRET` — session secret used by `express-session`
- `GITHUB_CLIENT_ID` — GitHub OAuth app client id (optional)
- `GITHUB_CLIENT_SECRET` — GitHub OAuth app client secret (optional)
- `GITHUB_CALLBACK_URL` — callback url for GitHub OAuth (defaults to `http://localhost:5500/user/auth/github/callback`)

Example `.env` (do not commit secrets):

```env
DB_URL=mongodb://localhost:27017/task-manager
PORT=5500
SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
GITHUB_CLIENT_ID=your_github_id
GITHUB_CLIENT_SECRET=your_github_secret
GITHUB_CALLBACK_URL=http://localhost:5500/user/auth/github/callback
```

---

## Install

```bash
npm install
```

---

## Development

- Start in development mode (uses `nodemon` to run TypeScript directly):

```bash
npm run dev
```

- Build and run production bundle:

```bash
npm run build
npm run start
```

---

## Important implementation notes

- The app expects MongoDB reachable at `DB_URL` and will connect on startup.
- Elasticsearch is configured in `src/config/elastic.ts`. By default it connects to `http://localhost:9200`.
- Task documents are indexed/updated/deleted in Elasticsearch via Mongoose post hooks in `src/model/task-model.ts`.
- Authentication:
	- Local login/register uses `POST /user/register` and `POST /user/login`.
	- GitHub OAuth is exposed via `GET /user/auth/github` and `GET /user/auth/github/callback`.
	- JWT tokens are set as HTTP-only cookie `token` on successful login.

---

## API (overview)

- Public pages:
	- `GET /` — home page
	- `GET /login` — login page
	- `GET /register` — register page

- User routes (`src/routes/user-route.ts`):
	- `POST /user/register` — register user
	- `POST /user/login` — login user
	- `GET /user/edit-profile` — edit profile page
	- `POST /user/:id` — update user
	- `DELETE /user/:id` — delete user
	- `GET /user/auth/github` — GitHub OAuth start
	- `GET /user/auth/github/callback` — GitHub OAuth callback

- Task routes (`src/routes/task-routes.ts`):
	- `GET /task/create` — create task page
	- `POST /task/create` — create task
	- `GET /task/search` — search page
	- `POST /task/search` — search tasks (Elasticsearch)
	- `POST /task/:id` — update task (status)

---

## Project structure (notable files)

- `src/index.ts` — app entry, Express setup, session, passport, Mongoose connect
- `src/config` — GitHub OAuth strategy & Elasticsearch client
- `src/model` — `user-model.ts`, `task-model.ts` (includes ES sync hooks)
- `src/controllers` — response
- `src/services` — business logics
- `src/routes` — route handlers
- `src/middlewares` — error handler, JWT/session middleware and validations
- `src/views` — EJS templates
- `src/utils` — encode/decode token , log config , sync elastic with mongo

---

## Elasticsearch

- Default config connects to `http://localhost:9200`. Ensure Elasticsearch is running and reachable.
- The `task` index is written automatically by the app when tasks are created/updated/deleted. If you need to create mappings or reindex, handle that from your ES admin tools.

---

## 👨‍💻 Ideal Use Cases

* Backend portfolio project
* Learning Express with TypeScript

---

## 📄 License

This project is open-source and free to use.
---
## ❤️ Support

If you find this project useful, please give it a ⭐ on GitHub!