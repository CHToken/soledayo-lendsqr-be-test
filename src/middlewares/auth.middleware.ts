import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export interface AuthRequest extends Request {
    user?: { userId: string; email: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = AuthService.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};