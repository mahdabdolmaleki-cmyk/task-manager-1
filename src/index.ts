import express from 'express'
import {Request,Response} from 'express'
import mongoose from 'mongoose'
require('dotenv/config')

const app =express()

app.get('/',(req:Request,res:Response)=>{
    res.send("hello world !!!!")
})
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