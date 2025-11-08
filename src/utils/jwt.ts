import 'dotenv/config';
import jwt, { type JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export type JwtUserPayload = { id: string; username?: string; role?: string } & JwtPayload;

export const verifyToken = (token: string) => {
    try {
        const decode = jwt.verify(token, JWT_SECRET!) as JwtUserPayload;
        if (!decode?.id) throw new Error('Token payload invalid')
        return decode;
    } catch (error) {
        throw new Error('Invalid token');
    }
}