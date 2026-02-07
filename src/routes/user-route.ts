import express from 'express'
import { register, deleteUser, login, updateUser, edit_user } from '../controllers/user-controller'
import validationMiddelware from '../middlewares/validation'
import { registerValidator } from '../dto/registerDto'



const userRouter = express.Router()

userRouter.get('/edit-profile',edit_user)
userRouter.post('/register', validationMiddelware(registerValidator), register)
userRouter.post('/login', login)
userRouter.post('/:id', updateUser)
userRouter.delete('/:id', deleteUser)

export default userRouter