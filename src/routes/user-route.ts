import express from 'express'
import {register, deleteUser, login, updateUser} from '../controllers/use-controller'
import validationMiddelware from '../middlewares/validation'
import  {loginValidator, registerValidator}  from '../dto/registerDto'



const userRouter = express.Router()

userRouter.post('/register',validationMiddelware(registerValidator),register)
userRouter.post('/login',validationMiddelware(loginValidator),login)
userRouter.put('/:id',updateUser)
userRouter.delete('/:id',deleteUser)

export default userRouter