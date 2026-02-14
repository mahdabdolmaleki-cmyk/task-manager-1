import { AppError } from "../errors/app-error"
import { TaskModel } from "../model/task-model"
import logger from "../utils/logger"



export const findUserTask = async (user: any) => {
    const task = await TaskModel.find({ forUser: user })
    return task
}

export const createTask = async (data: any, creator: any) => {
    const task = await TaskModel.create({ ...data, userCreatore: creator })
    return task
}

export const editStatus = async (paramsId: any, data: any, userId: any) => {
    const task = await TaskModel.findById(paramsId)
    if (!task!.forUser.equals(userId)) {throw new AppError(`user: [${userId}] want to change status of others task`)}
    const changeTask = await TaskModel.findByIdAndUpdate(paramsId, { status: data }, { new: true })
    logger.info(`user: [${userId}] change status tasks `)
    return changeTask
}