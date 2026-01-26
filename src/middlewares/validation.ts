import { validate } from "class-validator";
import ClientError from "../errors/clientError";
import { plainToInstance } from "class-transformer";
import { Request,Response,NextFunction } from "express";

const validationMiddelware = (validationSchema:any)=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
       try {
        const data = req.body
        const clientError = new ClientError()
        const validationClass : any = plainToInstance(validationSchema,data)
        validate(validationClass,{}).then((errors)=>{
            if (errors.length>0){
                clientError.data=[]
                clientError.msg=errors.map((error:any)=>{
                    return Object.values(error.constraints)
                })
                console.log(clientError.msg)
                res.render('register',{err : clientError.msg})
            }else{
              next()  
            }
        })
       } catch (err:any) {
            res.send(err.message)
       }
    }
}
export default validationMiddelware