import jwt from 'jsonwebtoken'

export const encodeToken = (payload: any) => {
    const token = jwt.sign(payload, 'secret', { expiresIn: "1h" })
    return token
}

export const decodeToken = (token: any) => {
    const decode = jwt.verify(token, 'secret');
    return decode
}


