import { v4 as uuidv4 } from 'uuid';
import { WalletModel } from '../models/wallet.model';
import { UserModel } from '../models/user.model';
import db from '../config/database';

export const WalletService = {
    async getBalance(userId: string) {
        const wallet = await WalletModel.findByUserId(userId);
        if (!wallet) throw new Error('Wallet not found');
        return wallet;
    },

    async fund(userId: string, amount: number): Promise<void> {
        if (amount <= 0) throw new Error('Amount must be greater than zero');

        await db.transaction(async (trx) => {
            const wallet = await trx('wallets').where({ user_id: userId }).first();
            if (!wallet) throw new Error('Wallet not found');

            const newBalance = parseFloat(wallet.balance) + amount;

            await trx('wallets')
                .where({ id: wallet.id })
                .update({ balance: newBalance, updated_at: new Date() });

            await trx('transactions').insert({
                id: uuidv4(),
                sender_wallet_id: null,
                receiver_wallet_id: wallet.id,
                amount,
                type: 'FUND',
                status: 'SUCCESS',
            });
        });
    },

    async transfer(userId: string, receiverEmail: string, amount: number): Promise<void> {
        if (amount <= 0) throw new Error('Amount must be greater than zero');

        await db.transaction(async (trx) => {
            const senderWallet = await trx('wallets').where({ user_id: userId }).first();
            if (!senderWallet) throw new Error('Sender wallet not found');

            if (parseFloat(senderWallet.balance) < amount) {
                throw new Error('Insufficient balance');
            }

            const receiverUser = await trx('users').where({ email: receiverEmail }).first();
            if (!receiverUser) throw new Error('Receiver not found');

            if (receiverUser.id === userId) {
                throw new Error('Cannot transfer to your own account');
            }

            const receiverWallet = await trx('wallets').where({ user_id: receiverUser.id }).first();
            if (!receiverWallet) throw new Error('Receiver wallet not found');

            const newSenderBalance = parseFloat(senderWallet.balance) - amount;
            const newReceiverBalance = parseFloat(receiverWallet.balance) + amount;

            await trx('wallets')
                .where({ id: senderWallet.id })
                .update({ balance: newSenderBalance, updated_at: new Date() });

            await trx('wallets')
                .where({ id: receiverWallet.id })
                .update({ balance: newReceiverBalance, updated_at: new Date() });

            await trx('transactions').insert({
                id: uuidv4(),
                sender_wallet_id: senderWallet.id,
                receiver_wallet_id: receiverWallet.id,
                amount,
                type: 'TRANSFER',
                status: 'SUCCESS',
            });
        });
    },

    async withdraw(userId: string, amount: number): Promise<void> {
        if (amount <= 0) throw new Error('Amount must be greater than zero');

        await db.transaction(async (trx) => {
            const wallet = await trx('wallets').where({ user_id: userId }).first();
            if (!wallet) throw new Error('Wallet not found');

            if (parseFloat(wallet.balance) < amount) {
                throw new Error('Insufficient balance');
            }

            const newBalance = parseFloat(wallet.balance) - amount;

            await trx('wallets')
                .where({ id: wallet.id })
                .update({ balance: newBalance, updated_at: new Date() });

            await trx('transactions').insert({
                id: uuidv4(),
                sender_wallet_id: wallet.id,
                receiver_wallet_id: null,
                amount,
                type: 'WITHDRAW',
                status: 'SUCCESS',
            });
        });
    },
};