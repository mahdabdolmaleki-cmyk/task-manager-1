import { Request, Response } from 'express'
import UserModel from '../model/user-model'
import UserDto from '../dto/userDto'
import { decodeToken, encodeToken } from '../utils/auth'
import { catchAsync } from '../errors/catch-async'
import logger from '../utils/logger'
import { deeleteUser, editProfile, findUser, loginUser, registerUser } from '../services/user-service'
import { findUserTask } from '../services/task-service'



export const profile = catchAsync(async (req: Request, res: Response) => {
    res.render('profile', { tasks: req.usersTask, user: req.currentUser })
})

export const loginPage = catchAsync(async (req: Request, res: Response) => {
    res.render('login')
})

export const registerPage = catchAsync(async (req: Request, res: Response) => {
    res.render('register')
})

export const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body
    const { user, status } = await loginUser(email, password)
    if (!status) { return res.render('login', { error: 'invalid credential' }) }
    const token = encodeToken({ id: user!._id })
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 })
    const tasks = await findUserTask(user!._id)
    logger.info(`user ${user!.name} loged in`)
    res.render('profile', { user, tasks })
})

export const logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie('token')
    res.render('index')
})

export const edit_user = catchAsync(async (req: Request, res: Response) => {
    let currentUser = req.currentUser
    const user = await findUser(currentUser._id)
    if (!user) {
        logger.warn(`user dont loged in`)
        return res.render('login', { error: "please login" })
    }
    res.render('editProfile', { user })
})

export const register = catchAsync(async (req: Request, res: Response) => {
    const data: UserDto = req.body
    const { user, status } = await registerUser(data)
    if (!status) { res.render('register', { err: "the email is already existed !!!!" }) }
    logger.info(`user ${data.name} signed up `)
    res.render('login', { status: "user created" })
})

export const updateUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
    const userId = req.currentUser._id
    const { user, status } = await editProfile(id, req.body, userId)
    if (!status) { return res.render('login') }
    logger.info('user edit his/her profile')
    const tasks = await findUserTask(req.currentUser._id)
    res.render('profile', { user, tasks })
})

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
    const {user , status}=await deeleteUser(id,req.currentUser._id)
    logger.info(`user ${user!.name} delete`)
    res.render('index', { status: "user deleted" })
})

