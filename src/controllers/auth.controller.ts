import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export const AuthController = {
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ success: false, message: 'Email is required' });
                return;
            }

            const token = await AuthService.login(email);
            res.status(200).json({ success: true, token });
        } catch (error) {
            next(error);
        }
    },
};