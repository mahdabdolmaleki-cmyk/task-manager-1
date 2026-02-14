import express from 'express'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import userRoutes from './routes/user-route'
import path from 'path'
import { jwtAuthMiddleware, globalErrorHandler } from './middlewares/index'
import taskRouter from './routes/task-routes'
import session from 'express-session'
import passport from './config/passport'
import { simpleSyncOnStart } from './utils/sync-helper'
import logger from './utils/logger'

const cookieParser = require('cookie-parser')
require('ejs')
require('dotenv/config')

const app = express()
app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 3600000 }
}))

app.use(passport.initialize())
app.use(passport.session())
simpleSyncOnStart()

app.get('/', (req: Request, res: Response) => { res.render('index') })

app.use('/user', userRoutes)
app.use('/task', taskRouter)


app.use(globalErrorHandler)

const port: any = process.env.PORT || 5500
const aa: any = process.env.DB_URL
mongoose.connect(aa)
    .then(async () => {
        app.listen(port, () => {
            logger.info(`server running on port: ${port}`)
            console.log(`server running on port: ${port}`)
        })
    })
    .catch(err => logger.error('cant connect to mongoDB'))