
exports.up = function (knex) {
    return knex.schema.createTable('watch_history', function (table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().unique().references('id').inTable('users').onDelete('CASCADE');
        table.integer('video_id').unsigned().unique().references('id').inTable('videos').onDelete('CASCADE');
        table.timestamp('watched_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('watch_history');
};