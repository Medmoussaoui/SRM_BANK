import knex from 'knex';

export const mysql = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'adam',
        password: 'password',
        database: 'smr_bank'
    }
});
