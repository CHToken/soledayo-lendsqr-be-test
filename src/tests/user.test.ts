import request from 'supertest';
import app from '../app';
import db from '../config/database';
import { AdjutorService } from '../services/adjutor.service';

jest.mock('../services/adjutor.service');

const mockedAdjutor = AdjutorService as jest.Mocked<typeof AdjutorService>;

beforeEach(async () => {
    await db('transactions').del();
    await db('wallets').del();
    await db('users').del();
});

afterAll(async () => {
    await db('transactions').del();
    await db('wallets').del();
    await db('users').del();
    await db.destroy();
});

describe('User Registration', () => {
    it('should register a new user successfully', async () => {
        mockedAdjutor.isBlacklisted.mockResolvedValue(false);

        const res = await request(app).post('/users/register').send({
            name: 'John Doe',
            email: 'john@example.com',
            phone: '08012345678',
        });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Account created successfully');
    });

    it('should reject registration if user is blacklisted', async () => {
        mockedAdjutor.isBlacklisted.mockResolvedValue(true);

        const res = await request(app).post('/users/register').send({
            name: 'Bad Actor',
            email: 'bad@example.com',
            phone: '08099999999',
        });

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('User is blacklisted and cannot be onboarded');
    });

    it('should reject registration if email already exists', async () => {
        mockedAdjutor.isBlacklisted.mockResolvedValue(false);

        await request(app).post('/users/register').send({
            name: 'John Doe',
            email: 'john@example.com',
            phone: '08012345678',
        });

        const res = await request(app).post('/users/register').send({
            name: 'John Doe',
            email: 'john@example.com',
            phone: '08012345679',
        });

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Email already registered');
    });

    it('should reject registration if required fields are missing', async () => {
        const res = await request(app).post('/users/register').send({
            email: 'john@example.com',
        });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
});

describe('Auth Login', () => {
    it('should login successfully and return a token', async () => {
        mockedAdjutor.isBlacklisted.mockResolvedValue(false);

        await request(app).post('/users/register').send({
            name: 'John Doe',
            email: 'john@example.com',
            phone: '08012345678',
        });

        const res = await request(app).post('/auth/login').send({
            email: 'john@example.com',
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
    });

    it('should fail login if user does not exist', async () => {
        const res = await request(app).post('/auth/login').send({
            email: 'nobody@example.com',
        });

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('User not found');
    });
});