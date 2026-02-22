import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('wallets', (table) => {
        table.string('id').primary();
        table.string('user_id').notNullable();
        table.decimal('balance', 18, 2).defaultTo(0.00).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('wallets');
}