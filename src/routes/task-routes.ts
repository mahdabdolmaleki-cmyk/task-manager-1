import express from 'express'
import { Get_CreateTask, get_search_task, Post_CreateTask, post_editTask, post_search_task } from '../controllers/task-controller'

const taskRouter = express.Router()

taskRouter.get('/create', Get_CreateTask)
taskRouter.post('/create', Post_CreateTask)
taskRouter.get('/search', get_search_task)
taskRouter.post('/search', post_search_task)
taskRouter.post('/:id', post_editTask)

export default taskRouter