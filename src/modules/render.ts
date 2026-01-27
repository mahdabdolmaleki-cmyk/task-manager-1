import { Request,Response } from "express"
import { decodeToken } from "../utils/auth"
import UserModel from "../model/user-model"





const userTasks = async(req:Request,res:Response)=>{
    try {
        
        

    } catch (err:any) {
        res.send(err)
    }
}

module.exports ={userTasks}