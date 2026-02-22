import request from 'supertest';
import app from '../app';
import db from '../config/database';
import { AdjutorService } from '../services/adjutor.service';

jest.mock('../services/adjutor.service');

const mockedAdjutor = AdjutorService as jest.Mocked<typeof AdjutorService>;

let tokenA: string;
let tokenB: string;

beforeAll(async () => {
    await db('transactions').del();
    await db('wallets').del();
    await db('users').del();

    mockedAdjutor.isBlacklisted.mockResolvedValue(false);

    await request(app).post('/users/register').send({
        name: 'User A',
        email: 'usera@example.com',
        phone: '08011111111',
    });

    await request(app).post('/users/register').send({
        name: 'User B',
        email: 'userb@example.com',
        phone: '08022222222',
    });

    const loginA = await request(app).post('/auth/login').send({ email: 'usera@example.com' });
    const loginB = await request(app).post('/auth/login').send({ email: 'userb@example.com' });

    tokenA = loginA.body.token;
    tokenB = loginB.body.token;
});

afterAll(async () => {
    await db('transactions').del();
    await db('wallets').del();
    await db('users').del();
    await db.destroy();
});

describe('Wallet Funding', () => {
    it('should fund wallet successfully', async () => {
        const res = await request(app)
            .post('/wallet/fund')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ amount: 5000 });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Wallet funded successfully');
    });

    it('should reject funding with invalid amount', async () => {
        const res = await request(app)
            .post('/wallet/fund')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ amount: -100 });

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Amount must be greater than zero');
    });

    it('should reject funding without token', async () => {
        const res = await request(app).post('/wallet/fund').send({ amount: 1000 });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });
});

describe('Wallet Transfer', () => {
    it('should transfer funds successfully', async () => {
        const res = await request(app)
            .post('/wallet/transfer')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ receiver_email: 'userb@example.com', amount: 1000 });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Transfer successful');
    });

    it('should reject transfer with insufficient balance', async () => {
        const res = await request(app)
            .post('/wallet/transfer')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ receiver_email: 'userb@example.com', amount: 999999 });

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Insufficient balance');
    });

    it('should reject transfer to own account', async () => {
        const res = await request(app)
            .post('/wallet/transfer')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ receiver_email: 'usera@example.com', amount: 100 });

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Cannot transfer to your own account');
    });
});

describe('Wallet Withdrawal', () => {
    it('should withdraw funds successfully', async () => {
        const res = await request(app)
            .post('/wallet/withdraw')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ amount: 500 });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Withdrawal successful');
    });

    it('should reject withdrawal with insufficient balance', async () => {
        const res = await request(app)
            .post('/wallet/withdraw')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ amount: 999999 });

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Insufficient balance');
    });
});

describe('Wallet Balance', () => {
    it('should get wallet balance successfully', async () => {
        const res = await request(app)
            .get('/wallet')
            .set('Authorization', `Bearer ${tokenA}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('balance');
    });

    it('should reject balance check without token', async () => {
        const res = await request(app).get('/wallet');

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });
});