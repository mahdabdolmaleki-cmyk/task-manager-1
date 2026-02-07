import { NextFunction, Request, Response } from 'express'
import UserModel from '../model/user-model'
import { decodeToken, encodeToken } from '../utils/auth'
import TaskModel from '../model/task-model'


export const Get_CreateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let currentUser = req.cookies.token
        if (!req.cookies.token) return res.render('login')
        currentUser = decodeToken(currentUser)
        console.log(currentUser.id)
        const user = await UserModel.findById(currentUser.id)
        if (!user) return res.render('login')
        let allUser= await UserModel.find()
        const users = allUser.filter(users => users.name !== user.name);
        console.log(users)
        res.render('createTask',{users})
    } catch (err: any) {
        res.send(err)
    }
}

export const Post_CreateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let currentUser = req.cookies.token
        currentUser = decodeToken(currentUser)
        const user = await UserModel.findById(currentUser.id)
        if (!user) return res.render('login')
        const data = req.body
        const task = await TaskModel.create({ ...data, userCreatore: currentUser.id })
        let allUser= await UserModel.find()
        const users = allUser.filter(users => users.name !== user.name);
        res.render('createTask', { status: `task ${task.title}created` ,users})
    } catch (err: any) {
        console.log(req.body)
        res.send(err)
    }
}

export const post_editTask = async (req:Request,res:Response)=>{
    const status = req.body
    const taskId = req.params.id
    await TaskModel.findByIdAndUpdate(taskId,status) 
    res.redirect('/login')
}
