import express from "express";
import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../utils/auth";
import UserModel from "../model/user-model";
import TaskModel from "../model/task-model";
import { catchAsync } from "../errors/catch-async";

const app = express()
app.use(express.json())
app.use(express.urlencoded())

export const jwtAuthMiddleware = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {   
    let token = req.cookies.token
    if(!token){ return next()}
    const data : any = decodeToken(token)
    const id : string = data.id
    const user = await UserModel.findById(id)
    if(!user){
        console.log("cant find user")
        next()
    }
    const tasks = await TaskModel.find({forUser:id})
    res.render('profile',{user,tasks})
    } catch (err:any) {
        res.status(500).send({message:"server error"})        
    }
})



