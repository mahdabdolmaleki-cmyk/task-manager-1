import express, { Router } from 'express'
import {Request,Response} from 'express'
import mongoose from 'mongoose'
import userRoutes from './routes/user-route'
import path from 'path'
import { jwtAuthMiddleware } from './middlewares/jwtAuth'
import taskRouter from './routes/task-routes'

const cookieParser =require ('cookie-parser')
require('ejs')
require('dotenv/config')

const app =express()
app.set('views',path.join(__dirname,'views'))
app.set("view engine","ejs")

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())

app.get('/',(req:Request,res:Response)=>{res.render('index')})
app.get('/login',jwtAuthMiddleware,(req:Request,res:Response)=>{res.render('login')})
app.get('/register',(req:Request,res:Response)=>{res.render('register')})

app.use('/',userRoutes)
app.use('/user',userRoutes)
app.use('/task',taskRouter)

app.get('/logout', (req, res) => {
    res.clearCookie('token')  
    res.redirect('/')  
})

const port:any = process.env.PORT || 5500
const aa:any = process.env.DB_URL
mongoose.connect(aa)
.then(()=>{
    app.listen(port,()=>{
        console.log(`server running on port ${port}` )
    })
})
.catch(err => console.log(err))