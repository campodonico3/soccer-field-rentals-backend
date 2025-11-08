import { type Request, type Response, type NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import type { AuthenticatedRequest } from "../types/types.js";



class AuthMiddleware {
    static authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const authHeader = req.header('Authorization')?? req.headers.authorization as string | undefined;

        const tokenFromHeader = authHeader?.replace(/^Bearer\s+/i, '').trim();

        const token = tokenFromHeader || (req.cookies && (req.cookies.token as string));

        //const token = req.header('Authorization')?.replace('Bearer', '');

        if (!token) return res.status(401).json({ message: 'No token provided' });
        try {
            const decoded = verifyToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    }
}

export default AuthMiddleware;