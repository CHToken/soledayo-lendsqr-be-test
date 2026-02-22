import { env } from './src/config/env';
import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'mysql2',
        connection: {
            host: env.db.host,
            port: env.db.port,
            user: env.db.user,
            password: env.db.password,
            database: env.db.name,
        },
        migrations: {
            directory: './src/migrations',
            extension: 'ts',
        },
    },
};

export default config;