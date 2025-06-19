
exports.up = function (knex) {
    return knex.schema.createTable('similars', function (table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('similar_user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').unique();
        table.timestamp('upload_date').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('similars');
};