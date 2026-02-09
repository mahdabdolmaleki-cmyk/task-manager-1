import { NextFunction, Request, Response } from 'express'
import UserModel from '../model/user-model'
import { decodeToken, encodeToken } from '../utils/auth'
import TaskModel from '../model/task-model'
import { catchAsync } from '../errors/catch-async'


export const Get_CreateTask = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let currentUser = req.cookies.token
        if (!req.cookies.token) return res.render('login')
        currentUser = decodeToken(currentUser)
        console.log(currentUser.id)
        const user = await UserModel.findById(currentUser.id)
        if (!user) return res.render('login')
        if(user.level === 'junior') return res.render('createTask',{status:'you dont have access to create task'})
        let allUser= await UserModel.find()
        let users = allUser.filter(users => users.name !== user.name);
        if ( user.level === 'midlevel') {
            users = users.filter(users => users.level === 'junior');
        }
        if ( user.level === 'senior') {
            users = users.filter(users => users.level === 'midlevel' || users.level === 'junior');
        }       
        res.render('createTask',{users})
})

export const Post_CreateTask = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let currentUser = req.cookies.token
        currentUser = decodeToken(currentUser)
        const user = await UserModel.findById(currentUser.id)
        if (!user) return res.render('login')
        const data = req.body
        const task = await TaskModel.create({ ...data, userCreatore: currentUser.id })
        let allUser= await UserModel.find()
        const users = allUser.filter(users => users.name !== user.name);
        res.render('createTask', { status: `task ${task.title}created` ,users})
})

export const post_editTask = catchAsync(async (req:Request,res:Response)=>{
    const status = req.body
    const taskId = req.params.id
    await TaskModel.findByIdAndUpdate(taskId,status) 
    res.redirect('/login')
})
