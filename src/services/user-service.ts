import UserModel from "../model/user-model"
import logger from "../utils/logger"
import bcrypt from 'bcrypt'

export const findUser = async (id: number) => {
    const user = await UserModel.findById(id)
    return user
}

export const findAllUser = async () => {
    const users = await UserModel.find()
    return users
}

export const loginUser = async (email: string, password: string) => {

    const user = await UserModel.findOne({ email })
    if (!user) {
        logger.warn(`login failed: user not found`)
        return { user: null, status: false }
    }
    const same = await bcrypt.compare(password, user.password)
    if (!same) {
        logger.warn(`login failed: wrong password`)
        return { user: null, status: false }
    }
    return { user, status: true }
}

export const registerUser = async (data: any) => {

    const find = await UserModel.findOne({ email: data.email })
    if (find) { return { user: null, status: false } }
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = await UserModel.create({ ...data, password: hashedPassword })
    return { user, status: true }
}

export const editProfile = async (paramsId: any, data: any, userId: any) => {
    let { name, family, email, level } = data
    let body: any = {}
    if (name !== '') body.name = name
    if (family !== '') body.family = family
    if (email !== '') body.email = email
    if (level !== '') body.level = level

    if (!userId.equals(paramsId)) { return { user: null, status: false } }

    const user = await UserModel.findByIdAndUpdate(paramsId, body, { new: true })

    return { user: user, status: true }
}

export const deeleteUser = async (paramsId: any, userId: any) => {
    if (!userId.equals(paramsId)) { return { user: null, status: false } }
    const user = await UserModel.findByIdAndDelete(userId)
    return { status: true, user }
}