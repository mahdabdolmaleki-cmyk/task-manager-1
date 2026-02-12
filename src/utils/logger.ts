import winston from "winston";

export default winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: "YY-MM-DD HH:mm:ss" }),
        winston.format.printf(info => `( ${info.timestamp} ) ${info.level} : ${info.message}`)
    ),
    transports: [
        new winston.transports.File({ filename: './logs/info.log', level: 'info' }),
        new winston.transports.File({ filename: './logs/warn.log', level: 'warn' }),
        new winston.transports.File({ filename: './logs/error.log', level: 'error' })
    ]
})