import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    logger.error(`from errorhandel error: ${message}`)
    res.status(statusCode).render("error", { message })
}