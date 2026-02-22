import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', WalletController.getBalance);
router.post('/fund', WalletController.fund);
router.post('/transfer', WalletController.transfer);
router.post('/withdraw', WalletController.withdraw);

export default router;