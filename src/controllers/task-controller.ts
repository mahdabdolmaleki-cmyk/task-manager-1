import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../errors/catch-async'
import logger from '../utils/logger'
import { findAllUser } from '../services/user-service'
import { createTask, editStatus, findUserTask } from '../services/task-service'
import { searchTask } from '../services/elastic-service'


export const Get_CreateTask = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.currentUser
    if (!user) {
        logger.warn('user didnt login to see tasks')
        return res.render('login')
    }
    if (user.level === 'junior') {
        logger.warn(`user ${user.name} with junior level try to create task!!!`)
        return res.render('createTask', { status: 'you dont have access to create task' })
    }
    let allUser = await findAllUser()
    let users = allUser.filter(users => users.name !== user.name);
    if (user.level === 'midlevel') {
        users = users.filter(users => users.level === 'junior');
    }
    if (user.level === 'senior') {
        users = users.filter(users => users.level === 'midlevel' || users.level === 'junior');
    }
    res.render('createTask', { users })
})

export const Post_CreateTask = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.currentUser
    if (!currentUser) {
        logger.warn('some one with out loging try to create task')
        return res.render('login')
    }
    const data = req.body
    const task = await createTask(data, currentUser._id.toString())
    let allUser = await findAllUser()
    const users = allUser.filter(users => users.name !== currentUser.name);
    logger.info(`user ${currentUser.name} create task with title: ${task.title}`)
    res.render('createTask', { status: `task ${task.title}created`, users })
})


export const post_search_task = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let { _id } = req.currentUser
    const data = req.body.search
    if (!data) { return res.render('search', { status: 'write some thing to search' }) }
    const result: any = await searchTask(data, _id)
    res.render('search', { tasks: result })


})

export const get_search_task = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.render('search')
})

export const post_editTask = catchAsync(async (req: Request, res: Response) => {
    const currentUser = req.currentUser
    const {status} = req.body
    await editStatus(req.params.id,status,currentUser._id)
    const tasks = await findUserTask(currentUser._id)
    res.render('profile', { user: currentUser, tasks })
})
