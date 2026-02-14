import express from "express";
import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../utils/auth";
import UserModel from "../model/user-model";
import { TaskModel } from "../model/task-model";
import { catchAsync } from "../errors/catch-async";
import logger from "../utils/logger";
import { findUserTask } from "../services/task-service";
import { findUser } from "../services/user-service";

declare global {
    namespace Express {
        interface Request {
            currentUser: any
            usersTask: any
        }
    }
}

const app = express()
app.use(express.json())
app.use(express.urlencoded())

export const jwtAuthMiddleware = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let token = req.cookies.token
        if (!token) { return res.render('login') }
        const data: any = decodeToken(token)
        const id: any = data.id
        const user = await findUser(id)
        if (!user) { return res.render('login') }
        const tasks = await findUserTask(id)
        req.currentUser = user
        req.usersTask = tasks
        next()
})



