import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('transactions', (table) => {
        table.string('id').primary();
        table.string('sender_wallet_id').nullable();
        table.string('receiver_wallet_id').nullable();
        table.decimal('amount', 18, 2).notNullable();
        table.enum('type', ['FUND', 'TRANSFER', 'WITHDRAW']).notNullable();
        table.enum('status', ['PENDING', 'SUCCESS', 'FAILED']).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.foreign('sender_wallet_id').references('id').inTable('wallets').onDelete('SET NULL');
        table.foreign('receiver_wallet_id').references('id').inTable('wallets').onDelete('SET NULL');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('transactions');
}