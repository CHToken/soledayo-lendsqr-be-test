import type { Knex } from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const connectionConfig = process.env.DATABASE_URL || {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'mysql2',
        connection: connectionConfig,
        migrations: {
            directory: './src/migrations',
            extension: 'ts',
        },
    },
    production: {
        client: 'mysql2',
        connection: connectionConfig,
        migrations: {
            directory: './src/migrations',
            extension: 'ts',
        },
    },
};

export default config;