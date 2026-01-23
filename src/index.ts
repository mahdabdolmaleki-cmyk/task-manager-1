import express, { Router } from 'express'
import {Request,Response} from 'express'
import mongoose from 'mongoose'
import userRoutes from './routes/user-route'
require('dotenv/config')

const app =express()

app.use(express.json())
app.use(express.urlencoded())

app.get('/',(req:Request,res:Response)=>{
    res.send("hello world !!!!")
})

app.use('/user',userRoutes)


const port:any = process.env.PORT || 5500
const aa:any = process.env.DB_URL
console.log(aa)
mongoose.connect(aa)
.then(()=>{
    app.listen(port,()=>{
        console.log(`server running on port ${port}` )
    })
})
.catch(err => console.log(err))