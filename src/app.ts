import express from 'express';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import walletRoutes from './routes/wallet.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/wallet', walletRoutes);

// Health check
app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Lendsqr Wallet API is running' });
});

// Global error handler
app.use(errorMiddleware);

app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
});

export default app;