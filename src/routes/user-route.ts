import express from 'express'
import {
    register, deleteUser, login, updateUser,
    edit_user, profile, logout, loginPage, registerPage
} from '../controllers/user-controller'
import { githubCallback } from '../controllers/github-controller'
import { registerValidator } from '../dto/registerDto'
import passport from '../config/passport'
import { validationMiddelware, jwtAuthMiddleware } from '../middlewares/index'
import { loginValidator } from '../dto/loginDto'

const userRouter = express.Router()

userRouter.get('/profile', jwtAuthMiddleware, profile)

userRouter.get('/login', jwtAuthMiddleware, loginPage)

userRouter.get('/register', registerPage)

userRouter.get('/logout', logout)

userRouter.get('/edit-profile', jwtAuthMiddleware, edit_user)


userRouter.post('/register', jwtAuthMiddleware, validationMiddelware(registerValidator), register)

userRouter.post('/login', validationMiddelware(loginValidator), login)

userRouter.post('/:id', jwtAuthMiddleware, updateUser)


userRouter.delete('/:id', jwtAuthMiddleware, deleteUser)


// git hb register & login
userRouter.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
)

userRouter.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    githubCallback
)

export default userRouter