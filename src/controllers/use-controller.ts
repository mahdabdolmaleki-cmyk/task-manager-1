import {Request,Response} from 'express'
import User from '../model/user-model'
import UserDto from '../dto/userDto'



export const getAll = async (req:Request,res:Response)=>{
        try {
            res.send(await User.find())
        } catch (err:any) {
            res.send(err)
        }
    }

export const createUser = async (req:Request,res:Response)=>{
        try {
            const user= await User.create(req.body)
            res.send(user)
        } catch (err:any) {
            res.send(err)
        }
        
    }

export const updateUser = async (req:Request,res:Response)=>{
        try {
            const id : string = req.params.id
            const data : UserDto = req.body
            const user = await User.findByIdAndUpdate(id,data)
            res.send(user)
        } catch (err:any) {
            res.send(err)
        }
        
    }

export const deleteUser = async (req:Request,res:Response)=>{
        try {
            const id : string = req.params.id
            const user = await User.findByIdAndDelete(id)
            res.send(user)
        } catch (err:any) {
            res.send(err)
        }
        
    }    
