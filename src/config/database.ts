import knex from 'knex';
import { env } from './env';

const db = knex({
    client: 'mysql2',
    connection: env.db.url || {
        host: env.db.host,
        port: env.db.port,
        user: env.db.user,
        password: env.db.password,
        database: env.db.name,
    },
    pool: { min: 2, max: 10 },
});

export default db;