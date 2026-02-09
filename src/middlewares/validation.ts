import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../errors/catch-async";

export const validationMiddelware = (schema: any) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const data = req.body
        const validation = plainToInstance(schema, data)
        validate(validation).then((error) => {
            if (error.length > 0) {
                const errorMessages = error.flatMap(error =>
                    Object.values(error.constraints || {}))
                if (req.url == '/register')
                    res.render('register', { error: errorMessages })
            }
            next()
        })
    })


}