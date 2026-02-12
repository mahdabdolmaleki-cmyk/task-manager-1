import { Request, Response } from 'express'
import UserModel from '../model/user-model'
import UserDto from '../dto/userDto'
import bcrypt from 'bcrypt'
import { decodeToken, encodeToken } from '../utils/auth'
import { TaskModel } from '../model/task-model'
import { catchAsync } from '../errors/catch-async'
import logger from '../utils/logger'

export const login = catchAsync(async (req: Request, res: Response) => {
    const data = req.body
    const find = await UserModel.findOne({ email: data.email })
    if (!find) {
        logger.warn(`invalid credential data: ${data}`)
        return res.render('login', { error: "wrong email or password" })
    }
    const match = await bcrypt.compare(data.password, find.password as string)
    if (!match) {
        logger.warn(`invalid credential data: ${data}`)
        return res.render('login', { error: "wrong email or password" })
    }
    const tasks = await TaskModel.find({ forUser: find._id })
    const token = encodeToken({ id: find._id })
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 })
    logger.info(`user ${find.name} loged in`)
    res.render('profile', { user: find, tasks })
})

export const edit_user = catchAsync(async (req: Request, res: Response) => {
    let currentUser = req.cookies.token
    currentUser = decodeToken(currentUser)
    const user = await UserModel.findById(currentUser.id)
    if (!user) {
        logger.warn(`user dont loged in`)
        return res.render('login', { error: "please login" })
    }
    res.render('editProfile', { user })
})

export const register = catchAsync(async (req: Request, res: Response) => {
    const data: UserDto = req.body
    const find = await UserModel.findOne({ email: data.email })
    if (!find) {
        const hashedPassword = await bcrypt.hash(data.password, 10)
        await UserModel.create({ ...data, password: hashedPassword })
        logger.info(`user ${data.name} signed up `)
        res.render('login', { status: "user created" })
    } else {
        logger.warn(`user ${find.name} try to register`)
        res.render('register', { err: "the email is already existed !!!!" })
    }
})

export const updateUser = catchAsync(async (req: Request, res: Response) => {
    const id: string = req.params.id
    let { name, family, email, level } = req.body
    let data: any = {}
    if (name !== '') data.name = name
    if (family !== '') data.family = family
    if (email !== '') data.email = email
    if (level !== '') data.level = level
    const user = await UserModel.findByIdAndUpdate(id, data, { new: true })
    logger.info(`user ${name} change his/her details`)
    res.render('editProfile', { user })
})

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const id: string = req.params.id
    let currentUser = req.cookies.token
    currentUser = decodeToken(currentUser)
    currentUser = await UserModel.findById(currentUser.id)
    if (!currentUser) {
        logger.warn(`user try to delete other user`)
        return res.render('login')
    }
    const user = await UserModel.findByIdAndDelete(currentUser._id)
    if (!user) {
        logger.warn(`user try to delete other user`)
        return res.render('login')
    }
    logger.info(`user ${user!.name}`)
    res.render('index', { status: "user deleted" })
}) 
