import { Response, NextFunction } from 'express';
import { WalletService } from '../services/wallet.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const WalletController = {
    async getBalance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const wallet = await WalletService.getBalance(req.user!.userId);
            res.status(200).json({ success: true, data: wallet });
        } catch (error) {
            next(error);
        }
    },

    async fund(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { amount } = req.body;
            if (!amount) {
                res.status(400).json({ success: false, message: 'Amount is required' });
                return;
            }

            await WalletService.fund(req.user!.userId, parseFloat(amount));
            res.status(200).json({ success: true, message: 'Wallet funded successfully' });
        } catch (error) {
            next(error);
        }
    },

    async transfer(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { receiver_email, amount } = req.body;
            if (!receiver_email || !amount) {
                res.status(400).json({ success: false, message: 'Receiver email and amount are required' });
                return;
            }

            await WalletService.transfer(req.user!.userId, receiver_email, parseFloat(amount));
            res.status(200).json({ success: true, message: 'Transfer successful' });
        } catch (error) {
            next(error);
        }
    },

    async withdraw(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { amount } = req.body;
            if (!amount) {
                res.status(400).json({ success: false, message: 'Amount is required' });
                return;
            }

            await WalletService.withdraw(req.user!.userId, parseFloat(amount));
            res.status(200).json({ success: true, message: 'Withdrawal successful' });
        } catch (error) {
            next(error);
        }
    },
};