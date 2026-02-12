import { Request, Response } from 'express'
import UserModel from '../model/user-model'
import UserDto from '../dto/userDto'
import bcrypt from 'bcrypt'
import { decodeToken, encodeToken } from '../utils/auth'
import {TaskModel} from '../model/task-model'
import { catchAsync } from '../errors/catch-async'


export const login = catchAsync(async (req: Request, res: Response) => {
    const data = req.body
    const find = await UserModel.findOne({ email: data.email })
    if (!find) return res.render('login', { error: "wrong email or password" })
    const match = await bcrypt.compare(data.password, find.password as string)
    if (!match) return res.render('login', { error: "wrong email or password" })
    const tasks = await TaskModel.find({ forUser: find._id })
    const token = encodeToken({ id: find._id })
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 })
    res.render('profile', { user: find, tasks })
})

export const edit_user = catchAsync(async (req: Request, res: Response) => {
    let currentUser = req.cookies.token
    currentUser = decodeToken(currentUser)
    const user = await UserModel.findById(currentUser.id)
    if (!user) return res.render('login', { status: "please login for edit profile" })
    res.render('editProfile', { user })
})

export const register = catchAsync(async (req: Request, res: Response) => {
    const data: UserDto = req.body
    const find = await UserModel.findOne({ email: data.email })
    if (!find) {
        const hashedPassword = await bcrypt.hash(data.password, 10)
        const user = await UserModel.create({ ...data, password: hashedPassword })
        res.render('login', { status: "user created" })
    } else {
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
        console.log(data)
        const user = await UserModel.findByIdAndUpdate(id, data, { new: true })
        res.render('editProfile', { user })
})

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
        const id: string = req.params.id
        const user = await UserModel.findByIdAndDelete(id)
        res.render('index', { status: "user deleted" })
}   ) 
