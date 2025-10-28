import { type Request, type Response, type NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import type { AuthenticatedRequest } from "../types/types.js";

class AuthMiddleware {
    static authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const token = req.header('Authorization')?.replace('Bearer', '');
        if (!token) return res.status(401).json({ message: 'No token provided' });
        try {
            const decoded = verifyToken(token.trim());
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    }
}

export default AuthMiddleware;