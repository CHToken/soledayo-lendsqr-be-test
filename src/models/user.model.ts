import db from '../config/database';
import { User } from '../types';

export const UserModel = {
    async create(user: User): Promise<void> {
        await db('users').insert(user);
    },

    async findByEmail(email: string): Promise<User | undefined> {
        return db('users').where({ email }).first();
    },

    async findById(id: string): Promise<User | undefined> {
        return db('users').where({ id }).first();
    },
};