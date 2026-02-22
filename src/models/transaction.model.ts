import db from '../config/database';
import { Transaction } from '../types';

export const TransactionModel = {
    async create(transaction: Transaction): Promise<void> {
        await db('transactions').insert(transaction);
    },

    async findByWalletId(walletId: string): Promise<Transaction[]> {
        return db('transactions').where('sender_wallet_id', walletId).orWhere('receiver_wallet_id', walletId);
    },
};