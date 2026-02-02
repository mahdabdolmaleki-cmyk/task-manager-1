# 🛠 task manager

A backend automation system built with **Express**, **TypeScript**, and **MongoDB**.  
This app allows users to create tasks, update their status, and ensures that **users can only view their own tasks**.

## 📂 Project Structure

- automation-app/
  - src/
    - schemas/
    - users/
    - tasks/
    - middlewares/
    - index.ts
  - package.json
  - tsconfig.json
  - .env



## 📜 package.json Scripts
- dev → Runs the app in development mode with live reload (nodemon).
- build → Compiles TypeScript files into JavaScript (dist folder).
- start → Runs the compiled app from the dist folder.
- test → Placeholder for future test scripts.

## 🚀 API Routes for user
-GET /user - show all users
-PUT /user/:id - update user by id
-DELETE /user/:id - delete user by id

## ✅ Task Routes
- GET /tasks – Get tasks 
- POST /tasks – Create a new task
- PUT /tasks/:id – Update a task
- DELETE /tasks/:id – Delete a task

## 🔐 Auth Routes
- POST /user/register – Register a new user
- POST /user/auth/login – Login and show user tasks


## 📄 License
This project is open-source and free to use.
