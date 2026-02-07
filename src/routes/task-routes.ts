import express from 'express'
import { Get_CreateTask, Post_CreateTask, post_editTask } from '../controllers/task-controller'



const taskRouter = express.Router()

taskRouter.get('/create', Get_CreateTask)

taskRouter.post('/create', Post_CreateTask)

taskRouter.post('/:id', post_editTask)


export default taskRouter