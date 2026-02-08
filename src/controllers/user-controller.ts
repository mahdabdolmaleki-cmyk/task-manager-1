import { Request, Response } from 'express'
import UserModel from '../model/user-model'
import UserDto from '../dto/userDto'
import bcrypt from 'bcrypt'
import { decodeToken, encodeToken } from '../utils/auth'
import TaskModel from '../model/task-model'


export const login = async (req: Request, res: Response) => {
    try {
        const data = req.body
        const find = await UserModel.findOne({ email: data.email })
        if (!find) return res.render('login', { status: "wrong email or password" })
        if (!find.password) return res.render('login', { status: "Please login with GitHub or set a password" })
        const match = await bcrypt.compare(data.password, find.password)
        if (!match) return res.render('login', { status: "wrong email or password" })
        const tasks = await TaskModel.find({ forUser: find._id })
        const token = encodeToken({ id: find._id })
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 })
        res.render('profile', { user: find, tasks })
    } catch (err: any) {
        res.status(500).send({ message: "server error" })
    }
}

export const edit_user = async (req: Request, res: Response) => {

    try {
        let currentUser = req.cookies.token
        currentUser = decodeToken(currentUser)
        const user = await UserModel.findById(currentUser.id)
        if (!user) return res.render('login', { status: "please login for edit profile" })
        res.render('editProfile', { user })

    } catch (err: any) {
        res.status(500).send({ message: "eeeeeeeeeee" })

    }

}

export const register = async (req: Request, res: Response) => {
    try {
        const data: UserDto = req.body
        const find = await UserModel.findOne({ email: data.email })
        if (!find) {
            const hashedPassword = await bcrypt.hash(data.password, 10)
            const user = await UserModel.create({ ...data, password: hashedPassword })
            res.render('login', { status: "user created" })
        } else {
            res.render('register', { err: "the email is already existed !!!!" })
        }
    } catch (err: any) {
        res.send(err)
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
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
    } catch (err: any) {
        res.send(err)
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id
        const user = await UserModel.findByIdAndDelete(id)
        res.render('index', { status: "user deleted" })
    } catch (err: any) {
        res.send(err)
    }

}    
