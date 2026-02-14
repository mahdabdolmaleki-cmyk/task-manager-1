import express from 'express'
import { Get_CreateTask, get_search_task, Post_CreateTask, post_editTask, post_search_task } from '../controllers/task-controller'
import { jwtAuthMiddleware } from '../middlewares/index'

const taskRouter = express.Router()

taskRouter.get('/create',jwtAuthMiddleware, Get_CreateTask)
taskRouter.post('/create',jwtAuthMiddleware, Post_CreateTask)
taskRouter.get('/search',jwtAuthMiddleware, get_search_task)
taskRouter.post('/search',jwtAuthMiddleware, post_search_task)
taskRouter.post('/:id',jwtAuthMiddleware, post_editTask)

export default taskRouter