import express from 'express'
import {register, deleteUser, login, updateUser} from '../controllers/use-controller'
import validationMiddelware from '../middlewares/validation'
import  {registerValidator}  from '../dto/registerDto'
import { Get_CreateTask, Post_CreateTask } from '../controllers/task-controller'
import { Request,Response } from 'express'



const taskRouter = express.Router()

taskRouter.get('/create',Get_CreateTask)

taskRouter.post('/create',Post_CreateTask)


export default taskRouter