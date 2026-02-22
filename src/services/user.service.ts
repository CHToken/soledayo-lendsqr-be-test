import { v4 as uuidv4 } from 'uuid';
import { UserModel } from '../models/user.model';
import { WalletModel } from '../models/wallet.model';
import { AdjutorService } from './adjutor.service';
import db from '../config/database';

export const UserService = {
    async register(name: string, email: string, phone: string): Promise<void> {
        // Check if email already exists
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Check Karma blacklist
        const blacklisted = await AdjutorService.isBlacklisted(email);
        if (blacklisted) {
            throw new Error('User is blacklisted and cannot be onboarded');
        }

        // Create user and wallet in a single transaction
        await db.transaction(async (trx) => {
            const userId = uuidv4();
            const walletId = uuidv4();

            await trx('users').insert({
                id: userId,
                name,
                email,
                phone,
                is_blacklisted: false,
            });

            await trx('wallets').insert({
                id: walletId,
                user_id: userId,
                balance: 0.00,
            });
        });
    },
};