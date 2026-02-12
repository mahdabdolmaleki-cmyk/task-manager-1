export class AppError extends Error {
    statusCode: number
    isOperatorational: boolean
    constructor(message: string, statusCode: number = 500) {
        super(message)
        this.statusCode = statusCode
        this.isOperatorational = this.isOperatorational

        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);

    }
}