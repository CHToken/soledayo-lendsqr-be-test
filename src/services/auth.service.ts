import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserModel } from '../models/user.model';

export const AuthService = {
    generateToken(userId: string, email: string): string {
        return jwt.sign({ userId, email }, env.jwtSecret, { expiresIn: '24h' });
    },

    verifyToken(token: string): { userId: string; email: string } {
        return jwt.verify(token, env.jwtSecret) as { userId: string; email: string };
    },

    async login(email: string): Promise<string> {
        const user = await UserModel.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        return AuthService.generateToken(user.id, user.email);
    },
};