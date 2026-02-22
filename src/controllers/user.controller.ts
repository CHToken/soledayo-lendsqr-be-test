import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

export const UserController = {
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, email, phone } = req.body;

            if (!name || !email || !phone) {
                res.status(400).json({ success: false, message: 'Name, email and phone are required' });
                return;
            }

            await UserService.register(name, email, phone);
            res.status(201).json({ success: true, message: 'Account created successfully' });
        } catch (error) {
            next(error);
        }
    },
};