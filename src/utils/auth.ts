import jwt from 'jsonwebtoken'
require('dotenv/config')

const secret: any = process.env.SECRET

export const encodeToken = (payload:any) => {
    const token = jwt.sign(payload, secret, { expiresIn: "1h" })
    console.log(token)
    return token
}

export const decodeToken = (token: any) => {
    const decode = jwt.verify(token, secret);
    return decode
}


