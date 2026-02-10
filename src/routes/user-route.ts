import express from 'express'
import { register, deleteUser, login, updateUser, edit_user } from '../controllers/user-controller'
import { githubCallback, githubFailure } from '../controllers/github-controller'

import { registerValidator } from '../dto/registerDto'
import passport from '../config/passport'
import { validationMiddelware } from '../middlewares/validation'



const userRouter = express.Router()

userRouter.get('/edit-profile', edit_user)
userRouter.post('/register', validationMiddelware(registerValidator), register)
userRouter.post('/login', login)
userRouter.post('/:id', updateUser)
userRouter.delete('/:id', deleteUser)


// GitHub OAuth routes

userRouter.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
)

userRouter.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    githubCallback
)

export default userRouter